'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const DM_AGENTS = [
  { name: 'CEO', role: '' },
  { name: 'Raj', role: 'Funding Intelligence Researcher' },
  { name: 'Maya', role: 'Prospect Research Specialist' },
  { name: 'Jordan', role: 'Cold Email Copywriter' },
  { name: 'Alex', role: 'Founder & Approval Lead' },
  { name: 'Sam', role: 'Outreach Sequence Manager' },
  { name: 'Taylor', role: 'Lead Pipeline Analyst' },
];

const TEAM = [
  ['Raj', 'Funding Intelligence Researcher'],
  ['Maya', 'Prospect Research Specialist'],
  ['Jordan', 'Cold Email Copywriter'],
  ['Alex', 'Founder & Approval Lead'],
  ['Sam', 'Outreach Sequence Manager'],
  ['Casey', 'Client Success Manager'],
  ['Ben', 'Web Developer'],
  ['Sofia', 'Brand & Case Study Designer'],
  ['Liam', 'Demo Video Producer'],
];

const STEPS = [
  ['Market research', 'Validate the opportunity and define your ideal customer'],
  ['Brand identity', 'Company name, logo concepts, and brand guidelines'],
  ['Product/service workflow', 'The first deliverable, inputs, and delivery process'],
  ['Account connections', 'Required connectors, inboxes, channels, and setup'],
  ['Website & landing page', 'A public-facing site that converts visitors to leads'],
];

function SidebarSection({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="px-3 py-2.5">
      <div className="text-[9px] font-medium tracking-[0.15em] uppercase text-white/30 mb-1.5">{label}</div>
      {children}
    </div>
  );
}

