import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    description: `${city.name} hosts World Cup 2026 matches at ${city.stadium}. See teams training nearby and playing here.`,
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
          background: `linear-gradient(135deg, ${city.accentColor}22 0%, transparent 60%)`,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Link
            href="/host-cities"
            className="text-sm text-muted hover:text-gold-light"
          >
            ← All host cities
          </Link>
          <div className="mt-6 flex items-center gap-4">
            <span
              className="h-16 w-2"
              style={{ backgroundColor: city.accentColor }}
            />
            <div>
              <h1 className="font-display text-5xl tracking-wide text-cream sm:text-6xl">
                {city.name}
              </h1>
              <p className="mt-2 text-muted">
                {city.country} · {city.stadium}
              </p>
            </div>
          </div>
          <div className="mt-8 flex gap-8 text-sm">
            <div>
              <span className="font-display text-3xl text-gold">
                {stats.tbcTeamCount}
              </span>
              <p className="text-muted">teams with nearby TBC</p>
            </div>
            <div>
              <span className="font-display text-3xl text-gold">
                {stats.playingTeamCount}
              </span>
              <p className="text-muted">teams playing group stage here</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <section>
            <h2 className="font-display text-2xl tracking-wide text-gold">
              TEAMS WITH NEARBY TBC
            </h2>
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
            <h2 className="font-display text-2xl tracking-wide text-gold">
              TEAMS PLAYING HERE
            </h2>
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
            <h2 className="font-display text-2xl tracking-wide text-gold">
              TBC LOCATIONS
            </h2>
            <div className="mt-4 overflow-hidden border border-card-border">
              <TbcMapWrapper
                teams={stats.tbcTeams}
                height="400px"
                zoom={6}
                center={[city.coordinates.lat, city.coordinates.lng]}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
