import React from "react";
import { Mail, Phone, MapPin, Send, ExternalLink } from "lucide-react";

const T = {
  ink: "#F4F8F5",
  surface: "#FFFFFF",
  hairline: "rgba(15,23,42,0.08)",
  text: "#16211C",
  muted: "#5F6E66",
  primary: "#1F9E88",
  primaryDim: "rgba(31,158,136,0.10)",
};


const Contact: React.FC = () => {
  return (
    <div style={{ background: T.ink }} className="min-h-screen font-serif">
      <main className="max-w-6xl mx-auto px-5 py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-2.5" style={{ color: T.primary }}>
            <Send size={11} className="inline mr-1.5 -mt-0.5" />
            Get in touch
          </p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight mb-2" style={{ color: T.text }}>
            Contact us
          </h1>
          <p style={{ color: T.muted }}>Reach out with questions, collaborations, or feedback.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Info Card */}
          <div className="rounded-2xl p-8" style={{ background: "#12211C", color: "rgba(241,244,249,0.7)" }}>
            <h2 className="font-serif text-lg font-semibold mb-8" style={{ color: "#F1F4F9" }}>
              Contact information
            </h2>

            <div className="space-y-7">
              <div className="flex gap-4 items-start">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(45,212,191,0.16)" }}
                >
                  <Mail size={16} style={{ color: "#2DD4BF" }} />
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-1" style={{ color: "rgba(241,244,249,0.4)" }}>
                    Email
                  </p>
                  <a
                    href="mailto:bagler+foodevpred@iiitd.ac.in"
                    className="text-sm transition-colors"
                    style={{ color: "rgba(241,244,249,0.75)" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#F1F4F9")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(241,244,249,0.75)")}
                  >
                    bagler+foodevpred@iiitd.ac.in
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(45,212,191,0.16)" }}
                >
                  <Phone size={16} style={{ color: "#2DD4BF" }} />
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-1" style={{ color: "rgba(241,244,249,0.4)" }}>
                    Phone
                  </p>
                  <p className="text-sm" style={{ color: "rgba(241,244,249,0.75)" }}>+91-11-26907-443</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(45,212,191,0.16)" }}
                >
                  <MapPin size={16} style={{ color: "#2DD4BF" }} />
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-1" style={{ color: "rgba(241,244,249,0.4)" }}>
                    Address
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(241,244,249,0.75)" }}>
                    Indraprastha Institute of Information Technology Delhi<br />
                    Okhla Phase III, New Delhi 110020
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8" style={{ borderTop: "1px solid rgba(241,244,249,0.08)" }}>
              <p className="font-serif text-sm font-semibold" style={{ color: "#F1F4F9" }}>Professor Ganesh Bagler</p>
              <p className="text-xs mt-0.5 mb-3" style={{ color: "rgba(241,244,249,0.4)" }}>
                  <b>HOD, Computational Biology Department</b>
              </p>
              <a
                href="https://cosylab.iiitd.edu.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                style={{ color: "#2DD4BF" }}
              >
                Visit CoSyLab <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Map */}
          <div
            className="rounded-2xl overflow-hidden p-2"
            style={{ background: T.surface, border: `1px solid ${T.hairline}` }}
          >
            <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden">
              <iframe
                title="IIIT-Delhi Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.859649960997!2d77.2716197!3d28.543938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3e45d85d3e3%3A0x691393414902968e!2sIIIT-Delhi%20R%26D%20Building!5e0!3m2!1sen!2sin!4v1775631823892!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Contact;