import Link from "next/link";
import { CountryFlag } from "@/components/ui/CountryFlag";
import type { GroupAdvancedTeamView } from "@/lib/schedule/groups";

type GroupAdvancementPanelProps = {
  group: string;
  isComplete: boolean;
  advancedTeams: GroupAdvancedTeamView[];
};

export function GroupAdvancementPanel({
  group,
  isComplete,
  advancedTeams,
}: GroupAdvancementPanelProps) {
  return (
    <div className="wc26-panel p-6">
      <p className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-gold">
        Knockout qualification
      </p>

      {!isComplete ? (
        <p className="mt-3 text-sm text-muted">
          Group {group} is still in progress. Top two finishers advance automatically,
          and the best eight third-place teams across all groups also qualify for the
          Round of 32.
        </p>
      ) : advancedTeams.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {advancedTeams.map((team) => (
            <li key={team.slug}>
              <Link
                href={`/teams/${team.slug}`}
                className="flex items-center justify-between gap-3 transition hover:text-gold-light"
              >
                <span className="inline-flex items-center gap-3">
                  <CountryFlag countryCode={team.countryCode} className="text-xl" />
                  <span className="font-display text-lg font-black uppercase tracking-[0.04em] text-cream">
                    {team.name}
                  </span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  {team.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted">No teams advanced from this group.</p>
      )}
    </div>
  );
}
