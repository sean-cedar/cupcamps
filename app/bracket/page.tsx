import type { Metadata } from "next";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { BracketPageLive } from "@/components/bracket/BracketPageLive";
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

      <BracketPageLive
        initialRounds={rounds}
        initialProgress={progress}
      />
    </div>
  );
}
