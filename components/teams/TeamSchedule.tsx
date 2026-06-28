import { SectionHeading } from "@/components/brand/SectionHeading";
import { MatchScheduleRow } from "@/components/teams/MatchScheduleRow";
import {
  getTeamEliminationMessage,
  getTeamSchedule,
  teamHasKnockoutPath,
} from "@/lib/schedule";
import type { Team } from "@/lib/types";

type TeamScheduleProps = {
  team: Team;
};

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
        subtitle="Tap a finished match for highlights"
      />

      <div className="mt-4 wc26-panel overflow-hidden">
        <div className="border-b border-card-border bg-card/80 px-4 py-2">
          <p className="font-display text-xs font-bold uppercase tracking-[0.15em] text-muted">
            Group stage
          </p>
        </div>
        {groupMatches.map((match) => (
          <MatchScheduleRow key={match.matchNumber} match={match} />
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
            <MatchScheduleRow key={match.matchNumber} match={match} />
          ))}
          <p className="border-t border-card-border px-4 py-2 text-xs text-muted">
            Embedded highlights load from Highlightly when configured. A FIFA.com
            link is always available as a fallback.
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
