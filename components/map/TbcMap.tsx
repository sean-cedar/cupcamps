"use client";

import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import type { TeamScheduleMapMarker } from "@/lib/map/team-schedule-markers";
import { formatMapMarkerDate } from "@/lib/map/team-schedule-markers";
import { getStageLabel } from "@/lib/schedule";
import type { Team } from "@/lib/types";

type TbcMapProps = {
  teams: Team[];
  height?: string;
  zoom?: number;
  center?: [number, number];
  highlightSlug?: string;
  matchMarkers?: TeamScheduleMapMarker[];
};

/** Covers Canada, Mexico, and the continental United States with padding. */
const NORTH_AMERICA_BOUNDS: L.LatLngBoundsExpression = [
  [14, -168],
  [72, -52],
];

const MIN_ZOOM = 3;

function createFlagIcon(countryCode: string, dimmed = false) {
  return L.divIcon({
    className: "tbc-flag-icon",
    html: `<div class="tbc-flag-marker${dimmed ? " tbc-flag-marker-dimmed" : ""}"><span class="fi fi-${countryCode}"></span></div>`,
    iconSize: [32, 24],
    iconAnchor: [16, 24],
    popupAnchor: [0, -26],
  });
}

function createMatchNumberIcon(sequence: number) {
  return L.divIcon({
    className: "tbc-match-icon",
    html: `<div class="tbc-match-marker"><span>${sequence}</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

function FitMapBounds({
  points,
  maxZoom,
}: {
  points: [number, number][];
  maxZoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], maxZoom ?? map.getZoom());
      return;
    }

    map.fitBounds(L.latLngBounds(points), {
      padding: [36, 36],
      maxZoom: maxZoom ?? 8,
    });
  }, [map, maxZoom, points]);

  return null;
}

export function TbcMap({
  teams,
  height = "600px",
  zoom = 4,
  center = [39.8283, -98.5795],
  highlightSlug,
  matchMarkers = [],
}: TbcMapProps) {
  const fitPoints = useMemo(() => {
    const points: [number, number][] = teams.map((team) => [
      team.tbc.coordinates.lat,
      team.tbc.coordinates.lng,
    ]);

    for (const marker of matchMarkers) {
      points.push([marker.coordinates.lat, marker.coordinates.lng]);
    }

    return points;
  }, [matchMarkers, teams]);

  const shouldFitBounds = matchMarkers.length > 0;
  const mapLabel =
    matchMarkers.length > 0
      ? "Map of team base camp and scheduled match venues"
      : "Map of World Cup 2026 team base camps across North America";

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={MIN_ZOOM}
      maxBounds={NORTH_AMERICA_BOUNDS}
      maxBoundsViscosity={1}
      style={{ height, width: "100%" }}
      scrollWheelZoom={true}
      aria-label={mapLabel}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {shouldFitBounds && <FitMapBounds points={fitPoints} maxZoom={zoom} />}

      {teams.map((team) => {
        const dimmed = Boolean(
          highlightSlug && highlightSlug !== team.slug,
        );

        return (
          <Marker
            key={team.slug}
            position={[team.tbc.coordinates.lat, team.tbc.coordinates.lng]}
            icon={createFlagIcon(team.countryCode, dimmed)}
            zIndexOffset={dimmed ? 0 : 1000}
          >
            <Popup>
              <div className="min-w-[180px] text-sm">
                <p className="flex items-center gap-2 font-bold text-gray-900">
                  <span className={`fi fi-${team.countryCode}`} />
                  {team.name}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Base camp
                </p>
                <p className="text-gray-600">{team.tbc.city}</p>
                <p className="text-xs text-gray-500">{team.tbc.trainingSite}</p>
                <Link
                  href={`/teams/${team.slug}`}
                  className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline"
                >
                  View team →
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {matchMarkers.map((marker) => (
        <Marker
          key={`${marker.matchNumber}-${marker.sequence}`}
          position={[marker.coordinates.lat, marker.coordinates.lng]}
          icon={createMatchNumberIcon(marker.sequence)}
          zIndexOffset={500}
        >
          <Popup>
            <div className="min-w-[180px] text-sm">
              <p className="font-display text-xs font-bold uppercase tracking-wider text-gray-500">
                Game {marker.sequence} · Match {marker.matchNumber}
              </p>
              <p className="mt-1 font-bold text-gray-900">
                {marker.isHome ? "vs" : "at"} {marker.opponentLabel}
              </p>
              {marker.score && (
                <p className="mt-0.5 font-display text-lg font-black text-gray-900">
                  {marker.score}
                </p>
              )}
              <p className="mt-1 text-gray-600">{marker.hostCityName}</p>
              <p className="text-xs text-gray-500">{marker.stadium}</p>
              <p className="mt-1 text-xs text-gray-500">
                {formatMapMarkerDate(marker.date)}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                {getStageLabel(marker.stage)}
              </p>
              <Link
                href={`/host-cities/${marker.hostCitySlug}`}
                className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline"
              >
                View host city →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
