'use client';

import { motion } from 'motion/react';
import { useRef } from 'react';
import MagicRings from '../ui/MagicRings';
import LiquidGlassButton from '../ui/LiquidGlass';

interface HeroSectionProps {
  onJoinClick: () => void;
}

export default function HeroSection({ onJoinClick }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Deep background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020818] via-[#060e28] to-[#0a0a1a]" />

      {/* Ambient glow effects */}
      <div className="absolute left-[-15%] top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(65,88,208,0.24)_0%,transparent_70%)] blur-[40px] pointer-events-none" />
      <div className="absolute right-[-15%] top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(139,111,255,0.22)_0%,transparent_70%)] blur-[40px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(65,88,208,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* MagicRings */}
      <div className="absolute inset-0 z-[1]">
        <MagicRings
          color="#3b5fdb"
          colorTwo="#8b6fff"
          speed={0.7}
          ringCount={6}
          attenuation={20.0}
          lineThickness={2.0}
          baseRadius={0.35}
          radiusStep={0.07}
          scaleRate={0.12}
          opacity={1}
          noiseAmount={0.03}
          rotation={-12}
          ringGap={1.4}
          fadeIn={0.9}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0.0}
          hoverScale={1.0}
          parallax={0.0}
          clickBurst={false}
        />
      </div>

      {/* Content overlay — nudged slightly above true center */}
      <div className="relative z-[10] flex flex-col items-center text-center px-6 max-w-[800px] -translate-y-[6vh]">
        {/* Badge — pill flanked by fading lines + glowing dots */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7 -translate-y-[2.5vh] flex items-center justify-center gap-3"
        >
          {/* left line → dot */}
          <span className="hidden sm:block h-px w-14 lg:w-24 bg-gradient-to-r from-transparent to-[rgba(190,205,255,0.55)]" />
          <span className="hidden sm:block w-[7px] h-[7px] rounded-full bg-white shadow-[0_0_9px_2px_rgba(180,200,255,0.65)]" />

          <span className="px-4 py-1.5 rounded-full border border-[rgba(80,120,200,0.25)] bg-white/90 backdrop-blur-sm">
            <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[rgba(65,88,139)]">
              ✦ Build AI Companies From Zero
            </span>
          </span>

          {/* dot ← right line */}
          <span className="hidden sm:block w-[7px] h-[7px] rounded-full bg-white shadow-[0_0_9px_2px_rgba(180,200,255,0.65)]" />
          <span className="hidden sm:block h-px w-14 lg:w-24 bg-gradient-to-r from-[rgba(190,205,255,0.55)] to-transparent" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(1.9rem,4.2vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.03em] mb-5"
        >
          {/* White → blue vertical gradient (blue rising from the bottom) */}
          <span className="block bg-gradient-to-b from-white via-[#dde6ff] to-[#7ba4ff] bg-clip-text text-transparent">
            The Architecture of Autopilot.
          </span>
          <span className="block bg-clip-text bg-gradient-to-b from-white via-[#dde6ff] to-[#7ba4ff] text-transparent">
            Build Your Business From Zero.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(0.875rem,1.5vw,1.05rem)] text-[rgba(185,200,235,0.6)] leading-relaxed max-w-[480px] mb-9 font-light tracking-[0.01em]"
        >
          Describe your vision. DoZero drafts the blueprint, hires your AI team,
          and sets them to work — automatically.
        </motion.p>

        {/* Join Button — CSS liquid glass pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <LiquidGlassButton
            onClick={onJoinClick}
            mouseContainer={heroRef}
            width={252}
            height={56}
          >
            <span className="group flex items-center gap-3 justify-center text-white [text-shadow:0_1px_8px_rgba(10,20,60,0.5)]">
              <span className="text-[12px] font-medium tracking-[0.3em] uppercase whitespace-nowrap">Join Waitlist</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </LiquidGlassButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[10]"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-[rgba(160,180,240,0.35)] font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-6 bg-gradient-to-b from-[rgba(100,140,255,0.4)] to-transparent"
        />
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#060a1a] z-[5] pointer-events-none" />
    </section>
  );
}
