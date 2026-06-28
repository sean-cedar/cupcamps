import {
  buildMatchOutcomes,
  getGroupStandings,
  resolveMatch,
  type MatchOutcome,
} from "@/lib/schedule/bracket";
import { matches } from "@/lib/schedule/matches";
import type { MatchRecord, MatchStage } from "@/lib/schedule/types";
import { getStageLabel } from "@/lib/schedule";
import { getTeam } from "@/lib/teams";

export type MatchTeamRef = {
  slug: string;
  name: string;
  countryCode: string;
};

export type MatchParticipantView = {
  slotSlug: string;
  label: string;
  team: MatchTeamRef | null;
  isPlaceholder: boolean;
  isWinner: boolean | null;
  score: number | null;
  potentialTeams: MatchTeamRef[];
};

export type GroupStandingRow = {
  slug: string;
  name: string;
  countryCode: string;
  played: number;
  points: number;
  gf: number;
  ga: number;
  gd: number;
  isHomeTeam: boolean;
  isAwayTeam: boolean;
};

export type FeederMatchView = {
  matchNumber: number;
  label: string;
  homeLabel: string;
  awayLabel: string;
  isPlayed: boolean;
  score: string | null;
};

export type MatchPageView = {
  matchNumber: number;
  stage: MatchStage;
  stageLabel: string;
  date: string;
  matchday: number | undefined;
  group: string | undefined;
  hostCitySlug: string;
  stadium: string;
  isPlayed: boolean;
  homeScore: number | null;
  awayScore: number | null;
  home: MatchParticipantView;
  away: MatchParticipantView;
  title: string;
  groupStandings: GroupStandingRow[] | null;
  feeders: FeederMatchView[];
};

const matchByNumber = new Map(matches.map((match) => [match.matchNumber, match]));

function isTeamSlug(slug: string): boolean {
  return !slug.startsWith("winner:") && !slug.startsWith("loser:");
}

function parsePlaceholder(
  slug: string,
): { kind: "winner" | "loser"; matchNumber: number } | null {
  if (slug.startsWith("winner:")) {
    return { kind: "winner", matchNumber: Number(slug.slice(7)) };
  }
  if (slug.startsWith("loser:")) {
    return { kind: "loser", matchNumber: Number(slug.slice(6)) };
  }
  return null;
}

function resolveSlugLabel(slug: string): string {
  if (isTeamSlug(slug)) {
    return getTeam(slug)?.name ?? slug;
  }
  if (slug.startsWith("winner:")) {
    return `Winner · M${slug.replace("winner:", "")}`;
  }
  if (slug.startsWith("loser:")) {
    return `Loser · M${slug.replace("loser:", "")}`;
  }
  return slug;
}

function toTeamRef(slug: string): MatchTeamRef | null {
  const team = getTeam(slug);
  if (!team) {
    return null;
  }
  return {
    slug: team.slug,
    name: team.name,
    countryCode: team.countryCode,
  };
}

function dedupeTeamRefs(teams: MatchTeamRef[]): MatchTeamRef[] {
  const seen = new Set<string>();
  return teams.filter((team) => {
    if (seen.has(team.slug)) {
      return false;
    }
    seen.add(team.slug);
    return true;
  });
}

function dedupeSlugs(slugs: string[]): string[] {
  return [...new Set(slugs)];
}

function getPotentialParticipants(
  slug: string,
  outcomes: Map<number, MatchOutcome>,
): string[] {
  if (isTeamSlug(slug)) {
    return [slug];
  }

  const placeholder = parsePlaceholder(slug);
  if (!placeholder) {
    return [];
  }

  const outcome = outcomes.get(placeholder.matchNumber);
  if (outcome) {
    return [outcome.winner, outcome.loser];
  }

  const source = resolveMatch(placeholder.matchNumber, outcomes);
  if (!source) {
    return [];
  }

  const homeSlug = source.resolvedHomeSlug ?? source.homeSlug;
  const awaySlug = source.resolvedAwaySlug ?? source.awaySlug;

  return dedupeSlugs([
    ...getPotentialParticipants(homeSlug, outcomes),
    ...getPotentialParticipants(awaySlug, outcomes),
  ]);
}

function getPotentialTeamsForSlot(
  slug: string,
  outcomes: Map<number, MatchOutcome>,
): MatchTeamRef[] {
  if (isTeamSlug(slug)) {
    const team = toTeamRef(slug);
    return team ? [team] : [];
  }

  const placeholder = parsePlaceholder(slug);
  if (!placeholder) {
    return [];
  }

  const outcome = outcomes.get(placeholder.matchNumber);
  if (outcome) {
    const winnerOrLoser =
      placeholder.kind === "winner" ? outcome.winner : outcome.loser;
    const team = toTeamRef(winnerOrLoser);
    return team ? [team] : [];
  }

  const source = resolveMatch(placeholder.matchNumber, outcomes);
  if (!source) {
    return [];
  }

  const homeSlug = source.resolvedHomeSlug ?? source.homeSlug;
  const awaySlug = source.resolvedAwaySlug ?? source.awaySlug;

  if (placeholder.kind === "winner") {
    return dedupeTeamRefs([
      ...getPotentialTeamsForSlot(homeSlug, outcomes),
      ...getPotentialTeamsForSlot(awaySlug, outcomes),
    ]);
  }

  return dedupeTeamRefs(
    getPotentialParticipants(homeSlug, outcomes)
      .concat(getPotentialParticipants(awaySlug, outcomes))
      .map((s) => toTeamRef(s))
      .filter((team): team is MatchTeamRef => Boolean(team)),
  );
}

