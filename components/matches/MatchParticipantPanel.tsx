import Link from "next/link";
import { KitPhotoLink } from "@/components/kits/KitPhotoLink";
import { TeamKit } from "@/components/ui/TeamKit";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { getKitPhotoUrl, getTeamKitSet } from "@/lib/kits";
import type { MatchParticipantView } from "@/lib/schedule/match-page";

type MatchParticipantPanelProps = {
  participant: MatchParticipantView;
  side: "home" | "away";
};

export function MatchParticipantPanel({
  participant,
  side,
}: MatchParticipantPanelProps) {
  const homeKit = participant.team
    ? getTeamKitSet(participant.team.slug)?.variants.find((v) => v.id === "home")
    : null;
  const showPotential =
    participant.isPlaceholder &&
    participant.potentialTeams.length > 0 &&
    !participant.team;

  return (
    <div
      className={`wc26-panel flex flex-col p-5 ${
        participant.isWinner ? "border-gold/40 bg-gold/5" : ""
      } ${side === "away" ? "text-right sm:items-end" : ""}`}
    >
      <p className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-gold">
        {side === "home" ? "Home" : "Away"}
      </p>

      {participant.team ? (
        <Link
          href={`/teams/${participant.team.slug}`}
          className={`mt-3 flex items-center gap-3 transition hover:text-gold-light ${
            side === "away" ? "flex-row-reverse" : ""
          }`}
        >
          <CountryFlag
            countryCode={participant.team.countryCode}
            className="text-4xl"
          />
          <div className={side === "away" ? "text-right" : ""}>
            <p
              className={`font-display text-2xl font-black uppercase tracking-[0.04em] ${
                participant.isWinner ? "text-gold-light" : "text-cream"
              }`}
            >
              {participant.team.name}
            </p>
            {participant.score !== null && (
              <p className="font-display text-4xl font-black tabular-nums text-cream">
                {participant.score}
              </p>
            )}
          </div>
        </Link>
      ) : (
        <div className={`mt-3 ${side === "away" ? "text-right" : ""}`}>
          <p className="font-display text-xl font-black uppercase tracking-[0.04em] text-muted">
            {participant.label}
          </p>
          {participant.score !== null && (
            <p className="font-display text-4xl font-black tabular-nums text-cream">
              {participant.score}
            </p>
          )}
        </div>
      )}

      {homeKit && participant.team && (
        <figure className="mt-4 flex flex-col items-center">
          <KitPhotoLink
            href={homeKit.photoUrl ?? getKitPhotoUrl(participant.team.slug, "home")}
            label={`${participant.team.name} home`}
            className="flex flex-col items-center text-center"
          >
            <TeamKit
              outfit={{ shirt: homeKit.shirt, shorts: homeKit.shorts }}
              size="lg"
              title={`${participant.team.name} home kit`}
            />
            <figcaption className="mt-2 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              Home kit
            </figcaption>
          </KitPhotoLink>
        </figure>
      )}

      {showPotential && (
        <div className={`mt-5 w-full ${side === "away" ? "text-right" : ""}`}>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
            Potential teams
          </p>
          <ul
            className={`mt-2 space-y-2 ${
              side === "away" ? "items-end" : "items-start"
            } flex flex-col`}
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
