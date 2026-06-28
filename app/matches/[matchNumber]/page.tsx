import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HostNationStripe } from "@/components/brand/HostNationStripe";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { HostCityLink } from "@/components/host-cities/HostCityCard";
import { GroupStandingsTable } from "@/components/groups/GroupStandingsTable";
import { MatchAdvancementPanel } from "@/components/matches/MatchAdvancementPanel";
import { MatchFeedersPanel } from "@/components/matches/MatchFeedersPanel";
import { MatchHighlightsSection } from "@/components/matches/MatchHighlightsSection";
import { MatchParticipantPanel } from "@/components/matches/MatchParticipantPanel";
import { getMatchPhotoUrl } from "@/lib/highlights/fallback";
import { getHighlightLookupSlugs, getMatchRecord } from "@/lib/highlights/match";
import { formatMatchDate } from "@/lib/schedule";
import {
  getAllMatchNumbers,
  getMatchPageView,
} from "@/lib/schedule/match-page";
import { getHostCity } from "@/lib/teams";

type PageProps = {
  params: Promise<{ matchNumber: string }>;
};

export async function generateStaticParams() {
  return getAllMatchNumbers().map((matchNumber) => ({
    matchNumber: String(matchNumber),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { matchNumber: raw } = await params;
  const matchNumber = Number(raw);
  const view = Number.isFinite(matchNumber)
    ? getMatchPageView(matchNumber)
    : undefined;

  if (!view) {
    return { title: "Match Not Found" };
  }

  return {
    title: view.title,
    description: `${view.stageLabel} · Match ${view.matchNumber} · ${view.stadium}`,
  };
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { matchNumber: raw } = await params;
  const matchNumber = Number(raw);

  if (!Number.isFinite(matchNumber)) {
    notFound();
  }

  const view = getMatchPageView(matchNumber);
  if (!view) {
    notFound();
  }

  const hostCity = getHostCity(view.hostCitySlug);
  const matchRecord = getMatchRecord(matchNumber);
  const lookupSlugs = matchRecord ? getHighlightLookupSlugs(matchRecord) : null;
  const matchPhotoUrl =
    matchRecord && lookupSlugs
      ? getMatchPhotoUrl(matchRecord, lookupSlugs.home, lookupSlugs.away)
      : matchRecord
        ? getMatchPhotoUrl(matchRecord, matchRecord.homeSlug, matchRecord.awaySlug)
        : "#";
  const scoreLabel =
    view.isPlayed && view.homeScore !== null && view.awayScore !== null
      ? `${view.homeScore}–${view.awayScore}`
      : null;

  return (
    <div>
      <section className="border-b border-card-border bg-card/50">
        <HostNationStripe height={3} />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Link
            href="/bracket"
            className="font-display text-xs font-bold uppercase tracking-[0.15em] text-muted hover:text-gold-light"
          >
            ← Bracket & schedule
          </Link>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-gold">
                {view.stageLabel}
                {view.group ? ` · Group ${view.group}` : ""}
                {view.matchday ? ` · MD ${view.matchday}` : ""}
              </p>
              <h1 className="mt-2 font-display text-4xl font-black uppercase tracking-[0.04em] text-cream sm:text-5xl">
                {view.title}
              </h1>
              <p className="mt-2 text-sm text-muted">
                Match {view.matchNumber} · {formatMatchDate(view.date)}
              </p>
            </div>

            {scoreLabel ? (
              <p className="font-display text-5xl font-black tabular-nums text-cream sm:text-6xl">
                {scoreLabel}
              </p>
            ) : (
              <span className="rounded border border-card-border px-3 py-1 font-display text-sm font-bold uppercase tracking-[0.14em] text-muted">
                TBD
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <MatchParticipantPanel
            participant={view.home}
            side="home"
            matchPhotoUrl={matchPhotoUrl}
          />
          <MatchParticipantPanel
            participant={view.away}
            side="away"
            matchPhotoUrl={matchPhotoUrl}
          />
        </div>

        <section className="mt-10">
          <SectionHeading title="Location" />
          <div className="mt-4 wc26-panel p-6">
            <p className="font-display text-xl font-black uppercase tracking-[0.04em] text-cream">
              {view.stadium}
            </p>
            {hostCity && (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <HostCityLink slug={view.hostCitySlug} />
                <span className="text-sm text-muted">{hostCity.country}</span>
              </div>
            )}
          </div>
        </section>

        {(view.feeders.length > 0 || view.advances.length > 0) && (
          <section className="mt-10">
            <SectionHeading
              title="Bracket path"
              subtitle="Previous and next knockout fixtures"
            />
            <div className="mt-4 space-y-6">
              {view.feeders.length > 0 && (
                <div>
                  {view.advances.length > 0 && (
                    <p className="mb-3 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                      Feeds into this match
                    </p>
                  )}
                  <MatchFeedersPanel feeders={view.feeders} />
                </div>
              )}
              {view.advances.length > 0 && (
                <div>
                  {view.feeders.length > 0 && (
                    <p className="mb-3 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                      Next in the bracket
                    </p>
                  )}
                  <MatchAdvancementPanel advances={view.advances} />
                </div>
              )}
            </div>
          </section>
        )}

        {view.groupStandings && view.group && (
          <section className="mt-10">
            <SectionHeading title="Group context" />
            <div className="mt-4">
              <GroupStandingsTable group={view.group} rows={view.groupStandings} />
            </div>
          </section>
        )}

        <section className="mt-10">
          <SectionHeading title="Match stats" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="wc26-panel p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted">
                Status
              </p>
              <p className="mt-1 font-display text-lg font-black text-cream">
                {view.isPlayed ? "Full time" : "Scheduled"}
              </p>
            </div>
            {scoreLabel && (
              <>
                <div className="wc26-panel p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted">
                    {view.home.team?.name ?? view.home.label} goals
                  </p>
                  <p className="mt-1 font-display text-lg font-black text-cream">
                    {view.homeScore}
                  </p>
                </div>
                <div className="wc26-panel p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted">
                    {view.away.team?.name ?? view.away.label} goals
                  </p>
                  <p className="mt-1 font-display text-lg font-black text-cream">
                    {view.awayScore}
                  </p>
                </div>
              </>
            )}
            <div className="wc26-panel p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted">
                Stage
              </p>
              <p className="mt-1 font-display text-lg font-black text-cream">
                {view.stageLabel}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <SectionHeading title="Highlights" />
          <div className="mt-4 wc26-panel p-6">
            <MatchHighlightsSection
              matchNumber={view.matchNumber}
              isPlayed={view.isPlayed}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
