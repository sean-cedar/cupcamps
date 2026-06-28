import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HostNationStripe } from "@/components/brand/HostNationStripe";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { HostCityLink } from "@/components/host-cities/HostCityCard";
import { TbcMapWrapper } from "@/components/map/TbcMapWrapper";
import { TeamKitGallery } from "@/components/teams/TeamKitGallery";
import { TeamSchedule } from "@/components/teams/TeamSchedule";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { GroupBadge } from "@/components/ui/GroupBadge";
import { getTeamKitVariants } from "@/lib/kits";
import { getTeamScheduleMapMarkers } from "@/lib/map/team-schedule-markers";
import { formatTeamTbcLocation, getHostCity, getTeam, teams } from "@/lib/teams";

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
    description: `${team.name} will train at ${team.tbc.trainingSite} in ${formatTeamTbcLocation(team)} during FIFA World Cup 26™. Group ${team.group}.`,
  };
}

export default async function TeamDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const team = getTeam(slug);
  if (!team) notFound();

  const nearestHostCity = getHostCity(team.tbc.nearestHostCitySlug);
  const kitVariants = getTeamKitVariants(team.slug);
  const groupStageCities = team.groupStageHostCitySlugs
    .map((s) => getHostCity(s))
    .filter(Boolean);
  const scheduleMapMarkers = getTeamScheduleMapMarkers(team.slug);

  return (
    <div>
      <section className="border-b border-card-border bg-card/50">
        <HostNationStripe height={3} />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Link
            href="/teams"
            className="font-display text-xs font-bold uppercase tracking-[0.15em] text-muted hover:text-gold-light"
          >
            ← All teams
          </Link>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap items-center gap-6">
              <CountryFlag countryCode={team.countryCode} className="text-6xl" />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-5xl font-black uppercase tracking-[0.04em] text-cream sm:text-6xl">
                    {team.name}
                  </h1>
                  <GroupBadge group={team.group} size="lg" />
                </div>
                <p className="mt-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                  {team.confederation} · Group {team.group}
                </p>
              </div>
            </div>

            {kitVariants.length > 0 && (
              <div className="hidden lg:block">
                <TeamKitGallery
                  teamName={team.name}
                  variants={kitVariants}
                  layout="hero"
                />
              </div>
            )}
          </div>

          {kitVariants.length > 0 && (
            <div className="mt-6 lg:hidden">
              <TeamKitGallery
                teamName={team.name}
                variants={kitVariants}
                layout="hero"
              />
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <section>
            <SectionHeading title="Home Away From Home" />
            <div className="mt-4 space-y-4 wc26-panel p-6">
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted">
                  Training site
                </p>
                <p className="mt-1 text-lg text-cream">{team.tbc.trainingSite}</p>
              </div>
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted">
                  Location
                </p>
                <p className="mt-1 text-lg text-cream">
                  {formatTeamTbcLocation(team)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`group-badge border px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider ${
                    team.tbc.isHostCityCommunity
                      ? "border-gold/60 bg-gold/10 text-gold-light"
                      : "border-card-border text-muted"
                  }`}
                >
                  {team.tbc.isHostCityCommunity
                    ? "Host city community"
                    : "Beyond host cities"}
                </span>
                {nearestHostCity && (
                  <span className="border border-card-border px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider text-muted">
                    Zone: {nearestHostCity.name}
                  </span>
                )}
              </div>
            </div>

            <section className="mt-10">
              <SectionHeading title="Match Cities" />
              <p className="mt-2 text-sm text-muted">
                Host cities where {team.name} plays group-stage matches
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
            <SectionHeading title="On The Map" />
            <div className="mt-4 overflow-hidden border border-gold/20">
              <HostNationStripe height={2} />
              <TbcMapWrapper
                teams={[team]}
                height="400px"
                zoom={5}
                center={[
                  team.tbc.coordinates.lat,
                  team.tbc.coordinates.lng,
                ]}
                highlightSlug={team.slug}
                matchMarkers={scheduleMapMarkers}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              Flag marks the base camp. Numbered pins follow this team&apos;s
              tournament path in order.
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
              <li className="flex items-center gap-1.5">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#2f855a] text-[9px] font-black text-white shadow-sm">
                  1
                </span>
                Completed
              </li>
              <li className="flex items-center gap-1.5">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-gold text-[9px] font-black text-[#111] shadow-sm">
                  2
                </span>
                Scheduled
              </li>
              <li className="flex items-center gap-1.5">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-dashed border-white bg-[#2a2a2a] text-[9px] font-black text-gold-light shadow-sm">
                  3
                </span>
                Potential
              </li>
            </ul>
          </section>

          <TeamSchedule team={team} />
        </div>
      </div>
    </div>
  );
}
