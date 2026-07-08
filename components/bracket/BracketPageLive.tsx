"use client";

import Link from "next/link";
import { KnockoutBracket } from "@/components/bracket/KnockoutBracket";
import { useLiveScores } from "@/components/live/LiveScoresProvider";
import { CountryFlag } from "@/components/ui/CountryFlag";
import type { BracketRoundView } from "@/lib/schedule/bracket-board";
import type { getKnockoutProgress } from "@/lib/schedule/bracket-board";

type BracketPageLiveProps = {
  initialRounds: BracketRoundView[];
  initialProgress: ReturnType<typeof getKnockoutProgress>;
};

export function BracketPageLive({
  initialRounds,
  initialProgress,
}: BracketPageLiveProps) {
  const { bracketRounds, knockoutProgress } = useLiveScores();
  const rounds = bracketRounds ?? initialRounds;
  const progress = knockoutProgress ?? initialProgress;

  return (
    <>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="wc26-panel p-4">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
            Knockout progress
          </p>
          <p className="mt-2 font-display text-3xl font-black text-gold">
            {progress.played}
            <span className="text-lg text-muted"> / {progress.total}</span>
          </p>
          <p className="mt-1 text-xs text-muted">Matches completed</p>
        </div>

        <div className="wc26-panel p-4 sm:col-span-2">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
            Champion
          </p>
          {progress.champion ? (
            <Link
              href={`/countries/${progress.champion.slug}`}
              className="mt-2 inline-flex flex-wrap items-center gap-3 transition hover:text-gold-light"
            >
              {progress.champion.countryCode && (
                <CountryFlag
                  countryCode={progress.champion.countryCode}
                  className="text-xl"
                />
              )}
              <span className="font-display text-2xl font-black uppercase tracking-wide text-cream">
                {progress.champion.label}
              </span>
            </Link>
          ) : (
            <p className="mt-2 font-display text-xl font-black uppercase tracking-wide text-muted">
              To be decided
            </p>
          )}
        </div>
      </div>

      <KnockoutBracket rounds={rounds} />
    </>
  );
}
