import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HostNationStripe } from "@/components/brand/HostNationStripe";
import { GroupDetailLive } from "@/components/groups/GroupDetailLive";
import { GroupBadge } from "@/components/ui/GroupBadge";
import {
  getAllGroups,
  getGroupPageView,
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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
          <Link
            href="/groups"
            className="font-display text-xs font-bold uppercase tracking-[0.15em] text-muted hover:text-gold-light"
          >
            ← All groups
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6">
            <GroupBadge group={view.group} size="lg" />
            <div>
              <h1 className="font-display text-4xl font-black uppercase tracking-[0.04em] text-cream sm:text-5xl lg:text-6xl">
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

      <GroupDetailLive initialView={view} />
    </div>
  );
}
