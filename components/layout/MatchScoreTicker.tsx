"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLiveScores } from "@/components/live/LiveScoresProvider";
import { getOpponentDisplay } from "@/lib/schedule";
import type { TournamentScheduleMatch } from "@/lib/schedule/tournament-schedule";

function shortTeamLabel(
  display: ReturnType<typeof getOpponentDisplay>,
): string {
  if (display.countryCode) {
    return display.countryCode;
  }

  if (display.label.length <= 4) {
    return display.label.toUpperCase();
  }

  return display.label
    .split(/\s+/)
    .map((word) => word[0] ?? "")
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function ScorePill({ match }: { match: TournamentScheduleMatch }) {
  const home = getOpponentDisplay(match.homeSlug);
  const away = getOpponentDisplay(match.awaySlug);
  const homeAbbr = shortTeamLabel(home);
  const awayAbbr = shortTeamLabel(away);

  const scoreLabel =
    match.homeScore !== null && match.awayScore !== null
      ? `${homeAbbr} ${match.homeScore}–${match.awayScore} ${awayAbbr}`
      : `${homeAbbr} vs ${awayAbbr}`;

  const statusLabel = match.isLive
    ? (match.liveStatusLabel ?? "Live")
    : match.isPlayed
      ? "FT"
      : "Upcoming";

  return (
    <Link
      href={`/matches/${match.matchNumber}`}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 transition hover:border-gold/40 hover:bg-gold/5 ${
        match.isLive
          ? "border-red-500/40 bg-red-500/10"
          : "border-card-border bg-card/50"
      }`}
    >
      {match.isLive && (
        <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
      )}
      <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-cream">
        {scoreLabel}
      </span>
      <span className="text-[10px] text-muted">{statusLabel}</span>
    </Link>
  );
}

export function MatchScoreTicker() {
  const { groups, feedError } = useLiveScores();

  const tickerMatches = useMemo(() => {
    if (!groups) {
      return [];
    }

    const schedule = groups.flatMap((group) => group.matches);
    const seen = new Set<number>();
    const ordered: TournamentScheduleMatch[] = [];

    for (const match of [
      ...schedule.filter((item) => item.isLive),
      ...schedule.filter((item) => item.isPlayed && !item.isLive).reverse(),
      ...schedule.filter((item) => !item.isPlayed && !item.isLive),
    ]) {
      if (seen.has(match.matchNumber)) {
        continue;
      }
      seen.add(match.matchNumber);
      ordered.push(match);
    }

    return ordered.slice(0, 16);
  }, [groups]);

  return (
    <div className="border-b border-card-border bg-background/95">
      <div className="site-shell-inline mx-auto flex max-w-7xl items-center py-2 sm:px-6">
        <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-2 pr-2">
            {tickerMatches.length > 0 ? (
              tickerMatches.map((match) => (
                <ScorePill key={match.matchNumber} match={match} />
              ))
            ) : (
              <span className="text-xs text-muted">
                {feedError ?? "Loading World Cup scores…"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
