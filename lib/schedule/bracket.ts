import {
  loserAdvancesTo,
  matches,
  roundOf32Entry,
  winnerAdvancesTo,
} from "@/lib/schedule/matches";
import type { MatchRecord } from "@/lib/schedule/types";
import { teams } from "@/lib/teams";

export type MatchOutcome = {
  winner: string;
  loser: string;
};

export type ResolvedMatch = MatchRecord & {
  resolvedHomeSlug: string | null;
  resolvedAwaySlug: string | null;
};

type GroupStanding = {
  slug: string;
  played: number;
  points: number;
  gf: number;
  ga: number;
  gd: number;
};

const matchByNumber = new Map(matches.map((m) => [m.matchNumber, m]));
const teamsByGroup = new Map<string, string[]>();

for (const team of teams) {
  const groupTeams = teamsByGroup.get(team.group) ?? [];
  groupTeams.push(team.slug);
  teamsByGroup.set(team.group, groupTeams);
}

function isPlaceholderSlug(slug: string): boolean {
  return slug.startsWith("winner:") || slug.startsWith("loser:");
}

function parsePlaceholder(slug: string): { kind: "winner" | "loser"; matchNumber: number } | null {
  if (slug.startsWith("winner:")) {
    return { kind: "winner", matchNumber: Number(slug.slice(7)) };
  }
  if (slug.startsWith("loser:")) {
    return { kind: "loser", matchNumber: Number(slug.slice(6)) };
  }
  return null;
}

function resolveParticipant(
  slug: string,
  outcomes: Map<number, MatchOutcome>,
): string | null {
  if (!isPlaceholderSlug(slug)) {
    return slug;
  }

  const placeholder = parsePlaceholder(slug);
  if (!placeholder || Number.isNaN(placeholder.matchNumber)) {
    return null;
  }

  const outcome = outcomes.get(placeholder.matchNumber);
  if (!outcome) {
    return null;
  }

  return placeholder.kind === "winner" ? outcome.winner : outcome.loser;
}

function getMatchOutcome(
  match: MatchRecord,
  resolvedHome: string | null,
  resolvedAway: string | null,
): MatchOutcome | null {
  if (!resolvedHome || !resolvedAway) {
    return null;
  }

  if (match.homeScore === null || match.awayScore === null) {
    return null;
  }

  if (match.homeScore > match.awayScore) {
    return { winner: resolvedHome, loser: resolvedAway };
  }
  if (match.awayScore > match.homeScore) {
    return { winner: resolvedAway, loser: resolvedHome };
  }

  return null;
}

export function buildMatchOutcomes(): Map<number, MatchOutcome> {
  const outcomes = new Map<number, MatchOutcome>();

  for (const match of matches) {
    const resolvedHome = resolveParticipant(match.homeSlug, outcomes);
    const resolvedAway = resolveParticipant(match.awaySlug, outcomes);
    const outcome = getMatchOutcome(match, resolvedHome, resolvedAway);
    if (outcome) {
      outcomes.set(match.matchNumber, outcome);
    }
  }

  return outcomes;
}

export function resolveMatch(
  matchNumber: number,
  outcomes: Map<number, MatchOutcome>,
): ResolvedMatch | undefined {
  const match = matchByNumber.get(matchNumber);
  if (!match) {
    return undefined;
  }

  return {
    ...match,
    resolvedHomeSlug: resolveParticipant(match.homeSlug, outcomes),
    resolvedAwaySlug: resolveParticipant(match.awaySlug, outcomes),
  };
}

function compareStandings(a: GroupStanding, b: GroupStanding): number {
  return (
    b.points - a.points ||
    b.gd - a.gd ||
    b.gf - a.gf ||
    a.slug.localeCompare(b.slug)
  );
}

export function getGroupStandings(group: string): GroupStanding[] {
  const groupTeams = teamsByGroup.get(group) ?? [];
  const standings = new Map<string, GroupStanding>(
    groupTeams.map((slug) => [
      slug,
      { slug, played: 0, points: 0, gf: 0, ga: 0, gd: 0 },
    ]),
  );

  for (const match of matches) {
    if (match.group !== group || match.homeScore === null || match.awayScore === null) {
      continue;
    }

    const home = standings.get(match.homeSlug);
    const away = standings.get(match.awaySlug);
    if (!home || !away) {
      continue;
    }

    home.played += 1;
    away.played += 1;
    home.gf += match.homeScore;
    home.ga += match.awayScore;
    away.gf += match.awayScore;
    away.ga += match.homeScore;
    home.gd = home.gf - home.ga;
    away.gd = away.gf - away.ga;

    if (match.homeScore > match.awayScore) {
      home.points += 3;
    } else if (match.awayScore > match.homeScore) {
      away.points += 3;
    } else {
      home.points += 1;
      away.points += 1;
    }
  }

  return [...standings.values()].sort(compareStandings);
}

function isGroupStageComplete(): boolean {
  return matches
    .filter((match) => match.stage === "group")
    .every((match) => match.homeScore !== null && match.awayScore !== null);
}

