import type { Metadata } from "next";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { GroupCard } from "@/components/groups/GroupCard";
import { getGroupSummaries } from "@/lib/schedule/groups";

export const metadata: Metadata = {
  title: "Group Stage",
  description:
    "FIFA World Cup 26™ group stage standings, results, and knockout qualification for all 12 groups.",
};

export default function GroupsPage() {
  const summaries = getGroupSummaries();
  const completedGroups = summaries.filter((summary) => summary.isComplete).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="Group Stage"
        subtitle="12 groups · 48 teams · top two plus best third-place finishers advance"
        className="mb-6"
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="wc26-panel p-4">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
            Groups complete
          </p>
          <p className="mt-2 font-display text-3xl font-black text-gold">
            {completedGroups}
            <span className="text-lg text-muted"> / 12</span>
          </p>
        </div>
        <div className="wc26-panel p-4 sm:col-span-2">
          <p className="text-sm text-muted">
            Each group page includes the full table, all six fixtures, and which
            teams advanced to the Round of 32 — including third-place teams that
            qualified among the best eight across the tournament.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaries.map((summary) => (
          <GroupCard key={summary.group} summary={summary} />
        ))}
      </div>
    </div>
  );
}
