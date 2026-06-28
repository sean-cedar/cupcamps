import {
  getHostCity,
  getTeamsPlayingAtHostCity,
  getTeamsWithTbcNearHostCity,
  hostCities,
} from "@/lib/teams";
import type { HostCity } from "@/lib/types";

export function getAllHostCities(): HostCity[] {
  return hostCities;
}

export function getHostCityBySlug(slug: string): HostCity | undefined {
  return getHostCity(slug);
}

export function getHostCityStats(slug: string) {
  const tbcTeams = getTeamsWithTbcNearHostCity(slug);
  const playingTeams = getTeamsPlayingAtHostCity(slug);

  return {
    tbcTeamCount: tbcTeams.length,
    playingTeamCount: playingTeams.length,
    tbcTeams,
    playingTeams,
  };
}
