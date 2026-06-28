import {
  formatMatchDate,
  formatScore,
  getOpponentDisplay,
  getTeamSchedule,
} from "@/lib/schedule";
import type { MatchStage } from "@/lib/schedule/types";
import { getHostCity } from "@/lib/teams";
import type { Coordinates } from "@/lib/types";

export type TeamScheduleMapMarker = {
  sequence: number;
  matchNumber: number;
  hostCitySlug: string;
  hostCityName: string;
  coordinates: Coordinates;
  date: string;
  stadium: string;
  stage: MatchStage;
  opponentLabel: string;
  score: string | null;
  isHome: boolean;
};

/** Small offset when a team plays multiple matches in the same host city. */
function duplicateCityOffset(index: number): Coordinates {
  if (index === 0) {
    return { lat: 0, lng: 0 };
  }

  const stepDegrees = 0.14;
  const angle = ((index - 1) * 72 * Math.PI) / 180;

  return {
    lat: Math.sin(angle) * stepDegrees,
    lng: Math.cos(angle) * stepDegrees,
  };
}

export function getTeamScheduleMapMarkers(
  teamSlug: string,
): TeamScheduleMapMarker[] {
  const schedule = getTeamSchedule(teamSlug);
  const cityMarkerCount = new Map<string, number>();

  return schedule.flatMap((match, index) => {
    const hostCity = getHostCity(match.hostCitySlug);
    if (!hostCity) {
      return [];
    }

    const duplicateIndex = cityMarkerCount.get(match.hostCitySlug) ?? 0;
    cityMarkerCount.set(match.hostCitySlug, duplicateIndex + 1);
    const offset = duplicateCityOffset(duplicateIndex);
    const opponent = getOpponentDisplay(match.opponentSlug);

    return [
      {
        sequence: index + 1,
        matchNumber: match.matchNumber,
        hostCitySlug: match.hostCitySlug,
        hostCityName: hostCity.name,
        coordinates: {
          lat: hostCity.coordinates.lat + offset.lat,
          lng: hostCity.coordinates.lng + offset.lng,
        },
        date: match.date,
        stadium: match.stadium,
        stage: match.stage,
        opponentLabel: opponent.label,
        score: formatScore(match),
        isHome: match.isHome,
      },
    ];
  });
}

export function formatMapMarkerDate(date: string): string {
  return formatMatchDate(date);
}
