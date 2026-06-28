import matchWornKitsData from "@/data/match-worn-kits.json";
import type { KitVariantId } from "@/lib/kits/types";

export type MatchWornKitsEntry = {
  source: string;
  photoUrl: string;
  kits: Record<string, KitVariantId>;
};

const wornKitsByMatch = matchWornKitsData as Record<string, MatchWornKitsEntry>;

export function getMatchWornKits(
  matchNumber: number,
): MatchWornKitsEntry | undefined {
  return wornKitsByMatch[String(matchNumber)];
}

/** Returns the explicitly catalogued kit variant, or null when unknown. */
export function getWornKitVariantId(
  matchNumber: number,
  teamSlug: string,
): KitVariantId | null {
  const variant = getMatchWornKits(matchNumber)?.kits[teamSlug];
  return variant ?? null;
}
