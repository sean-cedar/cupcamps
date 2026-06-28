import Link from "next/link";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { countryHref } from "@/lib/navigation/country-links";
import { getGroupAdvancementLabel } from "@/lib/schedule/groups";
import type { GroupTeamView } from "@/lib/schedule/groups";

type GroupTeamsPanelProps = {
  teams: GroupTeamView[];
  group: string;
};

function advancementClass(status: GroupTeamView["advancement"]): string {
  switch (status) {
    case "qualified-top-two":
    case "qualified-third":
      return "border-emerald-500/30 bg-emerald-950/20";
    case "third-eliminated":
    case "eliminated":
      return "opacity-80";
    default:
      return "";
  }
}

export function GroupTeamsPanel({ teams, group }: GroupTeamsPanelProps) {
  const countryFrom = `/groups/${group.toLowerCase()}`;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {teams.map((team) => (
        <Link
          key={team.slug}
          href={countryHref(team.slug, countryFrom)}
          className={`wc26-panel flex items-center gap-4 p-4 transition hover:border-gold/30 ${advancementClass(team.advancement)}`}
        >
          <CountryFlag countryCode={team.countryCode} className="text-3xl" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-black uppercase tracking-[0.04em] text-cream">
              {team.name}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted">
              {team.confederation}
            </p>
          </div>
          {team.advancement !== "in-progress" && (
            <span
              className={`shrink-0 text-right text-[10px] font-bold uppercase tracking-wider ${
                team.advancement === "qualified-top-two" ||
                team.advancement === "qualified-third"
                  ? "text-emerald-300"
                  : "text-muted"
              }`}
            >
              {getGroupAdvancementLabel(team.advancement)}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
