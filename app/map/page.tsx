import type { Metadata } from "next";
import Link from "next/link";
import { TbcMapWrapper } from "@/components/map/TbcMapWrapper";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { teams } from "@/lib/teams";

export const metadata: Metadata = {
  title: "Base Camp Map",
  description:
    "Interactive map of all 48 FIFA World Cup 2026 Team Base Camp training sites across North America.",
};

export default function MapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-4xl tracking-wide text-cream sm:text-5xl">
          BASE CAMP MAP
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          All 48 Team Base Camp training sites across the USA, Mexico, and
          Canada. Click a pin for details.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="overflow-hidden border border-card-border lg:col-span-2">
          <TbcMapWrapper teams={teams} height="650px" zoom={3} />
        </div>
        <div className="max-h-[650px] overflow-y-auto border border-card-border bg-card">
          <div className="sticky top-0 border-b border-card-border bg-card px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-muted">
              All teams ({teams.length})
            </p>
          </div>
          <ul className="divide-y divide-card-border">
            {teams
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((team) => (
                <li key={team.slug}>
                  <Link
                    href={`/teams/${team.slug}`}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-background"
                  >
                    <CountryFlag
                      countryCode={team.countryCode}
                      className="text-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-cream">
                        {team.name}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {team.tbc.city}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
