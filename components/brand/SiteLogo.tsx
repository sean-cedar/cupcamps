type SiteLogoProps = {
  className?: string;
};

/** Compact site wordmark — used in header and footer. */
export function SiteLogo({ className = "" }: SiteLogoProps) {
  return (
    <div className={`min-w-0 leading-none ${className}`}>
      <p className="truncate font-display text-xl font-black uppercase tracking-[0.04em] text-cream sm:text-2xl">
        Cup<span className="text-gold">Camps</span>
      </p>
      <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-muted sm:text-[11px]">
        World Cup 26 · Base Camps
      </p>
    </div>
  );
}
