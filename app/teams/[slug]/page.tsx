import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HostCityLink } from "@/components/host-cities/HostCityCard";
import { TbcMapWrapper } from "@/components/map/TbcMapWrapper";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { GroupBadge } from "@/components/ui/GroupBadge";
import { getHostCity, getTeam, teams } from "@/lib/teams";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return teams.map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeam(slug);
  if (!team) return { title: "Team Not Found" };

  return {
    title: `${team.name} Base Camp`,
    description: `${team.name} will train at ${team.tbc.trainingSite} in ${team.tbc.city} during World Cup 2026. Group ${team.group}.`,
  };
}

export default async function TeamDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const team = getTeam(slug);
  if (!team) notFound();

  const nearestHostCity = getHostCity(team.tbc.nearestHostCitySlug);
  const groupStageCities = team.groupStageHostCitySlugs
    .map((s) => getHostCity(s))
    .filter(Boolean);

  return (
    <div>
      <section className="border-b border-card-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Link
            href="/teams"
            className="text-sm text-muted hover:text-gold-light"
          >
            ← All teams
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <CountryFlag countryCode={team.countryCode} className="text-6xl" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-5xl tracking-wide text-cream sm:text-6xl">
                  {team.name}
                </h1>
                <GroupBadge group={team.group} size="lg" />
              </div>
              <p className="mt-2 text-muted">
                {team.confederation} · Group {team.group}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <section>
            <h2 className="font-display text-2xl tracking-wide text-gold">
              HOME AWAY FROM HOME
            </h2>
            <div className="mt-4 space-y-4 border border-card-border bg-card p-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">
                  Training site
                </p>
                <p className="mt-1 text-lg text-cream">{team.tbc.trainingSite}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">
                  Location
                </p>
                <p className="mt-1 text-lg text-cream">
                  {team.tbc.city}, {team.tbc.country}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`border px-3 py-1 text-xs uppercase tracking-wider ${
                    team.tbc.isHostCityCommunity
                      ? "border-gold/40 text-gold"
                      : "border-card-border text-muted"
                  }`}
                >
                  {team.tbc.isHostCityCommunity
                    ? "Host city community"
                    : "Beyond host cities"}
                </span>
                {nearestHostCity && (
                  <span className="border border-card-border px-3 py-1 text-xs text-muted">
                    Nearest zone: {nearestHostCity.name}
                  </span>
                )}
              </div>
            </div>

            <section className="mt-10">
              <h2 className="font-display text-2xl tracking-wide text-gold">
                ON THE PITCH
              </h2>
              <p className="mt-2 text-sm text-muted">
                Group-stage host cities where {team.name} plays
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {groupStageCities.map(
                  (city) =>
                    city && <HostCityLink key={city.slug} slug={city.slug} />,
                )}
              </div>
            </section>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide text-gold">
              ON THE MAP
            </h2>
            <div className="mt-4 overflow-hidden border border-card-border">
              <TbcMapWrapper
                teams={[team]}
                height="400px"
                zoom={8}
                center={[
                  team.tbc.coordinates.lat,
                  team.tbc.coordinates.lng,
                ]}
                highlightSlug={team.slug}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              Location is approximate based on training facility or city center.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
