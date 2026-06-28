import Link from "next/link";
import { HostCityLink } from "@/components/host-cities/HostCityCard";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { CountryFlag } from "@/components/ui/CountryFlag";
import {
  formatMatchDate,
  formatScore,
  getOpponentDisplay,
  getStageLabel,
  getTeamEliminationMessage,
  getTeamSchedule,
  teamHasKnockoutPath,
} from "@/lib/schedule";
import type { TeamMatch } from "@/lib/schedule/types";
import type { Team } from "@/lib/types";

type TeamScheduleProps = {
  team: Team;
};

function MatchRow({ match }: { match: TeamMatch }) {
  const opponent = getOpponentDisplay(match.opponentSlug);
  const score = formatScore(match);

  return (
    <div
      className={`grid gap-3 border-b border-card-border px-4 py-3 last:border-b-0 sm:grid-cols-[7rem_6rem_1fr_auto] sm:items-center ${
        match.isElimination ? "bg-red-950/20" : ""
      }`}
    >
      <div>
        <p className="text-xs font-medium text-cream">
          {formatMatchDate(match.date)}
        </p>
        {match.matchday && (
          <p className="text-[10px] uppercase tracking-wider text-muted">
            MD {match.matchday}
          </p>
        )}
      </div>

      <div>
        <span className="font-display text-[10px] font-bold uppercase tracking-wider text-gold">
          {match.group ? `Group ${match.group}` : getStageLabel(match.stage)}
        </span>
        <p className="text-[10px] text-muted">Match {match.matchNumber}</p>
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted">
          {match.isHome ? "vs" : "@"}
        </span>
        {opponent.slug && opponent.countryCode ? (
          <Link
            href={`/teams/${opponent.slug}`}
            className="flex min-w-0 items-center gap-2 text-cream hover:text-gold-light"
          >
            <CountryFlag countryCode={opponent.countryCode} className="text-base" />
            <span className="truncate font-medium">{opponent.label}</span>
          </Link>
        ) : (
          <span className="truncate text-sm text-muted">{opponent.label}</span>
        )}
        <span className="hidden text-xs text-muted sm:inline">
          · {match.stadium}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
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
        <HostCityLink slug={match.hostCitySlug} />
      </div>
    </div>
  );
}

export function TeamSchedule({ team }: TeamScheduleProps) {
  const schedule = getTeamSchedule(team.slug);
  const groupMatches = schedule.filter((m) => m.stage === "group");
  const knockoutMatches = schedule.filter((m) => m.stage !== "group");
  const eliminationMessage = getTeamEliminationMessage(team.slug);
  const hasKnockoutPath = teamHasKnockoutPath(team.slug);

  return (
    <section className="mt-10 lg:col-span-2">
      <SectionHeading
        title="Tournament Schedule"
        subtitle="Updates as match results are recorded"
      />

      <div className="mt-4 wc26-panel overflow-hidden">
        <div className="border-b border-card-border bg-card/80 px-4 py-2">
          <p className="font-display text-xs font-bold uppercase tracking-[0.15em] text-muted">
            Group stage
          </p>
        </div>
        {groupMatches.map((match) => (
          <MatchRow key={match.matchNumber} match={match} />
        ))}
      </div>

      {knockoutMatches.length > 0 ? (
        <div className="mt-4 wc26-panel overflow-hidden">
          <div className="border-b border-card-border bg-card/80 px-4 py-2">
            <p className="font-display text-xs font-bold uppercase tracking-[0.15em] text-muted">
              Knockout rounds
            </p>
          </div>
          {knockoutMatches.map((match) => (
            <MatchRow key={match.matchNumber} match={match} />
          ))}
          <p className="border-t border-card-border px-4 py-2 text-xs text-muted">
            Opponents resolve automatically when earlier bracket matches have
            final scores. Future fixtures drop off once a team is eliminated.
          </p>
        </div>
      ) : (
        !hasKnockoutPath && (
          <p className="mt-3 text-sm text-muted">
            {eliminationMessage ??
              "Knockout fixtures appear here once this team’s Round of 32 path is confirmed."}
          </p>
        )
      )}

      {eliminationMessage && knockoutMatches.length > 0 && (
        <p className="mt-3 text-sm text-red-300">{eliminationMessage}</p>
      )}
    </section>
  );
}
