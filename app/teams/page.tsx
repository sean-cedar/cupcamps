import type { Metadata } from "next";
import { Suspense } from "react";
import { TeamCard } from "@/components/teams/TeamCard";
import { TeamFilters } from "@/components/teams/TeamFilters";
import { filterTeams } from "@/lib/teams";
import type { TbcCountry } from "@/lib/types";

export const metadata: Metadata = {
  title: "All Teams",
  description:
    "Browse all 48 FIFA World Cup 2026 nations and their Team Base Camp training sites.",
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
      <div className="mb-8">
        <h1 className="font-display text-4xl tracking-wide text-cream sm:text-5xl">
          ALL 48 TEAMS
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Every qualified nation and their Team Base Camp — where players train,
          rest, and prepare for the biggest World Cup ever.
        </p>
      </div>

      <Suspense fallback={<div className="h-40 animate-pulse bg-card" />}>
        <TeamFilters />
      </Suspense>

      <p className="my-6 text-sm text-muted">
        Showing {filtered.length} team{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="border border-card-border bg-card p-12 text-center">
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
