const LINKS: { title: string; items: string[] }[] = [
  { title: 'Product', items: ['Features', 'Studios', 'Pricing', 'Changelog'] },
  { title: 'Company', items: ['About', 'Careers', 'Contact'] },
  { title: 'Resources', items: ['Docs', 'Blog', 'Community'] },
];

function Social({ d }: { d: string }) {
  return (
    <a href="#" className="grid place-items-center w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] text-white/55 hover:text-white hover:border-white/25 transition-colors">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
    </a>
  );
}

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#020818]">
      {/* ---- glowing horizon arc ---- */}
      <div className="relative h-[300px] sm:h-[420px] overflow-hidden">
        {/* stars */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(1.5px 1.5px at 12% 30%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 28% 55%, rgba(255,255,255,0.5), transparent), radial-gradient(1.5px 1.5px at 45% 22%, rgba(255,255,255,0.65), transparent), radial-gradient(1px 1px at 63% 48%, rgba(255,255,255,0.5), transparent), radial-gradient(1.5px 1.5px at 78% 28%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 88% 60%, rgba(255,255,255,0.45), transparent), radial-gradient(1px 1px at 52% 64%, rgba(255,255,255,0.4), transparent)',
          }}
        />
        {/* atmosphere glow above the horizon */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[34%] w-[130%] h-[260px] pointer-events-none"
          style={{ background: 'radial-gradient(50% 100% at 50% 100%, rgba(90,140,255,0.45), rgba(90,140,255,0.12) 45%, transparent 72%)', filter: 'blur(34px)' }}
        />
        {/* planet — only its glowing top arc shows */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: '280vw',
            height: '280vw',
            top: '40%',
            background: 'radial-gradient(circle at 50% 0%, #0b1844 0%, #060c22 28%, #03060f 55%)',
            boxShadow: 'inset 0 5px 34px rgba(150,185,255,0.5), inset 0 1px 0 1px rgba(205,225,255,0.85), 0 -6px 70px rgba(80,135,255,0.35)',
          }}
        />
        {/* bottom-of-screen fade into footer body */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#020818]" />
      </div>

      {/* ---- footer content ---- */}
      <div className="relative z-10 px-6 pt-10 pb-10 border-t border-white/[0.06]">
        <div className="max-w-[1140px] mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between gap-12">
            {/* brand */}
            <div className="max-w-[300px]">
              <div className="flex items-center gap-2.5">
                <span className="text-[17px] font-semibold text-white tracking-tight">DoZero</span>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-white/40 font-light">
                Describe an idea — DoZero assembles and runs the AI company that builds it, end to end.
              </p>
              <div className="mt-5 flex gap-2.5">
                <Social d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                <Social d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.42.36.79 1.08.79 2.18v3.23c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
                <Social d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </div>
            </div>

            {/* link columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-14">
              {LINKS.map((col) => (
                <div key={col.title}>
                  <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/35">{col.title}</div>
                  <ul className="mt-4 space-y-2.5">
                    {col.items.map((item) => (
                      <li key={item}>
                        <a href="#" className="text-[13px] text-white/55 hover:text-white transition-colors">{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-[12px] text-white/35">© 2026 DoZero. All rights reserved.</span>
            <div className="flex gap-6 text-[12px] text-white/35">
              <a href="#" className="hover:text-white/70 transition-colors">Privacy</a>
              <a href="#" className="hover:text-white/70 transition-colors">Terms</a>
              <a href="#" className="hover:text-white/70 transition-colors">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
