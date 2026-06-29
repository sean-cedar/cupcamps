import Link from "next/link";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { GroupBadge } from "@/components/ui/GroupBadge";
import type { GroupSummaryView } from "@/lib/schedule/groups";

type GroupCardProps = {
  summary: GroupSummaryView;
};

export function GroupCard({ summary }: GroupCardProps) {
  return (
    <Link
      href={`/groups/${summary.group}`}
      className="wc26-panel interaction-lift interaction-press ui-focus-ring block p-5 transition hover:border-gold/30 hover:bg-card/60"
      data-haptic="light"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <GroupBadge group={summary.group} size="lg" />
          <div>
            <p className="font-display text-lg font-black uppercase tracking-[0.06em] text-cream">
              Group {summary.group}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted">
              {summary.matchesPlayed}/{summary.matchesTotal} played
            </p>
          </div>
        </div>
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-gold">
          View →
        </span>
      </div>

      <ol className="mt-4 space-y-2">
        {summary.standings.map((row) => (
          <li
            key={row.slug}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="inline-flex min-w-0 items-center gap-2 text-cream">
              <span className="w-4 text-[10px] tabular-nums text-muted">
                {row.rank}
              </span>
              <CountryFlag countryCode={row.countryCode} className="text-sm" />
              <span className="truncate">{row.name}</span>
            </span>
            <span className="shrink-0 tabular-nums text-muted">{row.points} pts</span>
          </li>
        ))}
      </ol>

      <div className="mt-4 border-t border-card-border pt-3">
        {summary.isComplete ? (
          summary.advancedTeams.length > 0 ? (
            <p className="text-xs text-muted">
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                Advanced
              </span>
              {": "}
              {summary.advancedTeams.map((team) => team.name).join(", ")}
            </p>
          ) : (
            <p className="text-xs text-muted">Group complete</p>
          )
        ) : (
          <p className="text-xs text-muted">Group stage in progress</p>
        )}
      </div>
    </Link>
  );
}
