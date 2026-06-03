'use client';

import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import Nexbot from './Nexbot';

interface BentoItem {
  id: string;
  cls: string; // explicit grid placement — mobile stacks; md+ uses the area below
}

// 5 blocks. agents = tall (3D scene), blueprint = large (planner board),
// graph = large node blueprint (now bottom-left), scale + monitor = squares (right).
//   r1-2: [ agents ][ blueprint  ]
//   r3:   [  graph  ][  graph ][ scale  ]
//   r4:   [  graph  ][  graph ][ monitor]
const bentoItems: BentoItem[] = [
  { id: 'agents', cls: 'row-span-2 md:col-start-1 md:row-start-1' },
  { id: 'blueprint', cls: 'row-span-2 md:col-span-2 md:col-start-2 md:row-start-1' },
  { id: 'graph', cls: 'row-span-2 md:col-span-2 md:col-start-1 md:row-start-3' },
  { id: 'scale', cls: 'md:col-start-3 md:row-start-3' },
  { id: 'monitor', cls: 'md:col-start-3 md:row-start-4' },
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

/* ---------------------------------------------------------------------------
   Live "create a task" animation for the CENTER (Today) column. Loops:
   press + → a fresh card is created → the title auto-types → meta fades in →
   a green "saved" flash → the finished card holds → it clears and repeats.
--------------------------------------------------------------------------- */
type ComposePhase = 'click' | 'appear' | 'type' | 'meta' | 'save' | 'hold' | 'exit';

const COMPOSE_TASKS: {
  studio: keyof typeof STUDIO_TINT; title: string; date: string; comments: number; clips: number; seeds: string[];
}[] = [
  { studio: 'Dev', title: 'Scaffold full-stack app in secure E2B sandbox', date: 'Now', comments: 3, clips: 2, seeds: ['B'] },
  { studio: 'Browser', title: 'Crawl & summarize 20 competitor pages', date: 'Now', comments: 2, clips: 1, seeds: ['R', 'C'] },
  { studio: 'Video', title: 'Render a 30s launch teaser in Remotion', date: 'Now', comments: 1, clips: 4, seeds: ['V'] },
];

// The animated "+" in the Today header — presses inward when a new task starts.
function PlusButton({ pressed }: { pressed: boolean }) {
  return (
    <span className="relative w-5 h-5 grid place-items-center">
      {pressed && (
        <motion.span
          initial={{ scale: 0.6, opacity: 0.5 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full ring-2 ring-white/50"
        />
      )}
      <motion.span
        animate={pressed ? { scale: [1, 0.8, 1] } : { scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-5 h-5 rounded-full bg-white/90 shadow grid place-items-center text-slate-400"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
      </motion.span>
    </span>
  );
}

function TodayColumn() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<ComposePhase>('click');
  const [typed, setTyped] = useState(0);

  const task = COMPOSE_TASKS[idx];
  const titleLen = task.title.length;

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    switch (phase) {
      case 'click':
        t = setTimeout(() => setPhase('appear'), 650);
        break;
      case 'appear':
        t = setTimeout(() => setPhase('type'), 420);
        break;
      case 'type':
        t = typed < titleLen
          ? setTimeout(() => setTyped((n) => n + 1), 38)
          : setTimeout(() => setPhase('meta'), 320);
        break;
      case 'meta':
        t = setTimeout(() => setPhase('save'), 520);
        break;
      case 'save':
        t = setTimeout(() => setPhase('hold'), 820);
        break;
      case 'hold':
        t = setTimeout(() => setPhase('exit'), 1900);
        break;
      case 'exit':
        t = setTimeout(() => {
          setTyped(0);
          setIdx((i) => (i + 1) % COMPOSE_TASKS.length);
          setPhase('click');
        }, 460);
        break;
    }
    return () => { if (t) clearTimeout(t); };
  }, [phase, typed, titleLen]);

  const tint = STUDIO_TINT[task.studio];
  const active = phase !== 'click';                       // card is "created" from appear onward
  const showMeta = phase === 'meta' || phase === 'save' || phase === 'hold' || phase === 'exit';
  const saved = phase === 'save' || phase === 'hold' || phase === 'exit';

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[40%] z-10">
      <ColHeader label="Today" light action={<PlusButton pressed={phase === 'click'} />} />
      <div className="space-y-3">
        {/* The live, auto-composed card */}
        <motion.div
          animate={{ scale: phase === 'exit' ? 0.96 : 1, opacity: phase === 'exit' ? 0.55 : 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`relative rounded-2xl px-4 py-3.5 ring-1 transition-colors duration-300 ${
            active
              ? 'bg-white ring-black/[0.04] shadow-[0_14px_40px_-10px_rgba(0,0,0,0.6)]'
              : 'bg-white/[0.04] ring-white/10'
          }`}
        >
          {/* green "saved" flash */}
          {phase === 'save' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 rounded-2xl ring-2 ring-emerald-400 pointer-events-none"
            />
          )}

          <div className="flex items-start justify-between">
            {active ? (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${tint.light}`}
              >
                {task.studio} Studio
              </motion.span>
            ) : (
              <span className="text-[11px] text-white/35">What is the task?</span>
            )}
            {saved ? (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
            ) : active ? (
              <span className="text-slate-300 leading-none text-[15px] -mt-0.5">···</span>
            ) : null}
          </div>

          {/* auto-typing title (fixed 2-line height so cards below never jump) */}
          <p className="mt-2 text-[13px] font-medium leading-[1.3] min-h-[2.4em] text-slate-800">
            {active && (
              <>
                {task.title.slice(0, typed)}
                {phase === 'type' && (
                  <span className="inline-block w-[2px] h-[0.95em] ml-[1px] -mb-[1px] align-middle bg-slate-700 animate-pulse" />
                )}
              </>
            )}
          </p>

          <motion.div
            animate={{ opacity: showMeta ? 1 : 0, y: showMeta ? 0 : 6 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 flex items-center gap-3 text-slate-400"
          >
            <span className="flex items-center gap-1 text-[10.5px]"><IClock c="#94a3b8" />{task.date}</span>
            <span className="flex items-center gap-1 text-[10.5px]"><IComment c="#cbd5e1" />{task.comments}</span>
            <span className="flex items-center gap-1 text-[10.5px]"><IClip c="#94a3b8" />{task.clips}</span>
            <span className="ml-auto"><Avatars seeds={task.seeds} ring="ring-white" /></span>
          </motion.div>
        </motion.div>

        {/* Existing static "saved" tasks below */}
        <LightCard studio="Research" title="Audit competitor pricing & market positioning" date="Today" comments={4} clips={3} seeds={['R', 'C']} />
        <LightCard studio="Design" title="Generate brand identity & color system" date="Apr 9" comments={2} clips={1} seeds={['S']} />
      </div>
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

        {/* CENTER — Today (bright, prominent, in front) — live create-task animation */}
        <TodayColumn />
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

/* ---------------------------------------------------------------------------
   Node-based "Company Blueprint" — a lightweight recreation of the dozero-ai-app
   XYFlow editor: agent cards wired together with animated, flowing dashed edges.
   The cards build in on mount; the dashes flow continuously along each handoff.
--------------------------------------------------------------------------- */
const BP_COLORS: Record<string, string> = {
  green: '#22c55e', blue: '#3b82f6', pink: '#f72577', orange: '#f59e0b', slate: '#94a3b8', purple: '#8b5cf6',
};

type BPNode = {
  id: string; x: number; y: number; w: number; color: keyof typeof BP_COLORS;
  title: string; selected?: boolean; delay: number;
  role: string; foot: { k: string; v: string; boxed?: boolean };
};

const BP_NODE_H = 80;

// 8 generic agents wired into a dense mesh — 4 layers, left → right.
//   L0          L1            L2             L3        L4
//   Orchestrator  Planner   Coder/Designer/  QA       Deployer
//                 Researcher  Data Analyst
const BP_NODES: BPNode[] = [
  { id: 'orch', x: 4, y: 110, w: 140, color: 'green', title: 'Orchestrator', selected: true, delay: 0,
    role: 'Routes work across the agent mesh.', foot: { k: 'Output', v: 'Handoff' } },
  { id: 'planner', x: 156, y: 40, w: 140, color: 'blue', title: 'Planner', delay: 60,
    role: 'Breaks the goal into ordered steps.', foot: { k: 'Output', v: 'Handoff' } },
  { id: 'research', x: 156, y: 180, w: 140, color: 'purple', title: 'Researcher', delay: 120,
    role: 'Gathers and verifies live context.', foot: { k: 'Output', v: 'Handoff' } },
  { id: 'coder', x: 308, y: 4, w: 140, color: 'pink', title: 'Coder', delay: 180,
    role: 'Builds and edits the implementation.', foot: { k: 'Output', v: 'Handoff' } },
  { id: 'designer', x: 308, y: 110, w: 140, color: 'orange', title: 'Designer', delay: 240,
    role: 'Produces the visual system.', foot: { k: 'Output', v: 'Handoff' } },
  { id: 'data', x: 308, y: 216, w: 140, color: 'green', title: 'Data Analyst', delay: 300,
    role: 'Turns raw signals into metrics.', foot: { k: 'Output', v: 'Handoff' } },
  { id: 'qa', x: 460, y: 110, w: 140, color: 'blue', title: 'QA Reviewer', delay: 360,
    role: 'Validates every handoff.', foot: { k: 'Output', v: 'Handoff' } },
  { id: 'deploy', x: 612, y: 110, w: 140, color: 'slate', title: 'Deployer', delay: 420,
    role: 'Ships and monitors the result.', foot: { k: 'Final', v: 'Deliverable', boxed: true } },
];

type BPEdge = { sx: number; sy: number; tx: number; ty: number; color: keyof typeof BP_COLORS; delay: number };

// 13 connections — fan-out, cross-links and converging reviews.
const BP_EDGES: BPEdge[] = [
  { sx: 144, sy: 150, tx: 156, ty: 80, color: 'green', delay: 560 },   // orch → planner
  { sx: 144, sy: 150, tx: 156, ty: 220, color: 'green', delay: 615 },  // orch → researcher
  { sx: 296, sy: 80, tx: 308, ty: 44, color: 'blue', delay: 670 },     // planner → coder
  { sx: 296, sy: 80, tx: 308, ty: 150, color: 'blue', delay: 725 },    // planner → designer
  { sx: 296, sy: 220, tx: 308, ty: 256, color: 'purple', delay: 780 }, // researcher → data
  { sx: 296, sy: 220, tx: 308, ty: 44, color: 'purple', delay: 835 },  // researcher → coder
  { sx: 448, sy: 150, tx: 460, ty: 150, color: 'orange', delay: 890 }, // designer → qa
  { sx: 448, sy: 44, tx: 460, ty: 150, color: 'pink', delay: 945 },    // coder → qa
  { sx: 448, sy: 256, tx: 460, ty: 150, color: 'green', delay: 1000 }, // data → qa
  { sx: 600, sy: 150, tx: 612, ty: 150, color: 'blue', delay: 1055 },  // qa → deployer
  { sx: 448, sy: 44, tx: 612, ty: 150, color: 'pink', delay: 1110 },   // coder → deployer (cross)
  { sx: 144, sy: 150, tx: 308, ty: 256, color: 'green', delay: 1165 }, // orch → data (cross)
  { sx: 448, sy: 150, tx: 612, ty: 150, color: 'orange', delay: 1220 },// designer → deployer (cross)
];

// Auto-route: vertical-dominant edges curve vertically, otherwise horizontally.
function bpPath(e: BPEdge) {
  const dx = e.tx - e.sx;
  const dy = e.ty - e.sy;
  if (Math.abs(dy) > Math.abs(dx)) {
    const c = Math.max(28, Math.abs(dy) * 0.5) * Math.sign(dy);
    return `M${e.sx},${e.sy} C${e.sx},${e.sy + c} ${e.tx},${e.ty - c} ${e.tx},${e.ty}`;
  }
  const c = Math.max(34, Math.abs(dx) * 0.6);
  return `M${e.sx},${e.sy} C${e.sx + c},${e.sy} ${e.tx - c},${e.ty} ${e.tx},${e.ty}`;
}

function BPTrash() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4h6m-8 4h10m-9 0 .7 12h6.6L16 8" />
    </svg>
  );
}

function BPCard({ n }: { n: BPNode }) {
  const accent = BP_COLORS[n.color];
  return (
    <div
      className="bp-node absolute rounded-xl overflow-hidden backdrop-blur-md text-[#f6f6f8]"
      style={{
        left: n.x, top: n.y, width: n.w, height: BP_NODE_H,
        background: 'linear-gradient(135deg, rgba(50,52,64,0.55), rgba(16,16,22,0.40))',
        border: n.selected ? '1px solid rgba(120,160,255,0.65)' : '1px solid rgba(255,255,255,0.12)',
        boxShadow: n.selected
          ? 'inset 0 1px 0 rgba(255,255,255,0.20), 0 0 18px rgba(80,130,255,0.35), 0 12px 30px rgba(0,0,0,0.5)'
          : 'inset 0 1px 0 rgba(255,255,255,0.14), 0 12px 30px rgba(0,0,0,0.5)',
        animationDelay: `${n.delay}ms`,
      }}
    >
      {/* accent wash bleeding down from the title */}
      <div className="absolute inset-x-0 top-0 h-8 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${accent}24, transparent)` }} />
      {/* pulsing glow ring on the selected (coordinator) node */}
      {n.selected && <div className="absolute -inset-px rounded-xl pointer-events-none" style={{ animation: 'bp-sel-glow 2.6s ease-in-out infinite' }} />}

      <div className="relative flex items-center gap-1.5 px-2 h-5 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-[3px] flex-none" style={{ background: accent, boxShadow: `0 0 8px ${accent}aa` }} />
        <span className="flex-1 text-[9.5px] font-bold tracking-[-0.02em] truncate">{n.title}</span>
        <span className="text-white/30 flex-none"><BPTrash /></span>
      </div>
      <div className="relative px-2 pt-1 text-[8px] leading-[1.3] text-white/60" style={{ maxHeight: 26, overflow: 'hidden' }}>
        {n.role}
      </div>
      {n.foot.boxed ? (
        <div className="absolute bottom-1 inset-x-2">
          <div className="rounded-md border border-white/15 bg-white/[0.07] px-1.5 py-0.5 text-[8px] font-bold text-white/90 truncate">{n.foot.v}</div>
        </div>
      ) : (
        <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-2 h-4 text-[8px] font-semibold text-white/45 border-t border-white/[0.08]">
          <span>{n.foot.k}</span><span className="text-white/30">{n.foot.v}</span>
        </div>
      )}
    </div>
  );
}

function AgentBlueprint() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0b12]">
      <style>{`
        @keyframes bp-edge-flow { to { stroke-dashoffset: -34; } }
        @keyframes bp-edge-in { from { opacity: 0; } to { opacity: .9; } }
        @keyframes bp-node-in { from { opacity: 0; transform: translateY(12px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes bp-dot-pulse { 0%, 100% { opacity: .6; } 50% { opacity: 1; } }
        @keyframes bp-sel-glow { 0%, 100% { box-shadow: 0 0 10px rgba(96,165,250,0.25); } 50% { box-shadow: 0 0 22px rgba(96,165,250,0.6); } }
        .bp-node { opacity: 0; animation: bp-node-in 520ms cubic-bezier(.2,.9,.2,1) both; }
      `}</style>

      {/* top spotlight + soft color glow (the glass cards refract these) */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[62%] h-44 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(147,197,253,0.22), transparent 65%)', filter: 'blur(18px)' }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 280, height: 280, right: '2%', top: '-6%', background: 'radial-gradient(circle, rgba(59,130,246,0.16), transparent 70%)', filter: 'blur(22px)' }} />

      {/* dotted canvas texture, like the app's flow background */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#6b7280 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* editor toolbar — mirrors the real app top bar */}
      <div className="absolute left-4 top-3.5 z-20 flex items-center gap-2.5">
        <span className="grid place-items-center w-6 h-6 rounded-md bg-white/10 border border-white/15 text-[8px] font-bold text-white/80">CEO</span>
        <div>
          <div className="text-[11px] font-semibold text-white leading-none">Company Blueprint</div>
          <div className="mt-[5px] text-[7px] tracking-[0.16em] uppercase text-white/35 leading-none">8 agents · 13 handoffs</div>
        </div>
      </div>

      {/* fixed-coordinate flow canvas, top-anchored & centered horizontally (crops sides on narrow widths) */}
      <div className="absolute" style={{ left: '50%', top: 14, width: 760, height: 300, transform: 'translateX(-50%)' }}>
        <svg width="760" height="300" className="absolute inset-0 overflow-visible" fill="none">
          {BP_EDGES.map((e, i) => {
            const color = BP_COLORS[e.color];
            const d = bpPath(e);
            const begin = `${(e.delay / 1000).toFixed(2)}s`;
            const dur = `${(1.9 + (i % 3) * 0.35).toFixed(2)}s`;
            return (
              <g key={i}>
                <path d={d} stroke={color} strokeWidth={2.2} strokeDasharray="8 8" strokeLinecap="round"
                  style={{ opacity: 0, animation: 'bp-edge-flow 800ms linear infinite, bp-edge-in 440ms ease both', animationDelay: `0ms, ${e.delay}ms` }} />
                {/* port dots */}
                <circle cx={e.sx} cy={e.sy} r={3} fill={color} style={{ animation: 'bp-dot-pulse 1.8s ease-in-out infinite', animationDelay: `${e.delay}ms` }} />
                <circle cx={e.tx} cy={e.ty} r={3} fill={color} style={{ animation: 'bp-dot-pulse 1.8s ease-in-out infinite', animationDelay: `${e.delay + 200}ms` }} />
                {/* travelling data packet — flows source → target along the handoff */}
                <circle r="2.6" fill="#eaf2ff" opacity="0" style={{ filter: `drop-shadow(0 0 5px ${color})` }}>
                  <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={d} />
                  <animate attributeName="opacity" to="0.95" dur="0.3s" begin={begin} fill="freeze" />
                </circle>
              </g>
            );
          })}
        </svg>
        {BP_NODES.map((n) => <BPCard key={n.id} n={n} />)}
      </div>

      {/* inset vignette for depth */}
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 70px 8px rgba(0,0,0,0.55)' }} />

      {/* bottom fade + caption */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black via-black/85 to-transparent" />
      <div className="absolute left-5 bottom-3 z-20 max-w-[90%]">
        <span className="text-[12px] text-white font-semibold">Company Blueprint. </span>
        <span className="text-[12px] text-white/45 font-light">Every AI agent and the handoffs between them — the hierarchy and interdependency that runs your company.</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Technical HUD + vignette over the Nexbot 3D scene — a live "agent runtime"
   read-out (status, stack tokens) and a caption, matching the other tiles.
--------------------------------------------------------------------------- */
function AgentsOverlay() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <style>{`
        @keyframes ag-pulse { 0%, 100% { opacity: .45; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
        @keyframes ag-bar { 0%, 100% { transform: scaleY(0.35); } 50% { transform: scaleY(1); } }
      `}</style>

      {/* top-left runtime status */}
      <div className="absolute left-4 top-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/[0.05] backdrop-blur-md px-2.5 py-1">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex w-full h-full rounded-full bg-blue-600" style={{ animation: 'ag-pulse 1.6s ease-in-out infinite' }} />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-blue-600" />
          </span>
          <span className="text-[9px] font-semibold tracking-[0.18em] text-black/70 uppercase">Agent runtime</span>
        </div>
        <div className="flex gap-1.5">
          {['MCP', 'OpenRouter'].map((t) => (
            <span key={t} className="rounded-md border border-white/10 bg-black/[0.04] backdrop-blur-md px-1.5 py-0.5 text-[8px] font-mono text-black/55">{t}</span>
          ))}
        </div>
      </div>

      {/* top-right faux "activity" equalizer — a little live telemetry */}
      <div className="absolute right-4 top-4 flex items-end gap-[3px] h-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t from-sky-400/40 to-violet-400/80"
            style={{ height: '100%', transformOrigin: 'bottom', animation: `ag-bar ${900 + i * 120}ms ease-in-out ${i * 90}ms infinite` }}
          />
        ))}
      </div>

      {/* bottom vignette + caption */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/80 to-transparent" />
      <div className="absolute left-5 bottom-4 max-w-[90%]">
        <span className="text-[13px] text-white font-semibold">Agent Teams. </span>
        <span className="text-[13px] text-white/45 font-light">Coordinator and specialist agents delegate over MCP and execute tools in real time.</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Premium feature tiles for the two square blocks — spotlight, dot-grid depth,
   a glowing orb-mesh (workspace) and an animated precision ring (output).
   Palette: blue + white/grey.
--------------------------------------------------------------------------- */
function TileBackdrop({ from }: { from: 'left' | 'right' | 'center' }) {
  const pos = from === 'left' ? '-top-14 -left-10' : from === 'right' ? '-top-14 -right-10' : '-top-16 left-1/3';
  return (
    <>
      {/* top spotlight beam */}
      <div className={`absolute ${pos} w-56 h-44 pointer-events-none`} style={{ background: 'radial-gradient(ellipse at center, rgba(147,197,253,0.30), transparent 65%)', filter: 'blur(16px)' }} />
      {/* faint dot grid */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
    </>
  );
}

// Tile 1 — multi-agent collaborative workspace: a glowing coordinator orb wired
// to floating glass task pills (the live "hiring pipeline" funnel).
function WorkspaceFeature() {
  const pills = [
    { label: 'Source', v: '128', y: 2, on: false },
    { label: 'Screen', v: '24', y: 31, on: true },
    { label: 'Schedule', v: '6', y: 60, on: false },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#080a12]">
      <style>{`
        @keyframes ws-orb { 0%,100% { box-shadow: 0 0 14px 2px rgba(96,165,250,0.5); } 50% { box-shadow: 0 0 26px 5px rgba(96,165,250,0.85); } }
        @keyframes ws-dash { to { stroke-dashoffset: -16; } }
        @keyframes ws-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
      `}</style>
      <TileBackdrop from="left" />

      <div className="relative h-full p-4 flex flex-col justify-between">
        {/* orb mesh — fixed 300×84 canvas, centered */}
        <div className="relative mx-auto" style={{ width: 300, height: 84 }}>
          <svg width="300" height="84" className="absolute inset-0 overflow-visible">
            <defs>
              <linearGradient id="wsLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(147,197,253,0.7)" />
                <stop offset="100%" stopColor="rgba(147,197,253,0.15)" />
              </linearGradient>
            </defs>
            {[13, 42, 71].map((ty, i) => (
              <path
                key={i}
                d={`M38,42 C90,42 100,${ty} 158,${ty}`}
                fill="none"
                stroke="url(#wsLine)"
                strokeWidth="1.4"
                strokeDasharray="3 4"
                style={{ animation: 'ws-dash 1.1s linear infinite' }}
              />
            ))}
          </svg>

          {/* coordinator orb */}
          <div
            className="absolute grid place-items-center"
            style={{ left: 4, top: 25, width: 34, height: 34, borderRadius: '50%', background: 'radial-gradient(circle at 34% 28%, #eff6ff, #3b82f6 58%, #1e3a8a)', animation: 'ws-orb 3s ease-in-out infinite' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.2" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>
          </div>

          {/* floating glass task pills */}
          {pills.map((p, i) => (
            <div
              key={p.label}
              className="absolute flex items-center gap-1.5 rounded-lg backdrop-blur-md px-2 h-[22px]"
              style={{
                left: 158, top: p.y, width: 134,
                border: p.on ? '1px solid rgba(96,165,250,0.7)' : '1px solid rgba(255,255,255,0.10)',
                background: p.on ? 'rgba(59,130,246,0.14)' : 'rgba(255,255,255,0.05)',
                boxShadow: p.on ? '0 0 14px rgba(59,130,246,0.45)' : 'none',
                animation: `ws-float 3.4s ease-in-out ${i * 0.4}s infinite`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-none" style={{ background: p.on ? '#93c5fd' : '#64748b' }} />
              <span className={`text-[9.5px] font-medium ${p.on ? 'text-white' : 'text-white/70'}`}>{p.label}</span>
              <span className="ml-auto text-[9px] font-mono text-white/40">{p.v}</span>
            </div>
          ))}
        </div>

        <div className="relative">
          <h3 className="text-[14px] font-semibold text-white tracking-tight">Multi-agent workspace</h3>
          <p className="mt-0.5 text-[11px] leading-[1.4] text-white/45 font-light">Agents collaborate end-to-end — custom prompts, mapped tools and autonomous schedules.</p>
        </div>
      </div>
    </div>
  );
}

const RING_R = 34;
const RING_C = 2 * Math.PI * RING_R;
const RING_TARGET = RING_C * 0.08; // ~92% filled

// Tile 2 — output quality: an animated glowing precision ring with a verified core.
function PrecisionFeature() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#080a12]">
      <style>{`
        @keyframes bp-ring-draw { from { stroke-dashoffset: ${RING_C}; } to { stroke-dashoffset: ${RING_TARGET}; } }
      `}</style>
      <TileBackdrop from="center" />

      <div className="relative h-full flex items-center gap-4 px-4">
        {/* glowing precision ring */}
        <div className="relative shrink-0" style={{ width: 84, height: 84 }}>
          <svg width="84" height="84" viewBox="0 0 84 84">
            <defs>
              <linearGradient id="bpRing" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#bfdbfe" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            {/* gauge ticks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              const round = (n: number) => (42 + n * Math.cos(a)).toFixed(2);
              const roundY = (n: number) => (42 + n * Math.sin(a)).toFixed(2);
              return (
                <line
                  key={i}
                  x1={round(39)} y1={roundY(39)}
                  x2={round(42)} y2={roundY(42)}
                  stroke="rgba(148,163,184,0.25)" strokeWidth="1.2" strokeLinecap="round"
                />
              );
            })}
            <circle cx="42" cy="42" r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <circle
              cx="42" cy="42" r={RING_R} fill="none" stroke="url(#bpRing)" strokeWidth="6" strokeLinecap="round"
              transform="rotate(-90 42 42)"
              style={{ strokeDasharray: RING_C, strokeDashoffset: RING_C, animation: 'bp-ring-draw 1.5s cubic-bezier(.2,.9,.2,1) 0.2s forwards', filter: 'drop-shadow(0 0 5px rgba(96,165,250,0.7))' }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid place-items-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bfdbfe" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
          </div>
        </div>

        <div className="relative">
          <h3 className="text-[15px] font-semibold text-white tracking-tight">Precise by design</h3>
          <p className="mt-1 text-[11px] leading-[1.4] text-white/45 font-light">Every step self-checks before handoff — structured, verified output you can ship.</p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-[8.5px] font-mono text-white/55">12 / 12 steps · Zod-typed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BentoCard({ item, index }: { item: BentoItem; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  // agents → Nexbot 3D scene, blueprint → planner board, graph → node blueprint.
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden ${item.cls} rounded-2xl bg-black border border-white/[0.06]`}
    >
      {item.id === 'agents' && (
        <>
          <div className="absolute inset-0 scale-[1.4] translate-y-[20%]">
            <Nexbot />
          </div>
          <AgentsOverlay />
        </>
      )}
      {item.id === 'blueprint' && <PlanBoard />}
      {item.id === 'graph' && <AgentBlueprint />}
      {item.id === 'scale' && <WorkspaceFeature />}
      {item.id === 'monitor' && <PrecisionFeature />}
    </motion.div>
  );
}

export default function BentoGrid() {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="features" className="relative py-16 px-6 overflow-hidden">
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
          className="text-left mb-10"
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

        {/* Grid — auto-rows controls every card's height. tall/large = 2 rows. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[172px]">
          {bentoItems.map((item, i) => (
            <BentoCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}