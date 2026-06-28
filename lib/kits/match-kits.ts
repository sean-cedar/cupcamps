import matchKitOverrides from "@/data/match-kit-overrides.json";
import type { KitVariantId } from "@/lib/kits/types";

type MatchKitOverrides = Record<string, Partial<Record<string, KitVariantId>>>;

const overrides = matchKitOverrides as MatchKitOverrides;

export function getWornKitVariantId(
  matchNumber: number,
  teamSlug: string,
  side: "home" | "away",
): KitVariantId {
  const matchOverride = overrides[String(matchNumber)];
  const teamOverride = matchOverride?.[teamSlug];
  if (teamOverride) {
    return teamOverride;
  }

  return side === "home" ? "home" : "away";
}
