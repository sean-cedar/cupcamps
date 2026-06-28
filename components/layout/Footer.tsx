import Link from "next/link";
import { HostNationStripe } from "@/components/brand/HostNationStripe";
import { TournamentLockup } from "@/components/brand/TournamentLockup";
import { Wc26Mark } from "@/components/brand/Wc26Mark";
import { DATA_LAST_UPDATED } from "@/lib/teams";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-card-border bg-card">
      <HostNationStripe height={3} />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <Wc26Mark size={36} />
              <TournamentLockup subtitle="CupCamps · Fan Guide" size="sm" />
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              A fan-made guide to where all 48 nations are training and staying
              during the FIFA World Cup 26™. Visual identity inspired by the
              official tournament brand system. Not affiliated with or endorsed
              by FIFA.
            </p>
            <p className="mt-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold/70">
              Together · Football · Legacy · World · Game · On
            </p>
          </div>
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-cream">
              Data sources
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link
                  href="https://inside.fifa.com/organisation/media-releases/world-cup-2026-team-base-camps-tbc-48-nations-usa-mexico-canada"
                  className="underline decoration-gold/40 underline-offset-2 hover:text-gold-light"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FIFA Team Base Camp announcement (25 May 2026)
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums"
                  className="underline decoration-gold/40 underline-offset-2 hover:text-gold-light"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FIFA World Cup 26™ match schedule
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.fifa.com/en/articles/world-cup-2026-official-brand-unveiled-canada-mexico-usa-celebration-football-diversity"
                  className="underline decoration-gold/40 underline-offset-2 hover:text-gold-light"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FIFA World Cup 26™ official brand
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-xs text-muted">
              Last updated: {DATA_LAST_UPDATED}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
