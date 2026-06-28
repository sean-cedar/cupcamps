import type { Metadata } from "next";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { HostCityCard } from "@/components/host-cities/HostCityCard";
import { getHostCityStats } from "@/lib/host-cities";
import { hostCities } from "@/lib/teams";

export const metadata: Metadata = {
  title: "Host Cities",
  description:
    "All 16 FIFA World Cup 26™ host cities across the USA, Mexico, and Canada.",
};

export default function HostCitiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="16 Host Cities"
        subtitle="Canada · Mexico · United States"
        className="mb-8"
      />

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
