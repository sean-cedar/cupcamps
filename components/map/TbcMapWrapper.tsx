"use client";

import dynamic from "next/dynamic";
import type { TeamScheduleMapMarker } from "@/lib/map/team-schedule-markers";
import type { Team } from "@/lib/types";

const TbcMap = dynamic(
  () => import("@/components/map/TbcMap").then((mod) => mod.TbcMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] items-center justify-center border border-card-border bg-card text-muted">
        Loading map...
      </div>
    ),
  },
);

type TbcMapWrapperProps = {
  teams: Team[];
  height?: string;
  zoom?: number;
  center?: [number, number];
  highlightSlug?: string;
  matchMarkers?: TeamScheduleMapMarker[];
};

export function TbcMapWrapper(props: TbcMapWrapperProps) {
  return (
    <div className="map-shell relative z-0 isolate overflow-hidden">
      <TbcMap {...props} />
    </div>
  );
}
