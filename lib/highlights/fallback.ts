import matchMediaData from "@/data/match-media.json";
import { buildHighlightEmbed } from "@/lib/highlights/embed";
import type { HighlightVideo } from "@/lib/highlights/types";
import { getMatchTitle } from "@/lib/highlights/match";
import {
  getMatchPhotoSearchUrl,
  getYouTubeHighlightsSearchUrl,
} from "@/lib/schedule/match-media";
import { getTeam } from "@/lib/teams";
import type { MatchRecord } from "@/lib/schedule/types";

type MatchMediaEntry = {
  youtubeVideoId?: string;
  photoUrl?: string;
};

const mediaByMatch = matchMediaData as Record<string, MatchMediaEntry>;

function teamName(slug: string): string {
  return getTeam(slug)?.name ?? slug;
}

export function getCuratedMatchMedia(
  matchNumber: number,
): MatchMediaEntry | undefined {
  return mediaByMatch[String(matchNumber)];
}

export function getFifaMatchHighlightsUrl(match: MatchRecord): string {
  const title = getMatchTitle(match);
  const query = encodeURIComponent(`${title} highlights`);
  return `https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/highlights?q=${query}`;
}

export function getMatchPhotoUrl(
  match: MatchRecord,
  homeSlug: string,
  awaySlug: string,
): string {
  const curated = getCuratedMatchMedia(match.matchNumber)?.photoUrl;
  if (curated) {
    return curated;
  }

  return getMatchPhotoSearchUrl(teamName(homeSlug), teamName(awaySlug));
}

export function getYouTubeSearchUrl(match: MatchRecord): string {
  const slugs = { home: match.homeSlug, away: match.awaySlug };
  if (slugs.home.startsWith("winner:") || slugs.away.startsWith("winner:")) {
    return getYouTubeHighlightsSearchUrl(getMatchTitle(match), "");
  }

  return getYouTubeHighlightsSearchUrl(
    teamName(slugs.home),
    teamName(slugs.away),
  );
}

function videoFromYouTubeId(
  videoId: string,
  title: string,
): HighlightVideo | null {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedHtml = buildHighlightEmbed(watchUrl, title);
  if (!embedHtml) {
    return { id: videoId, title, watchUrl };
  }

  return {
    id: videoId,
    title,
    embedHtml,
    watchUrl,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
}

/** Curated or search-link fallbacks when Highlightly has nothing yet. */
export function getFallbackHighlightVideos(
  match: MatchRecord,
  homeSlug: string,
  awaySlug: string,
): HighlightVideo[] {
  const curatedId = getCuratedMatchMedia(match.matchNumber)?.youtubeVideoId;
  const title = `${getMatchTitle(match)} highlights`;

  if (curatedId) {
    const video = videoFromYouTubeId(curatedId, title);
    if (video) {
      return [video];
    }
  }

  return [
    {
      id: `youtube-search-${match.matchNumber}`,
      title,
      watchUrl: getYouTubeHighlightsSearchUrl(
        teamName(homeSlug),
        teamName(awaySlug),
      ),
    },
  ];
}
