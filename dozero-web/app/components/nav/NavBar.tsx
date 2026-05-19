/**
 * NavBar — Blueprint-style top header bar.
 */
export default function NavBar() {
  return (
    <header
      className="blueprint-layer w-full flex items-center justify-between px-6 py-5 z-30"
      style={{
        borderBottom: "1px solid rgba(53,165,255,0.18)",
        background: "rgba(4,16,31,0.60)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {/* Logotype */}
      <span
        className="bp-display text-2xl tracking-[0.1em]"
        style={{ color: "var(--bp-accent-bright)", opacity: 0.95 }}
      >
        DO ZERO AI
      </span>

      <nav className="flex items-center gap-8">
        <a 
          href="#blog" 
          className="bp-mono text-[11px] tracking-widest text-[var(--bp-ink)] opacity-70 hover:opacity-100 hover:text-[var(--bp-accent-bright)] transition-colors"
        >
          BLOG
        </a>
        <a 
          href="#waitlist" 
          className="bp-mono text-[11px] tracking-widest text-[var(--bp-ink)] opacity-70 hover:opacity-100 hover:text-[var(--bp-accent-bright)] transition-colors"
        >
          WAITLIST
        </a>
      </nav>
    </header>
  );
}
