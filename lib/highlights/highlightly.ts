import { buildHighlightEmbed } from "@/lib/highlights/embed";
import {
  getTeamNameVariants,
  teamsMatchByName,
  textMentionsBothTeams,
} from "@/lib/highlights/team-names";
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
    league?: { id?: number; name?: string };
  };
};

type HighlightlyResponse = {
  data?: HighlightlyHighlight[];
  pagination?: { totalCount?: number };
  plan?: { tier?: string; message?: string };
};

const DEFAULT_BASE_URL = "https://soccer.highlightly.net";
const FALLBACK_BASE_URL = "https://sports.highlightly.net";
const RAPIDAPI_BASE_URL = "https://football-highlights-api.p.rapidapi.com";
const RAPIDAPI_HOST = "football-highlights-api.p.rapidapi.com";
const LEAGUE_NAME_CANDIDATES = [
  "World Cup",
  "FIFA World Cup",
  "FIFA World Cup 2026",
  "World Cup 2026",
];
const DEFAULT_FEED_CACHE_SECONDS = 1800;
const PAGE_LIMIT = 40;
const MATCH_QUERY_LIMIT = 20;

function getApiKey(): string | undefined {
  return process.env.HIGHLIGHTLY_API_KEY?.trim() || undefined;
}

function useRapidApi(): boolean {
  return process.env.HIGHLIGHTLY_API_MODE?.trim().toLowerCase() === "rapidapi";
}

function getLeagueCandidates(): string[] {
  const configured = process.env.HIGHLIGHTLY_LEAGUE_NAME?.trim();
  return configured ? [configured, ...LEAGUE_NAME_CANDIDATES] : LEAGUE_NAME_CANDIDATES;
}

function getTimezone(): string | undefined {
  return process.env.HIGHLIGHTLY_TIMEZONE?.trim() || undefined;
}

export function getFeedCacheSeconds(): number {
  const parsed = Number(process.env.HIGHLIGHTLY_FEED_CACHE_SECONDS);
  if (Number.isFinite(parsed) && parsed >= 900) {
    return parsed;
  }
  return DEFAULT_FEED_CACHE_SECONDS;
}

function getBaseUrls(): string[] {
  const configured = process.env.HIGHLIGHTLY_API_BASE_URL?.trim();
  if (configured) {
    return [configured];
  }

  if (useRapidApi()) {
    return [RAPIDAPI_BASE_URL];
  }

  return [DEFAULT_BASE_URL, FALLBACK_BASE_URL];
}

function getRequestConfig(baseUrl: string): {
  baseUrl: string;
  headers: Record<string, string>;
} {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { baseUrl, headers: {} };
  }

  if (useRapidApi()) {
    return {
      baseUrl,
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host":
          process.env.HIGHLIGHTLY_RAPIDAPI_HOST?.trim() || RAPIDAPI_HOST,
      },
    };
  }

  return {
    baseUrl,
    headers: {
      "x-rapidapi-key": apiKey,
    },
  };
}

export function getHighlightlyTeamName(teamSlug: string): string | null {
  return getTeam(teamSlug)?.name ?? null;
}

