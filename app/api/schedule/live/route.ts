import { buildLiveSitePayload } from "@/lib/schedule/live-payload";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await buildLiveSitePayload();

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load live schedule.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
