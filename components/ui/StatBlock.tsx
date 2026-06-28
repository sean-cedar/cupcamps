type StatBlockProps = {
  value: string | number;
  label: string;
  className?: string;
};

export function StatBlock({ value, label, className = "" }: StatBlockProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="font-display text-5xl leading-none text-gold sm:text-6xl">
        {value}
      </span>
      <span className="mt-1 text-sm uppercase tracking-widest text-muted">
        {label}
      </span>
    </div>
  );
}
