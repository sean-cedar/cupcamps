import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { TeamsDirectory } from "@/components/teams/TeamsDirectory";

export const metadata: Metadata = {
  title: "All Teams",
  description:
    "Browse all 48 FIFA World Cup 26™ nations and their Team Base Camp training sites.",
};

export default function TeamsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="All 48 Teams"
        subtitle="Team base camps · group stage"
        className="mb-8"
      />

      <Suspense fallback={<div className="h-40 animate-pulse bg-card" />}>
        <TeamsDirectory />
      </Suspense>
    </div>
  );
}
