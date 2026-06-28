import type { TeamKit } from "@/lib/kits/types";

export function kitPatternDef(kit: TeamKit, id: string): string | null {
  const secondary = kit.secondary ?? kit.primary;
  const accent = kit.accent ?? kit.primary;

  switch (kit.pattern) {
    case "vertical-stripes":
      return `<pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="2" height="4" fill="${kit.primary}"/><rect x="2" width="2" height="4" fill="${secondary}"/></pattern>`;
    case "horizontal-stripes":
      return `<pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1.33" fill="${kit.primary}"/><rect y="1.33" width="4" height="1.34" fill="${secondary}"/><rect y="2.67" width="4" height="1.33" fill="${kit.primary}"/></pattern>`;
    case "checker":
      return `<pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="${kit.primary}"/><rect x="2" width="2" height="2" fill="${secondary}"/><rect y="2" width="2" height="2" fill="${secondary}"/><rect x="2" y="2" width="2" height="2" fill="${kit.primary}"/></pattern>`;
    case "tricolor-vertical":
      return `<pattern id="${id}" width="6" height="4" patternUnits="userSpaceOnUse"><rect width="2" height="4" fill="${kit.primary}"/><rect x="2" width="2" height="4" fill="${secondary}"/><rect x="4" width="2" height="4" fill="${accent}"/></pattern>`;
    default:
      return null;
  }
}

export function kitBodyFill(kit: TeamKit, patternId: string): string {
  if (
    kit.pattern === "solid" ||
    kit.pattern === "cross" ||
    kit.pattern === "shoulder-yoke" ||
    kit.pattern === "central-band" ||
    kit.pattern === "split-diagonal" ||
    kit.pattern === "chest-stripe" ||
    kit.pattern === "central-stripe" ||
    kit.pattern === "side-panels"
  ) {
    return kit.primary;
  }

  return `url(#${patternId})`;
}

export function kitOverlayElements(kit: TeamKit): Array<{
  type: "path" | "rect";
  props: Record<string, string | number>;
}> {
  const secondary = kit.secondary ?? kit.primary;
  const accent = kit.accent ?? kit.collar ?? kit.primary;

  switch (kit.pattern) {
    case "shoulder-yoke":
      return [{ type: "path", props: { d: "M8 9 L24 9 L24 16 L8 16 Z", fill: accent } }];
    case "central-band":
      return [
        { type: "rect", props: { x: 13, y: 9, width: 6, height: 24, fill: secondary } },
        ...(kit.accent
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
        ...(kit.secondary
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

export function kitColors(kit: TeamKit) {
  return {
    collar: kit.collar ?? kit.accent ?? kit.primary,
    sleeves: kit.sleeves ?? kit.accent ?? kit.collar ?? kit.primary,
  };
}
