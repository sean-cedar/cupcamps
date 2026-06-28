import teamKitsData from "@/data/team-kits.json";
import { getKitPhotoUrl } from "@/lib/kits/photo-url";
import type { KitOutfit, KitShirt, KitVariant, TeamKitSet } from "@/lib/kits/types";

const kitsBySlug = teamKitsData as Record<string, TeamKitSet>;

export function getTeamKitSet(teamSlug: string): TeamKitSet | undefined {
  const kitSet = kitsBySlug[teamSlug];
  if (!kitSet) {
    return undefined;
  }

  return {
    variants: kitSet.variants.map((variant) => ({
      ...variant,
      photoUrl: variant.photoUrl ?? getKitPhotoUrl(teamSlug, variant.id),
    })),
  };
}

export function getTeamKitVariants(teamSlug: string): KitVariant[] {
  return getTeamKitSet(teamSlug)?.variants ?? [];
}

export { getKitPhotoUrl, getKitOverviewUrl } from "@/lib/kits/photo-url";
export { getMatchWornKits, getFirstMatchForKitVariant, getWornKitOutfit, getWornKitVariantId } from "@/lib/kits/match-kits";
export type { MatchWornKitSpec, MatchWornKitsEntry } from "@/lib/kits/match-kits";

export type {
  KitOutfit,
  KitPattern,
  KitShirt,
  KitShorts,
  KitVariant,
  KitVariantId,
  ShortsPattern,
  TeamKitSet,
} from "@/lib/kits/types";
