export type MatchStage =
  | "group"
  | "round-of-32"
  | "round-of-16"
  | "quarter-final"
  | "semi-final"
  | "third-place"
  | "final";

export type TeamMatch = {
  matchNumber: number;
  stage: MatchStage;
  date: string;
  matchday?: number;
  group?: string;
  homeSlug: string;
  awaySlug: string;
  homeScore: number | null;
  awayScore: number | null;
  hostCitySlug: string;
  stadium: string;
  isHome: boolean;
  opponentSlug: string;
  isPlayed: boolean;
  isElimination?: boolean;
};

/** Neutral fixture row for host-city schedules (home vs away). */
export type CityMatch = {
  matchNumber: number;
  stage: MatchStage;
  date: string;
  matchday?: number;
  group?: string;
  homeSlug: string;
  awaySlug: string;
  homeScore: number | null;
  awayScore: number | null;
  hostCitySlug: string;
  stadium: string;
  isPlayed: boolean;
};

export type MatchRecord = {
  matchNumber: number;
  stage: MatchStage;
  date: string;
  matchday?: number;
  group?: string;
  homeSlug: string;
  awaySlug: string;
  homeScore: number | null;
  awayScore: number | null;
  hostCitySlug: string;
  stadium: string;
};
