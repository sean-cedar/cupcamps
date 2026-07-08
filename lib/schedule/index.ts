import {
  buildMatchOutcomes,
  getKnockoutMatchNumbersForTeam,
  getProjectedSide,
  getResolvedOpponentSlug,
  getTeamEliminationStage,
  isTeamQualifiedForKnockout,
  resolveMatch,
  resolveParticipantSlug,
} from "@/lib/schedule/bracket";
import { matches, roundOf32Entry } from "@/lib/schedule/matches";
import type { CityMatch, MatchRecord, MatchStage, TeamMatch } from "@/lib/schedule/types";
import { getTeam } from "@/lib/teams";

const matchByNumber = new Map(matches.map((m) => [m.matchNumber, m]));

const STAGE_LABELS: Record<MatchStage, string> = {
  group: "Group stage",
  "round-of-32": "Round of 32",
  "round-of-16": "Round of 16",
  "quarter-final": "Quarter-final",
  "semi-final": "Semi-final",
  "third-place": "Third-place play-off",
  final: "Final",
};

export function getStageLabel(stage: MatchStage): string {
  return STAGE_LABELS[stage];
}

function isTeamSlug(slug: string): boolean {
  return !slug.startsWith("winner:") && !slug.startsWith("loser:");
}

function resolveSlugLabel(slug: string): string {
  if (isTeamSlug(slug)) {
    return getTeam(slug)?.name ?? slug;
  }
  if (slug.startsWith("winner:")) {
    const num = slug.replace("winner:", "");
    return `Winner of Match ${num}`;
  }
  if (slug.startsWith("loser:")) {
    const num = slug.replace("loser:", "");
    return `Loser of Match ${num}`;
  }
  return slug;
}

function toGroupMatch(match: MatchRecord, teamSlug: string): TeamMatch {
  const isHome = match.homeSlug === teamSlug;

  return {
    matchNumber: match.matchNumber,
    stage: match.stage,
    date: match.date,
    matchday: match.matchday,
    group: match.group,
    homeSlug: match.homeSlug,
    awaySlug: match.awaySlug,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    hostCitySlug: match.hostCitySlug,
    stadium: match.stadium,
    isHome,
    opponentSlug: isHome ? match.awaySlug : match.homeSlug,
    isPlayed: match.homeScore !== null && match.awayScore !== null,
    isElimination: false,
  };
}

function toKnockoutMatch(
  match: MatchRecord,
  teamSlug: string,
  outcomes: ReturnType<typeof buildMatchOutcomes>,
  entry: number,
): TeamMatch {
  const resolved = resolveMatch(match.matchNumber, outcomes)!;
  const side =
    resolved.resolvedHomeSlug === teamSlug
      ? "home"
      : resolved.resolvedAwaySlug === teamSlug
        ? "away"
        : getProjectedSide(match.matchNumber, teamSlug, entry);
  const opponentSlug = getResolvedOpponentSlug(resolved, teamSlug, entry);
  const outcome = outcomes.get(match.matchNumber);

  return {
    matchNumber: match.matchNumber,
    stage: match.stage,
    date: match.date,
    matchday: match.matchday,
    group: match.group,
    homeSlug: resolved.resolvedHomeSlug ?? match.homeSlug,
    awaySlug: resolved.resolvedAwaySlug ?? match.awaySlug,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    hostCitySlug: match.hostCitySlug,
    stadium: match.stadium,
    isHome: side === "home",
    opponentSlug,
    isPlayed: match.homeScore !== null && match.awayScore !== null,
    isElimination: outcome?.loser === teamSlug,
  };
}

function getGroupMatches(teamSlug: string): TeamMatch[] {
  return matches
    .filter(
      (m) =>
        m.stage === "group" &&
        (m.homeSlug === teamSlug || m.awaySlug === teamSlug),
    )
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m) => toGroupMatch(m, teamSlug));
}

function getKnockoutMatches(teamSlug: string): TeamMatch[] {
  const entry = roundOf32Entry[teamSlug];
  if (!entry) {
    return [];
  }

  const outcomes = buildMatchOutcomes();

  return getKnockoutMatchNumbersForTeam(teamSlug)
    .map((matchNumber) => matchByNumber.get(matchNumber))
    .filter((match): match is MatchRecord => Boolean(match))
    .map((match) => toKnockoutMatch(match, teamSlug, outcomes, entry));
}

export function teamHasKnockoutPath(teamSlug: string): boolean {
  return isTeamQualifiedForKnockout(teamSlug) && teamSlug in roundOf32Entry;
}

export function getTeamSchedule(teamSlug: string): TeamMatch[] {
  return [...getGroupMatches(teamSlug), ...getKnockoutMatches(teamSlug)];
}

export function getTeamEliminationMessage(teamSlug: string): string | null {
  const stage = getTeamEliminationStage(teamSlug);
  if (!stage) {
    return null;
  }

  if (stage === "group") {
    return "Eliminated in the group stage.";
  }

  return `Eliminated in the ${getStageLabel(stage).toLowerCase()}.`;
}

export function getOpponentDisplay(
  opponentSlug: string,
  matchSource: MatchRecord[] = matches,
): { slug: string | null; label: string; countryCode: string | null } {
  const outcomes = buildMatchOutcomes(matchSource);
  const resolvedSlug =
    resolveParticipantSlug(opponentSlug, outcomes) ?? opponentSlug;

  if (isTeamSlug(resolvedSlug)) {
    const team = getTeam(resolvedSlug);
    return {
      slug: resolvedSlug,
      label: team?.name ?? resolvedSlug,
      countryCode: team?.countryCode ?? null,
    };
  }
  return {
    slug: null,
    label: resolveSlugLabel(resolvedSlug),
    countryCode: null,
  };
}

export function formatMatchDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export {
  formatMatchKickoff,
  formatMatchSchedule,
  getMatchKickoff,
  getMatchKickoffInstant,
} from "@/lib/schedule/kickoffs";
export type { MatchKickoff } from "@/lib/schedule/kickoffs";

export function formatScore(match: TeamMatch): string | null {
  if (match.homeScore === null || match.awayScore === null) {
    return null;
  }
  const teamScore = match.isHome ? match.homeScore : match.awayScore;
  const oppScore = match.isHome ? match.awayScore : match.homeScore;
  return `${teamScore}–${oppScore}`;
}

export function formatFixtureScore(match: CityMatch): string | null {
  if (match.homeScore === null || match.awayScore === null) {
    return null;
  }
  return `${match.homeScore}–${match.awayScore}`;
}

export function getHostCitySchedule(
  hostCitySlug: string,
  matchSource: MatchRecord[] = matches,
): CityMatch[] {
  const outcomes = buildMatchOutcomes(matchSource);

  return matchSource
    .filter((match) => match.hostCitySlug === hostCitySlug)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.matchNumber - b.matchNumber,
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