function getThirdPlaceCandidates(): GroupStanding[] {
  const groups = [...teamsByGroup.keys()].sort();
  const candidates: GroupStanding[] = [];

  for (const group of groups) {
    const standings = getGroupStandings(group);
    const third = standings[2];
    if (third && third.played === 3) {
      candidates.push(third);
    }
  }

  return candidates.sort(compareStandings);
}

export function getAdvancingThirdPlaceSlugs(): Set<string> | null {
  if (!isGroupStageComplete()) {
    return null;
  }

  return new Set(getThirdPlaceCandidates().slice(0, 8).map((team) => team.slug));
}

export function isGroupComplete(group: string): boolean {
  return matches
    .filter((match) => match.group === group)
    .every(
      (match) => match.homeScore !== null && match.awayScore !== null,
    );
}

export function getQualifiedTeams(): Set<string> | null {
  if (!isGroupStageComplete()) {
    return null;
  }

  const qualified = new Set<string>();

  for (const group of teamsByGroup.keys()) {
    const standings = getGroupStandings(group);
    qualified.add(standings[0].slug);
    qualified.add(standings[1].slug);
  }

  for (const third of getThirdPlaceCandidates().slice(0, 8)) {
    qualified.add(third.slug);
  }

  return qualified;
}

export function isTeamQualifiedForKnockout(teamSlug: string): boolean {
  const qualified = getQualifiedTeams();
  if (qualified) {
    return qualified.has(teamSlug);
  }

  return teamSlug in roundOf32Entry;
}

export function getTeamEliminationStage(teamSlug: string): MatchRecord["stage"] | null {
  if (!isTeamQualifiedForKnockout(teamSlug)) {
    return isGroupStageComplete() ? "group" : null;
  }

  const entry = roundOf32Entry[teamSlug];
  if (!entry) {
    return isGroupStageComplete() ? "group" : null;
  }

  const outcomes = buildMatchOutcomes();
  let current: number | undefined = entry;

  while (current) {
    const resolved = resolveMatch(current, outcomes);
    if (!resolved) {
      break;
    }

    const outcome = outcomes.get(current);
    if (outcome) {
      if (outcome.loser === teamSlug) {
        return resolved.stage;
      }
      if (outcome.winner === teamSlug) {
        current = winnerAdvancesTo[current];
        continue;
      }
      break;
    }

    const { resolvedHomeSlug: home, resolvedAwaySlug: away } = resolved;
    if (home && away && home !== teamSlug && away !== teamSlug) {
      break;
    }

    current = winnerAdvancesTo[current];
  }

  return null;
}

export function getProjectedSide(
  matchNumber: number,
  teamSlug: string,
  entry: number,
): "home" | "away" | null {
  if (matchNumber === entry) {
    const match = matchByNumber.get(entry);
    if (!match) {
      return null;
    }
    if (match.homeSlug === teamSlug) {
      return "home";
    }
    if (match.awaySlug === teamSlug) {
      return "away";
    }
    return null;
  }

  let previous = entry;
  let current = winnerAdvancesTo[entry];

  while (current) {
    const match = matchByNumber.get(current);
    if (!match) {
      return null;
    }

    if (current === matchNumber) {
      if (match.homeSlug === `winner:${previous}`) {
        return "home";
      }
      if (match.awaySlug === `winner:${previous}`) {
        return "away";
      }
      if (match.homeSlug === `loser:${previous}`) {
        return "home";
      }
      if (match.awaySlug === `loser:${previous}`) {
        return "away";
      }
      return null;
    }

    previous = current;
    current = winnerAdvancesTo[current];
  }

  return null;
}

export function getKnockoutMatchNumbersForTeam(teamSlug: string): number[] {
  if (!isTeamQualifiedForKnockout(teamSlug)) {
    return [];
  }

  const entry = roundOf32Entry[teamSlug];
  if (!entry) {
    return [];
  }

  const outcomes = buildMatchOutcomes();
  const path: number[] = [];
  let current: number | undefined = entry;

  while (current) {
    const resolved = resolveMatch(current, outcomes);
    if (!resolved) {
      break;
    }

    const outcome = outcomes.get(current);

    if (outcome) {
      path.push(current);

      if (outcome.loser === teamSlug) {
        const thirdPlace = loserAdvancesTo[current];
        if (thirdPlace) {
          path.push(thirdPlace);
        }
        break;
      }

      current = winnerAdvancesTo[current];
      continue;
    }

    const { resolvedHomeSlug: home, resolvedAwaySlug: away } = resolved;
    if (home && away && home !== teamSlug && away !== teamSlug) {
      break;
    }

    path.push(current);
    current = winnerAdvancesTo[current];
  }

  return path;
}

export function getResolvedOpponentSlug(
  match: ResolvedMatch,
  teamSlug: string,
  entry: number,
): string {
  const side =
    match.resolvedHomeSlug === teamSlug
      ? "home"
      : match.resolvedAwaySlug === teamSlug
        ? "away"
        : getProjectedSide(match.matchNumber, teamSlug, entry);

  if (side === "home") {
    return match.resolvedAwaySlug ?? match.awaySlug;
  }
  if (side === "away") {
    return match.resolvedHomeSlug ?? match.homeSlug;
  }

  return match.awaySlug;
}
