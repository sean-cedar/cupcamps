import type { MatchRecord } from "@/lib/schedule/types";

type FixtureInput = {
  matchNumber: number;
  stage: MatchRecord["stage"];
  date: string;
  matchday?: number;
  group?: string;
  home: string;
  away: string;
  homeScore?: number | null;
  awayScore?: number | null;
  city: string;
  stadium: string;
};

function f(input: FixtureInput): MatchRecord {
  return {
    matchNumber: input.matchNumber,
    stage: input.stage,
    date: input.date,
    matchday: input.matchday,
    group: input.group,
    homeSlug: input.home,
    awaySlug: input.away,
    homeScore: input.homeScore ?? null,
    awayScore: input.awayScore ?? null,
    hostCitySlug: input.city,
    stadium: input.stadium,
  };
}

/** FIFA World Cup 26™ fixtures — group stage + knockout bracket (matches 1–104). */
export const matches: MatchRecord[] = [
  // Group A
  f({ matchNumber: 1, stage: "group", date: "2026-06-11", matchday: 1, group: "A", home: "mexico", away: "south-africa", homeScore: 2, awayScore: 0, city: "mexico-city", stadium: "Estadio Azteca" }),
  f({ matchNumber: 2, stage: "group", date: "2026-06-11", matchday: 1, group: "A", home: "korea-republic", away: "czechia", homeScore: 2, awayScore: 1, city: "guadalajara", stadium: "Estadio Akron" }),
  f({ matchNumber: 25, stage: "group", date: "2026-06-18", matchday: 2, group: "A", home: "czechia", away: "south-africa", city: "atlanta", stadium: "Mercedes-Benz Stadium" }),
  f({ matchNumber: 26, stage: "group", date: "2026-06-18", matchday: 2, group: "A", home: "mexico", away: "korea-republic", city: "guadalajara", stadium: "Estadio Akron" }),
  f({ matchNumber: 49, stage: "group", date: "2026-06-24", matchday: 3, group: "A", home: "south-africa", away: "korea-republic", city: "monterrey", stadium: "Estadio BBVA" }),
  f({ matchNumber: 50, stage: "group", date: "2026-06-24", matchday: 3, group: "A", home: "czechia", away: "mexico", city: "mexico-city", stadium: "Estadio Azteca" }),

  // Group B
  f({ matchNumber: 3, stage: "group", date: "2026-06-12", matchday: 1, group: "B", home: "canada", away: "bosnia-and-herzegovina", homeScore: 1, awayScore: 1, city: "toronto", stadium: "BMO Field" }),
  f({ matchNumber: 4, stage: "group", date: "2026-06-13", matchday: 1, group: "B", home: "qatar", away: "switzerland", homeScore: 1, awayScore: 1, city: "san-francisco-bay-area", stadium: "Levi's Stadium" }),
  f({ matchNumber: 27, stage: "group", date: "2026-06-18", matchday: 2, group: "B", home: "switzerland", away: "bosnia-and-herzegovina", city: "los-angeles", stadium: "SoFi Stadium" }),
  f({ matchNumber: 28, stage: "group", date: "2026-06-18", matchday: 2, group: "B", home: "canada", away: "qatar", city: "vancouver", stadium: "BC Place" }),
  f({ matchNumber: 51, stage: "group", date: "2026-06-24", matchday: 3, group: "B", home: "switzerland", away: "canada", city: "vancouver", stadium: "BC Place" }),
  f({ matchNumber: 52, stage: "group", date: "2026-06-24", matchday: 3, group: "B", home: "bosnia-and-herzegovina", away: "qatar", city: "seattle", stadium: "Lumen Field" }),

  // Group C
  f({ matchNumber: 5, stage: "group", date: "2026-06-13", matchday: 1, group: "C", home: "haiti", away: "scotland", homeScore: 0, awayScore: 1, city: "boston", stadium: "Gillette Stadium" }),
  f({ matchNumber: 6, stage: "group", date: "2026-06-13", matchday: 1, group: "C", home: "brazil", away: "morocco", homeScore: 1, awayScore: 1, city: "new-york-new-jersey", stadium: "MetLife Stadium" }),
  f({ matchNumber: 29, stage: "group", date: "2026-06-19", matchday: 2, group: "C", home: "brazil", away: "haiti", city: "philadelphia", stadium: "Lincoln Financial Field" }),
  f({ matchNumber: 30, stage: "group", date: "2026-06-19", matchday: 2, group: "C", home: "scotland", away: "morocco", city: "boston", stadium: "Gillette Stadium" }),
  f({ matchNumber: 53, stage: "group", date: "2026-06-24", matchday: 3, group: "C", home: "scotland", away: "brazil", city: "miami", stadium: "Hard Rock Stadium" }),
  f({ matchNumber: 54, stage: "group", date: "2026-06-24", matchday: 3, group: "C", home: "morocco", away: "haiti", city: "atlanta", stadium: "Mercedes-Benz Stadium" }),

  // Group D
  f({ matchNumber: 7, stage: "group", date: "2026-06-12", matchday: 1, group: "D", home: "united-states", away: "paraguay", homeScore: 4, awayScore: 1, city: "los-angeles", stadium: "SoFi Stadium" }),
  f({ matchNumber: 8, stage: "group", date: "2026-06-13", matchday: 1, group: "D", home: "australia", away: "turkiye", homeScore: 2, awayScore: 0, city: "vancouver", stadium: "BC Place" }),
  f({ matchNumber: 31, stage: "group", date: "2026-06-19", matchday: 2, group: "D", home: "turkiye", away: "paraguay", city: "san-francisco-bay-area", stadium: "Levi's Stadium" }),
  f({ matchNumber: 32, stage: "group", date: "2026-06-19", matchday: 2, group: "D", home: "united-states", away: "australia", city: "seattle", stadium: "Lumen Field" }),
  f({ matchNumber: 55, stage: "group", date: "2026-06-25", matchday: 3, group: "D", home: "turkiye", away: "united-states", city: "los-angeles", stadium: "SoFi Stadium" }),
  f({ matchNumber: 56, stage: "group", date: "2026-06-25", matchday: 3, group: "D", home: "paraguay", away: "australia", city: "san-francisco-bay-area", stadium: "Levi's Stadium" }),

  // Group E
  f({ matchNumber: 9, stage: "group", date: "2026-06-14", matchday: 1, group: "E", home: "ivory-coast", away: "ecuador", homeScore: 1, awayScore: 0, city: "philadelphia", stadium: "Lincoln Financial Field" }),
  f({ matchNumber: 10, stage: "group", date: "2026-06-14", matchday: 1, group: "E", home: "germany", away: "curacao", homeScore: 7, awayScore: 1, city: "houston", stadium: "NRG Stadium" }),
  f({ matchNumber: 33, stage: "group", date: "2026-06-20", matchday: 2, group: "E", home: "germany", away: "ivory-coast", city: "toronto", stadium: "BMO Field" }),
  f({ matchNumber: 34, stage: "group", date: "2026-06-20", matchday: 2, group: "E", home: "ecuador", away: "curacao", city: "kansas-city", stadium: "Arrowhead Stadium" }),
  f({ matchNumber: 57, stage: "group", date: "2026-06-25", matchday: 3, group: "E", home: "curacao", away: "ivory-coast", city: "philadelphia", stadium: "Lincoln Financial Field" }),
  f({ matchNumber: 58, stage: "group", date: "2026-06-25", matchday: 3, group: "E", home: "ecuador", away: "germany", city: "new-york-new-jersey", stadium: "MetLife Stadium" }),

  // Group F
  f({ matchNumber: 11, stage: "group", date: "2026-06-14", matchday: 1, group: "F", home: "netherlands", away: "japan", homeScore: 2, awayScore: 2, city: "dallas", stadium: "AT&T Stadium" }),
  f({ matchNumber: 12, stage: "group", date: "2026-06-14", matchday: 1, group: "F", home: "sweden", away: "tunisia", homeScore: 5, awayScore: 1, city: "monterrey", stadium: "Estadio BBVA" }),
  f({ matchNumber: 35, stage: "group", date: "2026-06-20", matchday: 2, group: "F", home: "netherlands", away: "sweden", city: "houston", stadium: "NRG Stadium" }),
  f({ matchNumber: 36, stage: "group", date: "2026-06-20", matchday: 2, group: "F", home: "tunisia", away: "japan", city: "monterrey", stadium: "Estadio BBVA" }),
  f({ matchNumber: 59, stage: "group", date: "2026-06-25", matchday: 3, group: "F", home: "japan", away: "sweden", city: "dallas", stadium: "AT&T Stadium" }),
  f({ matchNumber: 60, stage: "group", date: "2026-06-25", matchday: 3, group: "F", home: "tunisia", away: "netherlands", city: "kansas-city", stadium: "Arrowhead Stadium" }),

  // Group G
  f({ matchNumber: 13, stage: "group", date: "2026-06-15", matchday: 1, group: "G", home: "iran", away: "new-zealand", homeScore: 2, awayScore: 2, city: "los-angeles", stadium: "SoFi Stadium" }),
  f({ matchNumber: 14, stage: "group", date: "2026-06-15", matchday: 1, group: "G", home: "belgium", away: "egypt", homeScore: 1, awayScore: 1, city: "seattle", stadium: "Lumen Field" }),
  f({ matchNumber: 37, stage: "group", date: "2026-06-21", matchday: 2, group: "G", home: "egypt", away: "iran", city: "seattle", stadium: "Lumen Field" }),
  f({ matchNumber: 38, stage: "group", date: "2026-06-21", matchday: 2, group: "G", home: "new-zealand", away: "belgium", city: "vancouver", stadium: "BC Place" }),
  f({ matchNumber: 61, stage: "group", date: "2026-06-26", matchday: 3, group: "G", home: "egypt", away: "new-zealand", city: "vancouver", stadium: "BC Place" }),
  f({ matchNumber: 62, stage: "group", date: "2026-06-26", matchday: 3, group: "G", home: "iran", away: "belgium", city: "seattle", stadium: "Lumen Field" }),

  // Group H
  f({ matchNumber: 15, stage: "group", date: "2026-06-15", matchday: 1, group: "H", home: "saudi-arabia", away: "uruguay", homeScore: 1, awayScore: 1, city: "miami", stadium: "Hard Rock Stadium" }),
  f({ matchNumber: 16, stage: "group", date: "2026-06-15", matchday: 1, group: "H", home: "spain", away: "cabo-verde", homeScore: 0, awayScore: 0, city: "atlanta", stadium: "Mercedes-Benz Stadium" }),
  f({ matchNumber: 39, stage: "group", date: "2026-06-21", matchday: 2, group: "H", home: "uruguay", away: "cabo-verde", city: "miami", stadium: "Hard Rock Stadium" }),
  f({ matchNumber: 40, stage: "group", date: "2026-06-21", matchday: 2, group: "H", home: "spain", away: "saudi-arabia", city: "atlanta", stadium: "Mercedes-Benz Stadium" }),
  f({ matchNumber: 63, stage: "group", date: "2026-06-26", matchday: 3, group: "H", home: "cabo-verde", away: "saudi-arabia", city: "houston", stadium: "NRG Stadium" }),
  f({ matchNumber: 64, stage: "group", date: "2026-06-26", matchday: 3, group: "H", home: "uruguay", away: "spain", city: "guadalajara", stadium: "Estadio Akron" }),

  // Group I
  f({ matchNumber: 17, stage: "group", date: "2026-06-16", matchday: 1, group: "I", home: "france", away: "senegal", homeScore: 3, awayScore: 1, city: "new-york-new-jersey", stadium: "MetLife Stadium" }),
  f({ matchNumber: 18, stage: "group", date: "2026-06-16", matchday: 1, group: "I", home: "iraq", away: "norway", homeScore: 1, awayScore: 4, city: "boston", stadium: "Gillette Stadium" }),
  f({ matchNumber: 41, stage: "group", date: "2026-06-22", matchday: 2, group: "I", home: "norway", away: "senegal", city: "new-york-new-jersey", stadium: "MetLife Stadium" }),
  f({ matchNumber: 42, stage: "group", date: "2026-06-22", matchday: 2, group: "I", home: "france", away: "iraq", city: "philadelphia", stadium: "Lincoln Financial Field" }),
  f({ matchNumber: 65, stage: "group", date: "2026-06-26", matchday: 3, group: "I", home: "norway", away: "france", city: "boston", stadium: "Gillette Stadium" }),
  f({ matchNumber: 66, stage: "group", date: "2026-06-26", matchday: 3, group: "I", home: "senegal", away: "iraq", city: "toronto", stadium: "BMO Field" }),

  // Group J
  f({ matchNumber: 19, stage: "group", date: "2026-06-16", matchday: 1, group: "J", home: "argentina", away: "algeria", city: "kansas-city", stadium: "Arrowhead Stadium" }),
  f({ matchNumber: 20, stage: "group", date: "2026-06-16", matchday: 1, group: "J", home: "austria", away: "jordan", city: "san-francisco-bay-area", stadium: "Levi's Stadium" }),
  f({ matchNumber: 43, stage: "group", date: "2026-06-22", matchday: 2, group: "J", home: "argentina", away: "austria", city: "dallas", stadium: "AT&T Stadium" }),
  f({ matchNumber: 44, stage: "group", date: "2026-06-22", matchday: 2, group: "J", home: "jordan", away: "algeria", city: "san-francisco-bay-area", stadium: "Levi's Stadium" }),
  f({ matchNumber: 67, stage: "group", date: "2026-06-27", matchday: 3, group: "J", home: "algeria", away: "austria", city: "kansas-city", stadium: "Arrowhead Stadium" }),
  f({ matchNumber: 68, stage: "group", date: "2026-06-27", matchday: 3, group: "J", home: "jordan", away: "argentina", city: "dallas", stadium: "AT&T Stadium" }),

  // Group K
  f({ matchNumber: 21, stage: "group", date: "2026-06-17", matchday: 1, group: "K", home: "portugal", away: "congo-dr", city: "houston", stadium: "NRG Stadium" }),
  f({ matchNumber: 22, stage: "group", date: "2026-06-17", matchday: 1, group: "K", home: "uzbekistan", away: "colombia", city: "mexico-city", stadium: "Estadio Azteca" }),
  f({ matchNumber: 45, stage: "group", date: "2026-06-23", matchday: 2, group: "K", home: "portugal", away: "uzbekistan", city: "houston", stadium: "NRG Stadium" }),
  f({ matchNumber: 46, stage: "group", date: "2026-06-23", matchday: 2, group: "K", home: "colombia", away: "congo-dr", city: "guadalajara", stadium: "Estadio Akron" }),
  f({ matchNumber: 69, stage: "group", date: "2026-06-27", matchday: 3, group: "K", home: "colombia", away: "portugal", city: "miami", stadium: "Hard Rock Stadium" }),
  f({ matchNumber: 70, stage: "group", date: "2026-06-27", matchday: 3, group: "K", home: "congo-dr", away: "uzbekistan", city: "atlanta", stadium: "Mercedes-Benz Stadium" }),

  // Group L
  f({ matchNumber: 23, stage: "group", date: "2026-06-17", matchday: 1, group: "L", home: "ghana", away: "panama", city: "toronto", stadium: "BMO Field" }),
  f({ matchNumber: 24, stage: "group", date: "2026-06-17", matchday: 1, group: "L", home: "england", away: "croatia", city: "dallas", stadium: "AT&T Stadium" }),
  f({ matchNumber: 47, stage: "group", date: "2026-06-23", matchday: 2, group: "L", home: "england", away: "ghana", city: "boston", stadium: "Gillette Stadium" }),
  f({ matchNumber: 48, stage: "group", date: "2026-06-23", matchday: 2, group: "L", home: "panama", away: "croatia", city: "toronto", stadium: "BMO Field" }),
  f({ matchNumber: 71, stage: "group", date: "2026-06-27", matchday: 3, group: "L", home: "panama", away: "england", city: "new-york-new-jersey", stadium: "MetLife Stadium" }),
  f({ matchNumber: 72, stage: "group", date: "2026-06-27", matchday: 3, group: "L", home: "croatia", away: "ghana", city: "philadelphia", stadium: "Lincoln Financial Field" }),

  // Round of 32
  f({ matchNumber: 73, stage: "round-of-32", date: "2026-06-28", home: "south-africa", away: "canada", city: "los-angeles", stadium: "SoFi Stadium" }),
  f({ matchNumber: 74, stage: "round-of-32", date: "2026-06-29", home: "germany", away: "paraguay", city: "boston", stadium: "Gillette Stadium" }),
  f({ matchNumber: 75, stage: "round-of-32", date: "2026-06-29", home: "netherlands", away: "morocco", city: "monterrey", stadium: "Estadio BBVA" }),
  f({ matchNumber: 76, stage: "round-of-32", date: "2026-06-29", home: "brazil", away: "japan", city: "houston", stadium: "NRG Stadium" }),
  f({ matchNumber: 77, stage: "round-of-32", date: "2026-06-30", home: "france", away: "sweden", city: "new-york-new-jersey", stadium: "MetLife Stadium" }),
  f({ matchNumber: 78, stage: "round-of-32", date: "2026-06-30", home: "ivory-coast", away: "norway", city: "dallas", stadium: "AT&T Stadium" }),
  f({ matchNumber: 79, stage: "round-of-32", date: "2026-06-30", home: "mexico", away: "ecuador", city: "mexico-city", stadium: "Estadio Azteca" }),
  f({ matchNumber: 80, stage: "round-of-32", date: "2026-07-01", home: "england", away: "congo-dr", city: "atlanta", stadium: "Mercedes-Benz Stadium" }),
  f({ matchNumber: 81, stage: "round-of-32", date: "2026-07-01", home: "united-states", away: "bosnia-and-herzegovina", city: "san-francisco-bay-area", stadium: "Levi's Stadium" }),
  f({ matchNumber: 82, stage: "round-of-32", date: "2026-07-01", home: "belgium", away: "senegal", city: "seattle", stadium: "Lumen Field" }),
  f({ matchNumber: 83, stage: "round-of-32", date: "2026-07-02", home: "portugal", away: "croatia", city: "toronto", stadium: "BMO Field" }),
  f({ matchNumber: 84, stage: "round-of-32", date: "2026-07-02", home: "spain", away: "algeria", city: "los-angeles", stadium: "SoFi Stadium" }),
  f({ matchNumber: 85, stage: "round-of-32", date: "2026-07-02", home: "switzerland", away: "iran", city: "vancouver", stadium: "BC Place" }),
  f({ matchNumber: 86, stage: "round-of-32", date: "2026-07-03", home: "argentina", away: "cabo-verde", city: "miami", stadium: "Hard Rock Stadium" }),
  f({ matchNumber: 87, stage: "round-of-32", date: "2026-07-03", home: "colombia", away: "ghana", city: "kansas-city", stadium: "Arrowhead Stadium" }),
  f({ matchNumber: 88, stage: "round-of-32", date: "2026-07-03", home: "australia", away: "egypt", city: "dallas", stadium: "AT&T Stadium" }),

  // Round of 16
  f({ matchNumber: 89, stage: "round-of-16", date: "2026-07-04", home: "winner:74", away: "winner:77", city: "philadelphia", stadium: "Lincoln Financial Field" }),
  f({ matchNumber: 90, stage: "round-of-16", date: "2026-07-04", home: "winner:73", away: "winner:75", city: "houston", stadium: "NRG Stadium" }),
  f({ matchNumber: 91, stage: "round-of-16", date: "2026-07-05", home: "winner:76", away: "winner:78", city: "new-york-new-jersey", stadium: "MetLife Stadium" }),
  f({ matchNumber: 92, stage: "round-of-16", date: "2026-07-05", home: "winner:79", away: "winner:80", city: "mexico-city", stadium: "Estadio Azteca" }),
  f({ matchNumber: 93, stage: "round-of-16", date: "2026-07-06", home: "winner:83", away: "winner:84", city: "dallas", stadium: "AT&T Stadium" }),
  f({ matchNumber: 94, stage: "round-of-16", date: "2026-07-06", home: "winner:81", away: "winner:82", city: "seattle", stadium: "Lumen Field" }),
  f({ matchNumber: 95, stage: "round-of-16", date: "2026-07-07", home: "winner:86", away: "winner:88", city: "atlanta", stadium: "Mercedes-Benz Stadium" }),
  f({ matchNumber: 96, stage: "round-of-16", date: "2026-07-07", home: "winner:85", away: "winner:87", city: "vancouver", stadium: "BC Place" }),

  // Quarter-finals
  f({ matchNumber: 97, stage: "quarter-final", date: "2026-07-09", home: "winner:89", away: "winner:90", city: "boston", stadium: "Gillette Stadium" }),
  f({ matchNumber: 98, stage: "quarter-final", date: "2026-07-10", home: "winner:93", away: "winner:94", city: "los-angeles", stadium: "SoFi Stadium" }),
  f({ matchNumber: 99, stage: "quarter-final", date: "2026-07-11", home: "winner:91", away: "winner:92", city: "miami", stadium: "Hard Rock Stadium" }),
  f({ matchNumber: 100, stage: "quarter-final", date: "2026-07-11", home: "winner:95", away: "winner:96", city: "kansas-city", stadium: "Arrowhead Stadium" }),

  // Semi-finals
  f({ matchNumber: 101, stage: "semi-final", date: "2026-07-14", home: "winner:97", away: "winner:98", city: "dallas", stadium: "AT&T Stadium" }),
  f({ matchNumber: 102, stage: "semi-final", date: "2026-07-15", home: "winner:99", away: "winner:100", city: "atlanta", stadium: "Mercedes-Benz Stadium" }),

  // Third place & Final
  f({ matchNumber: 103, stage: "third-place", date: "2026-07-18", home: "loser:101", away: "loser:102", city: "miami", stadium: "Hard Rock Stadium" }),
  f({ matchNumber: 104, stage: "final", date: "2026-07-19", home: "winner:101", away: "winner:102", city: "new-york-new-jersey", stadium: "MetLife Stadium" }),
];

