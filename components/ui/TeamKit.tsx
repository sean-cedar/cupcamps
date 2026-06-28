"use client";

import { useId } from "react";
import type { TeamKit } from "@/lib/kits/types";
import {
  kitBodyFill,
  kitColors,
  kitOverlayElements,
  kitPatternDef,
} from "@/lib/kits/kit-svg-parts";

type TeamKitProps = {
  kit: TeamKit;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  title?: string;
};

const sizes = {
  sm: 16,
  md: 20,
  lg: 32,
  xl: 48,
} as const;

function PatternFill({ kit, id }: { kit: TeamKit; id: string }) {
  const secondary = kit.secondary ?? kit.primary;
  const accent = kit.accent ?? kit.primary;

  switch (kit.pattern) {
    case "vertical-stripes":
      return (
        <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="2" height="4" fill={kit.primary} />
          <rect x="2" width="2" height="4" fill={secondary} />
        </pattern>
      );
    case "horizontal-stripes":
      return (
        <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="1.33" fill={kit.primary} />
          <rect y="1.33" width="4" height="1.34" fill={secondary} />
          <rect y="2.67" width="4" height="1.33" fill={kit.primary} />
        </pattern>
      );
    case "checker":
      return (
        <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="2" height="2" fill={kit.primary} />
          <rect x="2" width="2" height="2" fill={secondary} />
          <rect y="2" width="2" height="2" fill={secondary} />
          <rect x="2" y="2" width="2" height="2" fill={kit.primary} />
        </pattern>
      );
    case "tricolor-vertical":
      return (
        <pattern id={id} width="6" height="4" patternUnits="userSpaceOnUse">
          <rect width="2" height="4" fill={kit.primary} />
          <rect x="2" width="2" height="4" fill={secondary} />
          <rect x="4" width="2" height="4" fill={accent} />
        </pattern>
      );
    default:
      return null;
  }
}

function Overlay({ kit }: { kit: TeamKit }) {
  return (
    <>
      {kitOverlayElements(kit).map((element, index) => {
        if (element.type === "path") {
          return <path key={index} d={String(element.props.d)} fill={String(element.props.fill)} />;
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

export function TeamKit({
  kit,
  size = "md",
  className = "",
  title,
}: TeamKitProps) {
  const patternId = useId().replace(/:/g, "");
  const px = sizes[size];
  const height = Math.round(px * 1.15);
  const { collar, sleeves } = kitColors(kit);
  const bodyFill = kitBodyFill(kit, patternId);

  return (
    <svg
      viewBox="0 0 32 36"
      width={px}
      height={height}
      className={`inline-block shrink-0 drop-shadow-sm ${className}`}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <PatternFill kit={kit} id={patternId} />
        <clipPath id={`${patternId}-shirt`}>
          <path d="M8 9 L11 9 L12.5 6 L14.5 6 L16 9 L24 9 L24 33 L8 33 Z" />
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

      <g clipPath={`url(#${patternId}-shirt)`}>
        <rect x="6" y="5" width="20" height="30" fill={bodyFill} />
        <Overlay kit={kit} />
      </g>

      <path
        d="M11 9 Q16 12.5 21 9"
        fill="none"
        stroke={collar}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d="M8 9 L11 9 L12.5 6 L14.5 6 L16 9 L24 9 L24 33 L8 33 Z M4 10 L8 9 L8 14 L4 16 Z M24 9 L28 10 L28 16 L24 14 Z"
        fill="none"
        stroke="#00000033"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Gray placeholder when bracket slots are not yet resolved. */
export function TeamKitPlaceholder({
  size = "md",
  className = "",
}: {
  size?: TeamKitProps["size"];
  className?: string;
}) {
  const px = sizes[size];
  const height = Math.round(px * 1.15);

  return (
    <svg
      viewBox="0 0 32 36"
      width={px}
      height={height}
      className={`inline-block shrink-0 opacity-40 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M8 9 L11 9 L12.5 6 L14.5 6 L16 9 L24 9 L24 33 L8 33 Z"
        fill="#444"
        stroke="#666"
        strokeWidth="0.75"
      />
    </svg>
  );
}
