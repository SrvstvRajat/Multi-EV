import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/predict", label: "Predict" },
  { to: "/how-to-use", label: "How to Use" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
];

const renderNavLabel = (label: string) =>
  label === "FAQs" ? (
    <>
      FAQ<span className="normal-case">s</span>
    </>
  ) : (
    label
  );

const T = {
  ink: "#F4F8F5",
  text: "#16211C",
  muted: "#5F6E66",
  primary: "#1F9E88",
  hairline: "rgba(15,23,42,0.08)",
  hairlineStrong: "rgba(15,23,42,0.14)",
};

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(244,248,245,0.94)" : "rgba(244,248,245,0.85)",
        borderBottom: `1px solid ${T.hairline}`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: scrolled ? "0 4px 20px rgba(22,33,28,0.06)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 h-[64px] flex items-center justify-between gap-8">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div
            className="font-mono w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold tracking-tight"
            style={{ background: T.primary }}
          >
            FEP
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-[15px] font-semibold" style={{ color: T.text }}>FoodEVPred</span>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className="font-mono relative text-[12px] uppercase tracking-[0.1em] font-medium transition-colors duration-200 pb-1"
              style={({ isActive }) => ({ color: isActive ? T.text : T.muted })}
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  {renderNavLabel(label)}
                  {isActive && (
                    <span
                      className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full"
                      style={{ background: T.primary }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
          <a
            href="https://cosylab.iiitd.edu.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[12px] uppercase tracking-[0.1em] font-medium transition-colors"
            style={{ color: T.muted }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = T.text)}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = T.muted)}
          >
            CoSyLab ↗
          </a>
        </nav>

        {/* CTA */}
        <NavLink
          to="/predict"
          className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          style={{ background: T.primary }}
        >
          Run Prediction →
        </NavLink>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: T.text }}
          onClick={() => setOpen(!open)}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = T.hairline)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="lg:hidden"
          style={{ background: T.ink, borderTop: `1px solid ${T.hairline}` }}
        >
          <nav className="max-w-6xl mx-auto px-5 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setOpen(false)}
                className="font-mono px-3 py-2.5 rounded-lg text-[13px] uppercase tracking-[0.1em] font-medium transition-colors"
                style={({ isActive }) => ({
                  color: isActive ? T.text : T.muted,
                  background: isActive ? T.hairlineStrong : "transparent",
                })}
              >
                {renderNavLabel(label)}
              </NavLink>
            ))}
            <a
              href="https://cosylab.iiitd.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono px-3 py-2.5 rounded-lg text-[13px] uppercase tracking-[0.1em] font-medium transition-colors"
              style={{ color: T.muted }}
              onClick={() => setOpen(false)}
            >
              CoSyLab ↗
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;