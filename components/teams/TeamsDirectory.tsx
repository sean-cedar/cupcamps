"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TeamCard } from "@/components/teams/TeamCard";
import {
  TeamFilters,
  type TeamFilterValues,
} from "@/components/teams/TeamFilters";
import { filterTeams } from "@/lib/teams";
import type { TbcCountry } from "@/lib/types";

function readFiltersFromParams(params: URLSearchParams): TeamFilterValues {
  return {
    search: params.get("search") ?? "",
    group: params.get("group") ?? "",
    tbcCountry: params.get("tbcCountry") ?? "",
    hostCity: params.get("hostCity") ?? "",
    sort: (params.get("sort") as TeamFilterValues["sort"]) || "name",
  };
}

function filtersToUrl(filters: TeamFilterValues): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.group) params.set("group", filters.group);
  if (filters.tbcCountry) params.set("tbcCountry", filters.tbcCountry);
  if (filters.hostCity) params.set("hostCity", filters.hostCity);
  if (filters.sort && filters.sort !== "name") params.set("sort", filters.sort);
  const qs = params.toString();
  return qs ? `/countries?${qs}` : "/countries";
}

export function TeamsDirectory() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<TeamFilterValues>(() =>
    readFiltersFromParams(searchParams),
  );

  const filtered = useMemo(
    () =>
      filterTeams({
        search: filters.search || undefined,
        group: filters.group || undefined,
        tbcCountry: (filters.tbcCountry as TbcCountry) || undefined,
        hostCitySlug: filters.hostCity || undefined,
        sort: filters.sort,
      }),
    [filters],
  );

  const syncUrl = useCallback((next: TeamFilterValues) => {
    const url = filtersToUrl(next);
    if (url !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, "", url);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => syncUrl(filters), 300);
    return () => window.clearTimeout(id);
  }, [filters, syncUrl]);

  useEffect(() => {
    const onPopState = () => {
      setFilters(readFiltersFromParams(new URLSearchParams(window.location.search)));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <>
      <TeamFilters
        {...filters}
        onSearchChange={(search) => setFilters((current) => ({ ...current, search }))}
        onGroupChange={(group) => setFilters((current) => ({ ...current, group }))}
        onTbcCountryChange={(tbcCountry) =>
          setFilters((current) => ({ ...current, tbcCountry }))
        }
        onHostCityChange={(hostCity) =>
          setFilters((current) => ({ ...current, hostCity }))
        }
        onSortChange={(sort) => setFilters((current) => ({ ...current, sort }))}
      />

      <p className="my-6 font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Showing {filtered.length} countr{filtered.length !== 1 ? "ies" : "y"}
      </p>

      {filtered.length === 0 ? (
        <div className="wc26-panel p-12 text-center">
          <p className="text-cream">No countries match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((team) => (
            <TeamCard key={team.slug} team={team} />
          ))}
        </div>
      )}
    </>
  );
}
