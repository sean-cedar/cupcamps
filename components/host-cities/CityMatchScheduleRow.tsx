"use client";

import Link from "next/link";
import { useMemo } from "react";
import { MatchLocationLink } from "@/components/host-cities/MatchLocationLink";
import { useLiveMatchScores, useLiveScores } from "@/components/live/LiveScoresProvider";
import { ScheduleMatchCard } from "@/components/schedule/ScheduleMatchCard";
import { MatchupTeams } from "@/components/ui/MatchupTeams";
import {
  formatMatchSchedule,
  getOpponentDisplay,
  getStageLabel,
} from "@/lib/schedule";
import type { CityMatch } from "@/lib/schedule/types";

type CityMatchScheduleRowProps = {
  match: CityMatch;
};

export function CityMatchScheduleRow({ match }: CityMatchScheduleRowProps) {
  const live = useLiveMatchScores(match.matchNumber);
  const { groups } = useLiveScores();

  const displayMatch = useMemo(() => {
    const liveRow = groups
      ?.flatMap((group) => group.matches)
      .find((row) => row.matchNumber === match.matchNumber);

    if (!liveRow) {
      return match;
    }

    return {
      ...match,
      homeSlug: liveRow.homeSlug,
      awaySlug: liveRow.awaySlug,
      homeScore: liveRow.homeScore ?? match.homeScore,
      awayScore: liveRow.awayScore ?? match.awayScore,
      isPlayed: liveRow.isPlayed,
    };
  }, [groups, match]);

  const homeScore = live?.homeScore ?? displayMatch.homeScore;
  const awayScore = live?.awayScore ?? displayMatch.awayScore;
  const isLive = live?.isLive ?? false;

  const home = getOpponentDisplay(displayMatch.homeSlug);
  const away = getOpponentDisplay(displayMatch.awaySlug);

  return (
    <>
      <ScheduleMatchCard
        matchNumber={displayMatch.matchNumber}
        date={displayMatch.date}
        matchday={displayMatch.matchday}
        group={displayMatch.group}
        stage={displayMatch.stage}
        stadium={displayMatch.stadium}
        hostCitySlug={displayMatch.hostCitySlug}
        home={home}
        away={away}
        homeScore={homeScore}
        awayScore={awayScore}
        hideStadium
      />

      <div className="relative hidden gap-3 border-b border-card-border px-4 py-3 last:border-b-0 hover:bg-card/40 sm:grid sm:grid-cols-[7rem_6rem_minmax(0,1fr)_9rem] sm:items-center">
        <Link
          href={`/matches/${displayMatch.matchNumber}`}
          className="absolute inset-0 z-0"
          aria-label={`View match ${displayMatch.matchNumber}`}
        />

        <div className="relative z-[1] pointer-events-none">
          <p className="text-xs font-medium text-cream">
            {formatMatchSchedule(
              displayMatch.matchNumber,
              displayMatch.date,
              displayMatch.hostCitySlug,
            )}
          </p>
          {displayMatch.matchday && (
            <p className="text-[10px] uppercase tracking-wider text-muted">
              MD {displayMatch.matchday}
            </p>
          )}
        </div>

        <div className="relative z-[1] pointer-events-none">
          <span className="font-display text-[10px] font-bold uppercase tracking-wider text-gold">
            {displayMatch.group
              ? `Group ${displayMatch.group}`
              : getStageLabel(displayMatch.stage)}
          </span>
          <p className="text-[10px] text-muted">Match {displayMatch.matchNumber}</p>
        </div>

        <div className="relative z-[1] min-w-0 pointer-events-none">
          {isLive && (
            <p className="mb-1 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-red-300">
              {live?.statusLabel ?? "Live"}
            </p>
          )}
          <MatchupTeams
            home={home}
            away={away}
            homeScore={homeScore}
            awayScore={awayScore}
            linkPointerEvents
          />
        </div>

        <div className="relative z-[1] pointer-events-auto">
          <MatchLocationLink
            hostCitySlug={displayMatch.hostCitySlug}
            stadium={displayMatch.stadium}
          />
        </div>
      </div>
    </>
  );
}
