import Link from "next/link";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { GroupBadge } from "@/components/ui/GroupBadge";
import { getHostCity } from "@/lib/teams";
import type { Team } from "@/lib/types";

type TeamCardProps = {
  team: Team;
};

const tbcCountryColors: Record<string, string> = {
  USA: "text-accent-usa",
  Mexico: "text-accent-mexico",
  Canada: "text-accent-canada",
};

export function TeamCard({ team }: TeamCardProps) {
  const hostCity = getHostCity(team.tbc.nearestHostCitySlug);

  return (
    <Link
      href={`/teams/${team.slug}`}
      className="group block border border-card-border bg-card p-5 transition hover:border-gold/50 hover:bg-card/80"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CountryFlag countryCode={team.countryCode} className="text-3xl" />
          <div>
            <h3 className="font-display text-xl tracking-wide text-cream group-hover:text-gold-light">
              {team.name}
            </h3>
            <p className="text-xs text-muted">{team.confederation}</p>
          </div>
        </div>
        <GroupBadge group={team.group} size="sm" />
      </div>
      <div className="mt-4 space-y-1 border-t border-card-border pt-4">
        <p className="text-sm text-cream">
          <span className="text-muted">TBC: </span>
          {team.tbc.city}
        </p>
        <p className="truncate text-sm text-muted">{team.tbc.trainingSite}</p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span
            className={`text-xs font-medium uppercase tracking-wider ${tbcCountryColors[team.tbc.country]}`}
          >
            {team.tbc.country}
          </span>
          {hostCity && (
            <span className="text-xs text-muted">· {hostCity.name} zone</span>
          )}
        </div>
      </div>
    </Link>
  );
}
