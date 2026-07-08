import { getLiveSchedulePayload } from "@/lib/espn/match-updates";
import type { LiveMatchUpdate } from "@/lib/espn/match-updates";
import {
  getKnockoutBracketRounds,
  getKnockoutProgress,
} from "@/lib/schedule/bracket-board";
import type { BracketRoundView } from "@/lib/schedule/bracket-board";
import type { GroupPageView, GroupSummaryView } from "@/lib/schedule/groups";
import { getAllGroups, getGroupPageView, getGroupSummaries } from "@/lib/schedule/groups";
import {
  countLiveMatches,
  countPlayedMatches,
  mergeLiveUpdatesIntoSchedule,
} from "@/lib/schedule/live-schedule";
import { mergeLiveUpdatesIntoMatchRecords } from "@/lib/schedule/merged-matches";
import {
  getTournamentSchedule,
  groupTournamentSchedule,
  type TournamentScheduleGroup,
} from "@/lib/schedule/tournament-schedule";

export type LiveSitePayload = {
  fetchedAt: string;
  updates: LiveMatchUpdate[];
  groups: TournamentScheduleGroup[];
  groupSummaries: GroupSummaryView[];
  groupPages: Record<string, GroupPageView>;
  bracketRounds: BracketRoundView[];
  knockoutProgress: ReturnType<typeof getKnockoutProgress>;
  playedMatches: number;
  liveMatches: number;
};

export async function buildLiveSitePayload(
  now = new Date(),
): Promise<LiveSitePayload> {
  const live = await getLiveSchedulePayload(now);
  const mergedMatches = mergeLiveUpdatesIntoMatchRecords(live.updates);
  const baseSchedule = getTournamentSchedule(mergedMatches);
  const mergedSchedule = mergeLiveUpdatesIntoSchedule(
    baseSchedule,
    live.updates,
    live.fetchedAt,
  );
  const groups = groupTournamentSchedule(mergedSchedule);

  const groupPages: Record<string, GroupPageView> = {};
  for (const group of getAllGroups()) {
    const page = getGroupPageView(group, mergedMatches);
    if (page) {
      groupPages[group] = page;
    }
  }

  return {
    fetchedAt: live.fetchedAt,
    updates: live.updates,
    groups,
    groupSummaries: getGroupSummaries(mergedMatches),
    groupPages,
    bracketRounds: getKnockoutBracketRounds(mergedMatches),
    knockoutProgress: getKnockoutProgress(mergedMatches),
    playedMatches: countPlayedMatches(mergedSchedule),
    liveMatches: countLiveMatches(mergedSchedule),
  };
}
