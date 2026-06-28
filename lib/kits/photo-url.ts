import type { KitVariantId } from "@/lib/kits/types";

/** Football Kit Archive slug differs from our team slug for some nations. */
const ARCHIVE_SLUG: Record<string, string> = {
  "bosnia-and-herzegovina": "bosnia-herzegovina",
  "cabo-verde": "cape-verde",
  "congo-dr": "dr-congo",
  "czechia": "czech-republic",
  "ivory-coast": "ivory-coast",
  "korea-republic": "south-korea",
  "turkiye": "turkey",
  "united-states": "usa",
};

/** Teams whose archive pages use a non-standard URL. */
const PHOTO_URL_OVERRIDES: Partial<
  Record<string, Partial<Record<KitVariantId, string>>>
> = {
  "ivory-coast": {
    home: "https://www.footballkitarchive.com/cote-divoire-2026-home-kit/",
    away: "https://www.footballkitarchive.com/cote-divoire-2026-away-kit/",
  },
};

const KIT_OVERVIEW_URL =
  "https://www.footyheadlines.com/2025/08/2026-world-cup-kit-overview.html";

function archiveUrl(archiveSlug: string, variantId: KitVariantId): string {
  return `https://www.footballkitarchive.com/${archiveSlug}-2026-${variantId}-kit/`;
}

export function getKitPhotoUrl(
  teamSlug: string,
  variantId: KitVariantId,
): string {
  const override = PHOTO_URL_OVERRIDES[teamSlug]?.[variantId];
  if (override) {
    return override;
  }

  const archiveSlug = ARCHIVE_SLUG[teamSlug] ?? teamSlug;
  return archiveUrl(archiveSlug, variantId);
}

export function getKitOverviewUrl(): string {
  return KIT_OVERVIEW_URL;
}
