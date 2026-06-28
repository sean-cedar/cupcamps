type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeading({
  title,
  subtitle,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <div className="mb-2 h-px w-12 bg-gold" />
      <h2 className="font-display text-2xl font-black uppercase tracking-[0.05em] text-cream sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}
