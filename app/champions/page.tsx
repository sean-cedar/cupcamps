import type { Metadata } from "next";
import Link from "next/link";
import { HostNationStripe } from "@/components/brand/HostNationStripe";
import { SectionHeading } from "@/components/brand/SectionHeading";
import {
  ChampionNationIdentity,
} from "@/components/world-cup/WorldCupTitles";
import {
  championTeamHref,
  getWorldCupChampions,
  getWorldCupChampionsByTeam,
} from "@/lib/world-cup/champions";

export const metadata: Metadata = {
  title: "World Cup Champions",
  description:
    "Every FIFA World Cup™ winner from 1930 through 2022 — titles by nation and year.",
};

export default function ChampionsPage() {
  const byYear = getWorldCupChampions();
  const byTeam = getWorldCupChampionsByTeam();

  return (
    <div>
      <section className="border-b border-card-border bg-card/50">
        <HostNationStripe height={3} />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
          <SectionHeading
            title="World Cup Champions"
            subtitle="22 editions · 8 nations"
          />
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Every FIFA World Cup™ winner from Uruguay 1930 through Argentina
            2022. Stars show how many titles each nation has lifted.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <section>
          <SectionHeading title="Titles by nation" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {byTeam.map((team) => (
              <article
                key={team.winnerSlug}
                id={team.winnerSlug}
                className="wc26-panel scroll-mt-28 p-5"
              >
                <ChampionNationIdentity
                  winnerSlug={team.winnerSlug}
                  winnerName={team.winnerName}
                  countryCode={team.countryCode}
                  titleCount={team.titles}
                />
                <p className="mt-3 font-display text-3xl font-black text-gold">
                  {team.titles}
                  <span className="text-lg text-muted">
                    {" "}
                    {team.titles === 1 ? "title" : "titles"}
                  </span>
                </p>
                <p className="mt-2 text-xs text-muted">{team.years.join(" · ")}</p>
                {team.hasTeamPage && (
                  <Link
                    href={championTeamHref(team.winnerSlug)!}
                    className="mt-3 inline-block font-display text-[10px] font-bold uppercase tracking-[0.14em] text-gold hover:text-gold-light"
                  >
                    2026 base camp →
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionHeading title="Winners by year" />
          <div className="mt-4 wc26-panel overflow-hidden">
            {byYear.map((record) => (
              <div
                key={record.year}
                className="grid gap-3 border-b border-card-border px-4 py-4 last:border-b-0 sm:grid-cols-[5rem_1fr_auto] sm:items-center"
              >
                <p className="font-display text-2xl font-black text-gold">
                  {record.year}
                </p>
                <div>
                  <ChampionNationIdentity
                    winnerSlug={record.winnerSlug}
                    winnerName={record.winnerName}
                    countryCode={record.countryCode}
                  />
                  <p className="mt-1 text-xs text-muted">
                    Host: {record.host} · Final vs {record.runnerUp}
                  </p>
                </div>
                <p className="font-display text-lg font-black text-cream sm:text-right">
                  {record.finalScore}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
