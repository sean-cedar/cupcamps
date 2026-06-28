import Link from "next/link";
import { Suspense } from "react";
import { HostCityCard } from "@/components/host-cities/HostCityCard";
import { TbcMapWrapper } from "@/components/map/TbcMapWrapper";
import { TeamCard } from "@/components/teams/TeamCard";
import { StatBlock } from "@/components/ui/StatBlock";
import { getHostCityStats } from "@/lib/host-cities";
import { getStats, hostCities, teams } from "@/lib/teams";

export default function HomePage() {
  const stats = getStats();
  const featuredTeams = teams.slice(0, 6);
  const featuredCities = hostCities.slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-card-border">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid items-end gap-12 lg:grid-cols-2">
            <div className="animate-fade-up">
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gold">
                FIFA World Cup 2026
              </p>
              <h1 className="font-display text-6xl leading-[0.9] tracking-wide text-cream sm:text-8xl">
                WHERE TEAMS
                <br />
                <span className="text-gold">CALL HOME</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
                Every nation has picked their Team Base Camp. Explore all 48
                training sites, the host cities they connect to, and where
                squads play during the group stage.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/teams"
                  className="bg-gold px-6 py-3 font-display text-lg tracking-wide text-background transition hover:bg-gold-light"
                >
                  BROWSE ALL TEAMS
                </Link>
                <Link
                  href="/map"
                  className="border border-gold/40 px-6 py-3 font-display text-lg tracking-wide text-gold transition hover:border-gold hover:bg-gold/10"
                >
                  VIEW MAP
                </Link>
              </div>
            </div>
            <div className="animate-fade-up stagger-2 grid grid-cols-2 gap-6">
              <StatBlock value={stats.teamCount} label="Nations" />
              <StatBlock value={stats.hostCityCount} label="Host cities" />
              <StatBlock
                value={stats.nonHostCommunityCount}
                label="Beyond host cities"
              />
              <StatBlock value={stats.tbcByCountry.USA ?? 0} label="TBCs in USA" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl tracking-wide text-cream">
              BASE CAMP MAP
            </h2>
            <p className="mt-1 text-sm text-muted">
              48 training sites across North America
            </p>
          </div>
          <Link
            href="/map"
            className="text-sm text-gold hover:text-gold-light"
          >
            Full screen map →
          </Link>
        </div>
        <div className="overflow-hidden border border-card-border">
          <TbcMapWrapper teams={teams} height="420px" zoom={3} />
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-accent-usa" /> USA TBC
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-accent-mexico" /> Mexico TBC
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-accent-canada" /> Canada TBC
          </span>
        </div>
      </section>

      <section className="border-y border-card-border bg-card/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl tracking-wide text-cream">
            FEATURED TEAMS
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTeams.map((team) => (
              <TeamCard key={team.slug} team={team} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/teams"
              className="text-sm font-medium text-gold hover:text-gold-light"
            >
              View all 48 teams →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl tracking-wide text-cream">
          HOST CITIES
        </h2>
        <p className="mt-1 text-sm text-muted">
          16 cities hosting group-stage and knockout matches
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="mt-8 text-center">
          <Link
            href="/host-cities"
            className="text-sm font-medium text-gold hover:text-gold-light"
          >
            Explore all host cities →
          </Link>
        </div>
      </section>
    </div>
  );
}
