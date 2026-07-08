import type { LiveMatchUpdate } from "@/lib/schedule/live-updates";
import type {
  TournamentScheduleGroup,
  TournamentScheduleMatch,
} from "@/lib/schedule/tournament-schedule";

export function liveUpdatesToMap(
  updates: LiveMatchUpdate[],
): Map<number, LiveMatchUpdate> {
  return new Map(updates.map((update) => [update.matchNumber, update]));
}

export function applyLiveMatchUpdate(
  match: TournamentScheduleMatch,
  update: LiveMatchUpdate | undefined,
  fetchedAt?: string,
): TournamentScheduleMatch {
  if (!update) {
    return match;
  }

  const homeScore =
    update.homeScore !== null ? update.homeScore : match.homeScore;
  const awayScore =
    update.awayScore !== null ? update.awayScore : match.awayScore;

  return {
    ...match,
    homeScore,
    awayScore,
    homeSlug: update.homeTeamSlug ?? match.homeSlug,
    awaySlug: update.awayTeamSlug ?? match.awaySlug,
    isPlayed: update.isFinal
      ? true
      : update.isLive
        ? false
        : match.isPlayed,
    isLive: update.isLive,
    liveStatusLabel: update.isLive ? update.statusLabel : null,
    feedUpdatedAt: fetchedAt ?? null,
  };
}

export function mergeLiveUpdatesIntoSchedule(
  schedule: TournamentScheduleMatch[],
  updates: LiveMatchUpdate[],
  fetchedAt?: string,
): TournamentScheduleMatch[] {
  const updateMap = liveUpdatesToMap(updates);

  return schedule.map((match) =>
    applyLiveMatchUpdate(match, updateMap.get(match.matchNumber), fetchedAt),
  );
}

export function mergeLiveUpdatesIntoGroups(
  groups: TournamentScheduleGroup[],
  updates: LiveMatchUpdate[],
  fetchedAt?: string,
): TournamentScheduleGroup[] {
  const updateMap = liveUpdatesToMap(updates);

  return groups.map((group) => ({
    ...group,
    matches: group.matches.map((match) =>
      applyLiveMatchUpdate(match, updateMap.get(match.matchNumber), fetchedAt),
    ),
  }));
}

export function countPlayedMatches(
  schedule: TournamentScheduleMatch[],
): number {
  return schedule.filter((match) => match.isPlayed).length;
}

export function countLiveMatches(
  schedule: TournamentScheduleMatch[],
): number {
  return schedule.filter((match) => match.isLive).length;
}
