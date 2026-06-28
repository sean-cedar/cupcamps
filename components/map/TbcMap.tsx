"use client";

import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { renderTeamKitSvg } from "@/lib/kits/render-kit-svg";
import { getTeamKit } from "@/lib/kits";
import type { Team } from "@/lib/types";

type TbcMapProps = {
  teams: Team[];
  height?: string;
  zoom?: number;
  center?: [number, number];
  highlightSlug?: string;
};

/** Covers Canada, Mexico, and the continental United States with padding. */
const NORTH_AMERICA_BOUNDS: L.LatLngBoundsExpression = [
  [14, -168],
  [72, -52],
];

const MIN_ZOOM = 3;

function createKitIcon(team: Team, dimmed = false) {
  const kit = getTeamKit(team.slug);
  const kitSvg = kit
    ? renderTeamKitSvg(kit, {
        id: `map-${team.slug}`,
        width: 22,
        title: `${team.name} home kit`,
      })
    : `<span class="fi fi-${team.countryCode}"></span>`;

  return L.divIcon({
    className: "tbc-flag-icon",
    html: `<div class="tbc-flag-marker${dimmed ? " tbc-flag-marker-dimmed" : ""}">${kitSvg}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
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
      minZoom={MIN_ZOOM}
      maxBounds={NORTH_AMERICA_BOUNDS}
      maxBoundsViscosity={1}
      style={{ height, width: "100%" }}
      scrollWheelZoom={true}
      aria-label="Map of World Cup 2026 team base camps across North America"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {teams.map((team) => {
        const dimmed = Boolean(
          highlightSlug && highlightSlug !== team.slug,
        );

        return (
          <Marker
            key={team.slug}
            position={[team.tbc.coordinates.lat, team.tbc.coordinates.lng]}
            icon={createKitIcon(team, dimmed)}
            zIndexOffset={dimmed ? 0 : 1000}
          >
            <Popup>
              <div className="min-w-[180px] text-sm">
                <p className="flex items-center gap-2 font-bold text-gray-900">
                  {getTeamKit(team.slug) ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: renderTeamKitSvg(getTeamKit(team.slug)!, {
                          id: `popup-${team.slug}`,
                          width: 20,
                          title: `${team.name} home kit`,
                        }),
                      }}
                    />
                  ) : (
                    <span className={`fi fi-${team.countryCode}`} />
                  )}
                  {team.name}
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
    </MapContainer>
  );
}
