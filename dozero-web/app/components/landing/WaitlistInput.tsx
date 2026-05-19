"use client";

import { useState } from "react";
import CornerMarks from "@/components/ui/CornerMarks";

export default function WaitlistInput() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const ready = email.trim().length > 5 && email.includes("@");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setStatus("submitting");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col items-center mt-6">
      <div className="relative w-full max-w-sm">
        <CornerMarks />

        <form
          onSubmit={handleSubmit}
          className="bp-frame group relative overflow-hidden flex flex-col transition-all duration-500 hover:border-[var(--bp-accent)] hover:shadow-[0_0_30px_rgba(53,165,255,0.15)]"
          style={{ borderRadius: 0, backgroundColor: "rgba(4,16,31,0.4)" }}
        >
          {status === "success" ? (
            <div className="w-full px-5 py-8 flex flex-col items-center justify-center bg-[rgba(53,165,255,0.1)] gap-2">
              <span className="bp-mono text-[13px] text-[var(--bp-accent-bright)] tracking-widest text-center">
                ✓ REQUEST LOGGED
              </span>
              <span className="text-[11px] text-[var(--bp-ink)] opacity-70 font-[Inter] text-center">
                We will notify you when a spot opens.
              </span>
            </div>
          ) : (
            <>
              {/* Animated sweep line */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <div className="bp-sweep-line" />
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="relative z-10 w-full border-0 bg-transparent px-8 py-5 text-[15px] font-bold focus:outline-none focus:ring-0 text-center placeholder-[var(--bp-ink)]/30 transition-all duration-300 group-hover:placeholder-[var(--bp-ink)]/60"
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  color: "var(--bp-ink)",
                }}
                disabled={status === "submitting"}
              />

              <button
                type="submit"
                disabled={!ready || status === "submitting"}
                className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed border-t border-[var(--bp-line)]/35 transition-all duration-300 hover:bg-[var(--bp-accent)]/15 hover:text-[var(--bp-accent-bright)] hover:tracking-widest"
                style={{ borderRadius: 0, padding: "18px", width: "100%" }}
              >
                <span className="relative z-10 text-[12px] font-black transition-all duration-300">
                  {status === "submitting" ? "PROCESSING..." : "CONTINUE"}
                </span>
                {!status && <span aria-hidden className="relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>}
              </button>
            </>
          )}
        </form>
      </div>

      {/* Footer keywords */}
      <div className="mt-8 flex items-center justify-center gap-6 bp-mono text-[10px] tracking-[0.2em] text-[var(--bp-ink)] opacity-50">
        <span>AUTONOMOUS</span>
        <span className="w-1 h-1 rounded-full bg-[var(--bp-line)] opacity-50" />
        <span>SECURE</span>
        <span className="w-1 h-1 rounded-full bg-[var(--bp-line)] opacity-50" />
        <span>INVISIBLE</span>
      </div>
    </div>
  );
}
