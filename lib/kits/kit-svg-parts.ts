import type { KitShirt, KitShorts } from "@/lib/kits/types";

export function kitPatternDef(shirt: KitShirt, id: string): string | null {
  const secondary = shirt.secondary ?? shirt.primary;
  const accent = shirt.accent ?? shirt.primary;

  switch (shirt.pattern) {
    case "vertical-stripes":
      return `<pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="2" height="4" fill="${shirt.primary}"/><rect x="2" width="2" height="4" fill="${secondary}"/></pattern>`;
    case "horizontal-stripes":
      return `<pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1.33" fill="${shirt.primary}"/><rect y="1.33" width="4" height="1.34" fill="${secondary}"/><rect y="2.67" width="4" height="1.33" fill="${shirt.primary}"/></pattern>`;
    case "checker":
      return `<pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="${shirt.primary}"/><rect x="2" width="2" height="2" fill="${secondary}"/><rect y="2" width="2" height="2" fill="${secondary}"/><rect x="2" y="2" width="2" height="2" fill="${shirt.primary}"/></pattern>`;
    case "tricolor-vertical":
      return `<pattern id="${id}" width="6" height="4" patternUnits="userSpaceOnUse"><rect width="2" height="4" fill="${shirt.primary}"/><rect x="2" width="2" height="4" fill="${secondary}"/><rect x="4" width="2" height="4" fill="${accent}"/></pattern>`;
    default:
      return null;
  }
}

export function shortsPatternDef(shorts: KitShorts, id: string): string | null {
  if (shorts.pattern !== "vertical-stripes") {
    return null;
  }

  const secondary = shorts.secondary ?? shorts.primary;
  return `<pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="2" height="4" fill="${shorts.primary}"/><rect x="2" width="2" height="4" fill="${secondary}"/></pattern>`;
}

export function kitBodyFill(shirt: KitShirt, patternId: string): string {
  if (
    shirt.pattern === "solid" ||
    shirt.pattern === "cross" ||
    shirt.pattern === "shoulder-yoke" ||
    shirt.pattern === "central-band" ||
    shirt.pattern === "split-diagonal" ||
    shirt.pattern === "chest-stripe" ||
    shirt.pattern === "central-stripe" ||
    shirt.pattern === "side-panels"
  ) {
    return shirt.primary;
  }

  return `url(#${patternId})`;
}

export function shortsBodyFill(shorts: KitShorts, patternId: string): string {
  if (shorts.pattern === "vertical-stripes") {
    return `url(#${patternId})`;
  }

  return shorts.primary;
}

export function kitOverlayElements(shirt: KitShirt): Array<{
  type: "path" | "rect";
  props: Record<string, string | number>;
}> {
  const secondary = shirt.secondary ?? shirt.primary;
  const accent = shirt.accent ?? shirt.collar ?? shirt.primary;

  switch (shirt.pattern) {
    case "shoulder-yoke":
      return [{ type: "path", props: { d: "M8 9 L24 9 L24 16 L8 16 Z", fill: accent } }];
    case "central-band":
      return [
        { type: "rect", props: { x: 13, y: 9, width: 6, height: 24, fill: secondary } },
        ...(shirt.accent
          ? [
              { type: "rect" as const, props: { x: 12, y: 9, width: 1, height: 24, fill: accent } },
              { type: "rect" as const, props: { x: 19, y: 9, width: 1, height: 24, fill: accent } },
            ]
          : []),
      ];
    case "split-diagonal":
      return [{ type: "path", props: { d: "M8 9 L24 33 L8 33 Z", fill: secondary } }];
    case "cross":
      return [
        { type: "rect", props: { x: 13.5, y: 12, width: 5, height: 18, fill: secondary } },
        { type: "rect", props: { x: 10, y: 18, width: 12, height: 5, fill: secondary } },
      ];
    case "chest-stripe":
      return [
        { type: "rect", props: { x: 8, y: 13, width: 16, height: 4.5, fill: accent } },
        ...(shirt.secondary
          ? [{ type: "rect" as const, props: { x: 8, y: 17.5, width: 16, height: 1.2, fill: secondary } }]
          : []),
      ];
    case "central-stripe":
      return [{ type: "rect", props: { x: 15, y: 9, width: 2, height: 24, fill: accent } }];
    case "side-panels":
      return [
        { type: "rect", props: { x: 8, y: 9, width: 3.5, height: 24, fill: secondary } },
        { type: "rect", props: { x: 20.5, y: 9, width: 3.5, height: 24, fill: secondary } },
      ];
    default:
      return [];
  }
}

export function shortsOverlayElements(shorts: KitShorts): Array<{
  type: "rect";
  props: Record<string, string | number>;
}> {
  if (!shorts.accent) {
    return [];
  }

  return [
    { type: "rect", props: { x: 8, y: 33, width: 1.5, height: 12, fill: shorts.accent } },
    { type: "rect", props: { x: 22.5, y: 33, width: 1.5, height: 12, fill: shorts.accent } },
  ];
}

export function kitColors(shirt: KitShirt) {
  return {
    collar: shirt.collar ?? shirt.accent ?? shirt.primary,
    sleeves: shirt.sleeves ?? shirt.accent ?? shirt.collar ?? shirt.primary,
  };
}
