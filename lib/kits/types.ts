/** Simplified home-kit render styles for WC26. */
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
  | "side-panels";

export type TeamKit = {
  primary: string;
  secondary?: string;
  accent?: string;
  collar?: string;
  sleeves?: string;
  pattern: KitPattern;
};
