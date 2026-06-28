import Link from "next/link";
import type { FeederMatchView } from "@/lib/schedule/match-page";

type MatchFeedersPanelProps = {
  feeders: FeederMatchView[];
};

export function MatchFeedersPanel({ feeders }: MatchFeedersPanelProps) {
  if (feeders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {feeders.map((feeder) => (
        <Link
          key={`${feeder.matchNumber}-${feeder.label}`}
          href={`/matches/${feeder.matchNumber}`}
          className="block wc26-panel p-4 transition hover:border-gold/30"
        >
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-gold">
            {feeder.label}
          </p>
          <p className="mt-1 text-sm text-cream">
            Match {feeder.matchNumber}: {feeder.homeLabel} vs {feeder.awayLabel}
          </p>
          {feeder.score ? (
            <p className="mt-1 font-display text-lg font-black text-cream">
              {feeder.score}
            </p>
          ) : (
            <p className="mt-1 text-xs uppercase tracking-wider text-muted">
              Not yet played
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
