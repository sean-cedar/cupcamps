import { buildMatchOutcomes, resolveMatch } from "@/lib/schedule/bracket";
import { matches } from "@/lib/schedule/matches";
import type { MatchRecord } from "@/lib/schedule/types";
import { getTeam } from "@/lib/teams";

const FIFA_HIGHLIGHTS_URL =
  "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/highlights";

const matchByNumber = new Map(matches.map((match) => [match.matchNumber, match]));

function isPlaceholderSlug(slug: string): boolean {
  return slug.startsWith("winner:") || slug.startsWith("loser:");
}

export function getMatchRecord(matchNumber: number): MatchRecord | undefined {
  return matchByNumber.get(matchNumber);
}

export function isMatchPlayed(match: MatchRecord): boolean {
  return match.homeScore !== null && match.awayScore !== null;
}

export function getFifaHighlightsFallbackUrl(): string {
  return FIFA_HIGHLIGHTS_URL;
}

/** Real team slugs for both sides, or null if bracket placeholders remain. */
export function getHighlightLookupSlugs(
  match: MatchRecord,
): { home: string; away: string } | null {
  const outcomes = buildMatchOutcomes();
  const resolved = resolveMatch(match.matchNumber, outcomes);
  if (!resolved?.resolvedHomeSlug || !resolved.resolvedAwaySlug) {
    return null;
  }

  if (
    isPlaceholderSlug(resolved.resolvedHomeSlug) ||
    isPlaceholderSlug(resolved.resolvedAwaySlug)
  ) {
    return null;
  }

  return {
    home: resolved.resolvedHomeSlug,
    away: resolved.resolvedAwaySlug,
  };
}

export function getMatchTitle(match: MatchRecord): string {
  const slugs = getHighlightLookupSlugs(match);
  if (!slugs) {
    return `Match ${match.matchNumber}`;
  }

  const home = getTeam(slugs.home)?.name ?? slugs.home;
  const away = getTeam(slugs.away)?.name ?? slugs.away;
  return `${home} vs ${away}`;
}

export function getCacheTtlSeconds(match: MatchRecord): number {
  if (!isMatchPlayed(match)) {
    return 60;
  }

  const kickoff = new Date(`${match.date}T20:00:00Z`).getTime();
  const hoursSinceKickoff = (Date.now() - kickoff) / (1000 * 60 * 60);

  if (hoursSinceKickoff >= 24) {
    return 6 * 60 * 60;
  }
  if (hoursSinceKickoff >= 3) {
    return 30 * 60;
  }
  return 5 * 60;
}
