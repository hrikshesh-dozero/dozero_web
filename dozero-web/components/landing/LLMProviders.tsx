'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';

/* --- stylized fallback glyphs (used until real /logos/*.svg are added) --- */
function OpenAIGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#10a37f" strokeWidth="1.4">
      {[0, 60, 120, 180, 240, 300].map((a) => <ellipse key={a} cx="12" cy="12" rx="3.3" ry="8.2" transform={`rotate(${a} 12 12)`} />)}
    </svg>
  );
}
function AnthropicGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" stroke="#e0855f" strokeWidth="1.7" strokeLinecap="round">
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x = (n: number) => (12 + n * Math.cos(a)).toFixed(2);
        const y = (n: number) => (12 + n * Math.sin(a)).toFixed(2);
        return <line key={i} x1={x(3.4)} y1={y(3.4)} x2={x(9.4)} y2={y(9.4)} />;
      })}
    </svg>
  );
}
function GeminiGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24">
      <defs><linearGradient id="gemg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7aa7ff" /><stop offset="50%" stopColor="#6f7dff" /><stop offset="100%" stopColor="#b07ce0" /></linearGradient></defs>
      <path d="M12 1 C12.6 7 17 11.4 23 12 C17 12.6 12.6 17 12 23 C11.4 17 7 12.6 1 12 C7 11.4 11.4 7 12 1 Z" fill="url(#gemg)" />
    </svg>
  );
}
function MetaGlyph() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="2.1" strokeLinecap="round">
      <defs><linearGradient id="metag" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3b9dff" /><stop offset="100%" stopColor="#1c6fff" /></linearGradient></defs>
      <path d="M6.5 9C4.6 9 3 10.3 3 12s1.6 3 3.5 3c2.6 0 3.4-3 5.5-3s2.9 3 5.5 3c1.9 0 3.5-1.3 3.5-3s-1.6-3-3.5-3c-2.6 0-3.4 3-5.5 3S9.1 9 6.5 9z" stroke="url(#metag)" />
    </svg>
  );
}
function MistralGlyph() {
  const rows = ['#FFD300', '#FF8205', '#E10500'];
  return (
    <svg width="26" height="26" viewBox="0 0 24 24">
      {rows.map((color, r) => [0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={3 + c * 6} y={4 + r * 6} width="4.8" height="4.8" rx="1" fill={color} opacity={c === 1 ? 1 : 0.85} />))}
    </svg>
  );
}
function GrokGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" stroke="#e8eaed" strokeWidth="2.4" strokeLinecap="round"><path d="M5 4l14 16M19 4 5 20" /></svg>
  );
}
function Mono({ ch, color }: { ch: string; color: string }) {
  return <span className="text-[18px] font-extrabold leading-none" style={{ color }}>{ch}</span>;
}
type Provider = { name: string; model: string; desc: string; tags: string[]; glow: string; logo: string; glyph: React.ReactNode; dark?: boolean; bg?: string };

