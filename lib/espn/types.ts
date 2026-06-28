export type EspnScoreboardGameStatus =
  | "scheduled"
  | "in-progress"
  | "halftime"
  | "final"
  | "postponed"
  | "other";

export type EspnScoreboardTeam = {
  abbreviation: string;
  name: string;
  score: string | null;
  isWinner: boolean;
};

export type EspnScoreboardGame = {
  id: string;
  name: string;
  shortName: string;
  date: string;
  status: EspnScoreboardGameStatus;
  statusLabel: string;
  isLive: boolean;
  home: EspnScoreboardTeam;
  away: EspnScoreboardTeam;
  espnUrl: string;
};

export type EspnScoreboardResponse = {
  fetchedAt: string;
  dateKey: string;
  liveGames: EspnScoreboardGame[];
  recentGames: EspnScoreboardGame[];
  upcomingGames: EspnScoreboardGame[];
};
