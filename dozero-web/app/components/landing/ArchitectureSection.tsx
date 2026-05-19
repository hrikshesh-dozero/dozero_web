import EyebrowBar from "@/components/landing/EyebrowBar";

export default function ArchitectureSection() {
  const specs = [
    {
      id: "01",
      title: "AGENT GROUPS & DELEGATION",
      desc: "A primary Coordinator AI parses your intent and dynamically delegates specialized operations to domain-expert Specialist agents.",
    },
    {
      id: "02",
      title: "BACKGROUND TASK QUEUES",
      desc: "Long-running asynchronous workflows chain operations autonomously, processing secure tasks in the background without UI blocking.",
    },
    {
      id: "03",
      title: "REAL-TIME SYNCHRONIZATION",
      desc: "Built on a reactive database architecture, delivering sub-millisecond state synchronization and live token streaming via SSE.",
    },
    {
      id: "04",
      title: "DEEP INTEGRATION LAYER",
      desc: "Specialist agents inherit secure n8n integration connections, allowing them to instantly execute operations across your internal APIs and CRMs.",
    }
  ];

  return (
    <section className="w-full max-w-4xl mx-auto py-12 relative z-20">
      <div className="mb-16">
        <EyebrowBar label="TECHNICAL SPECIFICATIONS" className="max-w-md mx-auto" />
      </div>

      <div className="flex flex-col border-t border-[var(--bp-line)]/50">
        {specs.map((spec, i) => (
          <div 
            key={i} 
            className="group flex flex-col md:flex-row items-start md:items-center py-10 border-b border-[var(--bp-line)]/30 transition-colors duration-500 hover:bg-[rgba(53,165,255,0.03)]"
          >
            {/* Number ID */}
            <div className="w-24 shrink-0 mb-4 md:mb-0">
              <span className="bp-display text-4xl text-[var(--bp-line)] opacity-50 group-hover:text-[var(--bp-accent)] transition-colors duration-500">
                {spec.id}
              </span>
            </div>

            {/* Title & Desc */}
            <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12">
              <h3 className="bp-mono w-48 shrink-0 text-[13px] font-bold text-[var(--bp-accent-bright)] tracking-widest leading-relaxed border-l-2 border-[var(--bp-line)]/50 pl-4 group-hover:border-[var(--bp-accent)] transition-colors duration-500">
                {spec.title}
              </h3>
              <p className="flex-1 text-[14px] leading-relaxed text-[var(--bp-ink)] opacity-75" style={{ fontFamily: "Inter, sans-serif" }}>
                {spec.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