const PROVIDERS: Provider[] = [
  { name: 'OpenAI', model: 'GPT-4o · o-series', desc: 'Frontier GPT and o-series — top-tier reasoning and tool use.', tags: ['Reasoning', 'Tools', 'Vision'], glow: 'rgba(16,200,150,0.7)', logo: '/logos/openai.svg', glyph: <OpenAIGlyph />, dark: true },
  { name: 'Anthropic', model: 'Claude', desc: 'Long-context reasoning with the most reliable tool calls.', tags: ['Long context', 'Tools', 'Vision'], glow: 'rgba(230,130,90,0.7)', logo: '/logos/anthropic.svg', glyph: <AnthropicGlyph /> },
  { name: 'Google', model: 'Gemini', desc: 'Fast, multimodal and cost-efficient models at scale.', tags: ['Multimodal', 'Fast', 'Cheap'], glow: 'rgba(110,140,255,0.75)', logo: '/logos/gemini.png', glyph: <GeminiGlyph /> },
  { name: 'Meta', model: 'Llama', desc: 'Open-weight models you can host and fine-tune anywhere.', tags: ['Open weights', 'Self-host'], glow: 'rgba(40,140,255,0.7)', logo: '/logos/meta.svg', glyph: <MetaGlyph /> },
  { name: 'Mistral', model: 'Mistral · Mixtral', desc: 'Lean open models and Mixtral mixture-of-experts.', tags: ['Open', 'MoE', 'Efficient'], glow: 'rgba(255,140,30,0.65)', logo: '/logos/mistral.svg', glyph: <MistralGlyph /> },
  { name: 'xAI', model: 'Grok', desc: 'Real-time knowledge paired with strong reasoning.', tags: ['Realtime', 'Reasoning'], glow: 'rgba(220,225,235,0.6)', logo: '/logos/grok.svg', glyph: <GrokGlyph />, dark: true },
  { name: 'DeepSeek', model: 'V3 · R1', desc: 'Open reasoning models with frontier quality at low cost.', tags: ['Open', 'Reasoning', 'Cheap'], glow: 'rgba(77,107,254,0.7)', logo: '/logos/deepseek.png', glyph: <Mono ch="D" color="#5b7cfe" /> },
  { name: 'Cohere', model: 'Command', desc: 'Retrieval-tuned models built for enterprise workloads.', tags: ['RAG', 'Enterprise'], glow: 'rgba(255,122,89,0.65)', logo: '/logos/cohere.svg', glyph: <Mono ch="C" color="#ff7a59" /> },
  { name: 'Qwen', model: 'Qwen', desc: 'Alibaba’s open, strongly multilingual models.', tags: ['Open', 'Multilingual'], glow: 'rgba(124,92,230,0.6)', logo: '/logos/qwen.svg', glyph: <Mono ch="Q" color="#8b5cf6" />, bg: 'rgba(110,100,240,0.45)' },
  { name: 'Perplexity', model: 'Sonar', desc: 'Search-grounded answers with live citations.', tags: ['Search', 'Citations'], glow: 'rgba(32,184,196,0.6)', logo: '/logos/perplexity.png', glyph: <Mono ch="P" color="#20b8c4" /> },
  { name: 'Groq', model: 'LPU', desc: 'Ultra-low-latency inference at extreme speed.', tags: ['Fast', 'Low latency'], glow: 'rgba(245,80,54,0.6)', logo: '/logos/groq.png', glyph: <Mono ch="G" color="#f55036" />, bg: 'rgba(245,110,40,0.5)' },
];

const TILE = 'w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] rounded-2xl';

// Auto-scrolling marquee columns (alternating up/down), duplicated for a seamless loop.
const SCROLL: { dir: 'mq-up' | 'mq-down'; dur: number; items: Provider[] }[] = [
  { dir: 'mq-up', dur: 26, items: [PROVIDERS[0], PROVIDERS[3], PROVIDERS[5], PROVIDERS[10]] },  // OpenAI · Meta · Grok · Groq
  { dir: 'mq-down', dur: 32, items: [PROVIDERS[1], PROVIDERS[6], PROVIDERS[8], PROVIDERS[7]] }, // Anthropic · DeepSeek · Qwen · Cohere
  { dir: 'mq-up', dur: 29, items: [PROVIDERS[2], PROVIDERS[4], PROVIDERS[9]] },                 // Gemini · Mistral · Perplexity
];

// Flip to true AFTER dropping the official SVGs into /public/logos/.
// While false, only the built-in glyphs render — no image requests, no 404s.
const USE_LOGO_FILES = true;

function ProviderIcon({ p, size = 30 }: { p: Provider; size?: number }) {
  const [err, setErr] = useState(false);
  if (USE_LOGO_FILES && p.logo && !err) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.logo} alt={p.name} width={size} height={size} onError={() => setErr(true)} style={{ width: size, height: size, objectFit: 'contain' }} />;
  }
  return <>{p.glyph}</>;
}

function ProviderTile({ p, active, setActive }: { p: Provider; active: string | null; setActive: (v: string | null) => void }) {
  const isActive = active === p.name;
  const dim = active !== null && !isActive;
  return (
    <button
      type="button"
      onMouseEnter={() => setActive(p.name)}
      onMouseLeave={() => setActive(null)}
      onFocus={() => setActive(p.name)}
      onBlur={() => setActive(null)}
      title={p.name}
      className={`${TILE} mb-3 sm:mb-4 shrink-0 relative grid place-items-center border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.015] transition-opacity duration-300 outline-none ${dim ? 'opacity-60' : 'opacity-100'}`}
    >
      {/* always-on backdrop glow for dark/low-contrast logos */}
      {p.bg && <span className="absolute inset-2.5 rounded-2xl pointer-events-none" style={{ background: `radial-gradient(circle, ${p.bg}, transparent 70%)`, filter: 'blur(7px)' }} />}
      <div
        className="relative transition-transform duration-300"
        style={{
          filter: [
            p.dark ? 'invert(1)' : '',
            isActive ? (p.dark ? `drop-shadow(0 0 4px ${p.glow}) drop-shadow(0 0 11px ${p.glow}) drop-shadow(0 0 22px ${p.glow})` : `drop-shadow(0 0 18px ${p.glow})`) : '',
          ].filter(Boolean).join(' ') || 'none',
          transform: isActive ? 'scale(1.12)' : 'scale(1)',
        }}
      >
        <ProviderIcon p={p} size={46} />
      </div>
    </button>
  );
}

