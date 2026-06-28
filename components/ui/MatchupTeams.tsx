import type { MouseEvent } from "react";
import { TeamIdentity } from "@/components/ui/TeamIdentity";

type MatchupParticipant = {
  slug: string | null;
  label: string;
  countryCode: string | null;
};

type MatchupTeamsProps = {
  home: MatchupParticipant;
  away: MatchupParticipant;
  kitSize?: "sm" | "md" | "lg";
  onTeamClick?: (event: MouseEvent) => void;
};

export function MatchupTeams({
  home,
  away,
  kitSize = "sm",
  onTeamClick,
}: MatchupTeamsProps) {
  return (
    <div className="min-w-0">
      <TeamIdentity
        teamSlug={home.slug}
        label={home.label}
        countryCode={home.countryCode}
        kitSize={kitSize}
        onClick={onTeamClick}
      />

      <div
        className="flex items-center gap-2 py-0.5"
        aria-hidden="true"
      >
        <div className="h-px min-w-0 flex-1 bg-card-border/80" />
        <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
          vs
        </span>
        <div className="h-px min-w-0 flex-1 bg-card-border/80" />
      </div>

      <TeamIdentity
        teamSlug={away.slug}
        label={away.label}
        countryCode={away.countryCode}
        kitSize={kitSize}
        onClick={onTeamClick}
      />
    </div>
  );
}
