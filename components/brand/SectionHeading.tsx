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
    <div className={`relative ${className}`}>
      <div className="amplify-edge mb-3 h-1 w-16" />
      <h2 className="font-display text-3xl font-black uppercase tracking-[0.06em] text-cream sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm uppercase tracking-[0.15em] text-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}
