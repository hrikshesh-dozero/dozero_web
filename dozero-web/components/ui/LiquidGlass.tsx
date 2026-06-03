'use client';

import { useEffect, useState, type ReactNode, type RefObject } from 'react';
import RawLiquidGlass from 'liquid-glass-react';

interface LiquidGlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  /** Width/height of the layout box that reserves space; the glass is centered inside it. */
  width?: number;
  height?: number;
  cornerRadius?: number;
  /** CSS padding passed to the glass (controls how far the content sits from the edges). */
  padding?: string;
  /** Element the glass tracks the cursor over, for the elastic "lean" effect. */
  mouseContainer?: RefObject<HTMLElement | null> | null;
  className?: string;
}

/**
 * Apple-style refractive "liquid glass" button built on `liquid-glass-react`.
 *
 * That library reads `navigator.userAgent` during render and relies on SVG
 * displacement filters, so it can't be server-rendered. We gate it behind a
 * mount flag and paint a matching CSS glass pill until the client takes over —
 * which also serves as the look for browsers without displacement support
 * (Safari/Firefox).
 */
export default function LiquidGlassButton({
  children,
  onClick,
  width = 250,
  height = 56,
  cornerRadius = 100,
  padding = '0px 40px',
  mouseContainer,
  className = '',
}: LiquidGlassButtonProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{ width, height, borderRadius: cornerRadius }}
        className={`relative flex items-center justify-center cursor-pointer border-none
          bg-[rgba(255,255,255,0.07)] backdrop-blur-xl
          shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_0_14px_rgba(255,255,255,0.12),0_8px_32px_rgba(0,0,0,0.25)]
          ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      <RawLiquidGlass
        onClick={onClick}
        mouseContainer={mouseContainer}
        displacementScale={64}
        blurAmount={0.08}
        saturation={130}
        aberrationIntensity={2}
        elasticity={0.25}
        cornerRadius={cornerRadius}
        padding={padding}
        // The library centers its decorative layers at top/left 50% + translate(-50%,-50%),
        // but the content/refraction layer only gets the transform — so it must be given the
        // matching top/left 50% explicitly, otherwise the pill and its content drift apart.
        style={{ position: 'absolute', top: '50%', left: '50%' }}
        className={`cursor-pointer ${className}`}
      >
        <div style={{ minHeight: height }} className="flex items-center justify-center">
          {children}
        </div>
      </RawLiquidGlass>
    </div>
  );
}

interface LiquidGlassSurfaceProps {
  children: ReactNode;
  /** Width/height of the layout box that reserves space; the glass is centered inside it. */
  width: number;
  height: number;
  cornerRadius?: number;
  /** CSS padding passed to the glass (keep at "0px" when the content provides its own padding). */
  padding?: string;
  /** Element the glass tracks the cursor over for the moving specular highlight. */
  mouseContainer?: RefObject<HTMLElement | null> | null;
  className?: string;
  /** Extra classes for the pre-mount CSS-glass fallback panel. */
  fallbackClassName?: string;
  /** Render the real glass on the first frame instead of showing the CSS fallback first.
   *  Safe only when the surface is never server-rendered (e.g. inside a modal that opens
   *  on a client click) — avoids the brief fallback "flash" before the glass appears. */
  immediate?: boolean;
}

/**
 * A larger refractive "liquid glass" panel (for cards/modals) built on the same
 * `liquid-glass-react` primitive as {@link LiquidGlassButton}. Elasticity is 0 so
 * the surface stays put — host components can apply their own motion (e.g. a 3D tilt).
 *
 * Same SSR caveat as the button: gated behind a mount flag with a CSS-glass fallback.
 */
export function LiquidGlassSurface({
  children,
  width,
  height,
  cornerRadius = 28,
  padding = '0px',
  mouseContainer,
  className = '',
  fallbackClassName = '',
  immediate = false,
}: LiquidGlassSurfaceProps) {
  // When `immediate`, start mounted on the client so the glass paints on the first
  // frame (no fallback flash). `typeof window` keeps it safe if ever server-rendered.
  const [mounted, setMounted] = useState(immediate && typeof window !== 'undefined');
  useEffect(() => setMounted(true), []);

  // For the first beat after mount, suppress the library's internal size transition so
  // its decorative layers snap to the measured size instead of visibly growing from the
  // 270x69 default. Re-enabled afterwards so step-to-step resizes still animate smoothly.
  const [settling, setSettling] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setSettling(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{ width, height, borderRadius: cornerRadius }}
        className={`relative overflow-hidden bg-[rgba(8,14,38,0.85)]
          backdrop-blur-md backdrop-saturate-[1.4]
          shadow-[0_24px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)]
          ${fallbackClassName}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={`relative lg-surface ${settling ? 'lg-settling' : ''}`} style={{ width, height }}>
      <RawLiquidGlass
        mouseContainer={mouseContainer}
        displacementScale={60}
        blurAmount={0.05}
        saturation={150}
        aberrationIntensity={2.5}
        elasticity={0}
        cornerRadius={cornerRadius}
        padding={padding}
        // top/left 50% anchor keeps the content layer aligned with the decorative layers.
        style={{ position: 'absolute', top: '50%', left: '50%' }}
        className={className}
      >
        {children}
      </RawLiquidGlass>
    </div>
  );
}
