"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { LiveMatchUpdate } from "@/lib/espn/match-updates";
import type { BracketRoundView } from "@/lib/schedule/bracket-board";
import type { GroupPageView, GroupSummaryView } from "@/lib/schedule/groups";
import type { LiveSitePayload } from "@/lib/schedule/live-payload";
import type { TournamentScheduleGroup } from "@/lib/schedule/tournament-schedule";

const POLL_INTERVAL_MS = 15_000;
const LIVE_POLL_INTERVAL_MS = 8_000;

type LiveScoresContextValue = {
  fetchedAt: string | null;
  updates: LiveMatchUpdate[];
  updatesByMatch: Map<number, LiveMatchUpdate>;
  groups: TournamentScheduleGroup[] | null;
  groupSummaries: GroupSummaryView[] | null;
  groupPages: Record<string, GroupPageView> | null;
  bracketRounds: BracketRoundView[] | null;
  knockoutProgress: LiveSitePayload["knockoutProgress"] | null;
  playedMatches: number | null;
  liveMatches: number;
  feedError: string | null;
  refresh: () => Promise<void>;
};

const LiveScoresContext = createContext<LiveScoresContextValue | null>(null);

type LiveScoresProviderProps = {
  children: ReactNode;
  initialPayload?: LiveSitePayload | null;
};

export function LiveScoresProvider({
  children,
  initialPayload = null,
}: LiveScoresProviderProps) {
  const [payload, setPayload] = useState<LiveSitePayload | null>(initialPayload);
  const [feedError, setFeedError] = useState<string | null>(null);
  const liveMatchesRef = useRef(initialPayload?.liveMatches ?? 0);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/schedule/live", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Live scores unavailable");
      }

      const nextPayload = (await response.json()) as LiveSitePayload;
      liveMatchesRef.current = nextPayload.liveMatches;
      setPayload(nextPayload);
      setFeedError(null);
    } catch {
      setFeedError("Live scores unavailable");
    }
  }, []);

  useEffect(() => {
    if (!initialPayload) {
      void refresh();
    }
  }, [initialPayload, refresh]);

  useEffect(() => {
    let intervalId = 0;

    const schedulePoll = () => {
      window.clearInterval(intervalId);
      const interval =
        liveMatchesRef.current > 0 ? LIVE_POLL_INTERVAL_MS : POLL_INTERVAL_MS;
      intervalId = window.setInterval(() => {
        void refresh();
      }, interval);
    };

    schedulePoll();

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refresh();
        schedulePoll();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refresh, payload?.liveMatches]);

  const updatesByMatch = useMemo(
    () =>
      new Map(
        (payload?.updates ?? []).map((update) => [update.matchNumber, update]),
      ),
    [payload?.updates],
  );

  const value = useMemo<LiveScoresContextValue>(
    () => ({
      fetchedAt: payload?.fetchedAt ?? null,
      updates: payload?.updates ?? [],
      updatesByMatch,
      groups: payload?.groups ?? null,
      groupSummaries: payload?.groupSummaries ?? null,
      groupPages: payload?.groupPages ?? null,
      bracketRounds: payload?.bracketRounds ?? null,
      knockoutProgress: payload?.knockoutProgress ?? null,
      playedMatches: payload?.playedMatches ?? null,
      liveMatches: payload?.liveMatches ?? 0,
      feedError,
      refresh,
    }),
    [payload, updatesByMatch, feedError, refresh],
  );

  return (
    <LiveScoresContext.Provider value={value}>
      {children}
    </LiveScoresContext.Provider>
  );
}

export function useLiveScores(): LiveScoresContextValue {
  const context = useContext(LiveScoresContext);
  if (!context) {
    throw new Error("useLiveScores must be used within LiveScoresProvider");
  }
  return context;
}

export function useLiveMatchUpdate(
  matchNumber: number,
): LiveMatchUpdate | undefined {
  const { updatesByMatch } = useLiveScores();
  return updatesByMatch.get(matchNumber);
}

export function useLiveMatchScores(matchNumber: number): {
  homeScore: number | null;
  awayScore: number | null;
  isLive: boolean;
  isFinal: boolean;
  statusLabel: string | null;
} | null {
  const update = useLiveMatchUpdate(matchNumber);
  if (!update) {
    return null;
  }

  return {
    homeScore: update.homeScore,
    awayScore: update.awayScore,
    isLive: update.isLive,
    isFinal: update.isFinal,
    statusLabel: update.statusLabel,
  };
}
