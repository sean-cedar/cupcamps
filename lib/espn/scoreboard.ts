import type {
  EspnScoreboardGame,
  EspnScoreboardGameStatus,
  EspnScoreboardResponse,
} from "@/lib/espn/types";

const ESPN_SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

type EspnCompetitor = {
  homeAway?: string;
  score?: string;
  winner?: boolean;
  team?: {
    abbreviation?: string;
    displayName?: string;
    shortDisplayName?: string;
  };
};

type EspnEvent = {
  id?: string;
  date?: string;
  name?: string;
  shortName?: string;
  links?: { href?: string; rel?: string[] }[];
  status?: {
    type?: {
      state?: string;
      description?: string;
      shortDetail?: string;
    };
  };
  competitions?: {
    competitors?: EspnCompetitor[];
  }[];
};

type EspnScoreboardPayload = {
  events?: EspnEvent[];
};

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export { formatDateKey };

function normalizeStatus(state?: string): EspnScoreboardGameStatus {
  switch (state) {
    case "pre":
      return "scheduled";
    case "in":
      return "in-progress";
    case "halftime":
      return "halftime";
    case "post":
      return "final";
    case "postponed":
      return "postponed";
    default:
      return "other";
  }
}

function parseTeam(competitor: EspnCompetitor | undefined) {
  return {
    abbreviation: competitor?.team?.abbreviation ?? "—",
    name:
      competitor?.team?.shortDisplayName ??
      competitor?.team?.displayName ??
      "TBD",
    score: competitor?.score ?? null,
    isWinner: Boolean(competitor?.winner),
  };
}

function parseGame(event: EspnEvent): EspnScoreboardGame | null {
  const competition = event.competitions?.[0];
  if (!competition?.competitors?.length) {
    return null;
  }

  const home =
    competition.competitors.find((team) => team.homeAway === "home") ??
    competition.competitors[0];
  const away =
    competition.competitors.find((team) => team.homeAway === "away") ??
    competition.competitors[1];

  if (!away) {
    return null;
  }

  const status = normalizeStatus(event.status?.type?.state);
  const statusLabel =
    event.status?.type?.shortDetail ??
    event.status?.type?.description ??
    "Scheduled";
  const espnLink = event.links?.find((link) =>
    link.rel?.includes("summary"),
  )?.href;

  return {
    id: event.id ?? `${event.shortName}-${event.date}`,
    name: event.name ?? event.shortName ?? "World Cup match",
    shortName: event.shortName ?? event.name ?? "World Cup match",
    date: event.date ?? new Date().toISOString(),
    status,
    statusLabel,
    isLive: status === "in-progress" || status === "halftime",
    home: parseTeam(home),
    away: parseTeam(away),
    espnUrl: espnLink ?? "https://www.espn.com/soccer/league/_/name/fifa.world",
  };
}

function sortByDateDesc(games: EspnScoreboardGame[]): EspnScoreboardGame[] {
  return [...games].sort(
    (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
  );
}

function sortByDateAsc(games: EspnScoreboardGame[]): EspnScoreboardGame[] {
  return [...games].sort(
    (left, right) => new Date(left.date).getTime() - new Date(right.date).getTime(),
  );
}

export function parseEspnGameFromEvent(event: EspnEvent): EspnScoreboardGame | null {
  return parseGame(event);
}

async function fetchScoreboard(
  dateKey?: string,
  cache: RequestCache = "force-cache",
): Promise<EspnEvent[]> {
  const url = new URL(ESPN_SCOREBOARD_URL);
  if (dateKey) {
    url.searchParams.set("dates", dateKey);
  }

  const response = await fetch(url.toString(), {
    cache,
    ...(cache === "force-cache" ? { next: { revalidate: 30 } } : {}),
  });

  if (!response.ok) {
    throw new Error(`ESPN scoreboard request failed (${response.status})`);
  }

  const payload = (await response.json()) as EspnScoreboardPayload;
  return payload.events ?? [];
}

export async function fetchEspnGamesWindow(
  now = new Date(),
  daysBefore = 4,
  daysAfter = 4,
): Promise<EspnEvent[]> {
  const dateKeys = new Set<string>();

  for (let offset = -daysBefore; offset <= daysAfter; offset += 1) {
    const date = new Date(now);
    date.setDate(date.getDate() + offset);
    dateKeys.add(formatDateKey(date));
  }

  const eventLists = await Promise.all([
    fetchScoreboard(undefined, "no-store"),
    ...[...dateKeys].map((dateKey) => fetchScoreboard(dateKey, "no-store")),
  ]);

  const merged = new Map<string, EspnEvent>();
  for (const events of eventLists) {
    for (const event of events) {
      const key = event.id ?? `${event.shortName}-${event.date}`;
      merged.set(key, event);
    }
  }

  return [...merged.values()];
}

export async function getEspnScoreboard(
  now = new Date(),
): Promise<EspnScoreboardResponse> {
  const dateKey = formatDateKey(now);
  const [todayEvents, liveEvents] = await Promise.all([
    fetchScoreboard(dateKey, "no-store"),
    fetchScoreboard(undefined, "no-store"),
  ]);

  const merged = new Map<string, EspnScoreboardGame>();
  for (const event of [...todayEvents, ...liveEvents]) {
    const game = parseGame(event);
    if (game) {
      merged.set(game.id, game);
    }
  }

  const games = [...merged.values()];
  const liveGames = sortByDateAsc(games.filter((game) => game.isLive));
  const finalGames = sortByDateDesc(
    games.filter((game) => game.status === "final"),
  );
  const upcomingGames = sortByDateAsc(
    games.filter((game) => game.status === "scheduled"),
  );

  return {
    fetchedAt: now.toISOString(),
    dateKey,
    liveGames,
    recentGames: finalGames.slice(0, 8),
    upcomingGames: upcomingGames.slice(0, 4),
  };
}
