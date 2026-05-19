interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: "div" | "button";
}

export default function GlassCard({
  children,
  className = "",
  onClick,
  as: Tag = "div",
}: GlassCardProps) {
  return (
    <Tag
      onClick={onClick}
      className={`glass-card relative overflow-hidden rounded-none ${className}`}
    >
      {/* Subtle inner shine line */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(159,210,255,0.2)] to-transparent"
        aria-hidden
      />
      {children}
    </Tag>
  );
}
