import { getEspnScoreboard } from "@/lib/espn/scoreboard";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const scoreboard = await getEspnScoreboard();

    return NextResponse.json(scoreboard, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load ESPN scoreboard.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
