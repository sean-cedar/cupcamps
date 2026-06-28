import type { Metadata } from "next";
import { HostCityCard } from "@/components/host-cities/HostCityCard";
import { getHostCityStats } from "@/lib/host-cities";
import { hostCities } from "@/lib/teams";

export const metadata: Metadata = {
  title: "Host Cities",
  description:
    "All 16 FIFA World Cup 2026 host cities across the USA, Mexico, and Canada.",
};

export default function HostCitiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-4xl tracking-wide text-cream sm:text-5xl">
          16 HOST CITIES
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          From Mexico City to Vancouver, these cities host group-stage and
          knockout matches — and many are connected to nearby Team Base Camps.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {hostCities.map((city) => {
          const stats = getHostCityStats(city.slug);
          return (
            <HostCityCard
              key={city.slug}
              city={city}
              tbcCount={stats.tbcTeamCount}
              playingCount={stats.playingTeamCount}
            />
          );
        })}
      </div>
    </div>
  );
}
