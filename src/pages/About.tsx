// import React from "react";
// import { Beaker, Brain, Database, Layers, Target, Zap, BookOpen, Sparkles } from "lucide-react";

// const T = {
//   ink: "#F4F8F5",
//   surface: "#FFFFFF",
//   hairline: "rgba(15,23,42,0.08)",
//   text: "#16211C",
//   muted: "#5F6E66",
//   primary: "#1F9E88",
//   primaryDim: "rgba(31,158,136,0.10)",
// };

// const FontLoader: React.FC = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
//     .font-display { font-family: 'Space Grotesk', sans-serif; }
//     .font-body { font-family: 'Inter', sans-serif; }
//     .font-mono { font-family: 'IBM Plex Mono', monospace; }
//   `}</style>
// );

// const cardClass = "rounded-2xl";
// const cardStyle: React.CSSProperties = { background: T.surface, border: `1px solid ${T.hairline}` };

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface StatCardProps  { value: string; label: string }
// interface MethodCardProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   tag: string;
//   tagColor: string;
//   tagBg: string;
// }
// interface TeamMemberProps {
//   name: string;
//   role: string;
//   affiliation: string;
//   initials: string;
//   color: string;
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
//   <div className="rounded-xl p-5 text-center" style={{ background: T.ink, border: `1px solid ${T.hairline}` }}>
//     <p className="font-display text-3xl font-semibold tracking-tight mb-1" style={{ color: T.primary }}>{value}</p>
//     <p className="font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: T.muted }}>{label}</p>
//   </div>
// );

// const MethodCard: React.FC<MethodCardProps> = ({ icon, title, description, tag, tagColor, tagBg }) => (
//   <div className={`p-6 flex flex-col gap-4 ${cardClass}`} style={cardStyle}>
//     <div className="flex items-start justify-between gap-3">
//       <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: tagBg, color: tagColor }}>
//         {icon}
//       </div>
//       <span
//         className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
//         style={{ background: tagBg, color: tagColor }}
//       >
//         {tag}
//       </span>
//     </div>
//     <div>
//       <h3 className="font-display text-sm font-semibold mb-1.5" style={{ color: T.text }}>{title}</h3>
//       <p className="text-sm leading-relaxed" style={{ color: T.muted }}>{description}</p>
//     </div>
//   </div>
// );

// const TeamMember: React.FC<TeamMemberProps> = ({ name, role, affiliation, initials, color }) => (
//   <div className={`p-5 flex items-center gap-4 ${cardClass}`} style={cardStyle}>
//     <div
//       className="font-mono w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
//       style={{ background: color }}
//     >
//       {initials}
//     </div>
//     <div>
//       <p className="font-display text-sm font-semibold" style={{ color: T.text }}>{name}</p>
//       <p className="text-xs font-medium mt-0.5" style={{ color: T.primary }}>{role}</p>
//       <p className="text-xs mt-0.5" style={{ color: T.muted }}>{affiliation}</p>
//     </div>
//   </div>
// );

// // ─── Source classes ───────────────────────────────────────────────────────────

// const SOURCE_CLASSES = [
//   { label: "Cow Milk",    emoji: "🐄", color: "#1F9E88", bg: "rgba(31,158,136,0.10)" },
//   { label: "Human Milk",  emoji: "🤱", color: "#5B8FDB", bg: "rgba(91,143,219,0.10)" },
//   { label: "Citrus",      emoji: "🍋", color: "#D98A46", bg: "rgba(217,138,70,0.12)" },
//   { label: "Broccoli",    emoji: "🥦", color: "#5FA157", bg: "rgba(95,161,87,0.10)" },
//   { label: "Arabidopsis", emoji: "🌿", color: "#2D9C8E", bg: "rgba(45,156,142,0.10)" },
//   { label: "Negative",    emoji: "⊖",  color: "#8A97A6", bg: "rgba(138,151,166,0.12)" },
// ];

// // ─── Main Component ───────────────────────────────────────────────────────────

