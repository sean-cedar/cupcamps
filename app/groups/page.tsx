import type { Metadata } from "next";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { GroupsDirectory } from "@/components/groups/GroupsDirectory";
import { getGroupSummaries } from "@/lib/schedule/groups";

export const metadata: Metadata = {
  title: "Group Stage",
  description:
    "FIFA World Cup 26™ group stage standings, results, and knockout qualification for all 12 groups.",
};

export default function GroupsPage() {
  const summaries = getGroupSummaries();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="Group Stage"
        subtitle="12 groups · 48 teams · top two plus best third-place finishers advance"
        className="mb-6"
      />

      <GroupsDirectory initialSummaries={summaries} />
    </div>
  );
}
