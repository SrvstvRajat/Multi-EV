/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";
import IIITD from "../Layout/IIITDLogo.jpg";

const T = {
  ink: "#12211C",
  primary: "#2DD4BF",
  text: "#F1F4F9",
};

const Footer: React.FC = () => {
  return (
    <footer
      className="mt-20 font-serif"
      style={{
        marginTop: "0rem",
        background: T.ink,
        borderTop: "1px solid rgba(45,212,191,0.15)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* TOP SECTION */}
        <div className="grid md:grid-cols-3 gap-12 mb-4 mt--8">

          {/* Column 1: Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="font-mono w-11 h-11 rounded-xl flex items-center justify-center text-[#0A140F] text-[11px] font-bold tracking-tight"
                style={{ background: T.primary }}
              >
                FEP
              </div>
              <div>
                <span className="font-serif text-xl font-semibold block leading-none" style={{ color: T.text }}>
                  FoodEVPred
                </span>
              </div>
            </div>

      

            {/* IIITD Logo */}
            <div className="flex items-center gap-4 mb-5">
              <img
                src={IIITD}
                alt="IIITD Logo"
                className="h-12 w-auto object-contain rounded-lg p-2"
                style={{
                  background: "rgba(241,244,249,0.06)",
                  border: "1px solid rgba(241,244,249,0.1)",
                }}
              />
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mb-5">

             <div className="flex items-center gap-4">
            {[
              { Icon: Github, label: "GitHub", href: "https://github.com/cosylabiiit" },
              { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/cosylab-iiitd/" },
              { Icon: Twitter, label: "Twitter", href: "https://twitter.com/gansbags" },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: "rgba(241,244,249,0.04)",
                  border: "1px solid rgba(241,244,249,0.08)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(45,212,191,0.12)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(45,212,191,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(241,244,249,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(241,244,249,0.08)";
                }}
              >
                <Icon size={16} style={{ color: "rgba(241,244,249,0.5)" }} />
              </a>
            ))}
          </div>
          {/* CoSyLab Link */}
          <div>
          <a
                  href="https://cosylab.iiitd.edu.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                  style={{ color: T.primary }}
                >
                  <span>Visit CoSyLab</span>
                  <ExternalLink size={12} />
                </a>
                </div>
                </div>
          </div>

          {/* Column 2: Contact Info */}
          <div>
            <h3
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] mb-5"
              style={{ color: "rgba(241,244,249,0.4)" }}
            >
              Contact
            </h3>

            <ul className="space-y-4">
              <li>
                <p className="font-serif text-sm font-semibold" style={{ color: T.text }}>
                  Prof. Ganesh Bagler
                </p>
                <p className="text-sm" style={{ color: "rgba(241,244,249,0.65)" }}>
                  <b>HOD, Computational Biology Department</b>
                </p>
              </li>

              {/* Email */}
              <li className="flex gap-3 items-start pt-1">
                <Mail size={14} className="flex-shrink-0 mt-0.5" style={{ color: T.primary }} />
                <a
                  href="mailto:bagler+foodevpred@iiitd.ac.in"
                  className="text-sm transition-colors"
                  style={{ color: "rgba(241,244,249,0.65)" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = T.text)}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(241,244,249,0.65)")}
                >
                  bagler+foodevpred@iiitd.ac.in
                </a>
              </li>

              {/* Phone */}
              <li className="flex gap-3 items-start">
                <Phone size={14} className="flex-shrink-0 mt-0.5" style={{ color: T.primary }} />
                <span className="text-sm" style={{ color: "rgba(241,244,249,0.65)" }}>
                  +91-11-26907-443
                </span>
              </li>

              {/* Location */}
              <li className="flex gap-3 items-start">
                <MapPin size={14} className="flex-shrink-0 mt-0.5" style={{ color: T.primary }} />
                <span className="text-sm" style={{ color: "rgba(241,244,249,0.65)" }}>
                  IIIT-Delhi, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div style={{ borderTop: "1px solid rgba(241,244,249,0.08)" }} className="mb-7" />

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-5">

          {/* Copyright */}
          <div className="text-center md:text-center">
            <p className="text-sm mb-0.5" style={{ color: "rgba(241,244,249,0.4)" }}>
              © 2026 FoodEVPred. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: "rgba(241,244,249,0.25)" }}>
              Indraprastha Institute of Information Technology Delhi
            </p>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-7 pt-7" style={{ borderTop: "1px solid rgba(241,244,249,0.06)" }}>
          <p
            className="text-xs text-center max-w-5xl mx-auto"
            style={{ color: "rgba(241,244,249,0.22)", lineHeight: "1.75" }}
          >
            <span style={{ color: "rgba(241,244,249,0.4)", fontWeight: 600 }}>Disclaimer:</span>{" "}
            All material on this website is a product of research and is provided for your
            information only and may not be construed as medical advice or instruction. No
            action or inaction should be taken based solely on the contents of this
            information; instead, readers should consult appropriate health professionals on
            any matter relating to their health and well-being.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;