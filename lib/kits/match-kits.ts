import matchWornKitsData from "@/data/match-worn-kits.json";
import { getTeamKitSet } from "@/lib/kits";
import type {
  KitOutfit,
  KitShorts,
  KitShirt,
  KitVariantId,
} from "@/lib/kits/types";

export type MatchWornKitSpec =
  | KitVariantId
  | {
      variant: KitVariantId;
      shirt?: Partial<KitShirt>;
      shorts?: Partial<KitShorts>;
    };

export type MatchWornKitsEntry = {
  source: string;
  photoUrl: string;
  kits: Record<string, MatchWornKitSpec>;
};

const wornKitsByMatch = matchWornKitsData as Record<string, MatchWornKitsEntry>;

function normalizeSpec(spec: MatchWornKitSpec): {
  variant: KitVariantId;
  shirt?: Partial<KitShirt>;
  shorts?: Partial<KitShorts>;
} {
  if (typeof spec === "string") {
    return { variant: spec };
  }

  return {
    variant: spec.variant,
    shirt: spec.shirt,
    shorts: spec.shorts,
  };
}

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
  const spec = getMatchWornKits(matchNumber)?.kits[teamSlug];
  if (!spec) {
    return null;
  }

  return normalizeSpec(spec).variant;
}

/** Builds the exact shirt/shorts combination worn in a catalogued match. */
export function getWornKitOutfit(
  matchNumber: number,
  teamSlug: string,
): KitOutfit | null {
  const spec = getMatchWornKits(matchNumber)?.kits[teamSlug];
  if (!spec) {
    return null;
  }

  const { variant, shirt: shirtOverride, shorts: shortsOverride } =
    normalizeSpec(spec);
  const base = getTeamKitSet(teamSlug)?.variants.find(
    (entry) => entry.id === variant,
  );

  if (!base) {
    return null;
  }

  return {
    shirt: { ...base.shirt, ...shirtOverride },
    shorts: { ...base.shorts, ...shortsOverride },
  };
}

/** First group-stage match where a team wore a given kit variant. */
export function getFirstMatchForKitVariant(
  teamSlug: string,
  variantId: KitVariantId,
): number | null {
  const matches = Object.entries(wornKitsByMatch).sort(
    ([left], [right]) => Number(left) - Number(right),
  );

  for (const [matchNumber, entry] of matches) {
    const spec = entry.kits[teamSlug];
    if (!spec) {
      continue;
    }

    if (normalizeSpec(spec).variant === variantId) {
      return Number(matchNumber);
    }
  }

  return null;
}
