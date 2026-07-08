export type LiveMatchUpdate = {
  matchNumber: number;
  homeScore: number | null;
  awayScore: number | null;
  homeTeamSlug: string | null;
  awayTeamSlug: string | null;
  isLive: boolean;
  isFinal: boolean;
  statusLabel: string;
  espnUrl: string;
};

export type LiveSchedulePayload = {
  fetchedAt: string;
  updates: LiveMatchUpdate[];
};
