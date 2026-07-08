import {
  getAdvancingThirdPlaceSlugs,
  getGroupStandings,
  isGroupComplete,
  resolveMatch,
  buildMatchOutcomes,
} from "@/lib/schedule/bracket";
import { matches } from "@/lib/schedule/matches";
import type { CityMatch, MatchRecord } from "@/lib/schedule/types";
import { getTeam, getTeamsByGroup, teams } from "@/lib/teams";

export type GroupAdvancementStatus =
  | "qualified-top-two"
  | "qualified-third"
  | "third-eliminated"
  | "eliminated"
  | "in-progress";

export type GroupStandingView = {
  slug: string;
  name: string;
  countryCode: string;
  played: number;
  points: number;
  gf: number;
  ga: number;
  gd: number;
  rank: number;
  advancement: GroupAdvancementStatus;
};

export type GroupAdvancedTeamView = {
  slug: string;
  name: string;
  countryCode: string;
  label: string;
};

export type GroupTeamView = {
  slug: string;
  name: string;
  countryCode: string;
  confederation: string;
  advancement: GroupAdvancementStatus;
};

export type GroupSummaryView = {
  group: string;
  isComplete: boolean;
  matchesPlayed: number;
  matchesTotal: number;
  standings: GroupStandingView[];
  advancedTeams: GroupAdvancedTeamView[];
};

export type GroupPageView = GroupSummaryView & {
  teams: GroupTeamView[];
  fixtures: CityMatch[];
  fixturesByMatchday: Array<{ matchday: number; fixtures: CityMatch[] }>;
};

const GROUPS = [...new Set(teams.map((team) => team.group))].sort();

function resolveAdvancement(
  slug: string,
  rank: number,
  isComplete: boolean,
  advancingThirds: Set<string> | null,
): GroupAdvancementStatus {
  if (!isComplete) {
    return "in-progress";
  }

  if (rank <= 2) {
    return "qualified-top-two";
  }

  if (rank === 3) {
    return advancingThirds?.has(slug) ? "qualified-third" : "third-eliminated";
  }

  return "eliminated";
}

function advancementLabel(status: GroupAdvancementStatus): string {
  switch (status) {
    case "qualified-top-two":
      return "Round of 32";
    case "qualified-third":
      return "Round of 32 (3rd)";
    case "third-eliminated":
      return "Eliminated (3rd)";
    case "eliminated":
      return "Eliminated";
    default:
      return "In progress";
  }
}

function buildStandings(
  group: string,
  isComplete: boolean,
  advancingThirds: Set<string> | null,
  matchSource: MatchRecord[] = matches,
): GroupStandingView[] {
  return getGroupStandings(group, matchSource).map((row, index) => {
    const team = getTeam(row.slug);
    const rank = index + 1;

    return {
      slug: row.slug,
      name: team?.name ?? row.slug,
      countryCode: team?.countryCode ?? "",
      played: row.played,
      points: row.points,
      gf: row.gf,
      ga: row.ga,
      gd: row.gd,
      rank,
      advancement: resolveAdvancement(row.slug, rank, isComplete, advancingThirds),
    };
  });
}

function buildAdvancedTeams(standings: GroupStandingView[]): GroupAdvancedTeamView[] {
  return standings
    .filter(
      (row) =>
        row.advancement === "qualified-top-two" ||
        row.advancement === "qualified-third",
    )
    .map((row) => ({
      slug: row.slug,
      name: row.name,
      countryCode: row.countryCode,
      label: advancementLabel(row.advancement),
    }));
}

function buildGroupFixtures(
  group: string,
  matchSource: MatchRecord[] = matches,
): CityMatch[] {
  const outcomes = buildMatchOutcomes(matchSource);

  return matchSource
    .filter((match) => match.group === group)
    .sort(
      (a, b) =>
        (a.matchday ?? 0) - (b.matchday ?? 0) ||
        a.date.localeCompare(b.date) ||
        a.matchNumber - b.matchNumber,
    )
    .map((match) => {
      const resolved = resolveMatch(match.matchNumber, outcomes, matchSource);

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
        hostCitySlug: match.hostCitySlug,
        stadium: match.stadium,
        isPlayed: match.homeScore !== null && match.awayScore !== null,
      };
    });
}

function buildGroupSummary(
  group: string,
  matchSource: MatchRecord[] = matches,
): GroupSummaryView {
  const isComplete = isGroupComplete(group, matchSource);
  const advancingThirds = getAdvancingThirdPlaceSlugs(matchSource);
  const standings = buildStandings(group, isComplete, advancingThirds, matchSource);
  const fixtures = buildGroupFixtures(group, matchSource);

  return {
    group,
    isComplete,
    matchesPlayed: fixtures.filter((match) => match.isPlayed).length,
    matchesTotal: fixtures.length,
    standings,
    advancedTeams: buildAdvancedTeams(standings),
  };
}

export function getAllGroups(): string[] {
  return GROUPS;
}

export function getGroupSummaries(
  matchSource: MatchRecord[] = matches,
): GroupSummaryView[] {
  return GROUPS.map((group) => buildGroupSummary(group, matchSource));
}

export function getGroupPageView(
  group: string,
  matchSource: MatchRecord[] = matches,
): GroupPageView | undefined {
  if (!GROUPS.includes(group)) {
    return undefined;
  }

  const summary = buildGroupSummary(group, matchSource);
  const fixtures = buildGroupFixtures(group, matchSource);
  const matchdays = [...new Set(fixtures.map((match) => match.matchday ?? 0))].sort(
    (a, b) => a - b,
  );

  const teamsInGroup = getTeamsByGroup(group)
    .map((team) => {
      const standing = summary.standings.find((row) => row.slug === team.slug);

      return {
        slug: team.slug,
        name: team.name,
        countryCode: team.countryCode,
        confederation: team.confederation,
        advancement: standing?.advancement ?? "in-progress",
      };
    })
    .sort((a, b) => {
      const rankA =
        summary.standings.find((row) => row.slug === a.slug)?.rank ?? 99;
      const rankB =
        summary.standings.find((row) => row.slug === b.slug)?.rank ?? 99;
      return rankA - rankB || a.name.localeCompare(b.name);
    });

  return {
    ...summary,
    teams: teamsInGroup,
    fixtures,
    fixturesByMatchday: matchdays.map((matchday) => ({
      matchday,
      fixtures: fixtures.filter((match) => (match.matchday ?? 0) === matchday),
    })),
  };
}

export function getGroupAdvancementLabel(status: GroupAdvancementStatus): string {
  return advancementLabel(status);
}

export function toGroupStandingRows(standings: GroupStandingView[]) {
  return standings.map((row) => ({
    slug: row.slug,
    name: row.name,
    countryCode: row.countryCode,
    played: row.played,
    points: row.points,
    gf: row.gf,
    ga: row.ga,
    gd: row.gd,
    isHomeTeam: false,
    isAwayTeam: false,
    advancement: row.advancement,
  }));
}
