"""
app.py  –  FastAPI wrapper around the ProtT5-XL + stacked-ensemble pipeline.

Pipeline:
  sequence -> ProtT5-XL embedding (mean-pooled, 1024-dim)
           -> select RFE 256 dims
           -> StandardScaler
           -> 3 base models (LR, SVM_RBF, MLP)   [base_models.pkl]
           -> XGBoost meta-model                  [meta_model.pkl]
           -> label translation

────────────────────────────────────────────────────────────
  MODE A – Local files (dev / demo):
    Place all model artefacts next to app.py and run:
      uvicorn app:app --host 0.0.0.0 --port 8000

  MODE B – HuggingFace Hub (production):
    Set these env vars and your OWN artefacts download automatically.
    (ProtT5-XL itself is always pulled from its public HF repo regardless
     of this setting — it is not part of your private snapshot.)
      HF_REPO_ID=your-username/ev-classifier
      HF_TOKEN=hf_xxxx   (only needed if repo is private)
      uvicorn app:app --host 0.0.0.0 --port 8000
────────────────────────────────────────────────────────────

NOTE: This pipeline replaces the previous ESM2 + LoRA pipeline entirely.
The adapter_config.json / adapter_model.safetensors / tokenizer_config.json /
vocab.txt files from that pipeline are NOT used here and can be deleted.
"""

import os
import json
import time
import logging
from contextlib import asynccontextmanager
from typing import List

import numpy as np
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

# ── Logging ───────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)

# ── Config ────────────────────────────────────────────────────────────────────

HF_REPO_ID = os.environ.get("HF_REPO_ID", "").strip()
HF_TOKEN = os.environ.get("HF_TOKEN", "").strip() or None

PROT_T5_MODEL_NAME = "Rostlab/prot_t5_xl_uniref50"
MAX_SEQ_LEN = 1024

# ── Local-dev escape hatch ──────────────────────────────────────────────────
# ProtT5-XL is a ~3B param model: ~6GB VRAM (fp16/GPU) or ~11-12GB RAM
# (fp32/CPU). On the real server (GPU available) this is never touched and
# the app behaves exactly as production. Locally, if you don't have a GPU
# and don't want to wait minutes per request / risk an OOM kill, set:
#   DEV_MOCK_ML=true
# This skips loading ProtT5 + the ensemble entirely and returns a fake but
# correctly-shaped prediction, so you can develop/test the Express layer,
# Redis job flow, request validation, etc. without the real model.
DEV_MOCK_ML = os.environ.get("DEV_MOCK_ML", "false").strip().lower() == "true"

# If set, forces CPU even when CUDA is available (debugging only).
FORCE_CPU = os.environ.get("FORCE_CPU", "false").strip().lower() == "true"

# Single source of truth for class names. label_encoder.pkl only maps
# int -> int ([0, 1, 2]); it carries no string labels, so the mapping
# below is what actually produces human-readable output. Confirm this
# ordering with the ML team if classes are ever retrained/reordered.
LABEL_MAP = {
    0: "Non-EV",
    1: "Milk-based EV",
    2: "Plant-based EV",
}


def resolve_model_dir() -> str:
    """
    Returns the local directory that contains your OWN model artefacts
    (scaler.pkl, base_models.pkl, meta_model.pkl, label_encoder.pkl,
    rfe_256_features.json, meta_feature_layout.json).

    MODE A: the folder where app.py lives (artefacts placed manually).
    MODE B: a HuggingFace snapshot cache directory (auto-downloaded).

    Note: this does NOT control where ProtT5-XL is loaded from — that
    model is always pulled from its own public HF repo via
    transformers' standard from_pretrained() caching.
    """
    if HF_REPO_ID:
        log.info(f"HF_REPO_ID is set → downloading artefacts from HuggingFace: {HF_REPO_ID}")
        try:
            from huggingface_hub import snapshot_download
        except ImportError:
            raise RuntimeError(
                "huggingface_hub is not installed. Run: pip install huggingface_hub"
            )
        local_dir = snapshot_download(
            repo_id=HF_REPO_ID,
            token=HF_TOKEN,
            ignore_patterns=["*.py", "*.md", "*.txt", ".gitattributes"],
        )
        log.info(f"Artefacts downloaded/cached at: {local_dir}")
        return local_dir
    else:
        local_dir = os.environ.get(
            "MODEL_DIR",
            os.path.dirname(os.path.abspath(__file__))
        )
        log.info(f"HF_REPO_ID not set → using local model directory: {local_dir}")
        return local_dir


# ── Lazy globals (populated during startup) ───────────────────────────────────

_extractor = None   # callable: sequence -> (1024,) numpy array
_predictor = None   # callable: (1024,) array -> (label, confidence, probabilities)


