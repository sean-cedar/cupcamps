"use client";

import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Team } from "@/lib/types";

type TbcMapProps = {
  teams: Team[];
  height?: string;
  zoom?: number;
  center?: [number, number];
  highlightSlug?: string;
};

const countryMarkerClass: Record<string, string> = {
  USA: "tbc-marker-usa",
  Mexico: "tbc-marker-mexico",
  Canada: "tbc-marker-canada",
};

function createIcon(country: string) {
  const markerClass = countryMarkerClass[country] ?? "";
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div class="tbc-marker ${markerClass}"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
}

export function TbcMap({
  teams,
  height = "600px",
  zoom = 4,
  center = [39.8283, -98.5795],
  highlightSlug,
}: TbcMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: "100%" }}
      scrollWheelZoom={true}
      aria-label="Map of World Cup 2026 team base camps across North America"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {teams.map((team) => (
        <Marker
          key={team.slug}
          position={[team.tbc.coordinates.lat, team.tbc.coordinates.lng]}
          icon={createIcon(team.tbc.country)}
          opacity={highlightSlug && highlightSlug !== team.slug ? 0.5 : 1}
        >
          <Popup>
            <div className="min-w-[180px] text-sm">
              <p className="font-bold text-gray-900">{team.name}</p>
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
      ))}
    </MapContainer>
  );
}
