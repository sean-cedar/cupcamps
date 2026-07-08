import {
  buildMatchOutcomes,
  resolveMatch,
} from "@/lib/schedule/bracket";
import { matches } from "@/lib/schedule/matches";
import type { MatchRecord, MatchStage } from "@/lib/schedule/types";
import { getStageLabel } from "@/lib/schedule";
import { getTeam } from "@/lib/teams";

export type BracketParticipantView = {
  slug: string;
  label: string;
  countryCode: string | null;
  isPlaceholder: boolean;
  isWinner: boolean;
};

export type BracketMatchView = {
  matchNumber: number;
  stage: MatchStage;
  date: string;
  home: BracketParticipantView;
  away: BracketParticipantView;
  homeScore: number | null;
  awayScore: number | null;
  isPlayed: boolean;
  hostCitySlug: string;
  stadium: string;
};

export type BracketRoundView = {
  stage: MatchStage;
  label: string;
  matches: BracketMatchView[];
};

const ROUND_DEFINITIONS: Array<{
  stage: MatchStage;
  matchNumbers: number[];
}> = [
  {
    stage: "round-of-32",
    matchNumbers: [
      73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88,
    ],
  },
  {
    stage: "round-of-16",
    matchNumbers: [89, 90, 91, 92, 93, 94, 95, 96],
  },
  {
    stage: "quarter-final",
    matchNumbers: [97, 98, 99, 100],
  },
  {
    stage: "semi-final",
    matchNumbers: [101, 102],
  },
  {
    stage: "final",
    matchNumbers: [104, 103],
  },
];

function isTeamSlug(slug: string): boolean {
  return !slug.startsWith("winner:") && !slug.startsWith("loser:");
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

function toParticipant(
  slug: string,
  isWinner: boolean,
): BracketParticipantView {
  const team = isTeamSlug(slug) ? getTeam(slug) : null;

  return {
    slug,
    label: resolveSlugLabel(slug),
    countryCode: team?.countryCode ?? null,
    isPlaceholder: !isTeamSlug(slug),
    isWinner,
  };
}

function getBracketMatchView(
  matchNumber: number,
  outcomes: ReturnType<typeof buildMatchOutcomes>,
  matchSource: MatchRecord[] = matches,
): BracketMatchView | null {
  const resolved = resolveMatch(matchNumber, outcomes, matchSource);
  if (!resolved) {
    return null;
  }

  const homeSlug = resolved.resolvedHomeSlug ?? resolved.homeSlug;
  const awaySlug = resolved.resolvedAwaySlug ?? resolved.awaySlug;
  const isPlayed =
    resolved.homeScore !== null && resolved.awayScore !== null;

  let homeWinner = false;
  let awayWinner = false;

  if (isPlayed) {
    if (resolved.homeScore! > resolved.awayScore!) {
      homeWinner = true;
    } else if (resolved.awayScore! > resolved.homeScore!) {
      awayWinner = true;
    }
  }

  return {
    matchNumber: resolved.matchNumber,
    stage: resolved.stage,
    date: resolved.date,
    home: toParticipant(homeSlug, homeWinner),
    away: toParticipant(awaySlug, awayWinner),
    homeScore: resolved.homeScore,
    awayScore: resolved.awayScore,
    isPlayed,
    hostCitySlug: resolved.hostCitySlug,
    stadium: resolved.stadium,
  };
}

export function getKnockoutBracketRounds(
  matchSource: MatchRecord[] = matches,
): BracketRoundView[] {
  const outcomes = buildMatchOutcomes(matchSource);

  return ROUND_DEFINITIONS.map(({ stage, matchNumbers }) => {
    const roundMatches = matchNumbers
      .map((matchNumber) =>
        getBracketMatchView(matchNumber, outcomes, matchSource),
      )
      .filter((match): match is BracketMatchView => Boolean(match));

    const label =
      stage === "final"
        ? "Finals"
        : getStageLabel(stage);

    return {
      stage,
      label,
      matches: roundMatches,
    };
  });
}

export function getKnockoutProgress(
  matchSource: MatchRecord[] = matches,
): {
  played: number;
  total: number;
  champion: BracketParticipantView | null;
} {
  const outcomes = buildMatchOutcomes(matchSource);
  const knockoutMatches = matchSource.filter((match) => match.stage !== "group");
  const played = knockoutMatches.filter(
    (match) => match.homeScore !== null && match.awayScore !== null,
  ).length;

  const final = getBracketMatchView(104, outcomes, matchSource);
  const champion =
    final?.isPlayed && final.home.isWinner
      ? final.home
      : final?.isPlayed && final.away.isWinner
        ? final.away
        : null;

  return {
    played,
    total: knockoutMatches.length,
    champion,
  };
}