// const About: React.FC = () => {
//   return (
//     <div style={{ background: T.ink }} className="min-h-screen pb-24 font-body">
//       <FontLoader />
//       <main className="max-w-6xl mx-auto px-5 py-14 space-y-16">

//         {/* ── Hero ── */}
//         <div className="max-w-2xl">
//           <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-3" style={{ color: T.primary }}>
//             <Sparkles size={11} className="inline mr-1.5 -mt-0.5" />
//             About the platform
//           </p>
//           <h1 className="font-display text-4xl font-semibold tracking-tight leading-tight mb-4" style={{ color: T.text }}>
//             What is EVSource Predictor?
//           </h1>
//           <p className="text-lg leading-relaxed" style={{ color: T.muted }}>
//             A machine-learning framework for multi-class classification of food-derived extracellular vesicle (EV) proteins based solely on protein sequence–derived features — bridging computational biology and nutritional science.
//           </p>
//         </div>

//         {/* ── Mission + Stats ── */}
//         <div className={`p-8 md:p-10 ${cardClass}`} style={cardStyle}>
//           <div className="grid md:grid-cols-2 gap-10 items-start">
//             <div>
//               <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-3" style={{ color: T.muted }}>Our mission</p>
//               <h2 className="font-display text-xl font-semibold mb-4" style={{ color: T.text }}>
//                 Scalable, sequence-driven EV protein prediction.
//               </h2>
//               <p className="text-sm leading-relaxed mb-3" style={{ color: T.muted }}>
//                 Identifying the food source of an EV protein traditionally requires costly wet-lab experiments. EVSource Predictor replaces that bottleneck with a fast, accurate ML pipeline that runs in seconds.
//               </p>
//               <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
//                 This work intentionally avoids ligand binding, docking, molecular dynamics, or chemical reaction modeling — focusing instead on data-driven sequence-level learning, making it scalable and generalizable.
//               </p>
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <StatCard value="6"      label="Source Classes"    />
//               <StatCard value="~89%"   label="Test Accuracy"     />
//               <StatCard value="17K+"   label="EV Proteins"       />
//               <StatCard value="<5s"    label="Inference Time"    />
//             </div>
//           </div>
//         </div>

//         {/* ── Source Classes ── */}
//         <div>
//           <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: T.primary }}>Classification targets</p>
//           <h2 className="font-display text-2xl font-semibold mb-6" style={{ color: T.text }}>Six Source Categories</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
//             {SOURCE_CLASSES.map(({ label, emoji, color, bg }) => (
//               <div
//                 key={label}
//                 className="rounded-xl p-4 flex flex-col items-center gap-2 text-center"
//                 style={{ background: bg, border: `1px solid ${color}30` }}
//               >
//                 <span className="text-2xl">{emoji}</span>
//                 <span className="text-xs font-semibold leading-tight" style={{ color }}>{label}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── Methodology ── */}
//         <div>
//           <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: T.primary }}>How it works</p>
//           <h2 className="font-display text-2xl font-semibold mb-2" style={{ color: T.text }}>The ML Pipeline</h2>
//           <p className="text-sm mb-6" style={{ color: T.muted }}>
//             A two-stage feature extraction approach fused into a stack ensemble classifier.
//           </p>

//           <div className="grid md:grid-cols-3 gap-4 mb-4">
//             <MethodCard
//               icon={<Beaker size={16} />}
//               title="ESM2 Embeddings"
//               tag="Stage 1"
//               tagColor="#1F9E88" tagBg="rgba(31,158,136,0.10)"
//               description="Each protein sequence is encoded using Meta's ESM2 language model, producing rich contextual embeddings that capture evolutionary and structural information."
//             />
//             <MethodCard
//               icon={<Brain size={16} />}
//               title="Biopython Features"
//               tag="Stage 2"
//               tagColor="#5B8FDB" tagBg="rgba(91,143,219,0.10)"
//               description="Physicochemical and sequence-derived features (amino acid composition, dipeptide composition, molecular weight, isoelectric point) extracted via Biopython."
//             />
//             <MethodCard
//               icon={<Layers size={16} />}
//               title="Stack Ensemble"
//               tag="Stage 3"
//               tagColor="#5FA157" tagBg="rgba(95,161,87,0.10)"
//               description="Features are concatenated and passed through a stack ensemble classifier combining multiple base learners with a meta-classifier for robust multi-class prediction."
//             />
//           </div>

