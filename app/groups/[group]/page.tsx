import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HostNationStripe } from "@/components/brand/HostNationStripe";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { CityMatchScheduleRow } from "@/components/host-cities/CityMatchScheduleRow";
import { GroupAdvancementPanel } from "@/components/groups/GroupAdvancementPanel";
import { GroupStandingsTable } from "@/components/groups/GroupStandingsTable";
import { GroupTeamsPanel } from "@/components/groups/GroupTeamsPanel";
import { GroupBadge } from "@/components/ui/GroupBadge";
import {
  getAllGroups,
  getGroupPageView,
  toGroupStandingRows,
} from "@/lib/schedule/groups";

type PageProps = {
  params: Promise<{ group: string }>;
};

export async function generateStaticParams() {
  return getAllGroups().map((group) => ({
    group: group.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { group: raw } = await params;
  const group = raw.toUpperCase();
  const view = getGroupPageView(group);

  if (!view) {
    return { title: "Group Not Found" };
  }

  const advanced =
    view.advancedTeams.length > 0
      ? view.advancedTeams.map((team) => team.name).join(", ")
      : "group stage in progress";

  return {
    title: `Group ${view.group}`,
    description: `Group ${view.group} standings, fixtures, and results. Advanced: ${advanced}.`,
  };
}

export default async function GroupDetailPage({ params }: PageProps) {
  const { group: raw } = await params;
  const group = raw.toUpperCase();
  const view = getGroupPageView(group);

  if (!view) {
    notFound();
  }

  return (
    <div>
      <section className="border-b border-card-border bg-card/50">
        <HostNationStripe height={3} />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Link
            href="/groups"
            className="font-display text-xs font-bold uppercase tracking-[0.15em] text-muted hover:text-gold-light"
          >
            ← All groups
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <GroupBadge group={view.group} size="lg" />
            <div>
              <h1 className="font-display text-5xl font-black uppercase tracking-[0.04em] text-cream sm:text-6xl">
                Group {view.group}
              </h1>
              <p className="mt-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                {view.matchesPlayed}/{view.matchesTotal} matches played
                {view.isComplete ? " · Complete" : " · In progress"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          <section>
            <SectionHeading title="Standings" />
            <div className="mt-4">
              <GroupStandingsTable
                group={view.group}
                rows={toGroupStandingRows(view.standings)}
                showAdvancement
              />
            </div>
          </section>

          <section>
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
            <GroupTeamsPanel teams={view.teams} />
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
    </div>
  );
}
