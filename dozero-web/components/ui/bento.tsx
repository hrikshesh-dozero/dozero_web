'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import Nexbot from './Nexbot';

interface BentoItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  span: 'normal' | 'wide' | 'tall' | 'large';
}

const bentoItems: BentoItem[] = [
  {
    id: 'agents',
    title: 'AI Agent Teams',
    description: 'Autonomous agents that collaborate, delegate, and deliver — just like a real team.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M20 21a8 8 0 10-16 0"/>
        <circle cx="20" cy="6" r="2.5"/>
        <circle cx="4" cy="6" r="2.5"/>
      </svg>
    ),
    span: 'tall',
  },
  {
    id: 'blueprint',
    title: 'Smart Blueprints',
    description: 'Describe your idea and get a complete company blueprint in seconds.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    span: 'large',
  },
  {
    id: 'deploy',
    title: 'Instant Deploy',
    description: 'From concept to running operations — no infrastructure setup needed.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    span: 'wide',
  },
  {
    id: 'scale',
    title: 'Scale Without Limits',
    description: 'Add more agents, expand departments, and grow your AI workforce on demand.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0022 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    span: 'normal',
  },
  {
    id: 'monitor',
    title: 'Real-time Monitoring',
    description: 'Watch your AI team work in real-time with live dashboards and analytics.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    span: 'wide',
  },
  {
    id: 'integrate',
    title: 'Seamless Integrations',
    description: 'Connect with your existing tools and workflows without any friction.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
    span: 'normal',
  },
];

/* ---------------------------------------------------------------------------
   "Studio Planner" board — a faithful recreation of a Huly-style task planner,
   adapted to DoZero's Studios. Three columns in subtle perspective: a recessed
   "Yesterday" (done), a bright prominent "Today" (live, white cards), and a
   dimmed "Create New Task" composer. Each card surfaces real Studio work.
--------------------------------------------------------------------------- */

// Per-Studio accent (used for the little colored tag chip on each card).
const STUDIO_TINT: Record<string, { light: string; dark: string }> = {
  Dev: { light: 'bg-sky-100 text-sky-700', dark: 'bg-sky-400/15 text-sky-300' },
  Research: { light: 'bg-violet-100 text-violet-700', dark: 'bg-violet-400/15 text-violet-300' },
  Design: { light: 'bg-rose-100 text-rose-600', dark: 'bg-rose-400/15 text-rose-300' },
  Data: { light: 'bg-amber-100 text-amber-700', dark: 'bg-amber-400/15 text-amber-300' },
  Browser: { light: 'bg-emerald-100 text-emerald-700', dark: 'bg-emerald-400/15 text-emerald-300' },
  Video: { light: 'bg-orange-100 text-orange-700', dark: 'bg-orange-400/15 text-orange-300' },
};

