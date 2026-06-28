import Link from "next/link";
import { KitPhotoLink } from "@/components/kits/KitPhotoLink";
import { TeamKit } from "@/components/ui/TeamKit";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { getTeamKitSet } from "@/lib/kits";
import type { KitVariantId } from "@/lib/kits/types";
import type { MatchParticipantView } from "@/lib/schedule/match-page";

type MatchParticipantPanelProps = {
  participant: MatchParticipantView;
  side: "home" | "away";
  matchPhotoUrl: string;
};

function kitVariantForSide(side: "home" | "away"): KitVariantId {
  return side === "home" ? "home" : "away";
}

function kitLabelForVariant(variantId: KitVariantId): string {
  if (variantId === "away") {
    return "Away kit";
  }
  if (variantId === "third") {
    return "Third kit";
  }
  return "Home kit";
}

export function MatchParticipantPanel({
  participant,
  side,
  matchPhotoUrl,
}: MatchParticipantPanelProps) {
  const kitVariantId = kitVariantForSide(side);
  const wornKit = participant.team
    ? getTeamKitSet(participant.team.slug)?.variants.find(
        (variant) => variant.id === kitVariantId,
      )
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
                href={`/teams/${participant.team.slug}`}
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

            {wornKit && participant.team && (
              <KitPhotoLink
                href={matchPhotoUrl}
                label={`${participant.team.name} at this match`}
                showPhotoHint={false}
                className={`mt-2 inline-flex items-center gap-2 ${
                  side === "away" ? "flex-row-reverse" : ""
                }`}
              >
                <TeamKit
                  outfit={{ shirt: wornKit.shirt, shorts: wornKit.shorts }}
                  size="md"
                  title={`${participant.team.name} ${kitLabelForVariant(kitVariantId).toLowerCase()}`}
                />
                <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-muted transition group-hover:text-gold">
                  {kitLabelForVariant(kitVariantId)} · Match photo →
                </span>
              </KitPhotoLink>
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
                  href={`/teams/${team.slug}`}
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
