import Link from "next/link";
import { HostNationStripe } from "@/components/brand/HostNationStripe";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { Wc26Mark } from "@/components/brand/Wc26Mark";
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
        <HostNationStripe height={4} />
        <div className="hero-glow absolute inset-0" />
        <div className="pointer-events-none absolute -right-8 top-8 opacity-[0.07] sm:right-12 sm:top-12">
          <Wc26Mark size={280} variant="gold" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid items-end gap-12 lg:grid-cols-2">
            <div className="animate-fade-up">
              <div className="mb-4 flex items-center gap-3">
                <Wc26Mark size={48} variant="multicolor" />
                <p className="font-display text-sm font-bold uppercase tracking-[0.35em] text-gold">
                  FIFA World Cup 26™
                </p>
              </div>
              <h1 className="font-display text-6xl font-black uppercase leading-[0.88] tracking-[0.04em] text-cream sm:text-8xl">
                Where Teams
                <br />
                <span className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
                  Call Home
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
                Every nation has picked their Team Base Camp. Explore all 48
                training sites across Canada, Mexico, and the United States —
                and see where squads play during the group stage.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/teams" className="wc26-btn-primary px-8 py-3.5 text-base">
                  Browse All Teams
                </Link>
                <Link
                  href="/map"
                  className="wc26-btn-secondary px-8 py-3.5 text-base"
                >
                  View Map
                </Link>
              </div>
            </div>
            <div className="animate-fade-up stagger-2 grid grid-cols-2 gap-6 border border-card-border bg-card/60 p-6 backdrop-blur-sm">
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
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            title="Base Camp Map"
            subtitle="48 training sites · 3 host nations"
          />
          <Link
            href="/map"
            className="font-display text-sm font-bold uppercase tracking-[0.15em] text-gold hover:text-gold-light"
          >
            Full screen →
          </Link>
        </div>
        <div className="overflow-hidden border border-gold/20">
          <HostNationStripe height={3} />
          <TbcMapWrapper teams={teams} height="420px" zoom={3} />
        </div>
        <div className="mt-4 flex flex-wrap gap-6 text-xs uppercase tracking-widest text-muted">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-accent-usa-light" /> USA
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-accent-mexico-light" /> Mexico
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-accent-canada-light" /> Canada
          </span>
        </div>
      </section>

      <section className="border-y border-card-border bg-card/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading title="Featured Teams" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTeams.map((team) => (
              <TeamCard key={team.slug} team={team} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/teams"
              className="font-display text-sm font-bold uppercase tracking-[0.15em] text-gold hover:text-gold-light"
            >
              View all 48 teams →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading
          title="Host Cities"
          subtitle="16 cities · group stage & knockout"
        />
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
            className="font-display text-sm font-bold uppercase tracking-[0.15em] text-gold hover:text-gold-light"
          >
            Explore all host cities →
          </Link>
        </div>
      </section>
    </div>
  );
}
