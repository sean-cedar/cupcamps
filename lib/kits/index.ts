import teamKitsData from "@/data/team-kits.json";
import type { TeamKit } from "@/lib/kits/types";

const kitsBySlug = teamKitsData as Record<string, TeamKit>;

export function getTeamKit(teamSlug: string): TeamKit | undefined {
  return kitsBySlug[teamSlug];
}

export type { KitPattern, TeamKit } from "@/lib/kits/types";