function highlightToVideo(highlight: HighlightlyHighlight): HighlightVideo | null {
  if (highlight.embeddable === false || !highlight.title) {
    return null;
  }

  const rawEmbed = highlight.embedUrl ?? highlight.url;
  if (!rawEmbed) {
    return null;
  }

  const embedHtml = buildHighlightEmbed(rawEmbed, highlight.title);
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

function dedupeVideos(videos: HighlightVideo[]): HighlightVideo[] {
  const seen = new Set<string>();
  return videos.filter((video) => {
    if (seen.has(video.id)) {
      return false;
    }
    seen.add(video.id);
    return true;
  });
}

function highlightsToVideos(
  highlights: HighlightlyHighlight[],
): HighlightVideo[] {
  const videos: HighlightVideo[] = [];

  for (const highlight of highlights) {
    const video = highlightToVideo(highlight);
    if (video) {
      videos.push(video);
    }
  }

  return dedupeVideos(videos);
}

export function highlightMatchesFixture(
  highlight: HighlightlyHighlight,
  homeName: string,
  awayName: string,
): boolean {
  if (
    teamsMatchByName(
      highlight.match?.homeTeam?.name,
      highlight.match?.awayTeam?.name,
      homeName,
      awayName,
    )
  ) {
    return true;
  }

  return (
    textMentionsBothTeams(highlight.title, homeName, awayName) ||
    textMentionsBothTeams(highlight.description ?? undefined, homeName, awayName)
  );
}

export function findVideosInDateFeed(
  feed: HighlightlyHighlight[],
  homeName: string,
  awayName: string,
): HighlightVideo[] {
  const videos: HighlightVideo[] = [];

  for (const highlight of feed) {
    if (!highlightMatchesFixture(highlight, homeName, awayName)) {
      continue;
    }

    const video = highlightToVideo(highlight);
    if (video) {
      videos.push(video);
    }
  }

  return dedupeVideos(videos);
}

export function isHighlightlyConfigured(): boolean {
  return Boolean(getApiKey());
}

type HighlightQuery = {
  date: string;
  offset?: number;
  limit?: number;
  leagueName?: string;
  homeTeamName?: string;
  awayTeamName?: string;
};

async function fetchHighlightlyPage(
  query: HighlightQuery,
  baseUrl: string,
): Promise<HighlightlyResponse> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { data: [] };
  }

  const { headers } = getRequestConfig(baseUrl);
  const path = useRapidApi() ? "/highlights" : "/football/highlights";
  const params = new URLSearchParams({
    date: query.date,
    limit: String(query.limit ?? PAGE_LIMIT),
    offset: String(query.offset ?? 0),
  });

  const timezone = getTimezone();
  if (timezone) {
    params.set("timezone", timezone);
  }

  if (query.leagueName) {
    params.set("leagueName", query.leagueName);
  }
  if (query.homeTeamName) {
    params.set("homeTeamName", query.homeTeamName);
  }
  if (query.awayTeamName) {
    params.set("awayTeamName", query.awayTeamName);
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

async function fetchAllPages(
  query: Omit<HighlightQuery, "offset">,
  baseUrl: string,
): Promise<HighlightlyHighlight[]> {
  const firstPage = await fetchHighlightlyPage(query, baseUrl);
  const highlights = [...(firstPage.data ?? [])];
  const totalCount = firstPage.pagination?.totalCount ?? highlights.length;
  const limit = query.limit ?? PAGE_LIMIT;

  for (let offset = limit; offset < totalCount; offset += limit) {
    const page = await fetchHighlightlyPage({ ...query, offset }, baseUrl);
    highlights.push(...(page.data ?? []));
  }

  return highlights;
}

async function fetchWithBaseUrls(
  query: Omit<HighlightQuery, "offset">,
): Promise<HighlightlyHighlight[]> {
  for (const baseUrl of getBaseUrls()) {
    try {
      const highlights = await fetchAllPages(query, baseUrl);
      if (highlights.length > 0) {
        return highlights;
      }
    } catch {
      continue;
    }
  }

  return [];
}

function buildTeamQueryPlans(
  homeName: string,
  awayName: string,
): Array<{ homeTeamName: string; awayTeamName: string }> {
  const plans: Array<{ homeTeamName: string; awayTeamName: string }> = [];
  const seen = new Set<string>();

  for (const homeTeamName of getTeamNameVariants(homeName)) {
    for (const awayTeamName of getTeamNameVariants(awayName)) {
      const key = `${homeTeamName}::${awayTeamName}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      plans.push({ homeTeamName, awayTeamName });
    }
  }

  return plans;
}

/** One Highlightly request per date — all matches that day share this feed. */
export async function fetchWorldCupDateFeed(
  date: string,
): Promise<HighlightlyHighlight[]> {
  const leagueCandidates = getLeagueCandidates();

  for (const leagueName of leagueCandidates) {
    const highlights = await fetchWithBaseUrls({ date, leagueName });
    if (highlights.length > 0) {
      return highlights;
    }
  }

  return fetchWithBaseUrls({ date });
}

/** Targeted lookup for a single fixture, with shared date-feed fallback. */
export async function fetchHighlightsForMatch(
  date: string,
  homeName: string,
  awayName: string,
): Promise<HighlightVideo[]> {
  async function queryVideos(
    homeTeamName: string,
    awayTeamName: string,
    leagueName?: string,
  ): Promise<HighlightVideo[]> {
    const highlights = await fetchWithBaseUrls({
      date,
      homeTeamName,
      awayTeamName,
      leagueName,
      limit: MATCH_QUERY_LIMIT,
    });

    const matched = highlights.filter((highlight) =>
      highlightMatchesFixture(highlight, homeName, awayName),
    );
    const matchedVideos = highlightsToVideos(matched);
    if (matchedVideos.length > 0) {
      return matchedVideos;
    }

    if (
      homeTeamName === homeName &&
      awayTeamName === awayName &&
      highlights.length > 0
    ) {
      return highlightsToVideos(highlights);
    }

    return [];
  }

  let videos = await queryVideos(homeName, awayName);
  if (videos.length > 0) {
    return videos;
  }

  for (const leagueName of getLeagueCandidates()) {
    videos = await queryVideos(homeName, awayName, leagueName);
    if (videos.length > 0) {
      return videos;
    }
  }

  for (const { homeTeamName, awayTeamName } of buildTeamQueryPlans(
    homeName,
    awayName,
  )) {
    if (homeTeamName === homeName && awayTeamName === awayName) {
      continue;
    }

    videos = await queryVideos(homeTeamName, awayTeamName);
    if (videos.length > 0) {
      return videos;
    }
  }

  const feed = await fetchWorldCupDateFeed(date);
  return findVideosInDateFeed(feed, homeName, awayName);
}
