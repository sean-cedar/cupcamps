"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { getGroups, hostCities } from "@/lib/teams";
import type { TbcCountry } from "@/lib/types";

export function TeamFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") ?? "";
  const group = searchParams.get("group") ?? "";
  const tbcCountry = searchParams.get("tbcCountry") ?? "";
  const hostCity = searchParams.get("hostCity") ?? "";
  const sort = searchParams.get("sort") ?? "name";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      startTransition(() => {
        router.push(`/teams?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  const inputClass =
    "wc26-input w-full px-3 py-2.5 text-sm";

  return (
    <div
      className={`wc26-panel space-y-4 p-4 ${isPending ? "opacity-70" : ""}`}
    >
      <div className="amplify-edge h-0.5 w-12" />
      <div>
        <label
          htmlFor="search"
          className="mb-1 block font-display text-xs font-bold uppercase tracking-[0.2em] text-muted"
        >
          Search
        </label>
        <input
          id="search"
          type="search"
          defaultValue={search}
          placeholder="Country, city, or training site..."
          className={inputClass}
          onChange={(e) => updateParams({ search: e.target.value })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="group"
            className="mb-1 block font-display text-xs font-bold uppercase tracking-[0.2em] text-muted"
          >
            Group
          </label>
          <select
            id="group"
            value={group}
            onChange={(e) => updateParams({ group: e.target.value })}
            className={inputClass}
          >
            <option value="">All groups</option>
            {getGroups().map((g) => (
              <option key={g} value={g}>
                Group {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="tbcCountry"
            className="mb-1 block font-display text-xs font-bold uppercase tracking-[0.2em] text-muted"
          >
            TBC country
          </label>
          <select
            id="tbcCountry"
            value={tbcCountry}
            onChange={(e) => updateParams({ tbcCountry: e.target.value })}
            className={inputClass}
          >
            <option value="">All countries</option>
            {(["USA", "Mexico", "Canada"] as TbcCountry[]).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="hostCity"
            className="mb-1 block font-display text-xs font-bold uppercase tracking-[0.2em] text-muted"
          >
            Host city zone
          </label>
          <select
            id="hostCity"
            value={hostCity}
            onChange={(e) => updateParams({ hostCity: e.target.value })}
            className={inputClass}
          >
            <option value="">All host cities</option>
            {hostCities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="sort"
            className="mb-1 block font-display text-xs font-bold uppercase tracking-[0.2em] text-muted"
          >
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className={inputClass}
          >
            <option value="name">Name</option>
            <option value="group">Group</option>
            <option value="tbcCity">TBC city</option>
          </select>
        </div>
      </div>
    </div>
  );
}
