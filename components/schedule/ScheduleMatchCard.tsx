import Link from "next/link";
import { HostCityLink } from "@/components/host-cities/HostCityCard";
import { MatchupTeams } from "@/components/ui/MatchupTeams";
import { TeamIdentity } from "@/components/ui/TeamIdentity";
import { formatMatchDate, getStageLabel } from "@/lib/schedule";
import type { MatchStage } from "@/lib/schedule/types";

type ScheduleParticipant = {
  slug: string | null;
  label: string;
  countryCode: string | null;
};

type ScheduleMatchCardBase = {
  matchNumber: number;
  date: string;
  matchday?: number;
  group?: string;
  stage: MatchStage;
  stadium: string;
  score: string | null;
  hideStadium?: boolean;
};

type ScheduleMatchCardProps = ScheduleMatchCardBase & {
  isElimination?: boolean;
  variant: "team";
  isHome: boolean;
  opponent: ScheduleParticipant;
  hostCitySlug: string;
};

type ScheduleFixtureCardProps = ScheduleMatchCardBase & {
  variant: "fixture";
  home: ScheduleParticipant;
  away: ScheduleParticipant;
};

export function ScheduleMatchCard(
  props: ScheduleMatchCardProps | ScheduleFixtureCardProps,
) {
  const stageLabel = props.group
    ? `Group ${props.group}`
    : getStageLabel(props.stage);
  const isElimination =
    props.variant === "team" ? Boolean(props.isElimination) : false;

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
              {formatMatchDate(props.date)}
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

        {props.variant === "team" ? (
          <div className="space-y-2">
            <span className="inline-flex rounded border border-card-border bg-card/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              {props.isHome ? "Home" : "Away"}
            </span>
            <div className="pointer-events-auto w-fit max-w-full">
              <TeamIdentity
                teamSlug={props.opponent.slug}
                label={props.opponent.label}
                countryCode={props.opponent.countryCode}
              />
            </div>
          </div>
        ) : (
          <div className="pointer-events-auto">
            <MatchupTeams
              home={props.home}
              away={props.away}
              linkPointerEvents
            />
          </div>
        )}

        <div
          className={`flex flex-wrap items-center gap-3 ${
            props.hideStadium ? "justify-end" : "justify-between"
          }`}
        >
          {!props.hideStadium && (
            <p className="min-w-0 flex-1 text-xs text-muted">{props.stadium}</p>
          )}
          {props.score ? (
            <span
              className={`shrink-0 font-display text-lg font-black ${
                isElimination ? "text-red-300" : "text-cream"
              }`}
            >
              {props.score}
            </span>
          ) : (
            <span className="shrink-0 text-xs uppercase tracking-wider text-muted">
              TBD
            </span>
          )}
        </div>

        {props.variant === "team" && (
          <div className="pointer-events-auto">
            <HostCityLink slug={props.hostCitySlug} />
          </div>
        )}
      </div>
    </div>
  );
}
