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
      className="group wc26-panel block overflow-hidden transition hover:border-gold/40"
    >
      <div className="h-1.5" style={{ backgroundColor: city.accentColor }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-xl font-bold uppercase tracking-[0.06em] text-cream group-hover:text-gold-light">
              {city.name}
            </h3>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              {city.country}
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted">{city.stadium}</p>
        <div className="mt-4 flex gap-4 font-display text-xs uppercase tracking-wider text-cream">
          <span>
            <strong className="text-gold">{tbcCount}</strong> TBC
          </span>
          <span>
            <strong className="text-gold">{playingCount}</strong> playing
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
      className="flex items-center gap-3 wc26-panel px-4 py-3 transition hover:border-gold/40"
    >
      <CountryFlag countryCode={team.countryCode} className="text-xl" />
      <span className="flex-1 font-display font-semibold uppercase tracking-wide text-cream">
        {team.name}
      </span>
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
      className="inline-flex items-center gap-2 wc26-panel px-3 py-2 font-display text-xs font-bold uppercase tracking-wider text-cream transition hover:border-gold/40 hover:text-gold-light"
    >
      <span
        className="h-2.5 w-2.5"
        style={{ backgroundColor: city.accentColor }}
      />
      {city.name}
    </Link>
  );
}
