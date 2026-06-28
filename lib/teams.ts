import teamsData from "@/data/teams.json";
import hostCitiesData from "@/data/host-cities.json";
import nonHostCommunitiesData from "@/data/non-host-communities.json";
import type { HostCity, NonHostCommunity, Team, TeamFilters } from "@/lib/types";

export const DATA_LAST_UPDATED = "2026-05-25";

export const teams: Team[] = teamsData as Team[];
export const hostCities: HostCity[] = hostCitiesData as HostCity[];
export const nonHostCommunities: NonHostCommunity[] =
  nonHostCommunitiesData as NonHostCommunity[];

const hostCityMap = new Map(hostCities.map((city) => [city.slug, city]));

export function getHostCity(slug: string): HostCity | undefined {
  return hostCityMap.get(slug);
}

export function getTeam(slug: string): Team | undefined {
  return teams.find((team) => team.slug === slug);
}

/** Street address for the TBC training site. */
export function formatTeamTbcAddress(team: Team): string {
  return team.tbc.address;
}

export function formatTeamTbcLocation(
  team: Team,
  options?: { includeCountry?: boolean },
): string {
  if (options?.includeCountry === false) {
    return team.tbc.address.replace(/, (USA|Mexico|Canada)$/, "");
  }
  return team.tbc.address;
}

export function getTeamsByGroup(group: string): Team[] {
  return teams.filter((team) => team.group === group);
}

export function getTeamsByHostCity(hostCitySlug: string): Team[] {
  return teams.filter(
    (team) =>
      team.tbc.nearestHostCitySlug === hostCitySlug ||
      team.groupStageHostCitySlugs.includes(hostCitySlug),
  );
}

export function getTeamsWithTbcNearHostCity(hostCitySlug: string): Team[] {
  return teams.filter((team) => team.tbc.nearestHostCitySlug === hostCitySlug);
}

export function getTeamsPlayingAtHostCity(hostCitySlug: string): Team[] {
  return teams.filter((team) =>
    team.groupStageHostCitySlugs.includes(hostCitySlug),
  );
}

export function filterTeams(filters: TeamFilters): Team[] {
  let result = [...teams];

  if (filters.search) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (team) =>
        team.name.toLowerCase().includes(query) ||
        team.tbc.city.toLowerCase().includes(query) ||
        team.tbc.region.toLowerCase().includes(query) ||
        team.tbc.address.toLowerCase().includes(query) ||
        team.tbc.trainingSite.toLowerCase().includes(query),
    );
  }

  if (filters.group) {
    result = result.filter((team) => team.group === filters.group);
  }

  if (filters.tbcCountry) {
    result = result.filter((team) => team.tbc.country === filters.tbcCountry);
  }

  if (filters.hostCitySlug) {
    result = result.filter(
      (team) => team.tbc.nearestHostCitySlug === filters.hostCitySlug,
    );
  }

  const sort = filters.sort ?? "name";
  result.sort((a, b) => {
    if (sort === "group") {
      return a.group.localeCompare(b.group) || a.name.localeCompare(b.name);
    }
    if (sort === "tbcCity") {
      return (
        a.tbc.region.localeCompare(b.tbc.region) ||
        a.tbc.city.localeCompare(b.tbc.city) ||
        a.name.localeCompare(b.name)
      );
    }
    return a.name.localeCompare(b.name);
  });

  return result;
}

export function getGroups(): string[] {
  return [...new Set(teams.map((team) => team.group))].sort();
}

export function getStats() {
  const tbcByCountry = teams.reduce(
    (acc, team) => {
      acc[team.tbc.country] = (acc[team.tbc.country] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    teamCount: teams.length,
    hostCityCount: hostCities.length,
    nonHostCommunityCount: nonHostCommunities.length,
    tbcByCountry,
  };
}

export { hostCityMap };
