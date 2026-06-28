import Link from "next/link";
import type { AdvanceMatchView } from "@/lib/schedule/match-page";

type MatchAdvancementPanelProps = {
  advances: AdvanceMatchView[];
};

export function MatchAdvancementPanel({ advances }: MatchAdvancementPanelProps) {
  if (advances.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {advances.map((advance) => (
        <Link
          key={`${advance.matchNumber}-${advance.label}`}
          href={`/matches/${advance.matchNumber}`}
          className="block wc26-panel p-4 transition hover:border-gold/30"
        >
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-gold">
            {advance.label}
          </p>
          <p className="mt-1 text-xs uppercase tracking-wider text-muted">
            {advance.stageLabel}
          </p>
          <p className="mt-1 text-sm text-cream">
            {advance.homeLabel} vs {advance.awayLabel}
          </p>
          {advance.score ? (
            <p className="mt-1 font-display text-lg font-black text-cream">
              {advance.score}
            </p>
          ) : (
            <p className="mt-1 text-xs uppercase tracking-wider text-muted">
              View next match →
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
