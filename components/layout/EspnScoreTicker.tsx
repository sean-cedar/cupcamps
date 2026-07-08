"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  EspnScoreboardGame,
  EspnScoreboardResponse,
} from "@/lib/espn/types";

const POLL_INTERVAL_MS = 15_000;
const LIVE_POLL_INTERVAL_MS = 8_000;

function ScorePill({ game }: { game: EspnScoreboardGame }) {
  const scoreLabel =
    game.home.score !== null && game.away.score !== null
      ? `${game.home.abbreviation} ${game.home.score}–${game.away.score} ${game.away.abbreviation}`
      : `${game.home.abbreviation} vs ${game.away.abbreviation}`;

  return (
    <Link
      href={game.espnUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`espn-ticker-item inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 transition hover:border-gold/40 hover:bg-gold/5 ${
        game.isLive
          ? "border-red-500/40 bg-red-500/10"
          : "border-card-border bg-card/50"
      }`}
    >
      {game.isLive && (
        <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
      )}
      <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-cream">
        {scoreLabel}
      </span>
      <span className="text-[10px] text-muted">{game.statusLabel}</span>
    </Link>
  );
}

export function EspnScoreTicker() {
  const [scoreboard, setScoreboard] = useState<EspnScoreboardResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const liveGamesRef = useRef(0);

  const loadScoreboard = useCallback(async () => {
    try {
      const response = await fetch("/api/espn/scoreboard", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Scoreboard unavailable");
      }

      const payload = (await response.json()) as EspnScoreboardResponse;
      liveGamesRef.current = payload.liveGames.length;
      setScoreboard(payload);
      setError(null);
    } catch {
      setError("Scores unavailable");
    }
  }, []);

  useEffect(() => {
    void loadScoreboard();
  }, [loadScoreboard]);

  useEffect(() => {
    let intervalId = 0;

    const schedulePoll = () => {
      window.clearInterval(intervalId);
      const interval =
        liveGamesRef.current > 0 ? LIVE_POLL_INTERVAL_MS : POLL_INTERVAL_MS;
      intervalId = window.setInterval(() => {
        void loadScoreboard();
      }, interval);
    };

    schedulePoll();

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadScoreboard();
        schedulePoll();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [loadScoreboard, scoreboard?.liveGames.length]);

  const tickerGames = useMemo(() => {
    if (!scoreboard) {
      return [];
    }

    const seen = new Set<string>();
    const ordered: EspnScoreboardGame[] = [];

    for (const game of [
      ...scoreboard.liveGames,
      ...scoreboard.recentGames,
      ...scoreboard.upcomingGames,
    ]) {
      if (seen.has(game.id)) {
        continue;
      }
      seen.add(game.id);
      ordered.push(game);
    }

    return ordered;
  }, [scoreboard]);

  return (
    <div className="border-b border-card-border bg-background/95">
      <div className="site-shell-inline mx-auto flex max-w-7xl items-center gap-3 py-2 sm:px-6">
        <Link
          href="https://www.espn.com/soccer/league/_/name/fifa.world"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded border border-card-border bg-card/60 px-2 py-1 font-display text-[10px] font-black uppercase tracking-[0.16em] text-gold transition hover:border-gold/40"
          aria-label="ESPN FIFA World Cup scoreboard"
        >
          <span className="text-[11px] font-black text-cream">ESPN</span>
        </Link>

        <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-2 pr-2">
            {tickerGames.length > 0 ? (
              tickerGames.map((game) => <ScorePill key={game.id} game={game} />)
            ) : (
              <span className="text-xs text-muted">
                {error ?? "Loading World Cup scores…"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
