import Link from "next/link";
import { MatchLocationLink } from "@/components/host-cities/MatchLocationLink";
import { ScheduleMatchCard } from "@/components/schedule/ScheduleMatchCard";
import { MatchupTeams } from "@/components/ui/MatchupTeams";
import {
  formatMatchSchedule,
  getOpponentDisplay,
  getStageLabel,
} from "@/lib/schedule";
import type { TeamMatch } from "@/lib/schedule/types";

type MatchScheduleRowProps = {
  match: TeamMatch;
};

export function MatchScheduleRow({ match }: MatchScheduleRowProps) {
  const home = getOpponentDisplay(match.homeSlug);
  const away = getOpponentDisplay(match.awaySlug);

  return (
    <>
      <ScheduleMatchCard
        matchNumber={match.matchNumber}
        date={match.date}
        matchday={match.matchday}
        group={match.group}
        stage={match.stage}
        stadium={match.stadium}
        hostCitySlug={match.hostCitySlug}
        home={home}
        away={away}
        homeScore={match.homeScore}
        awayScore={match.awayScore}
        isElimination={match.isElimination}
      />

      <div
        className={`relative hidden gap-3 border-b border-card-border px-4 py-3 last:border-b-0 hover:bg-card/40 sm:grid sm:grid-cols-[7rem_6rem_1fr] sm:items-center ${
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
            {formatMatchSchedule(
              match.matchNumber,
              match.date,
              match.hostCitySlug,
            )}
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

        <div className="relative z-[1] min-w-0 space-y-2 pointer-events-none">
          <MatchupTeams
            home={home}
            away={away}
            homeScore={match.homeScore}
            awayScore={match.awayScore}
            isElimination={match.isElimination}
            linkPointerEvents
          />
          <div className="pointer-events-auto">
            <MatchLocationLink
              hostCitySlug={match.hostCitySlug}
              stadium={match.stadium}
            />
          </div>
        </div>
      </div>
    </>
  );
}