export default function LLMProviders() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [active, setActive] = useState<string | null>(null);
  const grad = 'block bg-gradient-to-b from-white via-[#dde6ff] to-[#7ba4ff] bg-clip-text text-transparent';
  const ap = active ? PROVIDERS.find((p) => p.name === active) ?? null : null;

  return (
    <section className="relative pt-44 pb-28 px-6 overflow-hidden bg-[#020818]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[460px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.15), transparent 70%)', filter: 'blur(34px)' }} />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, rgba(140,170,255,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 max-w-[1140px] mx-auto text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md px-3 py-1 text-[11px] font-medium text-white/60">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />MCP-native · Model agnostic
        </span>

        <h2 className="mt-6 text-[clamp(2.25rem,5vw,4.25rem)] font-bold tracking-[-0.03em] leading-[1.06]">
          <span className={grad}>Works with every model</span>
          <span className={grad}>you trust</span>
        </h2>

        <p className="mt-5 text-[clamp(1rem,1.5vw,1.15rem)] text-white/45 leading-relaxed max-w-[600px] mx-auto font-light">
          Seamless integration with any LLM provider — DoZero routes every agent to the right model through one MCP layer, so you&apos;re never locked to a single vendor.
        </p>

        {/* grid + hover info panel — centred together as one pair */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 max-w-[820px] mx-auto">
          {/* auto-scrolling provider marquee — columns drift vertically, pause on hover */}
          <div
            className="group flex justify-center gap-3 sm:gap-4 h-[440px] overflow-hidden"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)',
              maskImage: 'linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)',
            }}
          >
            <style>{`
              @keyframes mq-up { from { transform: translateY(0); } to { transform: translateY(-50%); } }
              @keyframes mq-down { from { transform: translateY(-50%); } to { transform: translateY(0); } }
            `}</style>
            {SCROLL.map((col, ci) => (
              <div
                key={ci}
                className="flex flex-col will-change-transform group-hover:[animation-play-state:paused]"
                style={{ animation: `${col.dir} ${col.dur}s linear infinite` }}
              >
                {[...col.items, ...col.items].map((p, i) => (
                  <ProviderTile key={`${p.name}-${i}`} p={p} active={active} setActive={setActive} />
                ))}
              </div>
            ))}
          </div>

          {/* minimal info panel — fixed width so content swaps never resize/recenter the pair */}
          <div className="relative min-h-[170px] w-full md:w-[330px] flex items-center md:text-left text-center">
            <motion.div key={active ?? 'idle'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="w-full">
              {ap ? (
                <>
                  <div className="flex items-center gap-3.5 md:justify-start justify-center">
                    <span
                      className="grid place-items-center w-14 h-14 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.02]"
                      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 20px -8px rgba(0,0,0,0.6)' }}
                    >
                      <span style={{ filter: `${ap.dark ? 'invert(1) ' : ''}drop-shadow(0 0 6px ${ap.glow})` }}>
                        <ProviderIcon p={ap} size={30} />
                      </span>
                    </span>
                    <div>
                      <div className="text-white font-semibold text-[19px] leading-tight tracking-tight">{ap.name}</div>
                      <div className="text-white/40 text-[12.5px] mt-0.5">{ap.model}</div>
                    </div>
                  </div>
                  <p className="mt-4 text-white/55 text-[13.5px] leading-relaxed max-w-[320px] md:mx-0 mx-auto">{ap.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5 md:justify-start justify-center">
                    {ap.tags.map((t) => <span key={t} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/55">{t}</span>)}
                    <span className="rounded-md border border-sky-400/25 bg-sky-400/10 px-2 py-0.5 text-[10px] text-sky-300">via MCP</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-white/80 font-semibold text-[17px]">One layer, every model</div>
                  <p className="mt-2 text-white/40 text-[13.5px] leading-relaxed max-w-[320px] md:mx-0 mx-auto">Every agent runs on the model best suited to its task — and you can switch providers anytime without lock-in or rewrites.</p>
                </>
              )}
            </motion.div>
          </div>
        </div>

        <p className="mt-14 text-[12px] text-white/30 font-mono tracking-wide">+ any OpenRouter model — Qwen, Perplexity, and more</p>
      </motion.div>
    </section>
  );
}
