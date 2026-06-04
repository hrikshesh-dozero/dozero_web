'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import Wave3D from '../ui/Wave3D';

const C = '#4b56c9'; // icon accent (indigo, reads through the clear glass on the light section)
const Bulb = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.5 1 1.3 1 2.1V16h6v-.4c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z" /></svg>
);
const ProfileCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="8" r="3.2" /><path d="M4 20a6 6 0 0 1 10-4.4" /><path d="m14.5 18 2 2 4-4" /></svg>
);
const Building = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-3h4v3" /></svg>
);
const Grid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.2" /><rect x="13" y="4" width="7" height="7" rx="1.2" /><rect x="4" y="13" width="7" height="7" rx="1.2" /><rect x="13" y="13" width="7" height="7" rx="1.2" /></svg>
);
const Play = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M10 8.5 16 12l-6 3.5z" fill={C} stroke="none" /></svg>
);

const STEPS = [
  { n: 1, title: 'Architectural Intent', desc: 'Describe your company in a single line of intent.', icon: <Bulb /> },
  { n: 2, title: 'CEO Alignment', desc: 'A coordinator interviews you and locks the plan.', icon: <ProfileCheck /> },
  { n: 3, title: 'Company Assembled', desc: 'Specialist agents are hired into a structured team.', icon: <Building /> },
  { n: 4, title: 'Studios Activated', desc: 'Dev, Research, Design and more spin up on demand.', icon: <Grid /> },
  { n: 5, title: 'Autonomous Execution', desc: 'Agents run every task end to end, hands-free.', icon: <Play /> },
];

export default function WaveFlow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative pt-28 pb-12 px-6 overflow-hidden bg-[#eef2fb]">
      {/* navy-blue light rays fanning from the top-right corner */}
      <div
        className="absolute top-0 right-0 w-[74%] h-[84%] pointer-events-none"
        style={{
          background:
            'conic-gradient(from 0deg at 100% 0%, transparent 190deg, rgba(40,74,175,0.24) 202deg, transparent 210deg, rgba(40,74,175,0.16) 222deg, transparent 230deg, rgba(40,74,175,0.30) 244deg, transparent 254deg, rgba(40,74,175,0.15) 265deg, transparent 276deg)',
          WebkitMaskImage: 'radial-gradient(ellipse 88% 88% at 100% 0%, #000 6%, transparent 70%)',
          maskImage: 'radial-gradient(ellipse 88% 88% at 100% 0%, #000 6%, transparent 70%)',
        }}
      />
      {/* brighter corner core glow */}
      <div
        className="absolute top-0 right-0 w-[56%] h-[62%] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 70% at 100% 0%, rgba(40,74,175,0.34), rgba(40,74,175,0.10) 40%, transparent 62%)' }}
      />

      {/* heading — left aligned, navy text */}
      <div className="relative z-10 max-w-[1140px] mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0b1640]/10 bg-[#0b1640]/[0.04] px-3 py-1 text-[11px] font-medium text-[#0b1640]/65">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />How it works
        </span>
        <h2 className="mt-6 text-[clamp(2.25rem,5vw,4.25rem)] font-bold tracking-[-0.03em] leading-[1.06] text-[#0b1640]">From intent to execution</h2>
        <h5 className="mt-5 text-[clamp(1rem,1.5vw,1.15rem)] text-[#0b1640]/55 leading-relaxed max-w-[560px] font-light">
          One line of intent becomes a running company — DoZero designs, assembles, and operates it in five automated steps.
        </h5>
      </div>

      {/* wave + glass step cards */}
      <div className="relative mt-12 h-[560px] w-full">
        {/* navy 3D wave on the light backdrop (edges fade in-shader) */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute inset-0"><Wave3D color={0x3a4ba8} opacity={0.5} /></div>
        </div>

        {/* glass cards laid over the wave */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 h-full flex items-center"
        >
          <div className="w-full max-w-[1200px] mx-auto flex flex-wrap lg:flex-nowrap justify-center gap-4 sm:gap-5">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-[210px] rounded-2xl border border-white/50 overflow-hidden p-5 backdrop-blur-sm"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75), 0 22px 46px -22px rgba(20,30,80,0.30)',
                }}
              >
                {/* specular reflection (top-left light catch) */}
                <div className="absolute -top-10 -left-8 w-44 h-32 pointer-events-none" style={{ background: 'radial-gradient(60% 60% at 35% 35%, rgba(255,255,255,0.5), transparent 70%)', filter: 'blur(10px)' }} />
                {/* edge highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
                <div className="relative flex items-center justify-between">
                  <span className="grid place-items-center w-9 h-9 rounded-xl border border-[#0b1640]/10 bg-white/40">{s.icon}</span>
                  <span className="text-[12px] font-mono text-[#0b1640]/35">0{s.n}</span>
                </div>
                <h3 className="relative mt-4 text-[15px] font-semibold tracking-tight text-[#0b1640]">{s.title}</h3>
                <p className="relative mt-1.5 text-[12px] leading-snug text-[#0b1640]/60">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
