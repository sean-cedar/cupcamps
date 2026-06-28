import Link from "next/link";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { formatMatchDate } from "@/lib/schedule";
import type { BracketMatchView } from "@/lib/schedule/bracket-board";
import { getHostCity } from "@/lib/teams";

type BracketMatchCardProps = {
  match: BracketMatchView;
  emphasized?: boolean;
};

function ParticipantRow({
  participant,
  score,
  align = "left",
}: {
  participant: BracketMatchView["home"];
  score: number | null;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`flex items-center gap-2 py-1 ${
        align === "right" ? "flex-row-reverse text-right" : ""
      }`}
    >
      {participant.isPlaceholder ? (
        <span className="inline-block h-3.5 w-5 rounded-sm bg-card-border" />
      ) : participant.countryCode ? (
        <CountryFlag countryCode={participant.countryCode} className="text-sm" />
      ) : (
        <span className="inline-block h-3.5 w-5 rounded-sm bg-card-border" />
      )}
      <span
        className={`min-w-0 flex-1 truncate ${
          participant.isWinner
            ? "font-semibold text-gold-light"
            : participant.isPlaceholder
              ? "text-muted"
              : "text-cream"
        }`}
      >
        {participant.label}
      </span>
      {score !== null && (
        <span
          className={`font-display text-sm font-black tabular-nums ${
            participant.isWinner ? "text-gold" : "text-cream"
          }`}
        >
          {score}
        </span>
      )}
    </div>
  );
}

export function BracketMatchCard({
  match,
  emphasized = false,
}: BracketMatchCardProps) {
  const stageLabel =
    match.stage === "third-place" ? "Third place" : undefined;
  const hostCity = getHostCity(match.hostCitySlug);

  return (
    <Link
      href={`/matches/${match.matchNumber}`}
      className={`block transition hover:scale-[1.01] ${
        emphasized ? "ring-1 ring-gold/30" : ""
      }`}
    >
      <article
        className={`wc26-panel p-3 ${
          emphasized ? "border-gold/40 bg-gold/5" : ""
        } ${match.isPlayed ? "" : "opacity-90"}`}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-gold">
            {stageLabel ?? `Match ${match.matchNumber}`}
          </p>
          {!match.isPlayed && (
            <span className="text-[10px] uppercase tracking-wider text-muted">
              TBD
            </span>
          )}
        </div>

        <div className="mt-2 space-y-0.5">
          <ParticipantRow participant={match.home} score={match.homeScore} />
          <ParticipantRow
            participant={match.away}
            score={match.awayScore}
            align="right"
          />
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-card-border pt-2">
          <p className="text-[10px] text-muted">{formatMatchDate(match.date)}</p>
          {hostCity && (
            <p className="text-[10px] font-medium text-muted">{hostCity.name}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
