"use client";

import { MatchHighlightsPanel } from "@/components/teams/MatchHighlightsPanel";

type MatchHighlightsSectionProps = {
  matchNumber: number;
  isPlayed: boolean;
};

export function MatchHighlightsSection({
  matchNumber,
  isPlayed,
}: MatchHighlightsSectionProps) {
  if (!isPlayed) {
    return (
      <p className="text-sm text-muted">
        Highlights will appear here once this match has been played.
      </p>
    );
  }

  return <MatchHighlightsPanel matchNumber={matchNumber} open />;
}