# ── Startup / shutdown ────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load all heavy models once at startup so every request is fast."""
    global _extractor, _predictor

    log.info("=== ML Service starting up ===")

    if DEV_MOCK_ML:
        log.warning(
            "DEV_MOCK_ML=true — skipping ProtT5 + ensemble entirely. "
            "Returning fake predictions. DO NOT use this in production."
        )

        def fake_extract(sequence: str) -> np.ndarray:
            return np.zeros(1024, dtype=np.float32)

        def fake_predict(emb_1024: np.ndarray):
            label = "Non-EV"
            probabilities = {"Non-EV": 1.0, "Milk-based EV": 0.0, "Plant-based EV": 0.0}
            return label, 1.0, probabilities

        _extractor = fake_extract
        _predictor = fake_predict
        log.info("=== ML Service ready (MOCK MODE) ===")
        yield
        log.info("=== ML Service shutting down ===")
        return

    MODEL_DIR = resolve_model_dir()

    import torch

    if FORCE_CPU:
        log.warning("FORCE_CPU=true — ignoring any available GPU.")
        cuda_available = False
    else:
        cuda_available = torch.cuda.is_available()

    DEVICE = torch.device("cuda" if cuda_available else "cpu")
    log.info(f"Using device: {DEVICE}")

    if DEVICE.type == "cpu":
        log.warning(
            "No GPU detected. ProtT5-XL (~3B params) will attempt to load "
            "in fp32 on CPU — this needs ~11-12GB free RAM and will be slow "
            "per request. This is fine for local correctness testing, but "
            "is NOT the production path. Set DEV_MOCK_ML=true instead if "
            "you just want to test the API/backend wiring without waiting "
            "or risking an out-of-memory crash."
        )

    # ── 1. ProtT5-XL embedding model ─────────────────────────────────────────
    log.info(f"Loading {PROT_T5_MODEL_NAME} …  (this may take a while)")
    t0 = time.time()

    from transformers import T5Tokenizer, T5EncoderModel

    tokenizer = T5Tokenizer.from_pretrained(PROT_T5_MODEL_NAME, do_lower_case=False)

    # fp16 only makes sense on GPU; fp32 fallback on CPU.
    dtype = torch.float16 if DEVICE.type == "cuda" else torch.float32
    prott5_model = T5EncoderModel.from_pretrained(
        PROT_T5_MODEL_NAME, torch_dtype=dtype
    ).eval().to(DEVICE)

    log.info(f"ProtT5-XL loaded in {time.time()-t0:.1f}s (dtype={dtype}, device={DEVICE})")

    def _clean_sequence(seq: str) -> str:
        """Map ambiguous residues to X (matches training preprocessing) and truncate."""
        seq = seq.strip().upper()
        seq = seq.replace("U", "X").replace("Z", "X").replace("O", "X").replace("B", "X")
        return seq[:MAX_SEQ_LEN]

    def extract_features(sequence: str) -> np.ndarray:
        """Return a (1024,) float32 numpy array — mean-pooled ProtT5 embedding."""
        cleaned = _clean_sequence(sequence)
        spaced = " ".join(list(cleaned))

        enc = tokenizer(
            [spaced],
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=MAX_SEQ_LEN + 1,
        ).to(DEVICE)

        with torch.no_grad():
            out = prott5_model(**enc)

        hidden = out.last_hidden_state.float()
        mask = enc["attention_mask"].unsqueeze(-1).float()
        emb = (hidden * mask).sum(1) / mask.sum(1)

        return emb.cpu().numpy()[0]

    _extractor = extract_features

    # ── 2. Stacked ensemble artefacts ────────────────────────────────────────
    log.info("Loading stacked-ensemble artefacts …")
    t1 = time.time()

    import joblib

    def _path(filename: str) -> str:
        return os.path.join(MODEL_DIR, filename)

    log.info("Loading rfe_256_features.json")
    with open(_path("rfe_256_features.json")) as f:
        rfe_meta = json.load(f)
    dim_indices = rfe_meta["dim_indices"]

    log.info("Loading meta_feature_layout.json")
    with open(_path("meta_feature_layout.json")) as f:
        layout = json.load(f)
    model_order = layout["base_model_order"]  # e.g. ["LR", "SVM_RBF", "MLP"]

    log.info("Loading scaler")
    scaler = joblib.load(_path("scaler.pkl"))

    log.info("Loading base_models")
    base_models = joblib.load(_path("base_models.pkl"))  # dict: {"LR":..., "SVM_RBF":..., "MLP":...}

    log.info("Loading meta_model")
    meta_model = joblib.load(_path("meta_model.pkl"))  # fitted XGBoost classifier

    log.info("Loading label_encoder")
    label_encoder = joblib.load(_path("label_encoder.pkl"))  # int -> int sanity check only

    missing = [m for m in model_order if m not in base_models]
    if missing:
        raise RuntimeError(
            f"base_models.pkl is missing models declared in meta_feature_layout.json: {missing}"
        )

    log.info(f"All ensemble artefacts loaded in {time.time()-t1:.1f}s. "
             f"Model order: {model_order}, classes: {list(label_encoder.classes_)}")

    def predict(emb_1024: np.ndarray):
        """Run the full stacked pipeline. Returns (label, confidence, probabilities dict)."""
        emb_256 = emb_1024[dim_indices].reshape(1, -1)
        scaled = scaler.transform(emb_256)

        meta_input = np.concatenate(
            [base_models[name].predict_proba(scaled) for name in model_order],
            axis=1,
        )

        pred_idx = int(meta_model.predict(meta_input)[0])
        proba = meta_model.predict_proba(meta_input)[0]

        label = LABEL_MAP.get(pred_idx, "Unknown")
        confidence = float(proba[pred_idx])
        probabilities = {LABEL_MAP.get(i, str(i)): float(p) for i, p in enumerate(proba)}

        return label, confidence, probabilities

    _predictor = predict

    log.info("=== ML Service ready ===")
    yield
    log.info("=== ML Service shutting down ===")


