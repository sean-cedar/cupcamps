import kickoffsData from "@/data/match-kickoffs.json";
import { matches } from "@/lib/schedule/matches";
import { getHostCity } from "@/lib/teams";

export type MatchKickoff = {
  kickoffIso: string;
  localTime: string;
  utcOffset: string;
};

type MatchKickoffsFile = {
  kickoffs: Record<string, MatchKickoff>;
};

const kickoffsByMatchNumber = (kickoffsData as MatchKickoffsFile).kickoffs;

const matchByNumber = new Map(matches.map((match) => [match.matchNumber, match]));

export function getMatchKickoff(matchNumber: number): MatchKickoff | undefined {
  return kickoffsByMatchNumber[String(matchNumber)];
}

export function getMatchKickoffInstant(matchNumber: number): Date | undefined {
  const kickoff = getMatchKickoff(matchNumber);
  return kickoff ? new Date(kickoff.kickoffIso) : undefined;
}

export function formatMatchKickoff(
  matchNumber: number,
  hostCitySlug?: string,
): string | null {
  const kickoff = getMatchKickoff(matchNumber);
  if (!kickoff) {
    return null;
  }

  const resolvedHostCitySlug =
    hostCitySlug ?? matchByNumber.get(matchNumber)?.hostCitySlug;
  const hostCity = resolvedHostCitySlug
    ? getHostCity(resolvedHostCitySlug)
    : undefined;

  if (hostCity?.timezone) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: hostCity.timezone,
      timeZoneName: "short",
    }).format(new Date(kickoff.kickoffIso));
  }

  const wallClock = kickoff.kickoffIso.split("T")[1]?.split(/[+-]/)[0];
  if (!wallClock) {
    return null;
  }

  const [hourRaw, minuteRaw] = wallClock.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

export function formatMatchSchedule(
  matchNumber: number,
  date: string,
  hostCitySlug?: string,
): string {
  const kickoff = formatMatchKickoff(matchNumber, hostCitySlug);
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (kickoff) {
    return `${formattedDate} · ${kickoff}`;
  }

  return formattedDate;
}
