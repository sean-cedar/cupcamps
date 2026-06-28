import teamKitsData from "@/data/team-kits.json";
import type { KitOutfit, KitShirt, KitVariant, TeamKitSet } from "@/lib/kits/types";

const kitsBySlug = teamKitsData as Record<string, TeamKitSet>;

export function getTeamKitSet(teamSlug: string): TeamKitSet | undefined {
  return kitsBySlug[teamSlug];
}

export function getTeamKitVariants(teamSlug: string): KitVariant[] {
  return getTeamKitSet(teamSlug)?.variants ?? [];
}

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
