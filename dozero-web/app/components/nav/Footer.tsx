/**
 * Footer — Blueprint drawing title block status bar.
 */
export default function Footer() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <footer
      className="blueprint-layer relative w-full px-6 py-4 z-30"
      style={{
        borderTop: "1px solid rgba(47,111,184,0.30)",
        background: "rgba(4,16,31,0.72)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        {/* Live indicator */}
        <div className="flex items-center gap-3">
          <span
            className="bp-blink inline-block h-2 w-2 rounded-full"
            style={{ background: "var(--bp-accent-bright)" }}
            aria-hidden
          />
          <p className="bp-tick text-[10px]">LIVE · DRAFT SESSION</p>
        </div>

        {/* Sheet metadata */}
        <div className="flex flex-wrap items-center gap-6">
          <p className="bp-tick opacity-60 text-[9px]">DRAWN BY · DOZERO</p>
          <p className="bp-tick opacity-60 text-[9px]">CHECKED · AI TEAM</p>
          <p className="bp-tick opacity-60 text-[9px]">DATE · {today}</p>
          <p className="bp-tick text-[9px]" style={{ color: "var(--bp-ink)" }}>
            VER · 1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}
