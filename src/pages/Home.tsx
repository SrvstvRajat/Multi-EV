import React, { useEffect, useState } from "react";
import { Fingerprint, Terminal } from "lucide-react";
import ConceptFig from "../images/Fig1_concept_fig.png";
import FlowchartFig from "../images/Fig2_Flowchart.png";
// Figure 3 is currently disabled below — re-enable this import if you bring it back.
// import PerformanceFig from "../images/Fig6_Stack_ovr_final_margine_final.png";

const T = {
  ink: "#F4F8F5",
  surface: "#FFFFFF",
  hairline: "rgba(15,23,42,0.08)",
  text: "#16211C",
  muted: "#5F6E66",
  primary: "#1F9E88",
  primaryDim: "rgba(31,158,136,0.10)",
};

const Tf = {
  surfaceRaised: "#EEF5F0",
  hairlineStrong: "rgba(15,23,42,0.14)",
  primary: "#1F9E88",
  amber: "#D98A46",
  amberDim: "rgba(217,138,70,0.12)",
  slate: "#8A97A6",
  slateDim: "rgba(138,151,166,0.12)",
};


const FontLoader: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
    .font-serif { font-family: 'Source Serif 4', Georgia, serif; }
    .font-mono { font-family: 'IBM Plex Mono', monospace; }
  `}</style>
);
 

const cardClass = "rounded-2xl";
const cardStyle: React.CSSProperties = { background: T.surface, border: `1px solid ${T.hairline}` };

interface StatCardProps { value: string; label: string }

const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <div className="rounded-xl p-5 text-center" style={{ background: T.ink, border: `1px solid ${T.hairline}` }}>
    <p className="font-serif text-3xl font-semibold tracking-tight mb-1" style={{ color: T.primary }}>{value}</p>
    <p className="font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: T.muted }}>{label}</p>
  </div>
);

const DECODER_SAMPLES = [
  { seq: "MANLTGTIKGLYPETLSPEQLEKLRGFKIQTRITNEKYLRTHKEVELLISGFFREMFLKRPDNIPEFAADYFTDPRLPNKIHMQLIKEKKAA", label: "Non-EV", confidence: 88, color: Tf.slate, bg: Tf.slateDim },
  { seq: "MAFKDTGKTPVEPEVAIHRIRITLTSRNVKSLEKVCADLIRGAKEKNLKVKGPVRMPTKTLRITTRKTPCGEGSKTWDRFQMRIHKRLIDLHSPSEIVKQITSISIEPGVEVEVTIADA", label: "Milk-based EV", confidence: 94, color: T.primary, bg: T.primaryDim },
  { seq: "MNTDITALEKAQYPVVDRNPAFTKVVGNFSTLDYLRFSTITGISVTVGYLSGIKPGIKGPSMVTGGLIGLMGGFMYAYQNSAGRLMGFFPNDGEVASYQKRGGFSK", label: "Plant-based EV", confidence: 91, color: Tf.amber, bg: Tf.amberDim }
];

const AA = "ACDEFGHIKLMNPQRSTVWY";
const randomSeq = (len: number) =>
  Array.from({ length: len }, () => AA[Math.floor(Math.random() * AA.length)]).join("");

const SequenceDecoder: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displaySeq, setDisplaySeq] = useState(() => randomSeq(DECODER_SAMPLES[0].seq.length));
  const [revealed, setRevealed] = useState(false);

  const active = DECODER_SAMPLES[activeIndex];

  useEffect(() => {
    setRevealed(false);
    setDisplaySeq(randomSeq(active.seq.length));
    const scramble = setInterval(() => setDisplaySeq(randomSeq(active.seq.length)), 55);
    const reveal = setTimeout(() => {
      clearInterval(scramble);
      setDisplaySeq(active.seq);
      setRevealed(true);
    }, 650);
    return () => {
      clearInterval(scramble);
      clearTimeout(reveal);
    };
  }, [active.seq, activeIndex]);

  useEffect(() => {
    const cycle = setInterval(() => {
      setActiveIndex((i) => (i + 1) % DECODER_SAMPLES.length);
    }, 4200);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border h-full" style={{ background: Tf.surfaceRaised, borderColor: T.hairline }}>
      <div className="absolute inset-x-0 h-24 pointer-events-none opacity-40" style={{ background: `linear-gradient(180deg, transparent, ${T.primary}22, transparent)`, animation: "scanline 3.2s linear infinite" }} />
      <div className="relative px-6 py-5 flex items-center justify-between border-b" style={{ borderColor: T.hairline }}>
        <div className="flex items-center gap-2.5">
          <Terminal size={14} style={{ color: Tf.primary }} />
          <span className="font-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: T.muted }}>sequence_decoder.live</span>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: Tf.hairlineStrong }} />
          <span className="w-2 h-2 rounded-full" style={{ background: Tf.hairlineStrong }} />
          <span className="w-2 h-2 rounded-full" style={{ background: T.primary, animation: "pulseGlow 1.8s ease-in-out infinite" }} />
        </div>
      </div>
      <div className="relative px-6 py-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] mb-2.5" style={{ color: T.muted }}>input sequence</p>
        <p className="font-mono text-[15px] leading-relaxed break-all mb-6 min-h-[3.2em]" style={{ color: revealed ? T.text : "rgba(22,33,28,0.32)" }}>{displaySeq}</p>
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: T.muted }}>predicted class</p>
          {revealed && (<span className="font-mono text-[11px]" style={{ color: active.color }}>{active.confidence}% confidence</span>)}
        </div>
        <div className="flex items-center gap-3 rounded-xl px-4 py-3 transition-opacity duration-300" style={{ background: active.bg, opacity: revealed ? 1 : 0.3 }}>
          <Fingerprint size={16} style={{ color: active.color }} />
          <span className="font-serif text-sm font-semibold" style={{ color: active.color }}>{revealed ? active.label : "resolving\u2026"}</span>
        </div>
        <div className="mt-2.5 h-1 rounded-full overflow-hidden" style={{ background: T.hairline }}>
          <div key={activeIndex} className="h-full rounded-full" style={{ background: active.color, width: revealed ? `${active.confidence}%` : "0%", transition: "width 0.6s ease-out" }} />
        </div>
      </div>
    </div>
  );
};

const SOURCE_CLASSES = [
  { label: "Milk EV", desc: "Proteins from milk-derived extracellular vesicles (bovine/human milk, colostrum).", color: "#1F9E88", bg: "rgba(31,158,136,0.10)", count: "2,963" },
  { label: "Plant EV", desc: "Proteins from plant-derived extracellular vesicles (ginger, grapefruit, carrot, etc).", color: "rgb(25 87 17)", bg: "rgba(25,87,17,0.10)", count: "3,796" },
  { label: "Non-EV", desc: "Non-vesicular proteins used as the negative class to balance training.", color: "rgb(0 26 102)", bg: "rgba(0,26,102,0.12)", count: "3,150" },
];

const Home: React.FC = () => {
  return (
    <div style={{ background: T.ink }} className="min-h-screen pb-2 font-serif">
      <FontLoader />
      <main className="max-w-6xl mx-auto px-5 py-14 space-y-16">

        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight leading-tight mb-4" style={{ color: T.text }}>
            What is FoodEVPred?
          </h1>
          <div className={`overflow-hidden ${cardClass}`} style={cardStyle}>
            <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.hairline}` }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: T.primary }}>Figure 1</span>
              <div className="flex-1 h-px" style={{ backgroundColor: T.hairline }} />
            </div>
              
               <p className="mt-4 text-[15px] leading-7" style={{ color: T.muted }}>
                Mechanism of different types of EV formation pathways in the human cell.
              </p>
            </div>
            <div className="p-4 md:p-6">
              <img src={ConceptFig} alt="Figure 1" className="w-full h-auto object-contain rounded-lg" />
            </div>
          </div>
        </div>

        <div className="space-y-5 font-serif text-[17px] leading-8" style={{ color: T.muted }}>
  <p>Food-derived extracellular vesicles (EVs) from animal and plant sources are emerging as naturally occurring nanocarriers that survive gastrointestinal transit and modulate host physiology. Despite extensive proteomics characterization of their cargo, no computational tool exists to predict whether a food protein is an EV cargo.</p>
  <p>Here, we present FoodEVPred, the first sequence-based machine learning framework for multi-class classification of food-derived EV cargo proteins into three categories: Milk EV, Plant EV, and Non-EV. The ProtT5 pre-trained protein language model was used to extract biophysical embeddings encoding protein function, stability, and structural context. We built a two-tier stacked ensemble comprising SVM (RBF kernel), LR, and MLP as base classifiers, with XGBoost as the meta-learner.</p>
  <p>The final model achieves an accuracy of 88.95 ± 1.26%, specificity of 94.24 ± 0.67%, and AUC of 97.32 ± 0.37%. One-vs-rest class performance demonstrates strong discrimination for EV vs. Non-EV (ACC 89.80 ± 0.93%, AUC 96.64 ± 0.57%), Milk EV vs. Non-EV (ACC 87.52 ± 1.21%, AUC 94.39 ± 0.76%), and Plant EV vs. Non-EV (ACC 97.62 ± 0.39%, AUC 99.74 ± 0.07%).</p>
  <p>FoodEVPred provides a scalable, interpretable foundation for prioritizing food-derived EV cargo proteins that have been explored as vehicles for small-molecule drugs, including doxorubicin prodrugs, peptide therapeutics, and antibiotics.</p>
