import Link from "next/link";
import { CountryFlag } from "@/components/ui/CountryFlag";
import {
  getGroupAdvancementLabel,
  type GroupAdvancementStatus,
} from "@/lib/schedule/groups";

export type GroupStandingCardRow = {
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

type GroupStandingCardProps = {
  row: GroupStandingCardRow;
  rank: number;
  showAdvancement?: boolean;
};

function cardClassName(row: GroupStandingCardRow): string {
  if (row.isHomeTeam || row.isAwayTeam) {
    return "border-gold/30 bg-gold/5";
  }

  switch (row.advancement) {
    case "qualified-top-two":
    case "qualified-third":
      return "border-emerald-900/40 bg-emerald-950/20";
    case "third-eliminated":
    case "eliminated":
      return "opacity-80";
    default:
      return "";
  }
}

export function GroupStandingCard({
  row,
  rank,
  showAdvancement = false,
}: GroupStandingCardProps) {
  return (
    <article
      className={`wc26-panel border p-4 ${cardClassName(row)}`}
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/countries/${row.slug}`}
          className="inline-flex min-w-0 flex-1 items-center gap-3 text-cream transition hover:text-gold-light"
        >
          <span className="w-5 shrink-0 text-xs tabular-nums text-muted">
            {rank}
          </span>
          <CountryFlag countryCode={row.countryCode} className="text-lg" />
          <span
            className={`truncate font-display text-sm font-semibold uppercase tracking-wide ${
              row.advancement === "qualified-top-two" ||
              row.advancement === "qualified-third"
                ? "text-gold-light"
                : ""
            }`}
          >
            {row.name}
          </span>
        </Link>
        <div className="shrink-0 text-right">
          <p className="font-display text-xl font-black tabular-nums text-cream">
            {row.points}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted">Pts</p>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-4 gap-2 text-center text-[10px] uppercase tracking-wider">
        <div>
          <dt className="text-muted">P</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-cream">
            {row.played}
          </dd>
        </div>
        <div>
          <dt className="text-muted">GF</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-cream">
            {row.gf}
          </dd>
        </div>
        <div>
          <dt className="text-muted">GA</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-cream">
            {row.ga}
          </dd>
        </div>
        <div>
          <dt className="text-muted">GD</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-cream">
            {row.gd > 0 ? `+${row.gd}` : row.gd}
          </dd>
        </div>
      </dl>

      {showAdvancement &&
        row.advancement &&
        row.advancement !== "in-progress" && (
          <p
            className={`mt-3 text-[10px] font-bold uppercase tracking-[0.12em] ${
              row.advancement === "qualified-top-two" ||
              row.advancement === "qualified-third"
                ? "text-emerald-300"
                : "text-muted"
            }`}
          >
            {getGroupAdvancementLabel(row.advancement)}
          </p>
        )}
    </article>
  );
}
