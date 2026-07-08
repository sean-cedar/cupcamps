"use client";

import { useLiveMatchScores } from "@/components/live/LiveScoresProvider";

type MatchLiveScoreProps = {
  matchNumber: number;
  initialHomeScore: number | null;
  initialAwayScore: number | null;
  initialIsPlayed: boolean;
};

export function MatchLiveScore({
  matchNumber,
  initialHomeScore,
  initialAwayScore,
  initialIsPlayed,
}: MatchLiveScoreProps) {
  const live = useLiveMatchScores(matchNumber);

  const homeScore = live?.homeScore ?? initialHomeScore;
  const awayScore = live?.awayScore ?? initialAwayScore;
  const isPlayed =
    live?.isFinal ?? (initialIsPlayed && homeScore !== null && awayScore !== null);
  const isLive = live?.isLive ?? false;

  if (!isPlayed && !isLive) {
    return null;
  }

  const scoreLabel =
    homeScore !== null && awayScore !== null
      ? `${homeScore}–${awayScore}`
      : null;

  if (!scoreLabel) {
    return (
      <div className="text-right">
        <span className="inline-flex items-center rounded bg-red-600/20 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-red-300 ring-1 ring-red-500/40">
          {live?.statusLabel ?? "Live"}
        </span>
      </div>
    );
  }

  return (
    <div className="text-right">
      {isLive && (
        <p className="mb-1 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-red-300">
          {live?.statusLabel ?? "Live"}
        </p>
      )}
      <p className="font-display text-4xl font-black tabular-nums text-cream sm:text-5xl lg:text-6xl">
        {scoreLabel}
      </p>
    </div>
  );
}

type MatchLiveStatusProps = {
  matchNumber: number;
  initialIsPlayed: boolean;
};

export function MatchLiveStatus({
  matchNumber,
  initialIsPlayed,
}: MatchLiveStatusProps) {
  const live = useLiveMatchScores(matchNumber);
  const isLive = live?.isLive ?? false;
  const isPlayed = live?.isFinal ?? initialIsPlayed;

  let label = "Scheduled";
  if (isLive) {
    label = live?.statusLabel ?? "Live";
  } else if (isPlayed) {
    label = "Full time";
  }

  return (
    <p className="mt-1 font-display text-lg font-black text-cream">{label}</p>
  );
}

type MatchLiveGoalStatsProps = {
  matchNumber: number;
  initialHomeScore: number | null;
  initialAwayScore: number | null;
  initialIsPlayed: boolean;
  homeLabel: string;
  awayLabel: string;
};

export function MatchLiveGoalStats({
  matchNumber,
  initialHomeScore,
  initialAwayScore,
  initialIsPlayed,
  homeLabel,
  awayLabel,
}: MatchLiveGoalStatsProps) {
  const live = useLiveMatchScores(matchNumber);
  const homeScore = live?.homeScore ?? initialHomeScore;
  const awayScore = live?.awayScore ?? initialAwayScore;
  const isPlayed =
    live?.isFinal ?? (initialIsPlayed && homeScore !== null && awayScore !== null);

  if (!isPlayed || homeScore === null || awayScore === null) {
    return null;
  }

  return (
    <>
      <div className="wc26-panel p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted">
          {homeLabel} goals
        </p>
        <p className="mt-1 font-display text-lg font-black text-cream">
          {homeScore}
        </p>
      </div>
      <div className="wc26-panel p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted">
          {awayLabel} goals
        </p>
        <p className="mt-1 font-display text-lg font-black text-cream">
          {awayScore}
        </p>
      </div>
    </>
  );
}
