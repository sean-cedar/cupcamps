import Link from "next/link";
import { MatchLocationLink } from "@/components/host-cities/MatchLocationLink";
import { MatchupTeams } from "@/components/ui/MatchupTeams";
import { formatMatchSchedule, getStageLabel } from "@/lib/schedule";
import type { MatchStage } from "@/lib/schedule/types";

type ScheduleParticipant = {
  slug: string | null;
  label: string;
  countryCode: string | null;
};

type ScheduleMatchCardProps = {
  matchNumber: number;
  date: string;
  matchday?: number;
  group?: string;
  stage: MatchStage;
  stadium: string;
  hostCitySlug: string;
  home: ScheduleParticipant;
  away: ScheduleParticipant;
  homeScore: number | null;
  awayScore: number | null;
  hideStadium?: boolean;
  isElimination?: boolean;
};

export function ScheduleMatchCard(props: ScheduleMatchCardProps) {
  const stageLabel = props.group
    ? `Group ${props.group}`
    : getStageLabel(props.stage);
  const isElimination = Boolean(props.isElimination);

  return (
    <div
      className={`relative border-b border-card-border px-4 py-3 last:border-b-0 sm:hidden ${
        isElimination ? "bg-red-950/20" : ""
      }`}
    >
      <Link
        href={`/matches/${props.matchNumber}`}
        className="absolute inset-0 z-0"
        aria-label={`View match ${props.matchNumber}`}
      />

      <div className="relative z-[1] space-y-3 pointer-events-none">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-cream">
              {formatMatchSchedule(
                props.matchNumber,
                props.date,
                props.hostCitySlug,
              )}
            </p>
            {props.matchday && (
              <p className="text-[10px] uppercase tracking-wider text-muted">
                MD {props.matchday}
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="font-display text-[10px] font-bold uppercase tracking-wider text-gold">
              {stageLabel}
            </span>
            <p className="text-[10px] text-muted">Match {props.matchNumber}</p>
          </div>
        </div>

        <div className="pointer-events-auto">
          <MatchupTeams
            home={props.home}
            away={props.away}
            homeScore={props.homeScore}
            awayScore={props.awayScore}
            isElimination={isElimination}
            linkPointerEvents
          />
        </div>

        <div className="pointer-events-auto">
          <MatchLocationLink
            hostCitySlug={props.hostCitySlug}
            stadium={props.stadium}
          />
        </div>
      </div>
    </div>
  );
}