# ── FastAPI app ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="Food EV Classifier – ML Service",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ───────────────────────────────────────────────────────────────────

VALID_AA = set("ACDEFGHIKLMNPQRSTVWYXUZOB")


class SingleRequest(BaseModel):
    sequence: str

    @field_validator("sequence")
    @classmethod
    def must_be_valid(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("sequence must not be blank")
        upper = v.upper()
        invalid = set(upper) - VALID_AA
        if invalid:
            raise ValueError(f"sequence contains invalid characters: {sorted(invalid)}")
        if len(upper) < 5:
            raise ValueError("sequence too short (minimum 5 residues)")
        return upper


class SingleResponse(BaseModel):
    prediction: str
    confidence: float
    probabilities: dict[str, float]
    sequence_length: int


class BatchRequest(BaseModel):
    sequences: List[str]

    @field_validator("sequences")
    @classmethod
    def validate_list(cls, v: List[str]) -> List[str]:
        if not v:
            raise ValueError("sequences list must not be empty")
        if len(v) > 50:
            raise ValueError("max 50 sequences per batch")
        return [s.strip().upper() for s in v]


class BatchItem(BaseModel):
    index: int
    sequence_length: int
    prediction: str
    confidence: float
    probabilities: dict[str, float] | None = None
    error: str | None = None


class BatchResponse(BaseModel):
    results: List[BatchItem]
    total: int
    succeeded: int
    failed: int


# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    ready = _extractor is not None and _predictor is not None
    return {
        "status": "ok" if ready else "loading",
        "models_loaded": ready,
        "mock_mode": DEV_MOCK_ML,
    }


# ── POST /predict ─────────────────────────────────────────────────────────────

@app.post("/predict", response_model=SingleResponse)
def predict_single(req: SingleRequest):
    if _extractor is None or _predictor is None:
        raise HTTPException(503, detail="Models are still loading, please retry in a moment.")

    try:
        emb = _extractor(req.sequence)
        label, confidence, probabilities = _predictor(emb)
    except Exception as exc:
        log.exception("Prediction failed")
        raise HTTPException(500, detail=f"Prediction error: {exc}") from exc

    return SingleResponse(
        prediction=label,
        confidence=round(confidence, 4),
        probabilities={k: round(p, 4) for k, p in probabilities.items()},
        sequence_length=len(req.sequence),
    )


# ── POST /predict/batch ───────────────────────────────────────────────────────

@app.post("/predict/batch", response_model=BatchResponse)
def predict_batch(req: BatchRequest):
    if _extractor is None or _predictor is None:
        raise HTTPException(503, detail="Models are still loading, please retry in a moment.")

    results: List[BatchItem] = []
    succeeded = 0
    failed = 0

    for idx, seq in enumerate(req.sequences):
        try:
            emb = _extractor(seq)
            label, confidence, probabilities = _predictor(emb)
            results.append(BatchItem(
                index=idx,
                sequence_length=len(seq),
                prediction=label,
                confidence=round(confidence, 4),
                probabilities={k: round(p, 4) for k, p in probabilities.items()},
            ))
            succeeded += 1
        except Exception as exc:
            log.error(f"Batch item {idx} failed: {exc}")
            results.append(BatchItem(
                index=idx,
                sequence_length=len(seq),
                prediction="",
                confidence=0.0,
                error=str(exc),
            ))
            failed += 1

    return BatchResponse(
        results=results,
        total=len(req.sequences),
        succeeded=succeeded,
        failed=failed,
    )


# ── Entrypoint ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)