function buildParticipantView(
  slotSlug: string,
  resolvedSlug: string | null,
  score: number | null,
  isWinner: boolean | null,
  outcomes: Map<number, MatchOutcome>,
): MatchParticipantView {
  const team = resolvedSlug ? toTeamRef(resolvedSlug) : null;
  const isPlaceholder = !isTeamSlug(slotSlug);
  const potentialTeams =
    isPlaceholder || !team
      ? getPotentialTeamsForSlot(slotSlug, outcomes)
      : team
        ? [team]
        : [];

  return {
    slotSlug,
    label: team?.name ?? resolveSlugLabel(slotSlug),
    team,
    isPlaceholder,
    isWinner,
    score,
    potentialTeams,
  };
}

function buildFeeders(
  match: MatchRecord,
  outcomes: Map<number, MatchOutcome>,
): FeederMatchView[] {
  const feeders: FeederMatchView[] = [];

  for (const slotSlug of [match.homeSlug, match.awaySlug]) {
    const placeholder = parsePlaceholder(slotSlug);
    if (!placeholder) {
      continue;
    }

    const source = matchByNumber.get(placeholder.matchNumber);
    if (!source) {
      continue;
    }

    const resolved = resolveMatch(placeholder.matchNumber, outcomes);
    const homeLabel = resolveSlugLabel(
      resolved?.resolvedHomeSlug ?? source.homeSlug,
    );
    const awayLabel = resolveSlugLabel(
      resolved?.resolvedAwaySlug ?? source.awaySlug,
    );
    const isPlayed =
      source.homeScore !== null && source.awayScore !== null;
    const score =
      isPlayed && source.homeScore !== null && source.awayScore !== null
        ? `${source.homeScore}–${source.awayScore}`
        : null;

    feeders.push({
      matchNumber: placeholder.matchNumber,
      label: resolveSlugLabel(slotSlug),
      homeLabel,
      awayLabel,
      isPlayed,
      score,
    });
  }

  return feeders;
}

function buildGroupStandings(
  match: MatchRecord,
  resolvedHome: string | null,
  resolvedAway: string | null,
): GroupStandingRow[] | null {
  if (!match.group) {
    return null;
  }

  return getGroupStandings(match.group).map((row) => {
    const team = getTeam(row.slug);
    return {
      slug: row.slug,
      name: team?.name ?? row.slug,
      countryCode: team?.countryCode ?? "",
      played: row.played,
      points: row.points,
      gf: row.gf,
      ga: row.ga,
      gd: row.gd,
      isHomeTeam: row.slug === resolvedHome,
      isAwayTeam: row.slug === resolvedAway,
    };
  });
}

function buildTitle(
  home: MatchParticipantView,
  away: MatchParticipantView,
  matchNumber: number,
): string {
  if (home.team && away.team) {
    return `${home.team.name} vs ${away.team.name}`;
  }
  if (home.team) {
    return `${home.team.name} vs ${away.label}`;
  }
  if (away.team) {
    return `${home.label} vs ${away.team.name}`;
  }
  return `Match ${matchNumber}`;
}

export function getMatchPageView(matchNumber: number): MatchPageView | undefined {
  const match = matchByNumber.get(matchNumber);
  if (!match) {
    return undefined;
  }

  const outcomes = buildMatchOutcomes();
  const resolved = resolveMatch(matchNumber, outcomes);
  const resolvedHome = resolved?.resolvedHomeSlug ?? null;
  const resolvedAway = resolved?.resolvedAwaySlug ?? null;
  const isPlayed = match.homeScore !== null && match.awayScore !== null;

  let homeWinner: boolean | null = null;
  let awayWinner: boolean | null = null;

  if (isPlayed && match.homeScore !== null && match.awayScore !== null) {
    if (match.homeScore > match.awayScore) {
      homeWinner = true;
      awayWinner = false;
    } else if (match.awayScore > match.homeScore) {
      homeWinner = false;
      awayWinner = true;
    }
  }

  const home = buildParticipantView(
    match.homeSlug,
    resolvedHome,
    match.homeScore,
    homeWinner,
    outcomes,
  );
  const away = buildParticipantView(
    match.awaySlug,
    resolvedAway,
    match.awayScore,
    awayWinner,
    outcomes,
  );

  return {
    matchNumber: match.matchNumber,
    stage: match.stage,
    stageLabel: getStageLabel(match.stage),
    date: match.date,
    matchday: match.matchday,
    group: match.group,
    hostCitySlug: match.hostCitySlug,
    stadium: match.stadium,
    isPlayed,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    home,
    away,
    title: buildTitle(home, away, match.matchNumber),
    groupStandings: buildGroupStandings(match, resolvedHome, resolvedAway),
    feeders: buildFeeders(match, outcomes),
  };
}

export function getAllMatchNumbers(): number[] {
  return matches.map((match) => match.matchNumber);
}
