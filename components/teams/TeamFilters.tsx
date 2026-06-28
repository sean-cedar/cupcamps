import { getGroups, hostCities } from "@/lib/teams";
import type { TbcCountry } from "@/lib/types";

export type TeamFilterValues = {
  search: string;
  group: string;
  tbcCountry: string;
  hostCity: string;
  sort: "name" | "group" | "tbcCity";
};

type TeamFiltersProps = TeamFilterValues & {
  onSearchChange: (value: string) => void;
  onGroupChange: (value: string) => void;
  onTbcCountryChange: (value: string) => void;
  onHostCityChange: (value: string) => void;
  onSortChange: (value: TeamFilterValues["sort"]) => void;
};

const inputClass = "wc26-input w-full px-3 py-2.5 text-sm";

export function TeamFilters({
  search,
  group,
  tbcCountry,
  hostCity,
  sort,
  onSearchChange,
  onGroupChange,
  onTbcCountryChange,
  onHostCityChange,
  onSortChange,
}: TeamFiltersProps) {
  return (
    <div className="wc26-panel space-y-4 p-4">
      <div className="section-accent" />
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
          value={search}
          placeholder="Country, city, or training site..."
          className={inputClass}
          onChange={(e) => onSearchChange(e.target.value)}
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
            onChange={(e) => onGroupChange(e.target.value)}
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
            onChange={(e) => onTbcCountryChange(e.target.value)}
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
            onChange={(e) => onHostCityChange(e.target.value)}
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
            onChange={(e) =>
              onSortChange(e.target.value as TeamFilterValues["sort"])
            }
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
