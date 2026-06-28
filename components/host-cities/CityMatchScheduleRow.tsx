"use client";

import Link from "next/link";
import { useState } from "react";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { MatchHighlightsPanel } from "@/components/teams/MatchHighlightsPanel";
import {
  formatFixtureScore,
  formatMatchDate,
  getOpponentDisplay,
  getStageLabel,
} from "@/lib/schedule";
import type { CityMatch } from "@/lib/schedule/types";

type CityMatchScheduleRowProps = {
  match: CityMatch;
};

function TeamLink({
  slug,
  label,
  countryCode,
}: {
  slug: string | null;
  label: string;
  countryCode: string | null;
}) {
  if (slug && countryCode) {
    return (
      <Link
        href={`/teams/${slug}`}
        className="flex min-w-0 items-center gap-2 text-cream hover:text-gold-light"
      >
        <CountryFlag countryCode={countryCode} className="text-base" />
        <span className="truncate font-medium">{label}</span>
      </Link>
    );
  }

  return <span className="truncate text-sm text-muted">{label}</span>;
}

export function CityMatchScheduleRow({ match }: CityMatchScheduleRowProps) {
  const [expanded, setExpanded] = useState(false);
  const home = getOpponentDisplay(match.homeSlug);
  const away = getOpponentDisplay(match.awaySlug);
  const score = formatFixtureScore(match);
  const canShowHighlights = match.isPlayed;

  return (
    <>
      <div
        className={`grid gap-3 border-b border-card-border px-4 py-3 last:border-b-0 sm:grid-cols-[7rem_6rem_1fr_auto] sm:items-center ${
          canShowHighlights ? "cursor-pointer hover:bg-card/40" : ""
        }`}
        role={canShowHighlights ? "button" : undefined}
        tabIndex={canShowHighlights ? 0 : undefined}
        aria-expanded={canShowHighlights ? expanded : undefined}
        onClick={
          canShowHighlights
            ? () => setExpanded((value) => !value)
            : undefined
        }
        onKeyDown={
          canShowHighlights
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setExpanded((value) => !value);
                }
              }
            : undefined
        }
      >
        <div>
          <p className="text-xs font-medium text-cream">
            {formatMatchDate(match.date)}
          </p>
          {match.matchday && (
            <p className="text-[10px] uppercase tracking-wider text-muted">
              MD {match.matchday}
            </p>
          )}
        </div>

        <div>
          <span className="font-display text-[10px] font-bold uppercase tracking-wider text-gold">
            {match.group ? `Group ${match.group}` : getStageLabel(match.stage)}
          </span>
          <p className="text-[10px] text-muted">Match {match.matchNumber}</p>
        </div>

        <div className="min-w-0 space-y-1">
          <div
            className="flex min-w-0 items-center gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            <TeamLink
              slug={home.slug}
              label={home.label}
              countryCode={home.countryCode}
            />
          </div>
          <div
            className="flex min-w-0 items-center gap-2 pl-4"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted">
              vs
            </span>
            <TeamLink
              slug={away.slug}
              label={away.label}
              countryCode={away.countryCode}
            />
          </div>
          <p className="hidden text-xs text-muted sm:block">{match.stadium}</p>
          {canShowHighlights && (
            <span className="text-[10px] uppercase tracking-wider text-gold">
              {expanded ? "Hide highlights" : "Highlights"}
            </span>
          )}
        </div>

        <div className="flex items-center justify-end sm:flex-col sm:items-end">
          {score ? (
            <span className="font-display text-lg font-black text-cream">
              {score}
            </span>
          ) : (
            <span className="text-xs uppercase tracking-wider text-muted">
              TBD
            </span>
          )}
        </div>
      </div>

      {canShowHighlights && (
        <MatchHighlightsPanel matchNumber={match.matchNumber} open={expanded} />
      )}
    </>
  );
}