/* --- tiny inline icons (clock / comment / paperclip / plus / check / tag) --- */
const IClock = ({ c = 'currentColor' }: { c?: string }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const IComment = ({ c = 'currentColor' }: { c?: string }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill={c} stroke="none"><path d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" /></svg>
);
const IClip = ({ c = 'currentColor' }: { c?: string }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11l-8.5 8.5a4 4 0 0 1-5.66-5.66L14 6.7a2.5 2.5 0 0 1 3.54 3.54l-7.1 7.07" /></svg>
);

// An overlapping cluster of gradient avatar circles.
function Avatars({ seeds, ring }: { seeds: string[]; ring: string }) {
  const grads = [
    'from-[#6366f1] to-[#8b5cf6]',
    'from-[#0ea5e9] to-[#22d3ee]',
    'from-[#f43f5e] to-[#fb923c]',
    'from-[#10b981] to-[#34d399]',
  ];
  return (
    <div className="flex -space-x-1.5">
      {seeds.map((s, i) => (
        <span
          key={s + i}
          className={`w-4 h-4 rounded-full bg-gradient-to-br ${grads[i % grads.length]} grid place-items-center text-[7px] font-bold text-white ring-2 ${ring}`}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

// A bright "Today" card — solid white, premium shadow (the hero of the board).
function LightCard({ studio, title, date, comments, clips, seeds }: {
  studio: keyof typeof STUDIO_TINT; title: string; date: string; comments: number; clips: number; seeds: string[];
}) {
  return (
    <div className="rounded-2xl bg-white shadow-[0_14px_40px_-10px_rgba(0,0,0,0.6)] ring-1 ring-black/[0.04] px-4 py-3.5">
      <div className="flex items-start justify-between">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${STUDIO_TINT[studio].light}`}>{studio} Studio</span>
        <span className="text-slate-300 leading-none text-[15px] -mt-0.5">···</span>
      </div>
      <p className="mt-2 text-[13px] font-medium leading-[1.3] text-slate-800">{title}</p>
      <div className="mt-3 flex items-center gap-3 text-slate-400">
        <span className="flex items-center gap-1 text-[10.5px]"><IClock c="#94a3b8" />{date}</span>
        <span className="flex items-center gap-1 text-[10.5px]"><IComment c="#cbd5e1" />{comments}</span>
        <span className="flex items-center gap-1 text-[10.5px]"><IClip c="#94a3b8" />{clips}</span>
        <span className="ml-auto"><Avatars seeds={seeds} ring="ring-white" /></span>
      </div>
    </div>
  );
}

// A recessed dark card for the side columns.
function DarkCard({ studio, title, seeds, done }: {
  studio: keyof typeof STUDIO_TINT; title: string; seeds: string[]; done?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.035] border border-white/[0.07] px-4 py-3.5">
      <div className="flex items-start justify-between">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${STUDIO_TINT[studio].dark}`}>{studio} Studio</span>
        {done && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
      </div>
      <p className="mt-2 text-[13px] font-medium leading-[1.3] text-white/55">{title}</p>
      <div className="mt-3 flex items-center text-white/30">
        <span className="flex items-center gap-1 text-[10.5px]"><IComment c="rgba(255,255,255,0.3)" />2</span>
        <span className="ml-auto"><Avatars seeds={seeds} ring="ring-[#0a0c12]" /></span>
      </div>
    </div>
  );
}

function ColHeader({ label, light, action }: { label: string; light?: boolean; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <span className={`text-[14px] font-semibold tracking-tight ${light ? 'text-slate-700' : 'text-white/45'}`}>{label}</span>
      {action}
    </div>
  );
}

function PlanBoard() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: '1400px' }}>
      {/* top-center blue/indigo glow, exactly like the reference */}
      <div className="absolute left-1/2 -top-16 -translate-x-1/2 w-[55%] h-[70%] rounded-full blur-[55px] opacity-70"
        style={{ background: 'radial-gradient(ellipse at center, rgba(120,150,255,0.45) 0%, rgba(90,110,230,0.18) 45%, transparent 72%)' }} />
      {/* faint dotted texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

      <div className="relative h-full" style={{ transformStyle: 'preserve-3d' }}>
        {/* LEFT — Yesterday (recessed, behind center) */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 left-4 w-[37%] z-0 opacity-55 origin-left"
          style={{ transform: 'rotateY(18deg)', maskImage: 'linear-gradient(to right, transparent, #000 32%)' }}
        >
          <ColHeader label="Yesterday" action={<span className="w-4 h-4 rounded-full border border-white/20 grid place-items-center"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>} />
          <div className="space-y-3">
            <DarkCard studio="Dev" title="Provisioned Neon Postgres & live preview server" seeds={['B', 'S']} done />
            <DarkCard studio="Data" title="Defined KPI dictionary & dashboard schema" seeds={['D']} done />
            <DarkCard studio="Video" title="Storyboarded launch teaser in Remotion" seeds={['V']} done />
          </div>
        </motion.div>

        {/* RIGHT — Create New Task (recessed, behind center) */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6, delay: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 right-4 w-[37%] z-0 opacity-55 origin-right"
          style={{ transform: 'rotateY(-18deg)', maskImage: 'linear-gradient(to left, transparent, #000 32%)' }}
        >
          <ColHeader label="Create New Task" action={null} />
          <div className="rounded-2xl bg-white/[0.035] border border-white/[0.07] p-4">
            <p className="text-[13px] text-white/30">What is the task?</p>
            <div className="mt-10 flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1-.6-1.4V4a1 1 0 0 1 1-1h7.9a2 2 0 0 1 1.4.6l7.5 7.5a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.2" fill="rgba(255,255,255,0.35)" /></svg>
              <span className="px-2 py-0.5 rounded-md bg-sky-400/15 text-sky-300 font-semibold text-[10px]">Browser Studio</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>
              <Avatars seeds={['R']} ring="ring-[#0a0c12]" />
            </div>
          </div>
        </motion.div>

        {/* CENTER — Today (bright, prominent, in front) */}
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-6 left-1/2 -translate-x-1/2 w-[40%] z-10"
        >
          <ColHeader
            label="Today"
            light
            action={<span className="w-5 h-5 rounded-full bg-white/90 shadow grid place-items-center text-slate-400"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></span>}
          />
          <div className="space-y-3">
            <LightCard studio="Dev" title="Scaffold full-stack app in secure E2B sandbox" date="Now" comments={3} clips={2} seeds={['B']} />
            <LightCard studio="Research" title="Audit competitor pricing & market positioning" date="Today" comments={4} clips={3} seeds={['R', 'C']} />
            <LightCard studio="Design" title="Generate brand identity & color system" date="Apr 9" comments={2} clips={1} seeds={['S']} />
          </div>
        </motion.div>
      </div>

      {/* bottom fade so tall columns clip cleanly, like the reference */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/85 to-transparent" />

      {/* caption, bottom-left */}
      <div className="absolute left-6 bottom-5 z-20 max-w-[60%]">
        <span className="text-[14px] text-white font-semibold">Studio Planner. </span>
        <span className="text-[14px] text-white/45 font-light">Keep track of the bigger picture — every agent&apos;s task across all six Studios in one live board.</span>
      </div>
    </div>
  );
}

function BentoCard({ item, index }: { item: BentoItem; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const spanClasses: Record<string, string> = {
    normal: 'col-span-1 row-span-1',
    wide: 'col-span-1 md:col-span-2 row-span-1',
    tall: 'col-span-1 row-span-1 md:row-span-2',
    large: 'col-span-1 md:col-span-2 row-span-1 md:row-span-2',
  };

  // The left vertical (tall) block holds the Nexbot 3D scene; the rest stay empty for now.
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden ${spanClasses[item.span]} rounded-2xl bg-black border border-white/[0.06]`}
    >
      {item.id === 'agents' && (
        <div className="absolute inset-0 scale-[1.4] translate-y-[20%]">
          <Nexbot />
        </div>
      )}
      {item.id === 'blueprint' && <PlanBoard />}
    </motion.div>
  );
}

export default function BentoGrid() {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="features" className="relative py-28 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060a1a] via-[#080e24] to-[#060a1a]" />

      {/* Subtle ambient dots */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(140,170,255,1) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative z-10 w-[90%] max-w-[1140px] mx-auto">
        {/* Section header — left-aligned, big white heading + muted description */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-left mb-14"
        >
          <h2 className="text-[clamp(2.5rem,5.5vw,5rem)] font-bold text-white tracking-[-0.03em] leading-[1.04]">
            clarity meets creativity
          </h2>
          <p className="mt-6 text-[clamp(1rem,1.6vw,1.2rem)] text-white/40 leading-relaxed max-w-[680px] font-light">
            DoZero turns a single line of intent into a self-assembling AI company — a Coordinator
            interviews you, hires specialist agents, provisions secure sandboxes, and executes every
            task end-to-end, from zero to done, automatically.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[224px]">
          {bentoItems.map((item, i) => (
            <BentoCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}