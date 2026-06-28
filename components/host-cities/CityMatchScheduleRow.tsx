"use client";

import { useState } from "react";
import { MatchupTeams } from "@/components/ui/MatchupTeams";
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

        <div className="min-w-0">
          <MatchupTeams
            home={home}
            away={away}
            onTeamClick={(event) => event.stopPropagation()}
          />
          <p className="mt-1 hidden text-xs text-muted sm:block">{match.stadium}</p>
          {canShowHighlights && (
            <span className="mt-1 inline-block text-[10px] uppercase tracking-wider text-gold">
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
