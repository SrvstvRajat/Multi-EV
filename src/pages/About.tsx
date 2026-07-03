import React from "react";
import { BookOpen, Sparkles } from "lucide-react";
import ConceptFig from "../images/Fig1_concept_fig.png";
import FlowchartFig from "../images/Fig2_Flowchart.png";
import PerformanceFig from "../images/Fig6_Stack_ovr_final_margine_final.png";

const T = {
  ink: "#F4F8F5",
  surface: "#FFFFFF",
  hairline: "rgba(15,23,42,0.08)",
  text: "#16211C",
  muted: "#5F6E66",
  primary: "#1F9E88",
  primaryDim: "rgba(31,158,136,0.10)",
};

const FontLoader: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    .font-mono { font-family: 'IBM Plex Mono', monospace; }
  `}</style>
);

const cardClass = "rounded-2xl";
const cardStyle: React.CSSProperties = { background: T.surface, border: `1px solid ${T.hairline}` };

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCardProps { value: string; label: string }
interface MethodCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  tagBg: string;
}
interface TeamMemberProps {
  name: string;
  role: string;
  affiliation: string;
  initials: string;
  color: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <div className="rounded-xl p-5 text-center" style={{ background: T.ink, border: `1px solid ${T.hairline}` }}>
    <p className="font-display text-3xl font-semibold tracking-tight mb-1" style={{ color: T.primary }}>{value}</p>
    <p className="font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: T.muted }}>{label}</p>
  </div>
);

const MethodCard: React.FC<MethodCardProps> = ({ icon, title, description, tag, tagColor, tagBg }) => (
  <div className={`p-6 flex flex-col gap-4 ${cardClass}`} style={cardStyle}>
    <div className="flex items-start justify-between gap-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: tagBg, color: tagColor }}>
        {icon}
      </div>
      <span
        className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
        style={{ background: tagBg, color: tagColor }}
      >
        {tag}
      </span>
    </div>
    <div>
      <h3 className="font-display text-sm font-semibold mb-1.5" style={{ color: T.text }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: T.muted }}>{description}</p>
    </div>
  </div>
);

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, affiliation, initials, color }) => (
  <div className={`p-5 flex items-center gap-4 ${cardClass}`} style={cardStyle}>
    <div
      className="font-mono w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
      style={{ background: color }}
    >
      {initials}
    </div>
    <div>
      <p className="font-display text-sm font-semibold" style={{ color: T.text }}>{name}</p>
      <p className="text-xs font-medium mt-0.5" style={{ color: T.primary }}>{role}</p>
      <p className="text-xs mt-0.5" style={{ color: T.muted }}>{affiliation}</p>
    </div>
  </div>
);

// ─── Source classes — matches Fig2 dataset and LABEL_MAP in app.py exactly ────

const SOURCE_CLASSES = [
  { label: "Milk EV", desc: "Proteins from milk-derived extracellular vesicles (bovine/human milk, colostrum)", color: "#1F9E88", bg: "rgba(31,158,136,0.10)", count: "2,963" },
  { label: "Plant EV", desc: "Proteins from plant-derived extracellular vesicles (ginger, grapefruit, carrot, etc)", color: "#5FA157", bg: "rgba(95,161,87,0.10)", count: "3,796" },
  { label: "Non-EV", desc: "Non-vesicular proteins used as the negative class to balance training", color: "#8A97A6", bg: "rgba(138,151,166,0.12)", count: "3,150" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const About: React.FC = () => {
  return (
    <div style={{ background: T.ink }} className="min-h-screen pb-24 font-body">
      <FontLoader />
      <main className="max-w-6xl mx-auto px-5 py-14 space-y-16">

        {/* ── Hero ── */}
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-3" style={{ color: T.primary }}>
            <Sparkles size={11} className="inline mr-1.5 -mt-0.5" />
            About the platform
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight leading-tight mb-4" style={{ color: T.text }}>
            What is MultiEV?
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: T.muted }}>
            Food-derived extracellular vesicles (EVs) from animal and plant sources are emerging as naturally occurring nanocarriers that survive gastrointestinal transit and modulate host physiology. Despite extensive proteomics characterization of their cargo, no computational tool exists to predict whether a food protein is an EV cargo. Here, we present FoodEVPred, the first sequence-based machine learning framework for multi-class classification of food-derived EV cargo proteins into three categories: Milk EV, Plant EV, and Non-EV. It comprises 11,788 protein sequences, yielding 6,353 non-redundant protein sequences after preprocessing. The ProtT5 pre-trained protein language model was used to extract biophysical embeddings encoding protein function, stability, and structural context. We built a two-tier stacked ensemble comprising SVM (RBF kernel), LR, and MLP as base classifiers, with XGBoost as the meta-learner. The final model achieves an accuracy of 88.95 ± 1.26%, specificity of 94.24 ± 0.67%, and AUC of 97.32 ± 0.37%. One-vs-rest class performance demonstrates strong discrimination for EV vs. Non-EV (ACC 89.80 ± 0.93%, AUC 96.64 ± 0.57%), Milk EV vs. Non-EV (ACC 87.52 ± 1.21%, AUC 94.39 ± 0.76%), and Plant EV vs. Non-EV (ACC 97.62 ± 0.39%, AUC 99.74 ± 0.07%). SHAP analysis identified ProtT5 dimensions encoding reveals biologically meaningful pattern among stacked ensemble models. We deployed a public web server for both real-time and batch-mode predictions. FoodEVPred provides a scalable, interpretable foundation for prioritizing food-derived EV cargo proteins that have been explored as vehicles for small-molecule drugs, including doxorubicin prodrugs, peptide therapeutics, and antibiotics.
          </p>
        </div>

        {/* ── Fig 1: Concept figure ── */}
        <div className={`overflow-hidden ${cardClass}`} style={cardStyle}>
          <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.hairline}` }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: T.muted }}>Figure 1</p>
            <h2 className="font-display text-base font-semibold mt-1" style={{ color: T.text }}>
              Mechanism of different types of EV formation pathways in the human cell
            </h2>
          </div>
          <div className="p-4 md:p-6">
            <img
              src={ConceptFig}
              alt="Figure 1: EV formation mechanisms (microvesicle, exosome, apoptotic body pathways) and food-derived EV sources with therapeutic applications"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>

        {/* ── Mission + Stats ── */}
        <div className={`p-8 md:p-10 ${cardClass}`} style={cardStyle}>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-3" style={{ color: T.muted }}>Our mission</p>
              <h2 className="font-display text-xl font-semibold mb-4" style={{ color: T.text }}>
                Scalable, sequence-driven EV protein prediction.
              </h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: T.muted }}>
                Identifying the food source of an EV protein traditionally requires costly wet-lab experiments.
                The pipeline uses ProtT5-XL embeddings with RFE-based feature selection (256 of 1024 dims), feeding a stacked ensemble of LR, SVM_RBF, and MLP base learners with an XGBoost meta-classifier.
              </p>
              {/* <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
                The pipeline uses ProtT5-XL embeddings with RFE-based feature selection (256 of 1024 dims), feeding a stacked ensemble of LR, SVM_RBF, and MLP base learners with an XGBoost meta-classifier.
              </p> */}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard value="3" label="Source Classes" />
              <StatCard value="11,788" label="Curated Proteins" />
              <StatCard value="256" label="RFE Features" />
              <StatCard value="3" label="Ensemble Models" />
            </div>
          </div>
        </div>

        {/* ── Source Classes ── */}
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: T.primary }}>Classification targets</p>
          <h2 className="font-display text-2xl font-semibold mb-6" style={{ color: T.text }}>Three Source Categories</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {SOURCE_CLASSES.map(({ label, desc, color, bg, count }) => (
              <div key={label} className={`p-5 ${cardClass}`} style={{ ...cardStyle, borderColor: `${color}30` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-sm font-semibold" style={{ color }}>{label}</span>
                  <span className="font-mono text-xs px-2.5 py-1 rounded-full" style={{ background: bg, color }}>
                    {count}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: T.muted }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Methodology ── */}
        {/* <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: T.primary }}>How it works</p>
          <h2 className="font-display text-2xl font-semibold mb-2" style={{ color: T.text }}>The ML Pipeline</h2>
          <p className="text-sm mb-6" style={{ color: T.muted }}>
            ProtT5-XL sequence embeddings, RFE feature selection, and a stacked ensemble classifier.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <MethodCard
              icon={<Beaker size={16} />}
              title="ProtT5-XL Embedding"
              tag="Stage 1"
              tagColor="#1F9E88" tagBg="rgba(31,158,136,0.10)"
              description="Each sequence is mean-pooled into a 1024-dim embedding using Rostlab's ProtT5-XL protein language model (T5-3B encoder, pre-trained on UniRef50), run in fp16 on GPU."
            />
            <MethodCard
              icon={<Brain size={16} />}
              title="RFE Feature Selection"
              tag="Stage 2"
              tagColor="#5B8FDB" tagBg="rgba(91,143,219,0.10)"
              description="Recursive Feature Elimination selects the 256 most informative of the 1024 embedding dimensions. Selected features are scaled to the training distribution before classification."
            />
            <MethodCard
              icon={<Layers size={16} />}
              title="Stacked Ensemble"
              tag="Stage 3"
              tagColor="#5FA157" tagBg="rgba(95,161,87,0.10)"
              description="Three base learners — Logistic Regression, SVM (RBF kernel), and MLP — each output class probabilities. These feed an XGBoost meta-classifier for the final 3-class prediction."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <MethodCard
              icon={<Database size={16} />}
              title="Dataset Curation"
              tag="Data"
              tagColor="#D98A46" tagBg="rgba(217,138,70,0.12)"
              description="2,963 Milk EV, 3,796 Plant EV, and 3,150 Non-EV proteins curated from public databases. CD-HIT (threshold 0.4) applied to remove sequence redundancy. Length filtered: 60–1,022 aa."
            />
            <MethodCard
              icon={<Target size={16} />}
              title="Training Strategy"
              tag="Training"
              tagColor="#2D9C8E" tagBg="rgba(45,156,142,0.10)"
              description="80/20 train-test split. Base learners and the XGBoost meta-model trained on the 256-dim scaled feature set, with base_model_order strictly preserved for meta-feature construction."
            />
            <MethodCard
              icon={<Zap size={16} />}
              title="Performance"
              tag="Results"
              tagColor="#8A97A6" tagBg="rgba(138,151,166,0.12)"
              description="The stacked model (SM8) achieves the highest performance across accuracy, F1, specificity, MCC, and precision. Full metrics and per-class ROC/PR curves shown in the figure below."
            />
          </div>
        </div> */}

        {/* ── Fig 2: ML Pipeline Flowchart — replaces hand-coded architecture diagram ── */}
        {/* <div className={`overflow-hidden ${cardClass}`} style={cardStyle}>
          <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.hairline}` }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: T.muted }}>Figure 2</p>
            <h2 className="font-display text-base font-semibold mt-1" style={{ color: T.text }}>
              Overview of the computational framework implemented in FoodEVPred. The workflow includes: (A) Dataset construction; (B) Dataset preprocessing; (C) Feature extraction and optimization; (D) Stacked ensemble model; and (E) Web server deployment.
            </h2>
          </div> */}
        <div className={`overflow-hidden ${cardClass}`} style={cardStyle}>
          <div
            className="px-8 py-6"
            style={{ borderBottom: `1px solid ${T.hairline}` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em]"
                style={{ color: T.primary }}
              >
                Figure 2
              </span>

              <div
                className="flex-1 h-px"
                style={{ backgroundColor: T.hairline }}
              />
            </div>

            {/* <h2
            // className="font-display text-xl md:text-2xl font-semibold leading-snug"
            // style={{ color: T.text }}
            >
              Overview of the computational workflow implemented in <span style={{ color: T.primary }}>FoodEVPred</span>
            </h2> */}

            <p
              className="mt-4 text-[15px] leading-7"
              style={{ color: T.muted }}
            >
              Overview of the computational workflow implemented in <span style={{ color: T.primary }}>FoodEVPred</span><br></br>
              The framework consists of five major stages:
              <strong style={{ color: T.text }}> (A)</strong> Dataset Construction,
              <strong style={{ color: T.text }}> (B)</strong> Dataset Preprocessing,
              <strong style={{ color: T.text }}> (C)</strong> Feature Extraction &
              Optimization,
              <strong style={{ color: T.text }}> (D)</strong> Stacked Ensemble
              Learning, and
              <strong style={{ color: T.text }}> (E)</strong> Web Server Deployment.
            </p>
          </div>
          <div className="p-4 md:p-6">
            <img
              src={FlowchartFig}
              alt="Figure 2: Full pipeline flowchart — Dataset construction (A), preprocessing with CD-HIT (B), ProtT5 feature extraction and RFE (C), stacked ensemble model (D), and web server deployment (E)"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
          {/* <div className="px-6 py-3 text-xs" style={{ borderTop: `1px solid ${T.hairline}`, color: T.muted }}>
            A: Dataset construction · B: Preprocessing (non-natural aa removal, length filter, CD-HIT) · C: ProtT5 embedding + RFE · D: Stacked ensemble (SVM_RBF, LR, MLP → XGBoost) · E: Web server
          </div> */}
        </div>

        {/* ── Fig 6: Performance ── */}
        <div>
          {/* <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: T.primary }}>Model performance</p> */}
          {/* <h2 className="font-display text-2xl font-semibold mb-2" style={{ color: T.text }}>Evaluation Results</h2> */}
          {/* <p className="text-sm mb-6" style={{ color: T.muted }}>
            Stacked ensemble comparison, confusion matrix, ROC and precision-recall curves, and per-class binary evaluations.
          </p> */}
          <div className={`overflow-hidden ${cardClass}`} style={cardStyle}>
            <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.hairline}` }}>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: T.muted }}>
                <span
                  className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em]"
                  style={{ color: T.primary }}
                >Figure 3</span></p>
              <h3 style={{ color: T.text }}>
                Evaluation of various base classifier combinations for group 3, 4, and 5 within the stacked ensemble framework. (A) Performance of various base combinations on the testing dataset; (B) Confusion matrix of final stack ensemble model with base classifier of SVM_RFB, LR, and MLP and the XGBoost as meta classifier; (C) AUROC (Area under the Receiver Operating Characteristics curve) demonstrates the discriminative power of the model for multi-class prediction; (D) PR curve (Precision-Recall curve) depicting the precision performance of the multi-class model of Food EV; (E) Performance of the testing dataset of one-vs-rest classes (ovr) on the stacked ensemble pipeline; (F) AUROC for every case of ovr; (G) PR-curve analysis for ovr binary classes of Food EV; Confusion matrix comparison of very ovr cases on the stacked ensemble model: (H) Milk EV vs. Non-EV; (I) EV vs. Non-Ev; (J) Plant EV vs. Milk-EV; (K) Plant EV vs. None-EV
              </h3>
            </div>
            <div className="p-4 md:p-6">
              <img
                src={PerformanceFig}
                alt="Figure 6: Performance comparison of stacked ensemble models (A), confusion matrix (B), ROC curves (C), PR curves (D), per-class binary comparisons (E–K)"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
            {/* <div className="px-6 py-3 text-xs" style={{ borderTop: `1px solid ${T.hairline}`, color: T.muted }}>
              A: Stacked model comparison (SM1–SM16) · B: 3-class confusion matrix · C: ROC curves (AUC=0.9726 stacked) · D: PR curves (AP=0.9440) · E–K: Binary pairwise evaluations
            </div> */}
          </div>
        </div>
      </main >
    </div >
  );
};

export default About;