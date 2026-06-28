import { buildMatchOutcomes, resolveMatch } from "@/lib/schedule/bracket";
import { formatMatchDate } from "@/lib/schedule/index";
import { getMatchKickoffInstant } from "@/lib/schedule/kickoffs";
import { matches } from "@/lib/schedule/matches";
import type { CityMatch, MatchRecord } from "@/lib/schedule/types";

/** Approximate live window: 90 minutes plus stoppage/extra time. */
export const MATCH_LIVE_DURATION_MS = 105 * 60 * 1000;

export type ScheduleMatchStatus = "played" | "live" | "next" | "upcoming";

export type TournamentScheduleMatch = CityMatch & {
  hostCitySlug: string;
  kickoffMs: number | null;
  isLive?: boolean;
  liveStatusLabel?: string | null;
  feedUpdatedAt?: string | null;
};

export type TournamentScheduleGroup = {
  date: string;
  dateLabel: string;
  matches: TournamentScheduleMatch[];
};

function toScheduleMatch(
  match: MatchRecord,
  outcomes: ReturnType<typeof buildMatchOutcomes>,
): TournamentScheduleMatch {
  const resolved = resolveMatch(match.matchNumber, outcomes);
  const kickoff = getMatchKickoffInstant(match.matchNumber);

  return {
    matchNumber: match.matchNumber,
    stage: match.stage,
    date: match.date,
    matchday: match.matchday,
    group: match.group,
    homeSlug: resolved?.resolvedHomeSlug ?? match.homeSlug,
    awaySlug: resolved?.resolvedAwaySlug ?? match.awaySlug,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    stadium: match.stadium,
    hostCitySlug: match.hostCitySlug,
    isPlayed: match.homeScore !== null && match.awayScore !== null,
    kickoffMs: kickoff?.getTime() ?? null,
  };
}

export function getTournamentSchedule(): TournamentScheduleMatch[] {
  const outcomes = buildMatchOutcomes();

  return matches
    .map((match) => toScheduleMatch(match, outcomes))
    .sort((a, b) => {
      if (a.kickoffMs != null && b.kickoffMs != null) {
        return a.kickoffMs - b.kickoffMs || a.matchNumber - b.matchNumber;
      }
      if (a.kickoffMs != null) {
        return -1;
      }
      if (b.kickoffMs != null) {
        return 1;
      }
      return a.date.localeCompare(b.date) || a.matchNumber - b.matchNumber;
    });
}

export function getScheduleAnchorIndex(
  schedule: TournamentScheduleMatch[],
  now = Date.now(),
): number {
  if (schedule.length === 0) {
    return 0;
  }

  const espnLiveIndex = schedule.findIndex((match) => match.isLive);
  if (espnLiveIndex >= 0) {
    return espnLiveIndex;
  }

  const liveIndex = schedule.findIndex(
    (match) =>
      !match.isPlayed &&
      match.kickoffMs != null &&
      match.kickoffMs <= now &&
      now < match.kickoffMs + MATCH_LIVE_DURATION_MS,
  );
  if (liveIndex >= 0) {
    return liveIndex;
  }

  const nextIndex = schedule.findIndex(
    (match) =>
      !match.isPlayed &&
      (match.kickoffMs == null ||
        match.kickoffMs + MATCH_LIVE_DURATION_MS > now),
  );
  if (nextIndex >= 0) {
    return nextIndex;
  }

  return schedule.length - 1;
}

export function getScheduleAnchorMatchNumber(
  schedule: TournamentScheduleMatch[],
  now = Date.now(),
): number {
  const index = getScheduleAnchorIndex(schedule, now);
  return schedule[index]?.matchNumber ?? 1;
}

function isMatchLive(match: TournamentScheduleMatch, now: number): boolean {
  if (match.isLive) {
    return true;
  }

  return (
    !match.isPlayed &&
    match.kickoffMs != null &&
    match.kickoffMs <= now &&
    now < match.kickoffMs + MATCH_LIVE_DURATION_MS
  );
}

export function buildScheduleStatuses(
  schedule: TournamentScheduleMatch[],
  now = Date.now(),
): Map<number, ScheduleMatchStatus> {
  const statuses = new Map<number, ScheduleMatchStatus>();
  const anchorIndex = getScheduleAnchorIndex(schedule, now);
  const anchor = schedule[anchorIndex];
  const anchorKickoff = anchor?.kickoffMs ?? null;
  const anchorIsLive = anchor ? isMatchLive(anchor, now) : false;

  for (const match of schedule) {
    if (match.isPlayed) {
      statuses.set(match.matchNumber, "played");
      continue;
    }

    if (isMatchLive(match, now)) {
      statuses.set(match.matchNumber, "live");
      continue;
    }

    const sharesNextKickoff =
      anchorKickoff != null &&
      match.kickoffMs === anchorKickoff &&
      !anchorIsLive;
    const isAnchorMatch =
      anchor != null && match.matchNumber === anchor.matchNumber && !anchorIsLive;

    if (sharesNextKickoff || isAnchorMatch) {
      statuses.set(match.matchNumber, "next");
      continue;
    }

    statuses.set(match.matchNumber, "upcoming");
  }

  return statuses;
}

export function groupTournamentSchedule(
  schedule: TournamentScheduleMatch[],
): TournamentScheduleGroup[] {
  const groups: TournamentScheduleGroup[] = [];

  for (const match of schedule) {
    const last = groups[groups.length - 1];
    if (last && last.date === match.date) {
      last.matches.push(match);
      continue;
    }

    groups.push({
      date: match.date,
      dateLabel: formatMatchDate(match.date),
      matches: [match],
    });
  }

  return groups;
}

export function getTournamentScheduleView(): {
  groups: TournamentScheduleGroup[];
  totalMatches: number;
  playedMatches: number;
} {
  const schedule = getTournamentSchedule();
  const groups = groupTournamentSchedule(schedule);

  return {
    groups,
    totalMatches: schedule.length,
    playedMatches: schedule.filter((match) => match.isPlayed).length,
  };
}
