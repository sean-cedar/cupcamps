import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HostNationStripe } from "@/components/brand/HostNationStripe";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { HostCitySchedule } from "@/components/host-cities/HostCitySchedule";
import { TeamListItem } from "@/components/host-cities/HostCityCard";
import { TbcMapWrapper } from "@/components/map/TbcMapWrapper";
import { getHostCityStats } from "@/lib/host-cities";
import { getHostCity, hostCities } from "@/lib/teams";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return hostCities.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getHostCity(slug);
  if (!city) return { title: "City Not Found" };

  return {
    title: city.name,
    description: `${city.name} hosts FIFA World Cup 26™ matches at ${city.stadium}. See teams training nearby and playing here.`,
  };
}

export default async function HostCityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const city = getHostCity(slug);
  if (!city) notFound();

  const stats = getHostCityStats(slug);

  return (
    <div>
      <section
        className="border-b border-card-border"
        style={{
          background: `linear-gradient(135deg, ${city.accentColor}28 0%, transparent 55%), linear-gradient(180deg, rgba(181,152,90,0.05) 0%, transparent 100%)`,
        }}
      >
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: city.accentColor }}
        />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Link
            href="/host-cities"
            className="font-display text-xs font-bold uppercase tracking-[0.15em] text-muted hover:text-gold-light"
          >
            ← All host cities
          </Link>
          <div className="mt-6 flex items-center gap-4">
            <span
              className="h-20 w-1.5"
              style={{ backgroundColor: city.accentColor }}
            />
            <div>
              <h1 className="font-display text-5xl font-black uppercase tracking-[0.04em] text-cream sm:text-6xl">
                {city.name}
              </h1>
              <p className="mt-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                {city.country} · {city.stadium}
              </p>
            </div>
          </div>
          <div className="mt-8 flex gap-10">
            <div>
              <span className="font-display text-4xl font-black text-gold">
                {stats.tbcTeamCount}
              </span>
              <p className="font-display text-xs uppercase tracking-widest text-muted">
                nearby TBC
              </p>
            </div>
            <div>
              <span className="font-display text-4xl font-black text-gold">
                {stats.playingTeamCount}
              </span>
              <p className="font-display text-xs uppercase tracking-widest text-muted">
                playing here
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <section>
            <SectionHeading title="Teams With Nearby TBC" />
            {stats.tbcTeams.length === 0 ? (
              <p className="mt-4 text-muted">No teams mapped to this zone.</p>
            ) : (
              <div className="mt-4 space-y-2">
                {stats.tbcTeams.map((team) => (
                  <TeamListItem key={team.slug} team={team} />
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionHeading title="Teams Playing Here" />
            {stats.playingTeams.length === 0 ? (
              <p className="mt-4 text-muted">
                No group-stage assignments in this city.
              </p>
            ) : (
              <div className="mt-4 space-y-2">
                {stats.playingTeams.map((team) => (
                  <TeamListItem key={team.slug} team={team} />
                ))}
              </div>
            )}
          </section>
        </div>

        {stats.tbcTeams.length > 0 && (
          <section className="mt-12">
            <SectionHeading title="TBC Locations" />
            <div className="mt-4 overflow-hidden border border-gold/20">
              <HostNationStripe height={2} />
              <TbcMapWrapper
                teams={stats.tbcTeams}
                height="400px"
                zoom={6}
                center={[city.coordinates.lat, city.coordinates.lng]}
              />
            </div>
          </section>
        )}

        <HostCitySchedule city={city} />
      </div>
    </div>
  );
}
