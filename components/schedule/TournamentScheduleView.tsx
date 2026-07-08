"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CityMatchScheduleRow } from "@/components/host-cities/CityMatchScheduleRow";
import { useLiveScores } from "@/components/live/LiveScoresProvider";
import {
  buildScheduleStatuses,
  getScheduleAnchorMatchNumber,
  type ScheduleMatchStatus,
  type TournamentScheduleGroup,
} from "@/lib/schedule/tournament-schedule";

type TournamentScheduleViewProps = {
  initialGroups: TournamentScheduleGroup[];
  initialFetchedAt: string | null;
};

const STATUS_LABELS: Record<"live", string> = {
  live: "Live",
};

function formatUpdatedAt(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function ScheduleStatusBadge({
  status,
  liveStatusLabel,
}: {
  status: ScheduleMatchStatus;
  liveStatusLabel?: string | null;
}) {
  if (status !== "live") {
    return null;
  }

  const label = liveStatusLabel ?? STATUS_LABELS.live;

  return (
    <span className="inline-flex shrink-0 items-center rounded bg-red-600/20 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-red-300 ring-1 ring-red-500/40">
      {label}
    </span>
  );
}

export function TournamentScheduleView({
  initialGroups,
  initialFetchedAt,
}: TournamentScheduleViewProps) {
  const { groups: liveGroups, fetchedAt: liveFetchedAt, feedError } =
    useLiveScores();
  const anchorScrolledRef = useRef(false);
  const groups = liveGroups ?? initialGroups;
  const fetchedAt = liveFetchedAt ?? initialFetchedAt;
  const [statuses, setStatuses] = useState<Map<number, ScheduleMatchStatus>>(
    () => new Map(),
  );
  const [showJumpToNow, setShowJumpToNow] = useState(false);

  const flatMatches = useMemo(
    () => groups.flatMap((group) => group.matches),
    [groups],
  );

  const syncStatuses = useCallback(() => {
    setStatuses(buildScheduleStatuses(flatMatches));
  }, [flatMatches]);

  useEffect(() => {
    syncStatuses();
    const interval = window.setInterval(syncStatuses, 60_000);
    return () => window.clearInterval(interval);
  }, [syncStatuses]);

  const scrollToAnchor = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const anchorMatchNumber = getScheduleAnchorMatchNumber(flatMatches);
      const element = document.getElementById(
        `schedule-match-${anchorMatchNumber}`,
      );
      element?.scrollIntoView({ block: "center", behavior });
    },
    [flatMatches],
  );

  useEffect(() => {
    if (anchorScrolledRef.current) {
      return;
    }

    anchorScrolledRef.current = true;
    requestAnimationFrame(() => {
      scrollToAnchor("auto");
    });
  }, [scrollToAnchor]);

  useEffect(() => {
    const onScroll = () => {
      const anchorMatchNumber = getScheduleAnchorMatchNumber(flatMatches);
      const anchorElement = document.getElementById(
        `schedule-match-${anchorMatchNumber}`,
      );
      if (!anchorElement) {
        setShowJumpToNow(false);
        return;
      }

      const rect = anchorElement.getBoundingClientRect();
      const chromeHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--site-chrome-height",
        ) || "88",
      );
      const inView =
        rect.top >= chromeHeight &&
        rect.bottom <= window.innerHeight - chromeHeight * 0.25;
      setShowJumpToNow(!inView);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [flatMatches]);

  return (
    <div className="relative">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">
          {fetchedAt ? (
            <>
              Live scores updated{" "}
              <span className="text-cream">{formatUpdatedAt(fetchedAt)}</span>
            </>
          ) : (
            "Loading live scores…"
          )}
        </p>
        {feedError && (
          <p className="text-xs text-red-300">{feedError}</p>
        )}
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.date} aria-label={group.dateLabel}>
            <div className="sticky top-[var(--site-chrome-height,5.5rem)] z-10 -mx-1 mb-3 border-b border-card-border bg-background/95 px-1 py-2 backdrop-blur-sm">
              <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-gold">
                {group.dateLabel}
              </p>
            </div>

            <div className="wc26-panel overflow-hidden">
              {group.matches.map((match) => {
                const status = statuses.get(match.matchNumber) ?? "upcoming";
                const isLive = status === "live";
                const isNext = status === "next";
                const isFocused = isLive || isNext;

                return (
                  <div
                    key={match.matchNumber}
                    id={`schedule-match-${match.matchNumber}`}
                    className={`relative scroll-mt-[calc(var(--site-chrome-height,5.5rem)+4.5rem)] ${
                      isFocused ? (isLive ? "schedule-live-row bg-gold/[0.04]" : "bg-gold/[0.04]") : ""
                    }`}
                  >
                    {isFocused && (
                      <div
                        className={`pointer-events-none absolute inset-y-0 left-0 z-[2] w-1 ${
                          isLive ? "bg-red-500/80" : "bg-gold/70"
                        }`}
                      />
                    )}
                    {isLive && (
                      <div className="pointer-events-none absolute right-3 top-3 z-[2] sm:right-4 sm:top-1/2 sm:-translate-y-1/2">
                        <ScheduleStatusBadge
                          status={status}
                          liveStatusLabel={match.liveStatusLabel}
                        />
                      </div>
                    )}
                    <CityMatchScheduleRow match={match} />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {showJumpToNow && (
        <button
          type="button"
          onClick={() => scrollToAnchor("smooth")}
          className="interaction-press-strong ui-focus-ring fixed bottom-6 right-4 z-[1000] rounded-full border border-gold/40 bg-background/95 px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.12em] text-gold shadow-lg backdrop-blur-sm transition hover:border-gold hover:text-gold-light sm:right-6"
          data-haptic="medium"
        >
          Jump to now
        </button>
      )}
    </div>
  );
}
