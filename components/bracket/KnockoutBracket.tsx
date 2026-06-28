import { BracketMatchCard } from "@/components/bracket/BracketMatchCard";
import type { BracketRoundView } from "@/lib/schedule/bracket-board";

type KnockoutBracketProps = {
  rounds: BracketRoundView[];
};

function RoundColumn({ round }: { round: BracketRoundView }) {
  return (
    <section className="flex w-56 shrink-0 flex-col gap-3 sm:w-60">
      <div className="border-b border-gold/20 pb-2 pt-1">
        <h3 className="font-display text-xs font-bold uppercase leading-snug tracking-[0.16em] text-cream">
          {round.label}
        </h3>
        <p className="mt-0.5 text-[10px] uppercase leading-snug tracking-wider text-muted">
          {round.matches.length} {round.matches.length === 1 ? "match" : "matches"}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {round.matches.map((match) => (
          <BracketMatchCard
            key={match.matchNumber}
            match={match}
            emphasized={match.stage === "final"}
          />
        ))}
      </div>
    </section>
  );
}

export function KnockoutBracket({ rounds }: KnockoutBracketProps) {
  return (
    <div className="space-y-8">
      <div className="hidden lg:block">
        <div className="pt-2">
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max gap-4 xl:gap-6">
              {rounds.map((round) => (
                <RoundColumn key={round.stage} round={round} />
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          Scroll horizontally to follow the path from the Round of 32 to the
          Final.
        </p>
      </div>

      <div className="space-y-8 lg:hidden">
        {rounds.map((round) => (
          <RoundColumn key={round.stage} round={round} />
        ))}
      </div>
    </div>
  );
}
