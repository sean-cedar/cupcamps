import Link from "next/link";
import { QuickNav } from "@/components/brand/QuickNav";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { HostCityCard } from "@/components/host-cities/HostCityCard";
import { TbcMapWrapper } from "@/components/map/TbcMapWrapper";
import { TeamCard } from "@/components/teams/TeamCard";
import { getHostCityStats } from "@/lib/host-cities";
import { hostCities, teams } from "@/lib/teams";

export default function HomePage() {
  const featuredTeams = teams.slice(0, 6);
  const featuredCities = hostCities.slice(0, 4);

  return (
    <div>
      {/* Hero — compact, action-oriented */}
      <section className="border-b border-card-border">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold">
                FIFA World Cup 26™
              </p>
              <h1 className="mt-2 font-display text-4xl font-black uppercase leading-[0.92] tracking-[0.03em] text-cream sm:text-5xl lg:text-6xl">
                Where teams
                <span className="text-gold"> call home</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                All 48 Team Base Camps across Canada, Mexico, and the United
                States — plus host cities and group-stage venues.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/teams"
                  className="wc26-btn-primary px-6 py-2.5 text-sm"
                >
                  Browse teams
                </Link>
                <Link
                  href="/map"
                  className="wc26-btn-secondary px-6 py-2.5 text-sm"
                >
                  Open map
                </Link>
              </div>
            </div>
            <QuickNav />
          </div>
        </div>
      </section>

      {/* Map — primary content, no wasted space above fold on desktop */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            title="Base camp map"
            subtitle="Flag = nation at their training site"
          />
          <Link
            href="/map"
            className="font-display text-xs font-bold uppercase tracking-[0.12em] text-gold hover:text-gold-light"
          >
            Expand →
          </Link>
        </div>
        <div className="overflow-hidden border border-card-border">
          <TbcMapWrapper teams={teams} height="380px" zoom={3} />
        </div>
      </section>

      <section className="border-y border-card-border bg-card/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <SectionHeading title="Teams" subtitle="48 nations" />
            <Link
              href="/teams"
              className="font-display text-xs font-bold uppercase tracking-[0.12em] text-gold hover:text-gold-light"
            >
              All teams →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTeams.map((team) => (
              <TeamCard key={team.slug} team={team} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <SectionHeading title="Host cities" subtitle="16 venues" />
          <Link
            href="/host-cities"
            className="font-display text-xs font-bold uppercase tracking-[0.12em] text-gold hover:text-gold-light"
          >
            All cities →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCities.map((city) => {
            const cityStats = getHostCityStats(city.slug);
            return (
              <HostCityCard
                key={city.slug}
                city={city}
                tbcCount={cityStats.tbcTeamCount}
                playingCount={cityStats.playingTeamCount}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