</div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: T.primary }}>Classification targets</p>
            <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: T.text }}>Three Source Categories</h2>
            <div className="flex flex-col gap-4">
              {SOURCE_CLASSES.map(({ label, desc, color, bg, count }) => (
                <div key={label} className={`p-5 ${cardClass}`} style={{ ...cardStyle, borderColor: `${color}30` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif text-sm font-semibold" style={{ color }}>{label}</span>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full" style={{ background: bg, color }}>{count}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: T.muted }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: T.primary }}>Live demo</p>
            <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: T.text }}>Try the Classifier</h2>
            <div className="flex flex-col gap-4">
              <SequenceDecoder />
            </div>
            
          </div>
        </div>

<div className="grid grid-cols-4 gap-3">
                <StatCard value="3" label="Source Classes" />
                <StatCard value="11,788" label="Curated Proteins" />
                <StatCard value="256" label="RFE Features" />
                <StatCard value="3" label="Ensemble Models" />
              </div>
        <div className={`overflow-hidden ${cardClass}`} style={cardStyle}>
          <div className="px-8 py-6" style={{ borderBottom: `1px solid ${T.hairline}` }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: T.primary }}>Figure 2</span>
              <div className="flex-1 h-px" style={{ backgroundColor: T.hairline }} />
            </div>
            <p className="mt-4 text-[15px] leading-7" style={{ color: T.muted }}>
              Overview of the computational workflow implemented in FoodEVPred.
              The framework consists of five major stages:
              (A) Dataset Construction,
              (B) Dataset Preprocessing,
              (C) Feature Extraction & Optimization,
              (D) Stacked Ensemble Learning, and
              (E) Web Server Deployment.
            </p>
          </div>
          <div className="p-4 md:p-6">
            <img src={FlowchartFig} alt="Figure 2" className="w-full h-auto object-contain rounded-lg" />
          </div>
        </div>

        {/* ── Fig 3: Performance (disabled — uncomment along with the PerformanceFig import above to re-enable) ──
        <div className={`overflow-hidden ${cardClass}`} style={cardStyle}>
          <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.hairline}` }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: T.muted }}>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: T.primary }}>Figure 3</span>
            </p>
            <h3 style={{ color: T.text }}>
              Evaluation of various base classifier combinations for group 3, 4, and 5 within the stacked ensemble framework. (A) Performance of various base combinations on the testing dataset; (B) Confusion matrix of final stack ensemble model with base classifier of SVM_RFB, LR, and MLP and the XGBoost as meta classifier; (C) AUROC demonstrates the discriminative power of the model for multi-class prediction; (D) PR curve depicting the precision performance of the multi-class model of Food EV; (E) Performance of the testing dataset of one-vs-rest classes (ovr) on the stacked ensemble pipeline; (F) AUROC for every case of ovr; (G) PR-curve analysis for ovr binary classes of Food EV; Confusion matrix comparison of ovr cases: (H) Milk EV vs. Non-EV; (I) EV vs. Non-EV; (J) Plant EV vs. Milk-EV; (K) Plant EV vs. Non-EV.
            </h3>
          </div>
          <div className="p-4 md:p-6">
            <img
              src={PerformanceFig}
              alt="Figure 3: Performance comparison of stacked ensemble models (A), confusion matrix (B), ROC curves (C), PR curves (D), per-class binary comparisons (E–K)"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>
        */}
      </main>
    </div>
  );
};

export default Home;