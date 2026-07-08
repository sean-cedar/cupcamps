"use client";

import { CityMatchScheduleRow } from "@/components/host-cities/CityMatchScheduleRow";
import { GroupAdvancementPanel } from "@/components/groups/GroupAdvancementPanel";
import { GroupStandingsTable } from "@/components/groups/GroupStandingsTable";
import { GroupTeamsPanel } from "@/components/groups/GroupTeamsPanel";
import { useLiveScores } from "@/components/live/LiveScoresProvider";
import { SectionHeading } from "@/components/brand/SectionHeading";
import type { GroupPageView } from "@/lib/schedule/groups";
import { toGroupStandingRows } from "@/lib/schedule/groups";

type GroupDetailLiveProps = {
  initialView: GroupPageView;
};

export function GroupDetailLive({ initialView }: GroupDetailLiveProps) {
  const { groupPages } = useLiveScores();
  const view = groupPages?.[initialView.group] ?? initialView;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        <section className="order-2 lg:order-1">
          <SectionHeading title="Standings" />
          <div className="mt-4">
            <GroupStandingsTable
              group={view.group}
              rows={toGroupStandingRows(view.standings)}
              showAdvancement
              countryFrom={`/groups/${view.group.toLowerCase()}`}
            />
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <SectionHeading title="Advanced" />
          <div className="mt-4">
            <GroupAdvancementPanel
              group={view.group}
              isComplete={view.isComplete}
              advancedTeams={view.advancedTeams}
            />
          </div>
        </section>
      </div>

      <section className="mt-10">
        <SectionHeading title="Teams" />
        <div className="mt-4">
          <GroupTeamsPanel teams={view.teams} group={view.group} />
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading title="Fixtures & results" />
        <div className="mt-4 space-y-8">
          {view.fixturesByMatchday.map(({ matchday, fixtures }) => (
            <div key={matchday}>
              <p className="mb-3 font-display text-xs font-bold uppercase tracking-[0.14em] text-gold">
                Matchday {matchday}
              </p>
              <div className="wc26-panel overflow-hidden">
                {fixtures.map((match) => (
                  <CityMatchScheduleRow key={match.matchNumber} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
