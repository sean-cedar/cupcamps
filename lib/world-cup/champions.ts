import championsData from "@/data/world-cup-champions.json";
import { getTeam } from "@/lib/teams";

export type WorldCupChampionRecord = {
  year: number;
  winnerSlug: string;
  winnerName: string;
  countryCode: string;
  host: string;
  finalScore: string;
  runnerUp: string;
};

export type WorldCupChampionTeamSummary = {
  winnerSlug: string;
  winnerName: string;
  countryCode: string;
  titles: number;
  years: number[];
  hasTeamPage: boolean;
};

const champions = championsData as WorldCupChampionRecord[];

export function getWorldCupChampions(): WorldCupChampionRecord[] {
  return champions;
}

export function getWorldCupTitleCount(teamSlug: string): number {
  return champions.filter((record) => record.winnerSlug === teamSlug).length;
}

export function getWorldCupTitleYears(teamSlug: string): number[] {
  return champions
    .filter((record) => record.winnerSlug === teamSlug)
    .map((record) => record.year)
    .sort((left, right) => right - left);
}

export function getWorldCupChampionsByTeam(): WorldCupChampionTeamSummary[] {
  const grouped = new Map<string, WorldCupChampionTeamSummary>();

  for (const record of champions) {
    const existing = grouped.get(record.winnerSlug);
    if (existing) {
      existing.titles += 1;
      existing.years.push(record.year);
      continue;
    }

    grouped.set(record.winnerSlug, {
      winnerSlug: record.winnerSlug,
      winnerName: record.winnerName,
      countryCode: record.countryCode,
      titles: 1,
      years: [record.year],
      hasTeamPage: Boolean(getTeam(record.winnerSlug)),
    });
  }

  return [...grouped.values()]
    .map((summary) => ({
      ...summary,
      years: summary.years.sort((left, right) => right - left),
    }))
    .sort(
      (left, right) =>
        right.titles - left.titles ||
        left.winnerName.localeCompare(right.winnerName),
    );
}

export function championTeamHref(winnerSlug: string): string | null {
  return getTeam(winnerSlug) ? `/countries/${winnerSlug}` : null;
}
