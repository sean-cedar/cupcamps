"use client";

import dynamic from "next/dynamic";
import type { TeamScheduleMapMarker } from "@/lib/map/team-schedule-markers";
import type { Team } from "@/lib/types";

const TbcMap = dynamic(
  () => import("@/components/map/TbcMap").then((mod) => mod.TbcMap),
  {
    ssr: false,
    loading: () => (
      <div className="map-height-page flex items-center justify-center border border-card-border bg-card text-muted">
        Loading map...
      </div>
    ),
  },
);

type TbcMapWrapperProps = {
  teams: Team[];
  height?: string;
  heightClassName?: string;
  zoom?: number;
  center?: [number, number];
  highlightSlug?: string;
  matchMarkers?: TeamScheduleMapMarker[];
};

export function TbcMapWrapper({
  height = "600px",
  heightClassName,
  ...props
}: TbcMapWrapperProps) {
  const resolvedHeight = heightClassName ? "100%" : height;

  return (
    <div
      className={`map-shell relative z-0 isolate overflow-hidden ${
        heightClassName ?? ""
      }`}
      style={heightClassName ? undefined : { height }}
    >
      <TbcMap {...props} height={resolvedHeight} />
    </div>
  );
}
