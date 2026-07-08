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
  mergeLiveUpdatesIntoGroups,
  mergeLiveUpdatesIntoSchedule,
} from "@/lib/schedule/live-schedule";
import { mergeLiveUpdatesIntoMatchRecords } from "@/lib/schedule/merged-matches";
import {
  getTournamentSchedule,
  getTournamentScheduleView,
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
  const base = getTournamentScheduleView();
  const live = await getLiveSchedulePayload(now);
  const mergedMatches = mergeLiveUpdatesIntoMatchRecords(live.updates);
  const groups = mergeLiveUpdatesIntoGroups(
    base.groups,
    live.updates,
    live.fetchedAt,
  );
  const mergedSchedule = mergeLiveUpdatesIntoSchedule(
    getTournamentSchedule(),
    live.updates,
    live.fetchedAt,
  );

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
