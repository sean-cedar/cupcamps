import {
  formatMatchDate,
  formatScore,
  getOpponentDisplay,
  getTeamSchedule,
} from "@/lib/schedule";
import type { MatchStage, TeamMatch } from "@/lib/schedule/types";
import { getHostCity } from "@/lib/teams";
import type { Coordinates } from "@/lib/types";

export type TeamScheduleMapMarkerStatus = "completed" | "scheduled" | "potential";

export type TeamScheduleMapMarker = {
  sequence: number;
  matchNumber: number;
  status: TeamScheduleMapMarkerStatus;
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

function isPlaceholderSlug(slug: string): boolean {
  return slug.startsWith("winner:") || slug.startsWith("loser:");
}

export function getTeamScheduleMapMarkerStatus(
  match: TeamMatch,
): TeamScheduleMapMarkerStatus {
  if (match.isPlayed) {
    return "completed";
  }

  if (isPlaceholderSlug(match.opponentSlug)) {
    return "potential";
  }

  return "scheduled";
}

export function getTeamScheduleMapMarkerStatusLabel(
  status: TeamScheduleMapMarkerStatus,
): string {
  switch (status) {
    case "completed":
      return "Completed";
    case "scheduled":
      return "Scheduled";
    case "potential":
      return "Potential";
  }
}

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
        status: getTeamScheduleMapMarkerStatus(match),
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
