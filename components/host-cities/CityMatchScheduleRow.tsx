import Link from "next/link";
import { MatchupTeams } from "@/components/ui/MatchupTeams";
import {
  formatFixtureScore,
  formatMatchDate,
  getOpponentDisplay,
  getStageLabel,
} from "@/lib/schedule";
import type { CityMatch } from "@/lib/schedule/types";

type CityMatchScheduleRowProps = {
  match: CityMatch;
};

export function CityMatchScheduleRow({ match }: CityMatchScheduleRowProps) {
  const home = getOpponentDisplay(match.homeSlug);
  const away = getOpponentDisplay(match.awaySlug);
  const score = formatFixtureScore(match);

  return (
    <div className="relative grid gap-3 border-b border-card-border px-4 py-3 last:border-b-0 hover:bg-card/40 sm:grid-cols-[7rem_6rem_1fr_auto] sm:items-center">
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

      <div className="relative z-[1] min-w-0 pointer-events-none">
        <MatchupTeams home={home} away={away} linkPointerEvents />
        <p className="mt-1 hidden text-xs text-muted sm:block">{match.stadium}</p>
      </div>

      <div className="relative z-[1] flex items-center justify-end pointer-events-none sm:flex-col sm:items-end">
        {score ? (
          <span className="font-display text-lg font-black text-cream">
            {score}
          </span>
        ) : (
          <span className="text-xs uppercase tracking-wider text-muted">
            TBD
          </span>
        )}
      </div>
    </div>
  );
}
