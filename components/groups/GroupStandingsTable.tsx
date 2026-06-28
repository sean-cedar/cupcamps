import Link from "next/link";
import { GroupStandingCard } from "@/components/groups/GroupStandingCard";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { countryHref } from "@/lib/navigation/country-links";
import { getGroupAdvancementLabel } from "@/lib/schedule/groups";
import type { GroupAdvancementStatus } from "@/lib/schedule/groups";

export type GroupStandingsRow = {
  slug: string;
  name: string;
  countryCode: string;
  played: number;
  points: number;
  gf: number;
  ga: number;
  gd: number;
  advancement?: GroupAdvancementStatus;
  isHomeTeam?: boolean;
  isAwayTeam?: boolean;
};

type GroupStandingsTableProps = {
  group: string;
  rows: GroupStandingsRow[];
  showAdvancement?: boolean;
  /** Passed through to country links for contextual back navigation. */
  countryFrom?: string;
};

function rowClassName(row: GroupStandingsRow): string {
  if (row.isHomeTeam || row.isAwayTeam) {
    return "bg-gold/5";
  }

  switch (row.advancement) {
    case "qualified-top-two":
    case "qualified-third":
      return "bg-emerald-950/25";
    case "third-eliminated":
    case "eliminated":
      return "opacity-70";
    default:
      return "";
  }
}

export function GroupStandingsTable({
  group,
  rows,
  showAdvancement = false,
  countryFrom,
}: GroupStandingsTableProps) {
  return (
    <div>
      <div className="space-y-3 md:hidden">
        <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-gold">
          Group {group} standings
        </p>
        {rows.map((row, index) => (
          <GroupStandingCard
            key={row.slug}
            row={row}
            rank={index + 1}
            showAdvancement={showAdvancement}
            countryFrom={countryFrom}
          />
        ))}
      </div>

      <div className="hidden overflow-x-auto wc26-panel md:block">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <caption className="px-4 py-3 text-left font-display text-xs font-bold uppercase tracking-[0.14em] text-gold">
          Group {group} standings
        </caption>
        <thead>
          <tr className="border-b border-card-border text-[10px] uppercase tracking-wider text-muted">
            <th className="px-4 py-2 font-medium">Team</th>
            <th className="px-2 py-2 text-center font-medium">P</th>
            <th className="px-2 py-2 text-center font-medium">Pts</th>
            <th className="px-2 py-2 text-center font-medium">GF</th>
            <th className="px-2 py-2 text-center font-medium">GA</th>
            <th className="px-2 py-2 text-center font-medium">GD</th>
            {showAdvancement && (
              <th className="px-4 py-2 text-right font-medium">Status</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.slug}
              className={`border-b border-card-border/60 last:border-b-0 ${rowClassName(row)}`}
            >
              <td className="px-4 py-2">
                <Link
                  href={countryHref(row.slug, countryFrom)}
                  className="inline-flex items-center gap-2 text-cream transition hover:text-gold-light"
                >
                  <span className="w-4 text-[10px] tabular-nums text-muted">
                    {index + 1}
                  </span>
                  <CountryFlag countryCode={row.countryCode} className="text-base" />
                  <span
                    className={
                      row.advancement === "qualified-top-two" ||
                      row.advancement === "qualified-third"
                        ? "font-semibold"
                        : ""
                    }
                  >
                    {row.name}
                  </span>
                </Link>
              </td>
              <td className="px-2 py-2 text-center tabular-nums text-muted">
                {row.played}
              </td>
              <td className="px-2 py-2 text-center tabular-nums font-semibold text-cream">
                {row.points}
              </td>
              <td className="px-2 py-2 text-center tabular-nums text-muted">
                {row.gf}
              </td>
              <td className="px-2 py-2 text-center tabular-nums text-muted">
                {row.ga}
              </td>
              <td className="px-2 py-2 text-center tabular-nums text-muted">
                {row.gd > 0 ? `+${row.gd}` : row.gd}
              </td>
              {showAdvancement && (
                <td className="px-4 py-2 text-right text-[10px] uppercase tracking-wider">
                  {row.advancement &&
                  row.advancement !== "in-progress" ? (
                    <span
                      className={
                        row.advancement === "qualified-top-two" ||
                        row.advancement === "qualified-third"
                          ? "text-emerald-300"
                          : "text-muted"
                      }
                    >
                      {getGroupAdvancementLabel(row.advancement)}
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
