import Link from "next/link";
import { TeamKit } from "@/components/ui/TeamKit";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { getTeamKitSet } from "@/lib/kits";
import {
  getMatchWornKits,
  getWornKitOutfit,
  getWornKitVariantId,
} from "@/lib/kits/match-kits";
import type { MatchParticipantView } from "@/lib/schedule/match-page";

type MatchParticipantPanelProps = {
  participant: MatchParticipantView;
  side: "home" | "away";
  matchNumber: number;
};

export function MatchParticipantPanel({
  participant,
  side,
  matchNumber,
}: MatchParticipantPanelProps) {
  const wornKitEntry = getMatchWornKits(matchNumber);
  const wornOutfit = participant.team
    ? getWornKitOutfit(matchNumber, participant.team.slug)
    : null;
  const variantId = participant.team
    ? getWornKitVariantId(matchNumber, participant.team.slug)
    : null;
  const wornKitLabel =
    variantId && participant.team
      ? getTeamKitSet(participant.team.slug)?.variants.find(
          (variant) => variant.id === variantId,
        )?.label
      : null;
  const showPotential =
    participant.isPlaceholder &&
    participant.potentialTeams.length > 0 &&
    !participant.team;

  return (
    <div
      className={`wc26-panel p-4 sm:p-5 ${
        participant.isWinner ? "border-gold/40 bg-gold/5" : ""
      }`}
    >
      <p
        className={`font-display text-[10px] font-bold uppercase tracking-[0.14em] text-gold ${
          side === "away" ? "text-right" : ""
        }`}
      >
        {side === "home" ? "Home" : "Away"}
      </p>

      <div
        className={`mt-3 flex items-center gap-3 sm:gap-4 ${
          side === "away" ? "flex-row-reverse" : ""
        }`}
      >
        {participant.team ? (
          <CountryFlag
            countryCode={participant.team.countryCode}
            className="shrink-0 text-3xl sm:text-4xl"
          />
        ) : null}

        <div
          className={`flex min-w-0 flex-1 items-center gap-3 sm:gap-4 ${
            side === "away" ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className={`min-w-0 flex-1 ${
              side === "away" ? "text-right" : "text-left"
            }`}
          >
            {participant.team ? (
              <Link
                href={`/countries/${participant.team.slug}`}
                className={`font-display text-xl font-black uppercase tracking-[0.04em] transition hover:text-gold-light sm:text-2xl ${
                  participant.isWinner ? "text-gold-light" : "text-cream"
                }`}
              >
                {participant.team.name}
              </Link>
            ) : (
              <p className="font-display text-lg font-black uppercase tracking-[0.04em] text-muted sm:text-xl">
                {participant.label}
              </p>
            )}

            {wornOutfit && participant.team && wornKitLabel && (
              <div
                className={`mt-3 inline-flex flex-col gap-2 ${
                  side === "away" ? "items-end" : "items-start"
                }`}
              >
                <div className="kit-gallery-cell !min-h-0 px-3 py-3">
                  <TeamKit
                    outfit={wornOutfit}
                    size="md"
                    title={`${participant.team.name} ${wornKitLabel.toLowerCase()} kit worn in this match`}
                    framed={false}
                  />
                </div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                  {wornKitLabel} kit · Match {matchNumber}
                </p>
                {wornKitEntry?.photoUrl && (
                  <a
                    href={wornKitEntry.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-gold transition hover:text-gold-light"
                  >
                    Match photos →
                  </a>
                )}
              </div>
            )}
          </div>

          {participant.score !== null && (
            <p className="shrink-0 font-display text-4xl font-black tabular-nums text-cream sm:text-5xl">
              {participant.score}
            </p>
          )}
        </div>
      </div>

      {showPotential && (
        <div className={`mt-4 w-full ${side === "away" ? "text-right" : ""}`}>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
            Potential teams
          </p>
          <ul
            className={`mt-2 flex flex-col space-y-2 ${
              side === "away" ? "items-end" : "items-start"
            }`}
          >
            {participant.potentialTeams.map((team) => (
              <li key={team.slug}>
                <Link
                  href={`/countries/${team.slug}`}
                  className={`inline-flex items-center gap-2 rounded border border-card-border bg-card/40 px-2 py-1.5 text-sm text-cream transition hover:border-gold/40 hover:text-gold-light ${
                    side === "away" ? "flex-row-reverse" : ""
                  }`}
                >
                  <CountryFlag countryCode={team.countryCode} className="text-base" />
                  <span>{team.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