//           <div className="grid md:grid-cols-3 gap-4">
//             <MethodCard
//               icon={<Database size={16} />}
//               title="Dataset Curation"
//               tag="Data"
//               tagColor="#D98A46" tagBg="rgba(217,138,70,0.12)"
//               description="High-confidence EV protein datasets curated from cow milk, human milk, citrus, broccoli, and Arabidopsis. A carefully assembled negative class balances the training distribution."
//             />
//             <MethodCard
//               icon={<Target size={16} />}
//               title="Training Strategy"
//               tag="Training"
//               tagColor="#2D9C8E" tagBg="rgba(45,156,142,0.10)"
//               description="Trained with stratified k-fold cross-validation. Class imbalance handled via inverse-frequency weighting. Early stopping on macro F1 score with patience=15."
//             />
//             <MethodCard
//               icon={<Zap size={16} />}
//               title="Performance"
//               tag="Results"
//               tagColor="#8A97A6" tagBg="rgba(138,151,166,0.12)"
//               description="The model achieves ~89% accuracy with strong per-class F1 across all 6 source categories. Full confusion matrix and per-class breakdown available in the paper."
//             />
//           </div>
//         </div>

//         {/* ── Architecture diagram ── */}
//         <div className={`p-8 md:p-10 ${cardClass}`} style={cardStyle}>
//           <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-6" style={{ color: T.muted }}>Architecture overview</p>
//           <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium">
//             {[
//               { label: "Protein\nSequence",    color: T.text,   bg: T.ink,                        border: T.hairline },
//               null,
//               { label: "ESM2\nEmbeddings",     color: "#1F9E88", bg: "rgba(31,158,136,0.10)",     border: "rgba(31,158,136,0.30)" },
//               { label: "BioPython\nFeatures",  color: "#5B8FDB", bg: "rgba(91,143,219,0.10)",     border: "rgba(91,143,219,0.30)" },
//               null,
//               { label: "Feature\nConcat",      color: T.muted,  bg: T.ink,                        border: T.hairline },
//               null,
//               { label: "Stack\nEnsemble",      color: "#5FA157", bg: "rgba(95,161,87,0.10)",      border: "rgba(95,161,87,0.30)" },
//               null,
//               { label: "Source\nPrediction",   color: "#ffffff", bg: T.primary,                   border: T.primary },
//             ].map((item, i) =>
//               item === null ? (
//                 <span key={i} className="font-bold px-1" style={{ color: T.hairline }}>→</span>
//               ) : (
//                 <div
//                   key={i}
//                   className="rounded-lg px-4 py-2.5 text-center whitespace-pre-line leading-tight text-xs font-semibold"
//                   style={{ background: item.bg, border: `1px solid ${item.border}`, color: item.color, minWidth: "82px" }}
//                 >
//                   {item.label}
//                 </div>
//               )
//             )}
//           </div>
//         </div>

//         {/* ── Team ── */}
//         <div>
//           <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: T.primary }}>The team</p>
//           <h2 className="font-display text-2xl font-semibold mb-6" style={{ color: T.text }}>Built by Researchers</h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <TeamMember name="[Your Name]"         role="Lead Researcher"        affiliation="IIIT Delhi"             initials="YN" color="#1F9E88" />
//             <TeamMember name="[Collaborator Name]" role="ML Engineering"         affiliation="[Their Institution]"    initials="CN" color="#5B8FDB" />
//             <TeamMember name="Prof. Ganesh Bagler" role="Principal Investigator" affiliation="CoSyLab, IIIT Delhi"    initials="GB" color="#5FA157" />
//           </div>
//         </div>

