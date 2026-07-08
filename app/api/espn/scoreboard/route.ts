import { getEspnScoreboard } from "@/lib/espn/scoreboard";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const scoreboard = await getEspnScoreboard();

    return NextResponse.json(scoreboard, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load ESPN scoreboard.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
