import {
  fetchEspnGamesWindow,
  parseEspnGameFromEvent,
} from "@/lib/espn/scoreboard";
import type { EspnScoreboardGame } from "@/lib/espn/types";
import { teamNamesMatch, teamsMatchByName } from "@/lib/highlights/team-names";
import type {
  LiveMatchUpdate,
  LiveSchedulePayload,
} from "@/lib/schedule/live-updates";
import type { TournamentScheduleMatch } from "@/lib/schedule/tournament-schedule";
import { getTournamentSchedule } from "@/lib/schedule/tournament-schedule";
import { getTeam, teams } from "@/lib/teams";

export type { LiveMatchUpdate, LiveSchedulePayload } from "@/lib/schedule/live-updates";

const KICKOFF_MATCH_TOLERANCE_MS = 2 * 60 * 60 * 1000;

function isRealTeamSlug(slug: string): boolean {
  return !slug.startsWith("winner:") && !slug.startsWith("loser:");
}

function parseScore(value: string | null | undefined): number | null {
  if (value == null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function findTeamSlugByEspnName(name: string | undefined): string | null {
  if (!name) {
    return null;
  }

  const team = teams.find((entry) => teamNamesMatch(name, entry.name));
  return team?.slug ?? null;
}

function toLiveMatchUpdate(
  matchNumber: number,
  game: EspnScoreboardGame,
): LiveMatchUpdate {
  return {
    matchNumber,
    homeScore: parseScore(game.home.score),
    awayScore: parseScore(game.away.score),
    homeTeamSlug: findTeamSlugByEspnName(game.home.name),
    awayTeamSlug: findTeamSlugByEspnName(game.away.name),
    isLive: game.isLive,
    isFinal: game.status === "final",
    statusLabel: game.statusLabel,
    espnUrl: game.espnUrl,
  };
}

function teamsMatchFixture(
  game: EspnScoreboardGame,
  match: TournamentScheduleMatch,
): boolean {
  if (!isRealTeamSlug(match.homeSlug) || !isRealTeamSlug(match.awaySlug)) {
    return false;
  }

  const homeTeam = getTeam(match.homeSlug);
  const awayTeam = getTeam(match.awaySlug);
  if (!homeTeam || !awayTeam) {
    return false;
  }

  return teamsMatchByName(
    game.home.name,
    game.away.name,
    homeTeam.name,
    awayTeam.name,
  );
}

function kickoffMatches(
  game: EspnScoreboardGame,
  match: TournamentScheduleMatch,
): boolean {
  if (match.kickoffMs == null) {
    return false;
  }

  const gameTime = new Date(game.date).getTime();
  return Math.abs(gameTime - match.kickoffMs) <= KICKOFF_MATCH_TOLERANCE_MS;
}

function sharesKnownTeam(
  game: EspnScoreboardGame,
  match: TournamentScheduleMatch,
): boolean {
  for (const slug of [match.homeSlug, match.awaySlug]) {
    if (!isRealTeamSlug(slug)) {
      continue;
    }

    const team = getTeam(slug);
    if (!team) {
      continue;
    }

    if (
      teamNamesMatch(game.home.name, team.name) ||
      teamNamesMatch(game.away.name, team.name)
    ) {
      return true;
    }
  }

  return false;
}

function teamsMatchPlaceholderFixture(
  game: EspnScoreboardGame,
  match: TournamentScheduleMatch,
): boolean {
  if (isRealTeamSlug(match.homeSlug) && isRealTeamSlug(match.awaySlug)) {
    return false;
  }

  if (!kickoffMatches(game, match)) {
    return false;
  }

  return Boolean(
    findTeamSlugByEspnName(game.home.name) &&
      findTeamSlugByEspnName(game.away.name),
  );
}

function findMatchNumberForEspnGame(
  game: EspnScoreboardGame,
  schedule: TournamentScheduleMatch[],
): number | null {
  const byTeams = schedule.find((match) => teamsMatchFixture(game, match));
  if (byTeams) {
    return byTeams.matchNumber;
  }

  const byPlaceholderTeams = schedule.filter((match) =>
    teamsMatchPlaceholderFixture(game, match),
  );
  if (byPlaceholderTeams.length === 1) {
    return byPlaceholderTeams[0]!.matchNumber;
  }

  const byKickoffAndTeam = schedule.filter(
    (match) => kickoffMatches(game, match) && sharesKnownTeam(game, match),
  );
  if (byKickoffAndTeam.length === 1) {
    return byKickoffAndTeam[0]!.matchNumber;
  }

  const byKickoff = schedule.filter((match) => kickoffMatches(game, match));
  if (byKickoff.length === 1) {
    return byKickoff[0]!.matchNumber;
  }

  return null;
}

export function mapEspnGamesToLiveUpdates(
  games: EspnScoreboardGame[],
  schedule: TournamentScheduleMatch[],
): LiveMatchUpdate[] {
  const updates = new Map<number, LiveMatchUpdate>();

  for (const game of games) {
    const matchNumber = findMatchNumberForEspnGame(game, schedule);
    if (matchNumber == null) {
      continue;
    }

    updates.set(matchNumber, toLiveMatchUpdate(matchNumber, game));
  }

  return [...updates.values()].sort((left, right) => left.matchNumber - right.matchNumber);
}

export async function getLiveSchedulePayload(
  now = new Date(),
): Promise<LiveSchedulePayload> {
  const schedule = getTournamentSchedule();
  const events = await fetchEspnGamesWindow(now, 14, 4);
  const games = events
    .map(parseEspnGameFromEvent)
    .filter((game): game is EspnScoreboardGame => game != null);

  return {
    fetchedAt: now.toISOString(),
    updates: mapEspnGamesToLiveUpdates(games, schedule),
  };
}
