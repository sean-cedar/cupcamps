/** Extra names Highlightly / broadcasters may use for our FIFA team names. */
const TEAM_ALIASES: Record<string, string[]> = {
  "bosnia and herzegovina": ["bosnia"],
  "cabo verde": ["cape verde"],
  "congo dr": ["dr congo", "democratic republic of the congo", "drc"],
  "cote d ivoire": ["ivory coast"],
  curacao: ["curaçao"],
  czechia: ["czech republic"],
  "ir iran": ["iran"],
  "korea republic": ["south korea"],
  turkiye: ["turkey"],
  "united states": ["usa", "us"],
};

export function normalizeTeamName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function aliasesForName(canonicalName: string): Set<string> {
  const normalized = normalizeTeamName(canonicalName);
  const aliases = new Set<string>([normalized]);

  for (const alias of TEAM_ALIASES[normalized] ?? []) {
    aliases.add(normalizeTeamName(alias));
  }

  return aliases;
}

export function teamNamesMatch(
  feedName: string | undefined,
  canonicalName: string,
): boolean {
  if (!feedName) {
    return false;
  }

  const feedNorm = normalizeTeamName(feedName);
  return aliasesForName(canonicalName).has(feedNorm);
}

export function teamsMatchByName(
  feedHome: string | undefined,
  feedAway: string | undefined,
  homeName: string,
  awayName: string,
): boolean {
  return (
    (teamNamesMatch(feedHome, homeName) &&
      teamNamesMatch(feedAway, awayName)) ||
    (teamNamesMatch(feedHome, awayName) &&
      teamNamesMatch(feedAway, homeName))
  );
}
