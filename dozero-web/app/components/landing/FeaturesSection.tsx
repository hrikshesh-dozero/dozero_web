import GlassCard from "@/components/ui/GlassCard";
import EyebrowBar from "@/components/landing/EyebrowBar";

export default function FeaturesSection() {
  const features = [
    {
      id: "01",
      title: "AUTONOMOUS EXECUTION",
      desc: "Stop building workflows. Define the intent, and let the system architect and execute the operations from end to end without manual intervention.",
    },
    {
      id: "02",
      title: "DYNAMIC AGENT HIRING",
      desc: "The system automatically provisions, prompts, and connects specialized AI agents based on the exact requirements of your brief.",
    },
    {
      id: "03",
      title: "NATIVE COMPOSIO INTEGRATION",
      desc: "Instant access to 100+ tools. If your agent needs to read emails, post to Slack, or query a database, the connection is handled natively.",
    },
    {
      id: "04",
      title: "SECURE & INVISIBLE",
      desc: "Enterprise-grade encryption and self-healing infrastructure. Workflows run seamlessly in the background, adapting to errors dynamically.",
    },
  ];

  return (
    <section id="features" className="w-full max-w-5xl mx-auto py-24 relative z-20">
      <div className="mb-12">
        <EyebrowBar label="SYSTEM CAPABILITIES" className="max-w-md mx-auto" />
        <h2 
          className="bp-display text-center mt-6 text-[var(--bp-accent-bright)]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
        >
          THE ARCHITECTURE OF AUTONOMY
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f) => (
          <GlassCard key={f.id} className="p-8 flex flex-col items-start gap-4">
            <span className="bp-display text-5xl text-[var(--bp-line)] opacity-60">
              {f.id}
            </span>
            <h3 className="bp-mono text-[14px] font-bold text-[var(--bp-accent-bright)] tracking-widest">
              {f.title}
            </h3>
            <p className="text-[15px] leading-relaxed text-[var(--bp-ink)] opacity-80" style={{ fontFamily: "Inter, sans-serif" }}>
              {f.desc}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
