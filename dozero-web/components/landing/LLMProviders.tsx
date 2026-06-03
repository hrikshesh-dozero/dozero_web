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
function HubGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" fill="white" stroke="none" />
      <path d="M12 5V2M12 22v-3M5 12H2M22 12h-3M7 7 5.2 5.2M16.8 5.2 19 7M5.2 19 7 17M17 17l2 1.8" />
    </svg>
  );
}

type Provider = { name: string; model: string; desc: string; tags: string[]; glow: string; logo: string; glyph: React.ReactNode; dark?: boolean };

const PROVIDERS: Provider[] = [
  { name: 'OpenAI', model: 'GPT-4o · o-series', desc: 'Frontier GPT and o-series — top-tier reasoning and tool use.', tags: ['Reasoning', 'Tools', 'Vision'], glow: 'rgba(16,200,150,0.7)', logo: '/logos/openai.svg', glyph: <OpenAIGlyph />, dark: true },
  { name: 'Anthropic', model: 'Claude', desc: 'Long-context reasoning with the most reliable tool calls.', tags: ['Long context', 'Tools', 'Vision'], glow: 'rgba(230,130,90,0.7)', logo: '/logos/anthropic.svg', glyph: <AnthropicGlyph /> },
  { name: 'Google', model: 'Gemini', desc: 'Fast, multimodal and cost-efficient models at scale.', tags: ['Multimodal', 'Fast', 'Cheap'], glow: 'rgba(110,140,255,0.75)', logo: '/logos/gemini.png', glyph: <GeminiGlyph /> },
  { name: 'Meta', model: 'Llama', desc: 'Open-weight models you can host and fine-tune anywhere.', tags: ['Open weights', 'Self-host'], glow: 'rgba(40,140,255,0.7)', logo: '/logos/meta.svg', glyph: <MetaGlyph /> },
  { name: 'Mistral', model: 'Mistral · Mixtral', desc: 'Lean open models and Mixtral mixture-of-experts.', tags: ['Open', 'MoE', 'Efficient'], glow: 'rgba(255,140,30,0.65)', logo: '/logos/mistral.svg', glyph: <MistralGlyph /> },
  { name: 'xAI', model: 'Grok', desc: 'Real-time knowledge paired with strong reasoning.', tags: ['Realtime', 'Reasoning'], glow: 'rgba(220,225,235,0.6)', logo: '/logos/grok.svg', glyph: <GrokGlyph />, dark: true },
  { name: 'DeepSeek', model: 'V3 · R1', desc: 'Open reasoning models with frontier quality at low cost.', tags: ['Open', 'Reasoning', 'Cheap'], glow: 'rgba(77,107,254,0.7)', logo: '/logos/deepseek.svg', glyph: <Mono ch="D" color="#5b7cfe" /> },
  { name: 'Cohere', model: 'Command', desc: 'Retrieval-tuned models built for enterprise workloads.', tags: ['RAG', 'Enterprise'], glow: 'rgba(255,122,89,0.65)', logo: '/logos/cohere.svg', glyph: <Mono ch="C" color="#ff7a59" /> },
];

// 3×3 grid with the MCP hub in the centre.
const ORDER = [0, 1, 2, 3, -1, 4, 5, 6, 7]; // -1 = hub

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

export default function LLMProviders() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [active, setActive] = useState<number | null>(null);
  const grad = 'block bg-gradient-to-b from-white via-[#dde6ff] to-[#7ba4ff] bg-clip-text text-transparent';
  const ap = active !== null ? PROVIDERS[active] : null;

  return (
    <section className="relative py-28 px-6 overflow-hidden bg-[#020818]">
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

        {/* grid (left) + hover info panel (right) */}
        <div className="mt-16 grid md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-center justify-center max-w-[840px] mx-auto">
          {/* provider grid — radial mask fades the edges into the black background */}
          <div
            className="grid grid-cols-3 gap-3 sm:gap-4 w-[300px] sm:w-[340px] mx-auto"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse 78% 82% at 50% 50%, #000 26%, transparent 92%)',
              maskImage: 'radial-gradient(ellipse 78% 82% at 50% 50%, #000 26%, transparent 92%)',
            }}
          >
            {ORDER.map((idx, cell) => {
              if (idx === -1) {
                return (
                  <div key={cell} className="relative aspect-square rounded-2xl grid place-items-center border border-sky-400/30 z-10"
                    style={{ background: 'radial-gradient(circle at 50% 32%, #3b82f6, #16306e 72%)', boxShadow: '0 0 30px rgba(59,130,246,0.55), inset 0 1px 0 rgba(255,255,255,0.3)' }} title="DoZero · MCP router">
                    <HubGlyph />
                  </div>
                );
              }
              const p = PROVIDERS[idx];
              const isActive = active === idx;
              const dim = active !== null && !isActive;
              return (
                <button
                  key={cell}
                  type="button"
                  onMouseEnter={() => setActive(idx)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(idx)}
                  onBlur={() => setActive(null)}
                  title={p.name}
                  className={`relative aspect-square rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.015] grid place-items-center transition-opacity duration-300 outline-none ${dim ? 'opacity-25' : 'opacity-100'}`}
                >
                  {/* glow lives on the icon only — works for glyphs and real logos */}
                  <div
                    className="relative transition-all duration-300"
                    style={{
                      filter: `${p.dark ? 'invert(1) ' : ''}${isActive ? `grayscale(0) drop-shadow(0 0 8px ${p.glow}) drop-shadow(0 0 16px ${p.glow})` : 'grayscale(0.5)'}`,
                      transform: isActive ? 'scale(1.14)' : 'scale(1)',
                    }}
                  >
                    <ProviderIcon p={p} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* minimal info panel */}
          <div className="relative min-h-[170px] flex items-center md:text-left text-center">
            <motion.div key={active ?? 'idle'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="w-full">
              {ap ? (
                <>
                  <div className="flex items-center gap-3 md:justify-start justify-center">
                    <span className="grid place-items-center w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04]"><ProviderIcon p={ap} size={24} /></span>
                    <div>
                      <div className="text-white font-semibold text-[18px] leading-tight">{ap.name}</div>
                      <div className="text-white/40 text-[12px]">{ap.model}</div>
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
                  <p className="mt-2 text-white/40 text-[13.5px] leading-relaxed max-w-[320px] md:mx-0 mx-auto">Hover a provider to see how DoZero connects to it through the MCP router — switch models without changing a line of code.</p>
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
