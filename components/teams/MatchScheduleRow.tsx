"use client";

import { useState } from "react";
import { HostCityLink } from "@/components/host-cities/HostCityCard";
import { TeamIdentity } from "@/components/ui/TeamIdentity";
import { MatchHighlightsPanel } from "@/components/teams/MatchHighlightsPanel";
import {
  formatMatchDate,
  formatScore,
  getOpponentDisplay,
  getStageLabel,
} from "@/lib/schedule";
import type { TeamMatch } from "@/lib/schedule/types";

type MatchScheduleRowProps = {
  match: TeamMatch;
};

export function MatchScheduleRow({ match }: MatchScheduleRowProps) {
  const [expanded, setExpanded] = useState(false);
  const opponent = getOpponentDisplay(match.opponentSlug);
  const score = formatScore(match);
  const canShowHighlights = match.isPlayed;

  return (
    <>
      <div
        className={`grid gap-3 border-b border-card-border px-4 py-3 last:border-b-0 sm:grid-cols-[7rem_6rem_1fr_auto] sm:items-center ${
          match.isElimination ? "bg-red-950/20" : ""
        } ${canShowHighlights ? "cursor-pointer hover:bg-card/40" : ""}`}
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded border border-card-border bg-card/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              {match.isHome ? "Home" : "Away"}
            </span>
          </div>
          <TeamIdentity
            teamSlug={opponent.slug}
            label={opponent.label}
            countryCode={opponent.countryCode}
            kitSize="sm"
            onClick={(event) => event.stopPropagation()}
          />
          <span className="hidden text-xs text-muted sm:inline">
            {match.stadium}
          </span>
          {canShowHighlights && (
            <span className="text-[10px] uppercase tracking-wider text-gold">
              {expanded ? "Hide highlights" : "Highlights"}
            </span>
          )}
        </div>

        <div
          className="flex items-center justify-between gap-3 sm:flex-col sm:items-end"
          onClick={(event) => event.stopPropagation()}
        >
          {score ? (
            <span
              className={`font-display text-lg font-black ${
                match.isElimination ? "text-red-300" : "text-cream"
              }`}
            >
              {score}
            </span>
          ) : (
            <span className="text-xs uppercase tracking-wider text-muted">
              TBD
            </span>
          )}
          <HostCityLink slug={match.hostCitySlug} />
        </div>
      </div>

      {canShowHighlights && (
        <MatchHighlightsPanel matchNumber={match.matchNumber} open={expanded} />
      )}
    </>
  );
}
