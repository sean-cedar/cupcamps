import Link from "next/link";
import { getHostCity } from "@/lib/teams";

type MatchLocationLinkProps = {
  hostCitySlug: string;
  stadium?: string;
  variant?: "inline" | "panel";
  className?: string;
};

export function MatchLocationLink({
  hostCitySlug,
  stadium,
  variant = "inline",
  className,
}: MatchLocationLinkProps) {
  const city = getHostCity(hostCitySlug);
  if (!city) {
    return null;
  }

  const href = `/host-cities/${hostCitySlug}`;

  if (variant === "panel") {
    return (
      <Link
        href={href}
        className={`group block transition ${className ?? ""}`}
      >
        {stadium && (
          <p className="font-display text-xl font-black uppercase tracking-[0.04em] text-cream group-hover:text-gold-light">
            {stadium}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-cream group-hover:text-gold-light">
            <span
              className="h-2.5 w-2.5 shrink-0"
              style={{ backgroundColor: city.accentColor }}
            />
            {city.name}
          </span>
          <span className="text-sm text-muted">{city.country}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex min-w-0 flex-col gap-0.5 text-left transition hover:text-gold-light ${className ?? ""}`}
    >
      {stadium && (
        <span className="truncate text-xs text-muted group-hover:text-gold-light/90">
          {stadium}
        </span>
      )}
      <span className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-cream">
        <span
          className="h-2 w-2 shrink-0"
          style={{ backgroundColor: city.accentColor }}
        />
        {city.name}
      </span>
    </Link>
  );
}