//         {/* ── Citation ── */}
//         <div className={`p-8 ${cardClass}`} style={cardStyle}>
//           <div className="flex items-start gap-4">
//             <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: T.primaryDim, color: T.primary }}>
//               <BookOpen size={16} />
//             </div>
//             <div className="flex-1">
//               <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-3" style={{ color: T.muted }}>Cite this work</p>
//               <div
//                 className="font-mono rounded-lg px-5 py-4 text-sm leading-relaxed"
//                 style={{ background: T.ink, color: T.muted, border: `1px solid ${T.hairline}` }}
//               >
//                 [Author(s)]. EVSource Predictor: Multi-Class Classification of Food-Derived EV Proteins.
//                 <span style={{ color: T.primary }}> [Journal / Conference]</span>, [Year].
//                 doi: [your-doi-here]
//               </div>
//               <p className="text-xs mt-3" style={{ color: T.muted }}>
//                 Contact:{" "}
//                 <a href="mailto:bagler+multiev@iiitd.ac.in" style={{ color: T.primary }} className="hover:underline">
//                   bagler+multiev@iiitd.ac.in
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>

//       </main>
//     </div>
//   );
// };

// export default About;

import React from "react";
import { Beaker, Brain, Database, Layers, Target, Zap, BookOpen, Sparkles } from "lucide-react";
import ConceptFig   from "../images/Fig1_concept_fig.png";
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

