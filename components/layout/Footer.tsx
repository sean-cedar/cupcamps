import Link from "next/link";
import { DATA_LAST_UPDATED } from "@/lib/teams";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-card-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="font-display text-xl tracking-wide text-gold">CUPCAMPS</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              A fan-made guide to where all 48 nations are training and staying
              during the FIFA World Cup 2026™. Not affiliated with or endorsed by
              FIFA.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-cream">Data sources</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
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
                  FIFA World Cup 2026 match schedule
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
