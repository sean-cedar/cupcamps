import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { KnockoutBracket } from "@/components/bracket/KnockoutBracket";
import { CountryFlag } from "@/components/ui/CountryFlag";
import {
  getKnockoutBracketRounds,
  getKnockoutProgress,
} from "@/lib/schedule/bracket-board";

export const metadata: Metadata = {
  title: "Knockout Bracket",
  description:
    "FIFA World Cup 26™ knockout bracket from the Round of 32 through the Final, with live results as matches are played.",
};

export default function BracketPage() {
  const rounds = getKnockoutBracketRounds();
  const progress = getKnockoutProgress();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="Knockout Bracket"
        subtitle="Round of 32 · Round of 16 · Quarter-finals · Semi-finals · Final"
        className="mb-6"
      />

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
              href={`/teams/${progress.champion.slug}`}
              className="mt-2 inline-flex items-center gap-2 transition hover:text-gold-light"
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
    </div>
  );
}
