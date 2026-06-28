import Link from "next/link";
import { HostNationStripe } from "@/components/brand/HostNationStripe";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { DATA_LAST_UPDATED } from "@/lib/teams";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-card-border bg-card">
      <HostNationStripe height={2} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <SiteLogo />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Fan-made guide to FIFA World Cup 26™ Team Base Camps. Not
              affiliated with or endorsed by FIFA.
            </p>
          </div>
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.15em] text-cream">
              Sources
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link
                  href="https://inside.fifa.com/organisation/media-releases/world-cup-2026-team-base-camps-tbc-48-nations-usa-mexico-canada"
                  className="underline decoration-gold/40 underline-offset-2 hover:text-gold-light"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FIFA TBC announcement
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums"
                  className="underline decoration-gold/40 underline-offset-2 hover:text-gold-light"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FIFA match schedule
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-xs text-muted">
              Updated {DATA_LAST_UPDATED}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
