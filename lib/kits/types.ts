/** Simplified kit render styles for WC26. */
export type KitPattern =
  | "solid"
  | "vertical-stripes"
  | "horizontal-stripes"
  | "checker"
  | "cross"
  | "shoulder-yoke"
  | "central-band"
  | "split-diagonal"
  | "tricolor-vertical"
  | "chest-stripe"
  | "central-stripe"
  | "side-panels"
  | "nordic-cross";

export type ShortsPattern = "solid" | "vertical-stripes";

export type KitShirt = {
  pattern: KitPattern;
  primary: string;
  secondary?: string;
  accent?: string;
  collar?: string;
  sleeves?: string;
};

export type KitShorts = {
  pattern?: ShortsPattern;
  primary: string;
  secondary?: string;
  accent?: string;
};

export type KitOutfit = {
  shirt: KitShirt;
  shorts: KitShorts;
};

export type KitVariantId = "home" | "away" | "third";

export type KitVariant = KitOutfit & {
  id: KitVariantId;
  label: string;
  /** Link to an official WC26 kit photo or product gallery. */
  photoUrl?: string;
};

export type TeamKitSet = {
  variants: KitVariant[];
};

/** @deprecated Use KitShirt — kept for migration helpers. */
export type TeamKit = KitShirt;
