export default function FloatingAssets() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* TOP-RIGHT: Ruler (moved slightly towards middle) */}
      <div
        className="bp-float absolute right-[12%] top-[14%] hidden md:block"
        style={{ "--bp-rot": "-15deg" } as React.CSSProperties}
      >
        <svg width="260" height="32" viewBox="0 0 260 32" fill="none">
          <g stroke="var(--bp-ink)" strokeWidth="1" fill="none" opacity="0.7">
            <rect x="2" y="6" width="256" height="20" className="bp-draw-in" style={{ "--bp-dash": "550" } as React.CSSProperties} />
            {[...Array(26)].map((_, i) => (
              <line key={i} x1={2 + i * 10} y1="6" x2={2 + i * 10} y2={i % 5 === 0 ? 22 : i % 2 === 0 ? 16 : 12} />
            ))}
          </g>
        </svg>
      </div>

      {/* LEFT EDGE, MID: Compass */}
      <div
        className="bp-float-slow absolute left-[2%] top-[35%] hidden md:block"
        style={{ "--bp-rot": "6deg" } as React.CSSProperties}
      >
        <svg width="140" height="160" viewBox="0 0 140 160" fill="none">
          <g stroke="var(--bp-ink)" strokeWidth="1.2" fill="none" opacity="0.75">
            <circle cx="70" cy="22" r="8" className="bp-draw-in" style={{ "--bp-dash": "60" } as React.CSSProperties} />
            <line x1="70" y1="30" x2="35" y2="140" className="bp-draw-in" style={{ "--bp-dash": "120" } as React.CSSProperties} />
            <line x1="70" y1="30" x2="105" y2="140" className="bp-draw-in" style={{ "--bp-dash": "120" } as React.CSSProperties} />
            <path d="M 35 140 Q 70 120, 105 140" className="bp-draw-in" style={{ "--bp-dash": "90" } as React.CSSProperties} />
            <circle cx="35" cy="140" r="3" fill="var(--bp-ink)" />
            <circle cx="105" cy="140" r="3" fill="var(--bp-accent-bright)" />
          </g>
          <text x="70" y="155" textAnchor="middle" fill="var(--bp-ink)" opacity="0.6" style={{ fontFamily: "JetBrains Mono", fontSize: 8, letterSpacing: "0.2em" }}>
            R = ∞
          </text>
        </svg>
      </div>

      {/* RIGHT EDGE, MID: Protractor */}
      <div
        className="bp-float absolute right-[1%] top-[40%] hidden lg:block"
        style={{ "--bp-rot": "-5deg" } as React.CSSProperties}
      >
        <svg width="180" height="110" viewBox="0 0 180 110" fill="none">
          <g stroke="var(--bp-ink)" strokeWidth="1.1" fill="none" opacity="0.7">
            <path d="M 10 100 A 80 80 0 0 1 170 100 Z" className="bp-draw-in" style={{ "--bp-dash": "320" } as React.CSSProperties} />
            <line x1="10" y1="100" x2="170" y2="100" />
            {[...Array(19)].map((_, i) => {
              const angle = (i * 10 * Math.PI) / 180;
              const x1 = 90 + Math.cos(Math.PI - angle) * 80;
              const y1 = 100 - Math.sin(Math.PI - angle) * 80;
              const r2 = i % 3 === 0 ? 72 : 76;
              const x2 = 90 + Math.cos(Math.PI - angle) * r2;
              const y2 = 100 - Math.sin(Math.PI - angle) * r2;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
          <text x="90" y="115" textAnchor="middle" fill="var(--bp-ink)" opacity="0.6" style={{ fontFamily: "JetBrains Mono", fontSize: 8, letterSpacing: "0.2em" }}>
            180° · FULL ARC
          </text>
        </svg>
      </div>

      {/* BOTTOM-LEFT: IsoCube */}
      <div
        className="bp-float-slow absolute bottom-[15%] left-[5%] hidden lg:block"
        style={{ "--bp-rot": "8deg" } as React.CSSProperties}
      >
        <svg width="140" height="160" viewBox="0 0 140 160" fill="none">
          <g stroke="var(--bp-ink)" strokeWidth="1.1" fill="none" opacity="0.75">
            <polygon points="70,20 125,50 125,110 70,140 15,110 15,50" className="bp-draw-in" style={{ "--bp-dash": "420" } as React.CSSProperties} />
            <line x1="70" y1="20" x2="70" y2="80" />
            <line x1="15" y1="50" x2="70" y2="80" />
            <line x1="125" y1="50" x2="70" y2="80" />
            <line x1="70" y1="80" x2="70" y2="140" />
          </g>
          <text x="70" y="155" textAnchor="middle" fill="var(--bp-ink)" opacity="0.7" style={{ fontFamily: "JetBrains Mono", fontSize: 8, letterSpacing: "0.2em" }}>
            UNIT · 1 × 1 × 1
          </text>
        </svg>
      </div>

      {/* BOTTOM-RIGHT: Node diagram */}
      <div
        className="bp-float-slow absolute bottom-[10%] right-[5%] hidden lg:block"
        style={{ "--bp-rot": "0deg" } as React.CSSProperties}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <g stroke="var(--bp-ink)" strokeWidth="1.1" fill="none" opacity="0.75">
            <circle cx="60" cy="60" r="50" strokeDasharray="4 4" />
            <circle cx="60" cy="60" r="30" className="bp-draw-in" style={{ "--bp-dash": "200" } as React.CSSProperties} />
            <circle cx="60" cy="60" r="10" fill="var(--bp-accent-bright)" fillOpacity="0.4" />
            <line x1="10" y1="60" x2="110" y2="60" />
            <line x1="60" y1="10" x2="60" y2="110" />
            <circle cx="60" cy="10" r="3" fill="var(--bp-accent-bright)" />
            <circle cx="110" cy="60" r="3" fill="var(--bp-accent-bright)" />
          </g>
          <text x="60" y="64" textAnchor="middle" fill="var(--bp-ink)" opacity="0.7" style={{ fontFamily: "JetBrains Mono", fontSize: 7, letterSpacing: "0.18em" }}>
            NODE · 00.01
          </text>
        </svg>
      </div>
    </div>
  );
}
