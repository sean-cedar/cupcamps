import Link from "next/link";
import { CountryFlag } from "@/components/ui/CountryFlag";
import {
  championTeamHref,
  getWorldCupTitleCount,
  getWorldCupTitleYears,
} from "@/lib/world-cup/champions";

type WorldCupTitlesProps = {
  teamSlug: string;
  teamName: string;
  size?: "sm" | "md" | "lg";
};

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M6 3h12v2a6 6 0 0 1-4 5.65V14h3v2H9v-2h3v-3.35A6 6 0 0 1 8 5V3zm2 2v.17A4 4 0 0 0 12 9a4 4 0 0 0 2-3.83V5H8zm-4 1h2v1a8 8 0 0 0 2.35 5.65L7.5 16H5a3 3 0 0 1-3-3V6h2zm16 0h2v7a3 3 0 0 1-3 3h-2.5l-.85-4.35A8 8 0 0 0 20 7V6zM7 18h10v3H7v-3z" />
    </svg>
  );
}

export function WorldCupTitles({
  teamSlug,
  teamName,
  size = "md",
}: WorldCupTitlesProps) {
  const titles = getWorldCupTitleCount(teamSlug);
  if (titles === 0) {
    return null;
  }

  const years = getWorldCupTitleYears(teamSlug);
  const sizeClasses =
    size === "lg"
      ? "gap-3 text-base"
      : size === "sm"
        ? "gap-1.5 text-xs"
        : "gap-2 text-sm";

  return (
    <Link
      href={`/champions#${teamSlug}`}
      className={`group inline-flex flex-wrap items-center rounded border border-gold/30 bg-gold/10 px-3 py-2 transition hover:border-gold/50 hover:bg-gold/15 ${sizeClasses}`}
      aria-label={`${teamName} — ${titles} World Cup ${titles === 1 ? "title" : "titles"}`}
    >
      <TrophyIcon className="h-4 w-4 shrink-0 text-gold" />
      <span className="font-display font-bold uppercase tracking-[0.12em] text-gold-light group-hover:text-gold">
        {titles}× champion
      </span>
      <span className="inline-flex items-center gap-0.5 text-gold" aria-hidden="true">
        {Array.from({ length: titles }).map((_, index) => (
          <span key={index} className="text-sm leading-none">
            ★
          </span>
        ))}
      </span>
      <span className="w-full text-[10px] uppercase tracking-wider text-muted">
        {years.join(" · ")}
      </span>
    </Link>
  );
}

export function ChampionStars({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-gold ${className ?? ""}`}
      aria-label={`${count} World Cup titles`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className="text-sm leading-none">
          ★
        </span>
      ))}
    </span>
  );
}

export function ChampionNationIdentity({
  winnerSlug,
  winnerName,
  countryCode,
  titleCount,
  className,
}: {
  winnerSlug: string;
  winnerName: string;
  countryCode: string;
  titleCount?: number;
  className?: string;
}) {
  const titles = titleCount ?? getWorldCupTitleCount(winnerSlug);
  const teamHref = championTeamHref(winnerSlug);
  const inner = (
    <>
      <CountryFlag countryCode={countryCode} className="text-xl" />
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-display font-bold uppercase tracking-wide text-cream">
            {winnerName}
          </span>
          <ChampionStars count={titles} />
        </span>
      </span>
    </>
  );

  if (teamHref) {
    return (
      <Link
        href={teamHref}
        className={`inline-flex items-center gap-3 transition hover:text-gold-light ${className ?? ""}`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      {inner}
    </span>
  );
}
