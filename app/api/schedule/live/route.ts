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
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const base = getTournamentScheduleView();
    const live = await getLiveSchedulePayload();
    const groups = mergeLiveUpdatesIntoGroups(
      base.groups,
      live.updates,
      live.fetchedAt,
    );
    const mergedSchedule = mergeLiveUpdatesIntoSchedule(
      getTournamentSchedule(),
      live.updates,
      live.fetchedAt,
    );

    return NextResponse.json(
      {
        fetchedAt: live.fetchedAt,
        updates: live.updates,
        groups,
        playedMatches: countPlayedMatches(mergedSchedule),
        liveMatches: countLiveMatches(mergedSchedule),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load live schedule.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
