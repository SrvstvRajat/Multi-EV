import { Search, ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

const T = {
  ink: "#F4F8F5",
  surface: "#FFFFFF",
  hairline: "rgba(15,23,42,0.08)",
  text: "#16211C",
  muted: "#5F6E66",
  primary: "#1F9E88",
  primaryDim: "rgba(31,158,136,0.10)",
};


type FAQItem = { q: string; a: React.ReactNode };

const faqs: FAQItem[] = [
  {
    q: "What services does FoodEVPred provide?",
    a: (
      <div className="text-sm leading-relaxed space-y-2" style={{ color: T.muted }}>
        <p>FoodEVPred offers sequence-based classification of food-derived extracellular vesicle (EV) cargo proteins:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Real-time single protein sequence prediction with confidence scores.</li>
          <li>Batch-mode prediction for multiple sequences via file upload (up to 50 per batch).</li>
          <li>Classification into three biologically distinct categories: Milk EV, Plant EV, and Non-EV.</li>
          <li>A public web server for both real-time and batch-mode analysis.</li>
        </ul>
      </div>
    ),
  },
  {
    q: "What features are used to represent protein sequences?",
    a: (
      <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
        Each sequence is passed through ProtT5, a pre-trained protein language model, to extract biophysical embeddings that encode protein function, stability, and structural context. These embeddings are the sole input to the classifier, no handcrafted physicochemical features are used.
      </p>
    ),
  },
  {
    q: "What is the predictive performance of the model?",
    a: (
      <div className="text-sm leading-relaxed space-y-2" style={{ color: T.muted }}>
        <p>
          The two-tier stacked ensemble (SVM, Logistic Regression, and MLP base learners with an XGBoost meta-learner) achieves an overall accuracy of 88.95% ± 1.26%, specificity of 94.24% ± 0.67%, and AUC of 97.32% ± 0.37%.
        </p>
        <p>One-vs-rest performance per class:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>EV vs. Non-EV:</strong> 89.80% ± 0.93% accuracy, 96.64% ± 0.57% AUC.</li>
          <li><strong>Milk EV vs. Non-EV:</strong> 87.52% ± 1.21% accuracy, 94.39% ± 0.76% AUC.</li>
          <li><strong>Plant EV vs. Non-EV:</strong> 97.62% ± 0.39% accuracy, 99.74% ± 0.07% AUC.</li>
        </ul>
      </div>
    ),
  },
  {
    q: "Which food sources can be predicted?",
    a: (
      <div className="text-sm leading-relaxed space-y-2" style={{ color: T.muted }}>
        <p>The classifier distinguishes three biologically distinct categories, trained on 6,353 non-redundant protein sequences curated from an initial set of 11,788:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Milk EV:</strong> Cargo proteins from animal milk-derived extracellular vesicles.</li>
          <li><strong>Plant EV:</strong> Cargo proteins from plant-derived extracellular vesicles.</li>
          <li><strong>Non-EV:</strong> Food proteins with no EV cargo signature.</li>
        </ul>
      </div>
    ),
  },
  {
    q: "Which operating systems are supported?",
    a: (
      <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
        The web server has been tested and runs successfully on Linux, macOS, and Windows. Any modern browser is supported.
      </p>
    ),
  },
  {
    q: "Is the web server mobile-friendly?",
    a: (
      <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
        Yes, the interface is fully responsive and works on mobile browsers. For the best experience with batch file uploads and result tables, a mid-to-large screen is recommended.
      </p>
    ),
  },
  {
    q: "What is the tech stack used to build this platform?",
    a: (
      <div className="text-sm space-y-3" style={{ color: T.muted }}>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-1" style={{ color: T.primary }}>Frontend</p>
          <p>TypeScript, React, Tailwind CSS</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-1" style={{ color: T.primary }}>Backend</p>
          <p>Python, Flask, MongoDB, Scikit-learn, XGBoost, Pandas, NumPy, ProtT5, SHAP</p>
        </div>
      </div>
    ),
  },
  {
    q: "How can I contribute or report issues?",
    a: (
      <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
        We welcome contributions, bug reports, and suggestions. Please contact us at{" "}
        <a href="mailto:bagler+foodevpred@iiitd.ac.in" className="font-medium hover:underline" style={{ color: T.primary }}>
          bagler+foodevpred@iiitd.ac.in
        </a>.
      </p>
    ),
  },
  {
    q: "How do I cite FoodEVPred?",
    a: (
      <div className="font-mono text-sm rounded-lg p-4" style={{ background: T.ink, border: `1px solid ${T.hairline}` }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: T.primary }}>Citation</p>
        <p className="italic leading-relaxed" style={{ color: T.muted }}>
          [Author(s)]. FoodEVPred: A Sequence-Based Ensemble Learning Framework for Multi-Class Prediction of Food-Derived Extracellular Vesicle Cargo Proteins for Oral Therapeutic Delivery. [Journal], [2026].
        </p>
      </div>
    ),
  },
];

const FAQs: React.FC = () => {
  const [openIndex,  setOpenIndex]  = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = faqs.filter(item =>
    item.q.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: T.ink }} className="min-h-screen font-serif">
      <main className="max-w-3xl mx-auto px-5 py-14">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-semibold tracking-tight mb-2" style={{ color: T.text }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: T.muted }}>Find answers to common questions about FoodEVPred.</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.muted }} />
          <input
            type="text"
            placeholder="Search FAQs…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
            style={{ background: T.surface, border: `1.5px solid ${T.hairline}`, color: T.text }}
            onFocus={e => {
              e.target.style.border = `1.5px solid ${T.primary}`;
              e.target.style.boxShadow = "0 0 0 3px rgba(31,158,136,0.12)";
            }}
            onBlur={e => {
              e.target.style.border = `1.5px solid ${T.hairline}`;
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* FAQ list */}
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.hairline}`, background: T.surface }}>
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <HelpCircle size={28} className="mx-auto mb-3" style={{ color: T.hairline }} />
              <p className="text-sm font-medium" style={{ color: T.muted }}>No results found for "{searchTerm}"</p>
            </div>
          ) : (
            filtered.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${T.hairline}` : "none" }}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors"
                    style={{ background: isOpen ? T.ink : T.surface }}
                  >
                    <span className="text-sm font-semibold pr-4 transition-colors" style={{ color: isOpen ? T.primary : T.text }}>
                      {item.q}
                    </span>
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: isOpen ? T.primary : T.ink, color: isOpen ? "white" : T.muted }}
                    >
                      <ChevronDown
                        size={14}
                        className="transition-transform duration-200"
                        style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                      />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5" style={{ borderTop: `1px solid ${T.hairline}`, paddingTop: "16px" }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </main>
    </div>
  );
};

export default FAQs;