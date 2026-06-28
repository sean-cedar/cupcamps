import {
  getCacheTtlSeconds,
  getMatchHighlights,
} from "@/lib/highlights";
import {
  getFeedCacheSeconds,
  isHighlightlyConfigured,
} from "@/lib/highlights/highlightly";
import { getMatchRecord, isMatchPlayed } from "@/lib/highlights/match";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ matchNumber: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { matchNumber: matchNumberParam } = await params;
  const matchNumber = Number(matchNumberParam);

  if (!Number.isInteger(matchNumber) || matchNumber < 1) {
    return NextResponse.json({ error: "Invalid match number." }, { status: 400 });
  }

  const match = getMatchRecord(matchNumber);
  if (!match) {
    return NextResponse.json({ error: "Match not found." }, { status: 404 });
  }

  const result = await getMatchHighlights(matchNumber);
  if (!result) {
    return NextResponse.json({ error: "Match not found." }, { status: 404 });
  }

  const ttl = isHighlightlyConfigured() && isMatchPlayed(match)
    ? getFeedCacheSeconds()
    : getCacheTtlSeconds(match);

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": `public, s-maxage=${ttl}, stale-while-revalidate=${ttl}`,
    },
  });
}
