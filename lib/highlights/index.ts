import {
  fetchHighlightsForMatch,
  getFeedCacheSeconds,
  getHighlightlyTeamName,
  getLeagueId,
  isHighlightlyConfigured,
} from "@/lib/highlights/highlightly";
import {
  getFallbackHighlightVideos,
  getFifaMatchHighlightsUrl,
} from "@/lib/highlights/fallback";
import {
  getCacheTtlSeconds,
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

  const lookupSlugs = getHighlightLookupSlugs(match);
  const fallbackUrl = getFifaMatchHighlightsUrl(match);
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

  let highlightlyVideos: HighlightVideo[] = [];

  if (isHighlightlyConfigured()) {
    try {
      highlightlyVideos = await getVideosForMatch(
        match.date,
        lookupSlugs.home,
        lookupSlugs.away,
      );
    } catch {
      highlightlyVideos = [];
    }
  }

  if (highlightlyVideos.length > 0) {
    return {
      matchNumber,
      status: "available",
      videos: highlightlyVideos,
      fallbackUrl,
      cachedAt,
    };
  }

  const fallbackVideos = getFallbackHighlightVideos(
    match,
    lookupSlugs.home,
    lookupSlugs.away,
  );
  const hasEmbed = fallbackVideos.some((video) => video.embedHtml);

  return {
    matchNumber,
    status: "available",
    videos: fallbackVideos,
    fallbackUrl,
    cachedAt,
    message: hasEmbed
      ? undefined
      : isHighlightlyConfigured()
        ? "No embedded clips in Highlightly yet — try FIFA.com or YouTube below."
        : "Add HIGHLIGHTLY_API_KEY for auto-embedded clips, or use the links below.",
  };
}

export { getCacheTtlSeconds };