/* A small glass pill that floats forward in 3D space */
function FloatingChip({
  className,
  z,
  delay,
  children,
}: { className: string; z: number; delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      style={{ z }}
      animate={{ y: [0, -9, 0] }}
      transition={{ duration: 5, delay, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute z-30 flex items-center gap-2 rounded-xl px-3.5 py-2.5
        border border-white/15 bg-[rgba(20,26,48,0.55)] backdrop-blur-xl
        shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.18)]
        text-[11px] font-medium text-white/85 whitespace-nowrap ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function AppShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  // Window starts tilted/peeking at the bottom of the hero, straightens as you scroll in.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });
  // NOTE: no opacity animation — opacity < 1 on a preserve-3d node flattens its 3D layers.
  // Settles at a slight backward tilt (not flat) so it always reads as a 3D object.
  const rotateX = useTransform(scrollYProgress, [0.05, 0.75], [24, 9]);
  const rotateY = useTransform(scrollYProgress, [0.05, 0.75], [-12, 0]);
  const scale = useTransform(scrollYProgress, [0.05, 0.75], [0.84, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full -mt-[26vh] pb-36 overflow-hidden"
    >
      {/* darken the lower portion (below the hero overlap) without covering the peek.
          Ends on #060a1a — the exact colour the next section (BentoGrid) starts with,
          so the two sections meet seamlessly instead of a hard black→blue edge. */}
      <div className="absolute inset-x-0 bottom-0 h-[82%] bg-gradient-to-b from-transparent via-[#070b1c] to-[#060a1a] pointer-events-none" />
      {/* ambient glow — kept dim so it reads as a faint halo around the panel, not a blue wash through it */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[560px] bg-[radial-gradient(ellipse_at_center,rgba(70,100,210,0.12)_0%,rgba(110,90,220,0.06)_40%,transparent_72%)] blur-[40px] pointer-events-none" />

      {/* 3D stage */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-6" style={{ perspective: '1800px' }}>
        <motion.div
          style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d', transformOrigin: 'center 65%' }}
          className="relative will-change-transform"
        >
          {/* receding glow plane — faint, so the glass frosts darkness (not a blue wash) */}
          <div
            style={{ transform: 'translateZ(-90px)' }}
            className="absolute -inset-8 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,rgba(70,100,210,0.12),transparent_72%)] blur-3xl"
          />

          {/* floor reflection / contact shadow */}
          <div
            style={{ transform: 'translateZ(-40px)' }}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-24 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.65),transparent_70%)] blur-2xl"
          />

          {/* The glass app window — translucent but very dark (near-black) glassmorphism */}
          <div className="relative rounded-2xl overflow-hidden
            border border-[rgba(255,255,255,0.09)]
            bg-gradient-to-b from-[rgba(6,7,11,0.62)] via-[rgba(4,5,9,0.58)] to-[rgba(3,3,6,0.62)]
            backdrop-saturate-150
            shadow-[0_50px_140px_-25px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.1)]">
            {/* top sheen */}
            <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none z-20" />

            {/* App top bar */}
            <div className="flex items-center justify-between px-5 h-12 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-6">
                <span className="text-[13px] font-semibold tracking-tight text-white/90">DoZero</span>
                <div className="hidden sm:flex items-center gap-1 text-[11px]">
                  {['HOME', 'AGENTS', 'COMPANY'].map((t, i) => (
                    <span key={t} className={`px-3 py-1.5 rounded-md tracking-[0.08em] ${i === 2 ? 'bg-white/[0.06] text-white/90' : 'text-white/40'}`}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/10 text-white/60">
                  <span className="w-4 h-4 rounded bg-white/10 grid place-items-center text-[8px] font-bold">CO</span>Coder
                </span>
                <span className="tracking-[0.08em] text-white/35">SIGN OUT</span>
              </div>
            </div>

            {/* Body: sidebar + chat */}
            <div className="flex h-[540px] sm:h-[620px] text-white">
              <aside className="hidden md:flex w-[244px] shrink-0 flex-col border-r border-white/[0.06] bg-white/[0.012] overflow-hidden">
                <div className="px-3 pt-3.5 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-white/35">← Company</span>
                    <span className="text-[10px] px-2 py-1 rounded-md bg-white/[0.06] text-white/70">+ New</span>
                  </div>
                  <div className="text-[15px] font-semibold text-white/90 tracking-tight">FundedLeads</div>
                </div>

                <SidebarSection label="Channels">
                  <div className="px-2 py-2 rounded-lg bg-white/[0.05] border border-white/[0.06]">
                    <div className="text-[12px] text-white/85"># Welcome to FundedLeads</div>
                    <div className="text-[10px] text-white/30 mt-0.5">2 msgs</div>
                  </div>
                </SidebarSection>

                <div className="px-3 py-1.5 flex items-center justify-between text-[9px] tracking-[0.15em] uppercase text-white/30">
                  <span>Tasks</span><span>+ new</span>
                </div>
                <SidebarSection label="Deliverables"><div className="text-[11px] text-white/45">0 saved →</div></SidebarSection>
                <SidebarSection label="Knowledge"><div className="text-[11px] text-white/45">Memories & assets →</div></SidebarSection>
                <SidebarSection label="Connections"><div className="text-[11px] text-white/45">Connect accounts →</div></SidebarSection>

                <div className="px-3 py-2 flex-1 overflow-hidden">
                  <div className="text-[9px] font-medium tracking-[0.15em] uppercase text-white/30 mb-2">Direct Messages</div>
                  <div className="flex flex-col gap-2.5">
                    {DM_AGENTS.map((a) => (
                      <div key={a.name} className="flex items-start gap-2">
                        <span className="mt-0.5 w-3.5 h-3.5 rounded-full bg-white/10 shrink-0" />
                        <div className="leading-tight">
                          <div className="text-[11.5px] text-white/75">{a.name}</div>
                          {a.role && <div className="text-[9.5px] text-white/30">{a.role}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="relative flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden px-6 sm:px-9 py-7 font-mono">
                  <div className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 grid place-items-center text-[10px] font-semibold text-white/70">AI</span>
                    <div className="min-w-0 text-[13px] leading-relaxed text-white/80">
                      <div className="text-[18px] font-bold text-white mb-3">Welcome to FundedLeads</div>
                      <p className="text-white/65 mb-4">We find your next SaaS clients before your competitors even know they raised.</p>
                      <p className="text-white/70 mb-2">I&apos;ve assembled your founding team. Here&apos;s who&apos;s on board:</p>
                      <ul className="mb-4 space-y-1">
                        {TEAM.map(([name, role]) => (
                          <li key={name} className="text-white/65">
                            <span className="text-white/30 mr-2">•</span>
                            <span className="text-white font-semibold">{name}</span> <span className="text-white/45">({role})</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-white/70 mb-2">Here&apos;s how I suggest we start:</p>
                      <ol className="space-y-1.5">
                        {STEPS.map(([title, desc], i) => (
                          <li key={title} className="text-white/65">
                            <span className="text-white/35 mr-2">{i + 1}.</span>
                            <span className="text-white font-semibold">{title}</span>
                            <span className="text-white/45"> — {desc}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>

                {/* content fade — kept above the input bar (z-0) so it never covers it */}
                <div className="absolute bottom-[88px] left-0 right-0 h-16 z-0 bg-gradient-to-t from-[rgba(10,12,20,0.95)] to-transparent pointer-events-none" />

                <div className="relative z-10 px-5 sm:px-8 pb-5">
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[rgba(10,12,20,0.85)] px-4 py-3">
                    <span className="flex-1 text-[12px] text-white/30 font-mono">Send a message... (Enter to send, @ to mention)</span>
                    <span className="text-[11px] px-3.5 py-1.5 rounded-lg bg-white/[0.08] text-white/70 border border-white/10">Send</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating glass chips — pop forward in 3D */}
          <FloatingChip className="top-16 -left-3 sm:-left-8 bg-transparent" z={90} delay={0}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
            9 agents online
          </FloatingChip>
          <FloatingChip className="top-1/3 -right-2 sm:-right-7 bg-transparent" z={120} delay={1.2}>
            <span className="text-[#7ba4ff]">✓</span> Blueprint drafted
          </FloatingChip>
          <FloatingChip className="-bottom-5 left-1/4 bg-transparent" z={70} delay={2.1}>
            <span className="w-2 h-2 rounded-full bg-[#7ba4ff] animate-pulse" />
            Ben is Building…
          </FloatingChip>
        </motion.div>
      </div>
    </section>
  );
}
