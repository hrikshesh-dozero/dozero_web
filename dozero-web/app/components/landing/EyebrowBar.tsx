/**
 * EyebrowBar — horizontal rule with a centred mono label.
 * Usage: <EyebrowBar label="DOZERO · DRAFTING TABLE" />
 */
interface EyebrowBarProps {
  label: string;
  className?: string;
}

export default function EyebrowBar({ label, className = "" }: EyebrowBarProps) {
  return (
    <div className={`flex items-center gap-4 w-full ${className}`}>
      <span
        className="h-px flex-1"
        style={{ background: "var(--bp-line)", opacity: 0.5 }}
      />
      <span className="bp-tick text-[10px] tracking-widest whitespace-nowrap">{label}</span>
      <span
        className="h-px flex-1"
        style={{ background: "var(--bp-line)", opacity: 0.5 }}
      />
    </div>
  );
}
