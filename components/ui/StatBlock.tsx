type StatBlockProps = {
  value: string | number;
  label: string;
  className?: string;
};

export function StatBlock({ value, label, className = "" }: StatBlockProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="font-display text-5xl font-black leading-none text-gold sm:text-6xl">
        {value}
      </span>
      <span className="mt-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
    </div>
  );
}
