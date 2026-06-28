import Link from "next/link";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { GroupBadge } from "@/components/ui/GroupBadge";
import { getHostCity } from "@/lib/teams";
import type { HostCity, Team } from "@/lib/types";

type HostCityCardProps = {
  city: HostCity;
  tbcCount: number;
  playingCount: number;
};

export function HostCityCard({ city, tbcCount, playingCount }: HostCityCardProps) {
  return (
    <Link
      href={`/host-cities/${city.slug}`}
      className="group block overflow-hidden border border-card-border bg-card transition hover:border-gold/50"
    >
      <div className="h-2" style={{ backgroundColor: city.accentColor }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-xl tracking-wide text-cream group-hover:text-gold-light">
              {city.name}
            </h3>
            <p className="text-xs uppercase tracking-wider text-muted">
              {city.country}
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted">{city.stadium}</p>
        <div className="mt-4 flex gap-4 text-xs text-cream">
          <span>
            <strong className="text-gold">{tbcCount}</strong> TBC teams
          </span>
          <span>
            <strong className="text-gold">{playingCount}</strong> playing here
          </span>
        </div>
      </div>
    </Link>
  );
}

type TeamListItemProps = {
  team: Team;
};

export function TeamListItem({ team }: TeamListItemProps) {
  return (
    <Link
      href={`/teams/${team.slug}`}
      className="flex items-center gap-3 border border-card-border bg-card px-4 py-3 transition hover:border-gold/50"
    >
      <CountryFlag countryCode={team.countryCode} className="text-xl" />
      <span className="flex-1 font-medium text-cream">{team.name}</span>
      <GroupBadge group={team.group} size="sm" />
    </Link>
  );
}

type HostCityLinkProps = {
  slug: string;
};

export function HostCityLink({ slug }: HostCityLinkProps) {
  const city = getHostCity(slug);
  if (!city) return null;

  return (
    <Link
      href={`/host-cities/${slug}`}
      className="inline-flex items-center gap-2 border border-card-border bg-card px-3 py-2 text-sm text-cream transition hover:border-gold/50 hover:text-gold-light"
    >
      <span
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: city.accentColor }}
      />
      {city.name}
    </Link>
  );
}
