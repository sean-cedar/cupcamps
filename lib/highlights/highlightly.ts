import { buildHighlightEmbed } from "@/lib/highlights/embed";
import { teamsMatchByName } from "@/lib/highlights/team-names";
import type { HighlightVideo } from "@/lib/highlights/types";
import { getTeam } from "@/lib/teams";

export type HighlightlyHighlight = {
  id?: string | number;
  title?: string;
  description?: string | null;
  url?: string;
  embedUrl?: string;
  embeddable?: boolean;
  imgUrl?: string;
  source?: string;
  type?: string;
  match?: {
    homeTeam?: { id?: number; name?: string };
    awayTeam?: { id?: number; name?: string };
  };
};

type HighlightlyResponse = {
  data?: HighlightlyHighlight[];
  pagination?: { totalCount?: number };
};

const DEFAULT_BASE_URL = "https://sports.highlightly.net";
const RAPIDAPI_BASE_URL = "https://football-highlights-api.p.rapidapi.com";
const RAPIDAPI_HOST = "football-highlights-api.p.rapidapi.com";
const LEAGUE_NAME_CANDIDATES = [
  "World Cup",
  "FIFA World Cup",
  "FIFA World Cup 2026",
];
const DEFAULT_FEED_CACHE_SECONDS = 1800;
const PAGE_LIMIT = 40;

function getApiKey(): string | undefined {
  return process.env.HIGHLIGHTLY_API_KEY?.trim() || undefined;
}

function useRapidApi(): boolean {
  return process.env.HIGHLIGHTLY_API_MODE?.trim().toLowerCase() === "rapidapi";
}

export function getFeedCacheSeconds(): number {
  const parsed = Number(process.env.HIGHLIGHTLY_FEED_CACHE_SECONDS);
  if (Number.isFinite(parsed) && parsed >= 900) {
    return parsed;
  }
  return DEFAULT_FEED_CACHE_SECONDS;
}

function getRequestConfig(): { baseUrl: string; headers: Record<string, string> } {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { baseUrl: DEFAULT_BASE_URL, headers: {} };
  }

  if (useRapidApi()) {
    return {
      baseUrl: process.env.HIGHLIGHTLY_API_BASE_URL?.trim() || RAPIDAPI_BASE_URL,
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host":
          process.env.HIGHLIGHTLY_RAPIDAPI_HOST?.trim() || RAPIDAPI_HOST,
      },
    };
  }

  return {
    baseUrl: process.env.HIGHLIGHTLY_API_BASE_URL?.trim() || DEFAULT_BASE_URL,
    headers: {
      "x-rapidapi-key": apiKey,
    },
  };
}

export function getHighlightlyTeamName(teamSlug: string): string | null {
  return getTeam(teamSlug)?.name ?? null;
}

function highlightToVideo(highlight: HighlightlyHighlight): HighlightVideo | null {
  if (highlight.embeddable === false || !highlight.embedUrl || !highlight.title) {
    return null;
  }

  const embedHtml = buildHighlightEmbed(highlight.embedUrl, highlight.title);
  if (!embedHtml) {
    return null;
  }

  return {
    id: String(highlight.id ?? highlight.url ?? highlight.title),
    title: highlight.title,
    embedHtml,
    thumbnailUrl: highlight.imgUrl,
  };
}

export function findVideosInDateFeed(
  feed: HighlightlyHighlight[],
  homeName: string,
  awayName: string,
): HighlightVideo[] {
  const videos: HighlightVideo[] = [];

  for (const highlight of feed) {
    if (
      !teamsMatchByName(
        highlight.match?.homeTeam?.name,
        highlight.match?.awayTeam?.name,
        homeName,
        awayName,
      )
    ) {
      continue;
    }

    const video = highlightToVideo(highlight);
    if (video) {
      videos.push(video);
    }
  }

  return videos;
}

export function isHighlightlyConfigured(): boolean {
  return Boolean(getApiKey());
}

async function fetchHighlightlyPage(
  date: string,
  offset: number,
  leagueName?: string,
): Promise<HighlightlyResponse> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { data: [] };
  }

  const { baseUrl, headers } = getRequestConfig();
  const path = useRapidApi() ? "/highlights" : "/football/highlights";
  const params = new URLSearchParams({
    date,
    limit: String(PAGE_LIMIT),
    offset: String(offset),
  });

  if (leagueName) {
    params.set("leagueName", leagueName);
  }

  const response = await fetch(`${baseUrl}${path}?${params.toString()}`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Highlightly feed failed (${response.status})`);
  }

  return (await response.json()) as HighlightlyResponse;
}

async function fetchAllPagesForLeague(
  date: string,
  leagueName?: string,
): Promise<HighlightlyHighlight[]> {
  const firstPage = await fetchHighlightlyPage(date, 0, leagueName);
  const highlights = [...(firstPage.data ?? [])];
  const totalCount = firstPage.pagination?.totalCount ?? highlights.length;

  for (let offset = PAGE_LIMIT; offset < totalCount; offset += PAGE_LIMIT) {
    const page = await fetchHighlightlyPage(date, offset, leagueName);
    highlights.push(...(page.data ?? []));
  }

  return highlights;
}

/** One Highlightly request per date — all matches that day share this feed. */
export async function fetchWorldCupDateFeed(
  date: string,
): Promise<HighlightlyHighlight[]> {
  const configuredLeague = process.env.HIGHLIGHTLY_LEAGUE_NAME?.trim();
  const leagueCandidates = configuredLeague
    ? [configuredLeague]
    : LEAGUE_NAME_CANDIDATES;

  for (const leagueName of leagueCandidates) {
    const highlights = await fetchAllPagesForLeague(date, leagueName);
    if (highlights.length > 0) {
      return highlights;
    }
  }

  return fetchAllPagesForLeague(date);
}
