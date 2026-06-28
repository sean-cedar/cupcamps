"use client";

import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import { MapThemeTileLayer } from "@/components/map/MapThemeTileLayer";
import type { TeamScheduleMapMarker } from "@/lib/map/team-schedule-markers";
import {
  formatMapMarkerDate,
  getTeamScheduleMapMarkerStatusLabel,
} from "@/lib/map/team-schedule-markers";
import { getStageLabel } from "@/lib/schedule";
import { formatTeamTbcLocation } from "@/lib/teams";
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

function createMatchNumberIcon(
  sequence: number,
  status: TeamScheduleMapMarker["status"],
) {
  return L.divIcon({
    className: "tbc-match-icon",
    html: `<div class="tbc-match-marker tbc-match-marker--${status}"><span>${sequence}</span></div>`,
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
      <MapThemeTileLayer />

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
                <p className="map-popup-text flex items-center gap-2 font-bold">
                  <span className={`fi fi-${team.countryCode}`} />
                  {team.name}
                </p>
                <p className="map-popup-muted text-[10px] font-semibold uppercase tracking-wider">
                  Base camp
                </p>
                <p className="map-popup-muted">{formatTeamTbcLocation(team)}</p>
                <p className="map-popup-muted text-xs">{team.tbc.trainingSite}</p>
                <Link
                  href={`/teams/${team.slug}`}
                  className="map-popup-link mt-2 inline-block text-xs font-medium hover:underline"
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
          icon={createMatchNumberIcon(marker.sequence, marker.status)}
          zIndexOffset={500}
        >
          <Popup>
            <div className="min-w-[180px] text-sm">
              <p className="map-popup-muted font-display text-xs font-bold uppercase tracking-wider">
                Game {marker.sequence} · Match {marker.matchNumber} ·{" "}
                {getTeamScheduleMapMarkerStatusLabel(marker.status)}
              </p>
              <p className="map-popup-text mt-1 font-bold">
                {marker.status === "potential" ? "Path: " : marker.isHome ? "vs" : "at"}{" "}
                {marker.opponentLabel}
              </p>
              {marker.score && (
                <p className="map-popup-text mt-0.5 font-display text-lg font-black">
                  {marker.score}
                </p>
              )}
              <p className="map-popup-muted mt-1">{marker.hostCityName}</p>
              <p className="map-popup-muted text-xs">{marker.stadium}</p>
              <p className="map-popup-muted mt-1 text-xs">
                {formatMapMarkerDate(marker.date)}
              </p>
              <p className="map-popup-muted text-[10px] uppercase tracking-wider">
                {getStageLabel(marker.stage)}
              </p>
              <Link
                href={`/matches/${marker.matchNumber}`}
                className="map-popup-link mt-2 inline-block text-xs font-medium hover:underline"
              >
                View match →
              </Link>
              <Link
                href={`/host-cities/${marker.hostCitySlug}`}
                className="map-popup-link mt-1 inline-block text-xs font-medium hover:underline"
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
