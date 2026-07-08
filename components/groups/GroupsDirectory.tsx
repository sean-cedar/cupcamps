"use client";

import { GroupCard } from "@/components/groups/GroupCard";
import { useLiveScores } from "@/components/live/LiveScoresProvider";
import type { GroupSummaryView } from "@/lib/schedule/groups";

type GroupsDirectoryProps = {
  initialSummaries: GroupSummaryView[];
};

export function GroupsDirectory({ initialSummaries }: GroupsDirectoryProps) {
  const { groupSummaries } = useLiveScores();
  const summaries = groupSummaries ?? initialSummaries;
  const completedGroups = summaries.filter((summary) => summary.isComplete).length;

  return (
    <>
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
    </>
  );
}
