import type { LiveMatchUpdate } from "@/lib/espn/match-updates";
import { matches } from "@/lib/schedule/matches";
import type { MatchRecord } from "@/lib/schedule/types";

export function applyLiveUpdateToMatchRecord(
  match: MatchRecord,
  update: LiveMatchUpdate | undefined,
): MatchRecord {
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
  };
}

export function mergeLiveUpdatesIntoMatchRecords(
  updates: LiveMatchUpdate[],
  base: MatchRecord[] = matches,
): MatchRecord[] {
  const updateMap = new Map(
    updates.map((update) => [update.matchNumber, update]),
  );

  return base.map((match) =>
    applyLiveUpdateToMatchRecord(match, updateMap.get(match.matchNumber)),
  );
}
