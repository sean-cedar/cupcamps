import { Wc26Mark } from "@/components/brand/Wc26Mark";

type SiteLogoProps = {
  className?: string;
  markSize?: number;
};

/** Compact site wordmark — used in header and footer. */
export function SiteLogo({ className = "", markSize = 34 }: SiteLogoProps) {
  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${className}`}>
      <Wc26Mark size={markSize} />
      <div className="min-w-0 leading-none">
        <p className="truncate font-display text-xl font-black uppercase tracking-[0.04em] text-cream sm:text-2xl">
          Cup<span className="text-gold">Camps</span>
        </p>
        <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-muted sm:text-[11px]">
          World Cup 26 · Base Camps
        </p>
      </div>
    </div>
  );
}
