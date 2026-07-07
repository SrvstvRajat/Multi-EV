import React, { useState } from "react";
import { FileText, Mail} from "lucide-react";
import SequenceImg from "../images/Sequence.png";
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


type HelpTab = "sequence" | "batchFile";

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
      <h3 className="font-serif text-sm font-semibold" style={{ color: T.text }}>{label}</h3>
    </div>
    <div className="p-4">
      <img src={img} alt={label} className="w-full h-auto object-contain rounded-lg" />
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const HowToUse: React.FC = () => {
  const [tab, setTab] = useState<HelpTab>("sequence");

  const tabs: { id: HelpTab; Icon: React.ElementType; label: string }[] = [
    { id: "sequence", Icon: FileText, label: "Sequence" },
    { id: "batchFile", Icon: Mail, label: "Batch File" },
  ];

  return (
    <div style={{ background: T.ink }} className="min-h-screen font-serif">
      <main className="max-w-6xl mx-auto px-5 py-14">

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

            {tab === "sequence" && (
              <>
                <ImageBox label="Single Protein Prediction" Icon={FileText} img={SequenceImg} />
                <div className="rounded-2xl p-6" style={{ background: T.surface, border: `1px solid ${T.hairline}` }}>
                  <h3 className="font-serif text-sm font-semibold mb-4" style={{ color: T.text }}>Steps</h3>
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
                  <h3 className="font-serif text-sm font-semibold mb-4" style={{ color: T.text }}>Steps</h3>
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
                    <strong>Tip:</strong> Download sample files from the Predict page to verify your data format before submitting a batch job.
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