export const roundOf32Entry: Record<string, number> = {
  "south-africa": 73,
  canada: 73,
  germany: 74,
  paraguay: 74,
  netherlands: 75,
  morocco: 75,
  brazil: 76,
  japan: 76,
  france: 77,
  sweden: 77,
  "ivory-coast": 78,
  norway: 78,
  mexico: 79,
  ecuador: 79,
  england: 80,
  "congo-dr": 80,
  "united-states": 81,
  "bosnia-and-herzegovina": 81,
  belgium: 82,
  senegal: 82,
  portugal: 83,
  croatia: 83,
  spain: 84,
  algeria: 84,
  switzerland: 85,
  iran: 85,
  argentina: 86,
  "cabo-verde": 86,
  colombia: 87,
  ghana: 87,
  australia: 88,
  egypt: 88,
};

export const winnerAdvancesTo: Record<number, number> = {
  73: 90,
  74: 89,
  75: 90,
  76: 91,
  77: 89,
  78: 91,
  79: 92,
  80: 92,
  81: 94,
  82: 94,
  83: 93,
  84: 93,
  85: 96,
  86: 95,
  87: 96,
  88: 95,
  89: 97,
  90: 97,
  91: 99,
  92: 99,
  93: 98,
  94: 98,
  95: 100,
  96: 100,
  97: 101,
  98: 101,
  99: 102,
  100: 102,
  101: 104,
  102: 104,
};

export const loserAdvancesTo: Record<number, number> = {
  101: 103,
  102: 103,
};
