import Link from "next/link";
import { HostCityLink } from "@/components/host-cities/HostCityCard";
import { TeamIdentity } from "@/components/ui/TeamIdentity";
import {
  formatMatchDate,
  formatScore,
  getOpponentDisplay,
  getStageLabel,
} from "@/lib/schedule";
import type { TeamMatch } from "@/lib/schedule/types";

type MatchScheduleRowProps = {
  match: TeamMatch;
};

export function MatchScheduleRow({ match }: MatchScheduleRowProps) {
  const opponent = getOpponentDisplay(match.opponentSlug);
  const score = formatScore(match);

  return (
    <div
      className={`relative grid gap-3 border-b border-card-border px-4 py-3 last:border-b-0 hover:bg-card/40 sm:grid-cols-[7rem_6rem_1fr_auto] sm:items-center ${
        match.isElimination ? "bg-red-950/20" : ""
      }`}
    >
      <Link
        href={`/matches/${match.matchNumber}`}
        className="absolute inset-0 z-0"
        aria-label={`View match ${match.matchNumber}`}
      />

      <div className="relative z-[1] pointer-events-none">
        <p className="text-xs font-medium text-cream">
          {formatMatchDate(match.date)}
        </p>
        {match.matchday && (
          <p className="text-[10px] uppercase tracking-wider text-muted">
            MD {match.matchday}
          </p>
        )}
      </div>

      <div className="relative z-[1] pointer-events-none">
        <span className="font-display text-[10px] font-bold uppercase tracking-wider text-gold">
          {match.group ? `Group ${match.group}` : getStageLabel(match.stage)}
        </span>
        <p className="text-[10px] text-muted">Match {match.matchNumber}</p>
      </div>

      <div className="relative z-[1] min-w-0 space-y-1">
        <div className="pointer-events-none flex flex-wrap items-center gap-2">
          <span className="rounded border border-card-border bg-card/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
            {match.isHome ? "Home" : "Away"}
          </span>
        </div>
        <div className="pointer-events-auto">
          <TeamIdentity
            teamSlug={opponent.slug}
            label={opponent.label}
            countryCode={opponent.countryCode}
          />
        </div>
        <span className="pointer-events-none hidden text-xs text-muted sm:inline">
          {match.stadium}
        </span>
      </div>

      <div className="relative z-[1] flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <span className="pointer-events-none">
          {score ? (
            <span
              className={`font-display text-lg font-black ${
                match.isElimination ? "text-red-300" : "text-cream"
              }`}
            >
              {score}
            </span>
          ) : (
            <span className="text-xs uppercase tracking-wider text-muted">
              TBD
            </span>
          )}
        </span>
        <div className="pointer-events-auto">
          <HostCityLink slug={match.hostCitySlug} />
        </div>
      </div>
    </div>
  );
}
