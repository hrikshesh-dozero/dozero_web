"use client";

// Background & UI
import BlueprintBackground from "@/components/ui/BlueprintBackground";
import FloatingAssets from "@/components/ui/FloatingAssets";

// Nav
import NavBar from "@/components/nav/NavBar";
import Footer from "@/components/nav/Footer";

// Landing sections
import EyebrowBar from "@/components/landing/EyebrowBar";
import WaitlistInput from "@/components/landing/WaitlistInput";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ArchitectureSection from "@/components/landing/ArchitectureSection";

export default function LandingPage() {
  return (
    <div className="blueprint-scope flex min-h-screen w-full flex-col overflow-x-hidden relative scroll-smooth">
      {/* ── Stacked background layers ── */}
      <BlueprintBackground />

      {/* ── Large Background Watermark ── */}
      <div
        className="absolute inset-0 mb-140 flex items-center justify-center pointer-events-none z-10 overflow-hidden"
        aria-hidden
      >
        <span
          className="bp-display whitespace-nowrap text-center opacity-[0.03] text-[var(--bp-accent-bright)] select-none"
          style={{ fontSize: "clamp(8rem, 20vw, 25rem)", lineHeight: 0.8 }}
        >
          SOMETHING<br />AMAZING<br />IS COMING
        </span>
      </div>

      {/* ── Top navigation ── */}
      <NavBar />

      {/* ── Hero / Waitlist Section ── */}
      <main className="blueprint-layer flex-1 flex flex-col items-center justify-center px-6 py-20 relative z-20 min-h-[85vh]">
        {/* Floating Blueprint SVGs (Compass, TSquare, etc.) */}
        <FloatingAssets />

        <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center gap-6 relative z-10">

          {/* Eyebrow divider */}
          <div className="bp-enter bp-enter-1 w-full max-w-md">
            <EyebrowBar label="STATUS · IN DEVELOPMENT" />
          </div>

          {/* Hero heading */}
          <div className="bp-enter bp-enter-2 mt-4">
            <h1
              className="bp-display mb-6"
              style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", color: "var(--bp-accent-bright)", lineHeight: 1 }}
            >
              JOIN THE ERA<br />OF ZERO
            </h1>
            <p
              className="text-[16px] md:text-[19px] leading-relaxed max-w-xl mx-auto"
              style={{ color: "var(--bp-ink)", opacity: 0.85, fontFamily: "Inter, sans-serif" }}
            >
              The architecture of what's possible is being drafted. Be the first to transition to autonomous execution.
            </p>
          </div>

          {/* Waitlist form card */}
          <div className="bp-enter bp-enter-3 w-full mt-8 flex justify-center">
            <WaitlistInput />
          </div>

        </div>
      </main>

      {/* ── Divider ── */}
      <div className="w-full max-w-7xl mx-auto px-6 z-20 my-12">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(47,111,184,0.3)] to-transparent" />
      </div>

      {/* ── Features Section ── */}
      <div className="px-6 relative z-20 pb-12">
        <FeaturesSection />
      </div>

      {/* ── Divider ── */}
      <div className="w-full max-w-7xl mx-auto px-6 z-20 mb-12">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(47,111,184,0.3)] to-transparent" />
      </div>

      {/* ── Architecture/Specs Section ── */}
      <div className="px-6 relative z-20 pb-20">
         <ArchitectureSection />
      </div>

      {/* ── Bottom status bar ── */}
      <Footer />
    </div>
  );
}
