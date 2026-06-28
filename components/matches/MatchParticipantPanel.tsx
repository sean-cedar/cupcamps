import Link from "next/link";
import { TeamKit } from "@/components/ui/TeamKit";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { getTeamKitSet } from "@/lib/kits";
import {
  getMatchWornKits,
  getWornKitOutfit,
  getWornKitVariantId,
} from "@/lib/kits/match-kits";
import { countryHref } from "@/lib/navigation/country-links";
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
  const fromMatch = `/matches/${matchNumber}`;
  const isAway = side === "away";

  return (
    <div
      className={`wc26-panel flex h-full flex-col p-5 sm:p-6 ${
        participant.isWinner ? "border-gold/40 bg-gold/5" : ""
      }`}
    >
      <p
        className={`font-display text-[10px] font-bold uppercase tracking-[0.14em] text-gold ${
          isAway ? "text-right" : ""
        }`}
      >
        {side === "home" ? "Home" : "Away"}
      </p>

      <div
        className={`mt-4 flex items-center gap-3 sm:gap-4 ${
          isAway ? "flex-row-reverse" : ""
        }`}
      >
        {participant.team ? (
          <Link
            href={countryHref(participant.team.slug, fromMatch)}
            className="shrink-0 transition hover:opacity-85"
            aria-label={`${participant.team.name} country page`}
          >
            <CountryFlag
              countryCode={participant.team.countryCode}
              className="text-4xl sm:text-5xl"
              label={participant.team.name}
            />
          </Link>
        ) : null}

        <div
          className={`flex min-w-0 flex-1 items-center gap-3 ${
            isAway ? "flex-row-reverse" : ""
          }`}
        >
          {participant.team ? (
            <Link
              href={countryHref(participant.team.slug, fromMatch)}
              className={`min-w-0 font-display text-xl font-black uppercase tracking-[0.04em] transition hover:text-gold-light sm:text-2xl ${
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

          {participant.score !== null && (
            <p className="shrink-0 font-display text-4xl font-black tabular-nums text-cream sm:text-5xl">
              {participant.score}
            </p>
          )}
        </div>
      </div>

      {wornOutfit && participant.team && wornKitLabel && (
        <div className="mt-6 flex flex-1 flex-col">
          <div className="kit-match-showcase flex flex-1 items-end justify-center">
            <TeamKit
              outfit={wornOutfit}
              size="2xl"
              title={`${participant.team.name} ${wornKitLabel.toLowerCase()} kit worn in this match`}
              framed={false}
            />
          </div>
          <div
            className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 ${
              isAway ? "justify-end" : ""
            }`}
          >
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
        </div>
      )}

      {showPotential && (
        <div className={`mt-4 w-full ${isAway ? "text-right" : ""}`}>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
            Potential teams
          </p>
          <ul
            className={`mt-2 flex flex-col space-y-2 ${
              isAway ? "items-end" : "items-start"
            }`}
          >
            {participant.potentialTeams.map((team) => (
              <li key={team.slug}>
                <Link
                  href={countryHref(team.slug, fromMatch)}
                  className={`inline-flex items-center gap-2 rounded border border-card-border bg-card/40 px-2 py-1.5 text-sm text-cream transition hover:border-gold/40 hover:text-gold-light ${
                    isAway ? "flex-row-reverse" : ""
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
