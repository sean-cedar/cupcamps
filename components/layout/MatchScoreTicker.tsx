"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLiveScores } from "@/components/live/LiveScoresProvider";
import { getOpponentDisplay } from "@/lib/schedule";
import type { TournamentScheduleMatch } from "@/lib/schedule/tournament-schedule";

const FIFA_TICKER_CODES: Record<string, string> = {
  "united-states": "USA",
  "korea-republic": "KOR",
  "south-africa": "RSA",
  "ivory-coast": "CIV",
  "congo-dr": "COD",
  "bosnia-and-herzegovina": "BIH",
  "cabo-verde": "CPV",
  "saudi-arabia": "KSA",
  "costa-rica": "CRC",
  "new-zealand": "NZL",
};

function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shortTeamLabel(
  display: ReturnType<typeof getOpponentDisplay>,
): string {
  if (display.slug) {
    const fifaCode = FIFA_TICKER_CODES[display.slug];
    if (fifaCode) {
      return fifaCode;
    }
  }

  if (display.countryCode) {
    return display.countryCode.toUpperCase();
  }

  if (
    display.label.startsWith("Winner") ||
    display.label.startsWith("Loser")
  ) {
    return "TBD";
  }

  return display.label.slice(0, 3).toUpperCase();
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
    const todayKey = getLocalDateKey();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = getLocalDateKey(tomorrow);

    const todayLive = schedule.filter(
      (match) => match.date === todayKey && match.isLive,
    );
    const todayCompleted = schedule.filter(
      (match) =>
        match.date === todayKey && match.isPlayed && !match.isLive,
    );
    const tomorrowScheduled = schedule.filter(
      (match) =>
        match.date === tomorrowKey && !match.isPlayed && !match.isLive,
    );

    const seen = new Set<number>();
    const ordered: TournamentScheduleMatch[] = [];

    for (const match of [
      ...todayLive,
      ...todayCompleted,
      ...tomorrowScheduled,
    ]) {
      if (seen.has(match.matchNumber)) {
        continue;
      }
      seen.add(match.matchNumber);
      ordered.push(match);
    }

    return ordered;
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
                {feedError ?? "No matches today or tomorrow"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
