import type { Metadata } from "next";
import Link from "next/link";
import { HostNationStripe } from "@/components/brand/HostNationStripe";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { TbcMapWrapper } from "@/components/map/TbcMapWrapper";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { TeamKit } from "@/components/ui/TeamKit";
import { getTeamKit } from "@/lib/kits";
import { teams } from "@/lib/teams";

export const metadata: Metadata = {
  title: "Base Camp Map",
  description:
    "Interactive map of all 48 FIFA World Cup 26™ Team Base Camp training sites across North America.",
};

export default function MapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="Base Camp Map"
        subtitle="48 sites · 3 host nations"
        className="mb-8"
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="overflow-hidden border border-gold/20 lg:col-span-2">
          <HostNationStripe height={3} />
          <TbcMapWrapper teams={teams} height="650px" zoom={3} />
        </div>
        <div className="max-h-[650px] overflow-y-auto wc26-panel">
          <div className="sticky top-0 border-b border-card-border bg-card px-4 py-3">
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted">
              All teams ({teams.length})
            </p>
          </div>
          <ul className="divide-y divide-card-border">
            {teams
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((team) => {
                const kit = getTeamKit(team.slug);
                return (
                <li key={team.slug}>
                  <Link
                    href={`/teams/${team.slug}`}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-background"
                  >
                    {kit && (
                      <TeamKit kit={kit} size="sm" title={`${team.name} home kit`} />
                    )}
                    <CountryFlag
                      countryCode={team.countryCode}
                      className="text-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-semibold uppercase tracking-wide text-cream">
                        {team.name}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {team.tbc.city}
                      </p>
                    </div>
                  </Link>
                </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}