interface StatCardProps  { value: string; label: string }
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
  { label: "Milk EV",   desc: "Proteins from milk-derived extracellular vesicles (bovine/human milk, colostrum)", color: "#1F9E88", bg: "rgba(31,158,136,0.10)", count: "2,963" },
  { label: "Plant EV",  desc: "Proteins from plant-derived extracellular vesicles (ginger, grapefruit, carrot…)", color: "#5FA157", bg: "rgba(95,161,87,0.10)",   count: "3,796" },
  { label: "Non-EV",    desc: "Non-vesicular proteins used as the negative class to balance training",             color: "#8A97A6", bg: "rgba(138,151,166,0.12)", count: "3,150" },
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
            A machine-learning web server for multi-class classification of food-derived
            extracellular vesicle (EV) cargo proteins — classifying sequences as
            Milk EV, Plant EV, or Non-EV based solely on protein sequence, using
            ProtT5-XL embeddings and a stacked ensemble model.
          </p>
        </div>

        {/* ── Fig 1: Concept figure ── */}
        <div className={`overflow-hidden ${cardClass}`} style={cardStyle}>
          <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.hairline}` }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: T.muted }}>Figure 1</p>
            <h2 className="font-display text-base font-semibold mt-1" style={{ color: T.text }}>
              Extracellular Vesicle Biology &amp; Food-Derived EV Sources
            </h2>
          </div>
          <div className="p-4 md:p-6">
            <img
              src={ConceptFig}
              alt="Figure 1: EV formation mechanisms (microvesicle, exosome, apoptotic body pathways) and food-derived EV sources with therapeutic applications"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
          <div className="px-6 py-3 text-xs" style={{ borderTop: `1px solid ${T.hairline}`, color: T.muted }}>
            EV formation pathways (Section A) and food-derived EV sources, GI tract survival, and therapeutic applications (Section B).
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
                Identifying the food source of an EV protein traditionally requires costly wet-lab experiments. MultiEV replaces that bottleneck with a sequence-only ML pipeline — no wet lab, no structure, no molecular dynamics required.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
                The pipeline uses ProtT5-XL embeddings with RFE-based feature selection (256 of 1024 dims), feeding a stacked ensemble of LR, SVM_RBF, and MLP base learners with an XGBoost meta-classifier.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard value="3"     label="Source Classes"    />
              <StatCard value="9,909" label="Curated Proteins"  />
              <StatCard value="256"   label="RFE Features"      />
              <StatCard value="4"     label="Ensemble Models"   />
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
        <div>
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
        </div>

        {/* ── Fig 2: ML Pipeline Flowchart — replaces hand-coded architecture diagram ── */}
        <div className={`overflow-hidden ${cardClass}`} style={cardStyle}>
          <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.hairline}` }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: T.muted }}>Figure 2</p>
            <h2 className="font-display text-base font-semibold mt-1" style={{ color: T.text }}>
              Complete ML Pipeline — Dataset Construction to Web Server
            </h2>
          </div>
          <div className="p-4 md:p-6">
            <img
              src={FlowchartFig}
              alt="Figure 2: Full pipeline flowchart — Dataset construction (A), preprocessing with CD-HIT (B), ProtT5 feature extraction and RFE (C), stacked ensemble model (D), and web server deployment (E)"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
          <div className="px-6 py-3 text-xs" style={{ borderTop: `1px solid ${T.hairline}`, color: T.muted }}>
            A: Dataset construction · B: Preprocessing (non-natural aa removal, length filter, CD-HIT) · C: ProtT5 embedding + RFE · D: Stacked ensemble (SVM_RBF, LR, MLP → XGBoost) · E: Web server
          </div>
        </div>

        {/* ── Fig 6: Performance ── */}
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: T.primary }}>Model performance</p>
          <h2 className="font-display text-2xl font-semibold mb-2" style={{ color: T.text }}>Evaluation Results</h2>
          <p className="text-sm mb-6" style={{ color: T.muted }}>
            Stacked ensemble comparison, confusion matrix, ROC and precision-recall curves, and per-class binary evaluations.
          </p>
          <div className={`overflow-hidden ${cardClass}`} style={cardStyle}>
            <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.hairline}` }}>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: T.muted }}>Figure 6</p>
              <h3 className="font-display text-base font-semibold mt-1" style={{ color: T.text }}>
                Stacked Ensemble Model — Test Dataset Performance
              </h3>
            </div>
            <div className="p-4 md:p-6">
              <img
                src={PerformanceFig}
                alt="Figure 6: Performance comparison of stacked ensemble models (A), confusion matrix (B), ROC curves (C), PR curves (D), per-class binary comparisons (E–K)"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
            <div className="px-6 py-3 text-xs" style={{ borderTop: `1px solid ${T.hairline}`, color: T.muted }}>
              A: Stacked model comparison (SM1–SM16) · B: 3-class confusion matrix · C: ROC curves (AUC=0.9726 stacked) · D: PR curves (AP=0.9440) · E–K: Binary pairwise evaluations
            </div>
          </div>
        </div>

        {/* ── Team ── */}
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: T.primary }}>The team</p>
          <h2 className="font-display text-2xl font-semibold mb-6" style={{ color: T.text }}>Built by Researchers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TeamMember name="[Your Name]"         role="Lead Researcher"        affiliation="IIIT Delhi"             initials="YN" color="#1F9E88" />
            <TeamMember name="[Collaborator Name]" role="ML Engineering"         affiliation="[Their Institution]"    initials="CN" color="#5B8FDB" />
            <TeamMember name="Prof. Ganesh Bagler" role="Principal Investigator" affiliation="CoSyLab, IIIT Delhi"    initials="GB" color="#5FA157" />
          </div>
        </div>

        {/* ── Citation ── */}
        <div className={`p-8 ${cardClass}`} style={cardStyle}>
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: T.primaryDim, color: T.primary }}>
              <BookOpen size={16} />
            </div>
            <div className="flex-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-3" style={{ color: T.muted }}>Cite this work</p>
              <div
                className="font-mono rounded-lg px-5 py-4 text-sm leading-relaxed"
                style={{ background: T.ink, color: T.muted, border: `1px solid ${T.hairline}` }}
              >
                [Author(s)]. EVSource Predictor: Multi-Class Classification of Food-Derived EV Proteins.
                <span style={{ color: T.primary }}> [Journal / Conference]</span>, [Year].
                doi: [your-doi-here]
              </div>
              <p className="text-xs mt-3" style={{ color: T.muted }}>
                Contact:{" "}
                <a href="mailto:bagler+multiev@iiitd.ac.in" style={{ color: T.primary }} className="hover:underline">
                  bagler+multiev@iiitd.ac.in
                </a>
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default About;