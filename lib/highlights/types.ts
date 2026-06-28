export type HighlightVideo = {
  id: string;
  title: string;
  embedHtml: string;
  thumbnailUrl?: string;
};

export type MatchHighlightsStatus =
  | "available"
  | "pending"
  | "unavailable"
  | "not_configured";

export type MatchHighlightsResponse = {
  matchNumber: number;
  status: MatchHighlightsStatus;
  videos: HighlightVideo[];
  fallbackUrl: string;
  cachedAt: string;
  message?: string;
};
