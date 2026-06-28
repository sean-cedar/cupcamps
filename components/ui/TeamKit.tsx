"use client";

import { useId } from "react";
import type { KitOutfit } from "@/lib/kits/types";
import {
  kitBodyFill,
  kitColors,
  kitOverlayElements,
  shortsBodyFill,
  shortsOverlayElements,
} from "@/lib/kits/kit-svg-parts";

const outfitSvgHeightRatio = 1.55;
const outfitViewBox = "0 0 32 50";

type TeamKitProps = {
  outfit: KitOutfit;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  title?: string;
  /** Adds a light frame so dark kit colors stay visible on dark backgrounds. */
  framed?: boolean;
};

const sizes = {
  sm: 16,
  md: 20,
  lg: 32,
  xl: 48,
  "2xl": 72,
} as const;

function ShirtPatternFill({
  shirt,
  id,
}: {
  shirt: KitOutfit["shirt"];
  id: string;
}) {
  const secondary = shirt.secondary ?? shirt.primary;
  const accent = shirt.accent ?? shirt.primary;

  switch (shirt.pattern) {
    case "vertical-stripes":
      return (
        <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="2" height="4" fill={shirt.primary} />
          <rect x="2" width="2" height="4" fill={secondary} />
        </pattern>
      );
    case "horizontal-stripes":
      return (
        <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="1.33" fill={shirt.primary} />
          <rect y="1.33" width="4" height="1.34" fill={secondary} />
          <rect y="2.67" width="4" height="1.33" fill={shirt.primary} />
        </pattern>
      );
    case "checker":
      return (
        <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="2" height="2" fill={shirt.primary} />
          <rect x="2" width="2" height="2" fill={secondary} />
          <rect y="2" width="2" height="2" fill={secondary} />
          <rect x="2" y="2" width="2" height="2" fill={shirt.primary} />
        </pattern>
      );
    case "tricolor-vertical":
      return (
        <pattern id={id} width="6" height="4" patternUnits="userSpaceOnUse">
          <rect width="2" height="4" fill={shirt.primary} />
          <rect x="2" width="2" height="4" fill={secondary} />
          <rect x="4" width="2" height="4" fill={accent} />
        </pattern>
      );
    case "small-checker":
      return (
        <pattern id={id} width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="1.5" height="1.5" fill={shirt.primary} />
          <rect x="1.5" width="1.5" height="1.5" fill={secondary} />
          <rect y="1.5" width="1.5" height="1.5" fill={secondary} />
          <rect x="1.5" y="1.5" width="1.5" height="1.5" fill={shirt.primary} />
        </pattern>
      );
    case "vertical-pinstripes":
      return (
        <pattern id={id} width="3" height="4" patternUnits="userSpaceOnUse">
          <rect width="1" height="4" fill={secondary} />
          <rect x="1" width="2" height="4" fill={shirt.primary} />
        </pattern>
      );
    default:
      return null;
  }
}

function ShortsPatternFill({
  shorts,
  id,
}: {
  shorts: KitOutfit["shorts"];
  id: string;
}) {
  if (shorts.pattern !== "vertical-stripes") {
    return null;
  }

  const secondary = shorts.secondary ?? shorts.primary;

  return (
    <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="2" height="4" fill={shorts.primary} />
      <rect x="2" width="2" height="4" fill={secondary} />
    </pattern>
  );
}

function ShirtOverlay({ shirt }: { shirt: KitOutfit["shirt"] }) {
  return (
    <>
      {kitOverlayElements(shirt).map((element, index) => {
        if (element.type === "path") {
          return (
            <path
              key={index}
              d={String(element.props.d)}
              fill={String(element.props.fill)}
            />
          );
        }

        return (
          <rect
            key={index}
            x={Number(element.props.x)}
            y={Number(element.props.y)}
            width={Number(element.props.width)}
            height={Number(element.props.height)}
            fill={String(element.props.fill)}
          />
        );
      })}
    </>
  );
}

function ShortsOverlay({ shorts }: { shorts: KitOutfit["shorts"] }) {
  return (
    <>
      {shortsOverlayElements(shorts).map((element, index) => (
        <rect
          key={index}
          x={Number(element.props.x)}
          y={Number(element.props.y)}
          width={Number(element.props.width)}
          height={Number(element.props.height)}
          fill={String(element.props.fill)}
        />
      ))}
    </>
  );
}

export function TeamKit({
  outfit,
  size = "md",
  className = "",
  title,
  framed = true,
}: TeamKitProps) {
  const shirtPatternId = useId().replace(/:/g, "");
  const shortsPatternId = useId().replace(/:/g, "");
  const px = sizes[size];
  const height = Math.round(px * outfitSvgHeightRatio);
  const { collar, sleeves } = kitColors(outfit.shirt);
  const shirtFill = kitBodyFill(outfit.shirt, shirtPatternId);
  const shortsFill = shortsBodyFill(outfit.shorts, shortsPatternId);
  const shirtBodyPath = "M8 9 L24 9 L24 33 L8 33 Z";

  const frameSizeClass =
    size === "sm" || size === "md"
      ? "kit-display-frame--sm"
      : size === "lg" || size === "xl" || size === "2xl"
        ? "kit-display-frame--lg"
        : "";

  const svg = (
    <svg
      viewBox={outfitViewBox}
      width={px}
      height={height}
      className={`inline-block shrink-0 ${className}`}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <ShirtPatternFill shirt={outfit.shirt} id={shirtPatternId} />
        <ShortsPatternFill shorts={outfit.shorts} id={shortsPatternId} />
        <clipPath id={`${shirtPatternId}-shirt`}>
          <path d={shirtBodyPath} />
        </clipPath>
      </defs>

      <path
        d="M4 10 L8 9 L8 14 L4 16 Z"
        fill={sleeves}
        stroke="#00000022"
        strokeWidth="0.5"
      />
      <path
        d="M24 9 L28 10 L28 16 L24 14 Z"
        fill={sleeves}
        stroke="#00000022"
        strokeWidth="0.5"
      />

      <g clipPath={`url(#${shirtPatternId}-shirt)`}>
        <rect x="6" y="5" width="20" height="30" fill={shirtFill} />
        <ShirtOverlay shirt={outfit.shirt} />
        <rect x="8" y="9" width="16" height="2.2" fill={collar} />
      </g>

      <g>
        <path d="M8 33 L24 33 L22.5 45 L9.5 45 Z" fill={shortsFill} />
        <ShortsOverlay shorts={outfit.shorts} />
        <line
          x1="16"
          y1="33"
          x2="16"
          y2="45"
          stroke="#00000022"
          strokeWidth="0.5"
        />
      </g>

      <path
        d={`${shirtBodyPath} M4 10 L8 9 L8 14 L4 16 Z M24 9 L28 10 L28 16 L24 14 Z M8 33 L24 33 L22.5 45 L9.5 45 Z`}
        fill="none"
        stroke="#00000044"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (!framed) {
    return svg;
  }

  return (
    <span className={`kit-display-frame ${frameSizeClass}`}>{svg}</span>
  );
}
