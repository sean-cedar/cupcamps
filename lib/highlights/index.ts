import {
  fetchHighlightsForMatch,
  getFeedCacheSeconds,
  getHighlightlyTeamName,
  getLeagueId,
  isHighlightlyConfigured,
} from "@/lib/highlights/highlightly";
import {
  getCacheTtlSeconds,
  getFifaHighlightsFallbackUrl,
  getHighlightLookupSlugs,
  getMatchRecord,
  isMatchPlayed,
} from "@/lib/highlights/match";
import type { HighlightVideo, MatchHighlightsResponse } from "@/lib/highlights/types";
import { unstable_cache } from "next/cache";

function getCachedMatchHighlights(
  date: string,
  homeSlug: string,
  awaySlug: string,
  homeName: string,
  awayName: string,
) {
  return unstable_cache(
    async () => fetchHighlightsForMatch(date, homeName, awayName),
    ["highlightly-match", date, homeSlug, awaySlug, String(getLeagueId() ?? "none")],
    { revalidate: getFeedCacheSeconds() },
  )();
}

async function getVideosForMatch(
  date: string,
  homeSlug: string,
  awaySlug: string,
): Promise<HighlightVideo[]> {
  const homeName = getHighlightlyTeamName(homeSlug);
  const awayName = getHighlightlyTeamName(awaySlug);

  if (!homeName || !awayName) {
    return [];
  }

  return getCachedMatchHighlights(date, homeSlug, awaySlug, homeName, awayName);
}

export async function getMatchHighlights(
  matchNumber: number,
): Promise<MatchHighlightsResponse | null> {
  const match = getMatchRecord(matchNumber);
  if (!match) {
    return null;
  }

  const fallbackUrl = getFifaHighlightsFallbackUrl();
  const cachedAt = new Date().toISOString();

  if (!isMatchPlayed(match)) {
    return {
      matchNumber,
      status: "unavailable",
      videos: [],
      fallbackUrl,
      cachedAt,
      message: "Highlights are available after the final whistle.",
    };
  }

  const lookupSlugs = getHighlightLookupSlugs(match);
  if (!lookupSlugs) {
    return {
      matchNumber,
      status: "pending",
      videos: [],
      fallbackUrl,
      cachedAt,
      message: "Waiting for both teams to be confirmed in the bracket.",
    };
  }

  if (!isHighlightlyConfigured()) {
    return {
      matchNumber,
      status: "not_configured",
      videos: [],
      fallbackUrl,
      cachedAt,
      message:
        "Add HIGHLIGHTLY_API_KEY to enable embedded highlights. Watch on FIFA.com in the meantime.",
    };
  }

  try {
    const videos = await getVideosForMatch(
      match.date,
      lookupSlugs.home,
      lookupSlugs.away,
    );

    if (videos.length > 0) {
      return {
        matchNumber,
        status: "available",
        videos,
        fallbackUrl,
        cachedAt,
      };
    }

    return {
      matchNumber,
      status: "pending",
      videos: [],
      fallbackUrl,
      cachedAt,
      message:
        "No embeddable highlights found for this match in Highlightly yet. Check FIFA.com, or verify your key is from highlightly.net (not RapidAPI) with league ID 1635.",
    };
  } catch {
    return {
      matchNumber,
      status: "pending",
      videos: [],
      fallbackUrl,
      cachedAt,
      message: "Could not load highlights right now. Try FIFA.com instead.",
    };
  }
}

export { getCacheTtlSeconds };
