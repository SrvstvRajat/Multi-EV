import React, { useState } from "react";
import { BookOpen, FileText, Mail, Info, CheckCircle } from "lucide-react";
import SequenceImg  from "../images/Sequence.png";
import BatchFileImg from "../images/Batch.png";

const T = {
  ink: "#F4F8F5",
  surface: "#FFFFFF",
  hairline: "rgba(15,23,42,0.08)",
  text: "#16211C",
  muted: "#5F6E66",
  primary: "#1F9E88",
  primaryDim: "rgba(31,158,136,0.10)",
  amber: "#D98A46",
};

const FontLoader: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    .font-mono { font-family: 'IBM Plex Mono', monospace; }
  `}</style>
);

type HelpTab = "overview" | "molecule" | "batchFile";

// ─── Step list ────────────────────────────────────────────────────────────────

const StepItem: React.FC<{ num: number; text: string; color: string }> = ({ num, text, color }) => (
  <li className="flex items-start gap-3">
    <span
      className="font-mono flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white"
      style={{ background: color }}
    >
      {num}
    </span>
    <span className="text-sm pt-0.5 leading-relaxed" style={{ color: T.muted }}>{text}</span>
  </li>
);

// ─── Image section ────────────────────────────────────────────────────────────

const ImageBox: React.FC<{ label: string; Icon: React.ElementType; img: string }> = ({ label, Icon, img }) => (
  <div className="rounded-2xl overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.hairline}` }}>
    <div className="px-6 py-4 flex items-center gap-2.5" style={{ borderBottom: `1px solid ${T.hairline}` }}>
      <Icon size={16} style={{ color: T.primary }} />
      <h3 className="font-display text-sm font-semibold" style={{ color: T.text }}>{label}</h3>
    </div>
    <div className="p-4">
      <img src={img} alt={label} className="w-full h-auto object-contain rounded-lg" />
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const HowToUse: React.FC = () => {
  const [tab, setTab] = useState<HelpTab>("overview");

  const tabs: { id: HelpTab; Icon: React.ElementType; label: string }[] = [
    { id: "overview",  Icon: Info,     label: "Overview"     },
    { id: "molecule",  Icon: FileText, label: "Sequence"     },
    { id: "batchFile", Icon: Mail,     label: "Batch File"   },
  ];

  return (
    <div style={{ background: T.ink }} className="min-h-screen font-body">
      <FontLoader />
      <main className="max-w-6xl mx-auto px-5 py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: T.primary }}>
            <BookOpen size={11} className="inline mr-1.5 -mt-0.5" />
            User guide
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight mb-2" style={{ color: T.text }}>How To Use</h1>
          <p style={{ color: T.muted }}>Learn how to use MultiEV effectively.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {tabs.map(({ id, Icon, label }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all"
                  style={
                    active
                      ? { background: T.primary, color: "white", boxShadow: "0 4px 14px rgba(31,158,136,0.25)" }
                      : { background: T.surface, color: T.muted, border: `1px solid ${T.hairline}` }
                  }
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-5">

            {tab === "overview" && (
              <>
                <ImageBox label="MultiEV — Platform Overview" Icon={Info} img={SequenceImg} />
                <div className="rounded-2xl p-6" style={{ background: T.surface, border: `1px solid ${T.hairline}` }}>
                  <h3 className="font-display text-sm font-semibold mb-4" style={{ color: T.text }}>Platform Highlights</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "3-class prediction: Milk EV, Plant EV, and Non-EV food-derived extracellular vesicle proteins",
                      "ProtT5-XL protein language model (T5-3B encoder) with RFE-based feature selection (256 of 1024 dims)",
                      "Stacked ensemble model: LR, SVM_RBF, and MLP base learners feeding an XGBoost meta-classifier",
                      "Supports single protein sequence and batch file prediction (up to 50 sequences via file upload)",
                    ].map((text, i) => (
                      <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: T.ink, border: `1px solid ${T.hairline}` }}>
                        <CheckCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: T.primary }} />
                        <p className="text-xs leading-relaxed" style={{ color: T.muted }}>{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === "molecule" && (
              <>
                <ImageBox label="Single Protein Prediction" Icon={FileText} img={SequenceImg} />
                <div className="rounded-2xl p-6" style={{ background: T.surface, border: `1px solid ${T.hairline}` }}>
                  <h3 className="font-display text-sm font-semibold mb-4" style={{ color: T.text }}>Steps</h3>
                  <ol className="space-y-3.5">
                    {[
                      "Navigate to the Predict page and select the \"Single Sequence\" tab.",
                      "Enter your protein sequence in the input field (one sequence per prediction).",
                      "Click \"Load Sample\" to auto-fill a test sequence and verify the interface.",
                      "Click \"Classify Sequence\" — the job runs asynchronously and results appear once complete.",
                    ].map((text, i) => (
                      <StepItem key={i} num={i + 1} text={text} color={T.primary} />
                    ))}
                  </ol>
                </div>
              </>
            )}

            {tab === "batchFile" && (
              <>
                <ImageBox label="Batch File Processing" Icon={Mail} img={BatchFileImg} />
                <div className="rounded-2xl p-6" style={{ background: T.surface, border: `1px solid ${T.hairline}` }}>
                  <h3 className="font-display text-sm font-semibold mb-4" style={{ color: T.text }}>Steps</h3>
                  <ol className="space-y-3.5">
                    {[
                      "Navigate to the Predict page and select the \"Batch File\" tab.",
                      "Upload your sequence file in .txt, .csv, or .fasta format (up to 50 sequences).",
                      "Enter your full name and a valid email address where results will be delivered.",
                      "Click \"Submit Batch Job\" — your CSV results will be emailed once processing completes.",
                    ].map((text, i) => (
                      <StepItem key={i} num={i + 1} text={text} color={T.amber} />
                    ))}
                  </ol>
                  <div className="mt-5 p-4 rounded-xl text-xs" style={{ background: T.primaryDim, border: `1px solid rgba(31,158,136,0.25)`, color: T.text }}>
                    <strong>Tip:</strong> Download sample files from the Home page to verify your data format before submitting a batch job.
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default HowToUse;