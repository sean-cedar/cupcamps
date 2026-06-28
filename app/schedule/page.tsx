import type { Metadata } from "next";
import { HostNationStripe } from "@/components/brand/HostNationStripe";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { TournamentScheduleView } from "@/components/schedule/TournamentScheduleView";
import { getLiveSchedulePayload } from "@/lib/espn/match-updates";
import {
  countLiveMatches,
  countPlayedMatches,
  mergeLiveUpdatesIntoGroups,
  mergeLiveUpdatesIntoSchedule,
} from "@/lib/schedule/live-schedule";
import {
  getTournamentSchedule,
  getTournamentScheduleView,
} from "@/lib/schedule/tournament-schedule";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Schedule",
  description:
    "Full FIFA World Cup 26™ match schedule in kickoff order. Opens on today’s live or next fixtures — scroll up for earlier matches and down for what’s ahead.",
};

export default async function SchedulePage() {
  const base = getTournamentScheduleView();
  let fetchedAt: string | null = null;
  let liveUpdates = base.groups;
  let playedMatches = base.playedMatches;
  let liveMatches = 0;

  try {
    const live = await getLiveSchedulePayload();
    fetchedAt = live.fetchedAt;
    liveUpdates = mergeLiveUpdatesIntoGroups(
      base.groups,
      live.updates,
      live.fetchedAt,
    );
    const mergedSchedule = mergeLiveUpdatesIntoSchedule(
      getTournamentSchedule(),
      live.updates,
      live.fetchedAt,
    );
    playedMatches = countPlayedMatches(mergedSchedule);
    liveMatches = countLiveMatches(mergedSchedule);
  } catch {
    liveUpdates = base.groups;
  }

  return (
    <div>
      <section className="border-b border-card-border bg-card/50">
        <HostNationStripe height={3} />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
          <SectionHeading
            title="Schedule"
            subtitle="All 104 matches in kickoff order"
          />
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Opens on the current or next kickoff. Scroll up for earlier fixtures
            and down for what&apos;s coming next. Scores refresh from ESPN on
            load and every 30 seconds.
          </p>
          <div className="mt-6 flex flex-wrap gap-6">
            <div>
              <span className="font-display text-3xl font-black text-gold">
                {playedMatches}
              </span>
              <p className="font-display text-[10px] uppercase tracking-widest text-muted">
                played
              </p>
            </div>
            <div>
              <span className="font-display text-3xl font-black text-cream">
                {base.totalMatches - playedMatches}
              </span>
              <p className="font-display text-[10px] uppercase tracking-widest text-muted">
                remaining
              </p>
            </div>
            {liveMatches > 0 && (
              <div>
                <span className="font-display text-3xl font-black text-red-300">
                  {liveMatches}
                </span>
                <p className="font-display text-[10px] uppercase tracking-widest text-muted">
                  live now
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <TournamentScheduleView
          baseGroups={base.groups}
          initialGroups={liveUpdates}
          initialFetchedAt={fetchedAt}
        />
      </div>
    </div>
  );
}
