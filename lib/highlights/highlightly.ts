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
    id?: number;
    homeTeam?: { id?: number; name?: string };
    awayTeam?: { id?: number; name?: string };
    league?: { id?: number; name?: string };
  };
};

type HighlightlyMatch = {
  id?: number;
  homeTeam?: { name?: string };
  awayTeam?: { name?: string };
};

type HighlightlyResponse<T> = {
  data?: T[];
  pagination?: { totalCount?: number };
  plan?: { tier?: string; message?: string };
};

const DEFAULT_BASE_URL = "https://soccer.highlightly.net";
const FALLBACK_BASE_URL = "https://sports.highlightly.net";
const RAPIDAPI_BASE_URL = "https://football-highlights-api.p.rapidapi.com";
const RAPIDAPI_HOST = "football-highlights-api.p.rapidapi.com";
/** World Cup 2026 league ID — https://highlightly.net/blogs/build-a-world-cup-2026-live-tracker */
const DEFAULT_LEAGUE_ID = 1635;
const DEFAULT_TIMEZONE = "America/New_York";
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

export function getLeagueId(): number | undefined {
  const configured = process.env.HIGHLIGHTLY_LEAGUE_ID?.trim();
  if (configured?.toLowerCase() === "none") {
    return undefined;
  }
  if (configured) {
    const parsed = Number(configured);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return DEFAULT_LEAGUE_ID;
}

function getHighlightsPath(baseUrl: string): string {
  if (baseUrl.includes("sports.highlightly.net")) {
    return "/football/highlights";
  }
  return "/highlights";
}

function getMatchesPath(baseUrl: string): string {
  if (baseUrl.includes("sports.highlightly.net")) {
    return "/football/matches";
  }
  return "/matches";
}

function getTimezone(): string {
  return process.env.HIGHLIGHTLY_TIMEZONE?.trim() || DEFAULT_TIMEZONE;
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

function buildEmbedOrLink(
  highlight: HighlightlyHighlight,
): Pick<HighlightVideo, "embedHtml" | "watchUrl"> | null {
  const candidates = [highlight.embedUrl, highlight.url].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const embedHtml = buildHighlightEmbed(candidate, highlight.title ?? "Highlight");
    if (embedHtml) {
      return { embedHtml };
    }
  }

  if (highlight.url) {
    return { watchUrl: highlight.url };
  }

  return null;
}

function highlightToVideo(highlight: HighlightlyHighlight): HighlightVideo | null {
  if (!highlight.title) {
    return null;
  }

  const presentation = buildEmbedOrLink(highlight);
  if (!presentation) {
    return null;
  }

  return {
    id: String(highlight.id ?? highlight.url ?? highlight.title),
    title: highlight.title,
    thumbnailUrl: highlight.imgUrl,
    ...presentation,
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
  date?: string;
  offset?: number;
  limit?: number;
  leagueId?: number;
  leagueName?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  matchId?: number;
};

type MatchQuery = {
  date: string;
  offset?: number;
  limit?: number;
  leagueId?: number;
  leagueName?: string;
};

async function fetchHighlightlyPage<T>(
  path: string,
  query: HighlightQuery | MatchQuery,
  baseUrl: string,
): Promise<HighlightlyResponse<T>> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { data: [] };
  }

  const { headers } = getRequestConfig(baseUrl);
  const params = new URLSearchParams({
    limit: String(query.limit ?? PAGE_LIMIT),
    offset: String(query.offset ?? 0),
  });

  if ("date" in query && query.date) {
    params.set("date", query.date);
  }

  params.set("timezone", getTimezone());

  if ("matchId" in query && query.matchId) {
    params.set("matchId", String(query.matchId));
  }
  if (query.leagueId) {
    params.set("leagueId", String(query.leagueId));
  }
  if ("leagueName" in query && query.leagueName) {
    params.set("leagueName", query.leagueName);
  }
  if ("homeTeamName" in query && query.homeTeamName) {
    params.set("homeTeamName", query.homeTeamName);
  }
  if ("awayTeamName" in query && query.awayTeamName) {
    params.set("awayTeamName", query.awayTeamName);
  }

  const response = await fetch(`${baseUrl}${path}?${params.toString()}`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Highlightly request failed (${response.status})`);
  }

  return (await response.json()) as HighlightlyResponse<T>;
}

async function fetchAllHighlightPages(
  query: Omit<HighlightQuery, "offset">,
  baseUrl: string,
): Promise<HighlightlyHighlight[]> {
  const path = useRapidApi() ? "/highlights" : getHighlightsPath(baseUrl);
  const firstPage = await fetchHighlightlyPage<HighlightlyHighlight>(
    path,
    query,
    baseUrl,
  );
  const highlights = [...(firstPage.data ?? [])];
  const totalCount = firstPage.pagination?.totalCount ?? highlights.length;
  const limit = query.limit ?? PAGE_LIMIT;

  for (let offset = limit; offset < totalCount; offset += limit) {
    const page = await fetchHighlightlyPage<HighlightlyHighlight>(
      path,
      { ...query, offset },
      baseUrl,
    );
    highlights.push(...(page.data ?? []));
  }

  return highlights;
}

async function fetchAllMatchPages(
  query: Omit<MatchQuery, "offset">,
  baseUrl: string,
): Promise<HighlightlyMatch[]> {
  const path = useRapidApi() ? "/matches" : getMatchesPath(baseUrl);
  const firstPage = await fetchHighlightlyPage<HighlightlyMatch>(
    path,
    query,
    baseUrl,
  );
  const matches = [...(firstPage.data ?? [])];
  const totalCount = firstPage.pagination?.totalCount ?? matches.length;
  const limit = query.limit ?? PAGE_LIMIT;

  for (let offset = limit; offset < totalCount; offset += limit) {
    const page = await fetchHighlightlyPage<HighlightlyMatch>(
      path,
      { ...query, offset },
      baseUrl,
    );
    matches.push(...(page.data ?? []));
  }

  return matches;
}

async function fetchHighlightsWithBaseUrls(
  query: Omit<HighlightQuery, "offset">,
): Promise<HighlightlyHighlight[]> {
  for (const baseUrl of getBaseUrls()) {
    try {
      const highlights = await fetchAllHighlightPages(query, baseUrl);
      if (highlights.length > 0) {
        return highlights;
      }
    } catch {
      continue;
    }
  }

  return [];
}

async function fetchMatchesWithBaseUrls(
  query: Omit<MatchQuery, "offset">,
): Promise<HighlightlyMatch[]> {
  for (const baseUrl of getBaseUrls()) {
    try {
      const matches = await fetchAllMatchPages(query, baseUrl);
      if (matches.length > 0) {
        return matches;
      }
    } catch {
      continue;
    }
  }

  return [];
}

function findHighlightlyMatchId(
  matches: HighlightlyMatch[],
  homeName: string,
  awayName: string,
): number | undefined {
  for (const match of matches) {
    if (
      teamsMatchByName(
        match.homeTeam?.name,
        match.awayTeam?.name,
        homeName,
        awayName,
      ) &&
      match.id
    ) {
      return match.id;
    }
  }

  return undefined;
}

async function fetchHighlightsByMatchId(
  matchId: number,
  leagueId?: number,
): Promise<HighlightVideo[]> {
  const highlights = await fetchHighlightsWithBaseUrls({
    matchId,
    leagueId,
    limit: MATCH_QUERY_LIMIT,
  });

  return highlightsToVideos(highlights);
}

async function resolveHighlightlyMatchId(
  date: string,
  homeName: string,
  awayName: string,
  leagueId?: number,
): Promise<number | undefined> {
  if (!leagueId) {
    return undefined;
  }

  const matches = await fetchMatchesWithBaseUrls({ date, leagueId });
  return findHighlightlyMatchId(matches, homeName, awayName);
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

/** Shared World Cup date feed (leagueId 1635 by default). */
export async function fetchWorldCupDateFeed(
  date: string,
): Promise<HighlightlyHighlight[]> {
  const leagueId = getLeagueId();
  if (leagueId) {
    const byLeagueId = await fetchHighlightsWithBaseUrls({ date, leagueId });
    if (byLeagueId.length > 0) {
      return byLeagueId;
    }
  }

  for (const leagueName of getLeagueCandidates()) {
    const highlights = await fetchHighlightsWithBaseUrls({ date, leagueName });
    if (highlights.length > 0) {
      return highlights;
    }
  }

  return fetchHighlightsWithBaseUrls({ date });
}

/** Targeted lookup for a single fixture, with matchId + date-feed fallbacks. */
export async function fetchHighlightsForMatch(
  date: string,
  homeName: string,
  awayName: string,
): Promise<HighlightVideo[]> {
  const leagueId = getLeagueId();

  if (leagueId) {
    const matchId = await resolveHighlightlyMatchId(
      date,
      homeName,
      awayName,
      leagueId,
    );
    if (matchId) {
      const byMatchId = await fetchHighlightsByMatchId(matchId, leagueId);
      if (byMatchId.length > 0) {
        return byMatchId;
      }
    }
  }

  async function queryVideos(
    homeTeamName: string,
    awayTeamName: string,
    options?: { leagueName?: string; leagueId?: number },
  ): Promise<HighlightVideo[]> {
    const highlights = await fetchHighlightsWithBaseUrls({
      date,
      homeTeamName,
      awayTeamName,
      leagueId: options?.leagueId ?? leagueId,
      leagueName: options?.leagueName,
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

  if (leagueId) {
    const feed = await fetchWorldCupDateFeed(date);
    const fromFeed = findVideosInDateFeed(feed, homeName, awayName);
    if (fromFeed.length > 0) {
      return fromFeed;
    }
  }

  let videos = await queryVideos(homeName, awayName);
  if (videos.length > 0) {
    return videos;
  }

  for (const leagueName of getLeagueCandidates()) {
    videos = await queryVideos(homeName, awayName, { leagueName });
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
