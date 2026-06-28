import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { TeamCard } from "@/components/teams/TeamCard";
import { TeamFilters } from "@/components/teams/TeamFilters";
import { filterTeams } from "@/lib/teams";
import type { TbcCountry } from "@/lib/types";

export const metadata: Metadata = {
  title: "All Teams",
  description:
    "Browse all 48 FIFA World Cup 26™ nations and their Team Base Camp training sites.",
};

type PageProps = {
  searchParams: Promise<{
    search?: string;
    group?: string;
    tbcCountry?: string;
    hostCity?: string;
    sort?: "name" | "group" | "tbcCity";
  }>;
};

export default async function TeamsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filtered = filterTeams({
    search: params.search,
    group: params.group,
    tbcCountry: params.tbcCountry as TbcCountry | undefined,
    hostCitySlug: params.hostCity,
    sort: params.sort,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="All 48 Teams"
        subtitle="Team base camps · group stage"
        className="mb-8"
      />

      <Suspense fallback={<div className="h-40 animate-pulse bg-card" />}>
        <TeamFilters />
      </Suspense>

      <p className="my-6 font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Showing {filtered.length} team{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="wc26-panel p-12 text-center">
          <p className="text-cream">No teams match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((team) => (
            <TeamCard key={team.slug} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
