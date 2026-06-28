/** Extra names Highlightly / broadcasters may use for our FIFA team names. */
const TEAM_ALIASES: Record<string, string[]> = {
  "bosnia and herzegovina": ["bosnia"],
  "cabo verde": ["cape verde"],
  "congo dr": ["dr congo", "democratic republic of the congo", "drc"],
  "cote d ivoire": ["ivory coast", "cote d ivoire"],
  curacao: ["curaçao"],
  czechia: ["czech republic"],
  "ir iran": ["iran"],
  "korea republic": ["south korea", "korea republic"],
  turkiye: ["turkey"],
  "united states": ["usa", "us", "united states of america"],
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

/** Names to try in Highlightly homeTeamName / awayTeamName query params. */
export function getTeamNameVariants(canonicalName: string): string[] {
  const normalized = normalizeTeamName(canonicalName);
  const variants = new Set<string>([canonicalName]);

  for (const alias of TEAM_ALIASES[normalized] ?? []) {
    variants.add(alias);
  }

  return [...variants];
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

function textMentionsTeam(text: string, canonicalName: string): boolean {
  const normalizedText = normalizeTeamName(text);
  if (!normalizedText) {
    return false;
  }

  for (const alias of aliasesForName(canonicalName)) {
    if (alias.length >= 4 && normalizedText.includes(alias)) {
      return true;
    }

    const words = alias.split(" ").filter((word) => word.length >= 4);
    if (words.length > 0 && words.every((word) => normalizedText.includes(word))) {
      return true;
    }
  }

  return false;
}

export function textMentionsBothTeams(
  text: string | undefined,
  homeName: string,
  awayName: string,
): boolean {
  if (!text) {
    return false;
  }

  return (
    textMentionsTeam(text, homeName) && textMentionsTeam(text, awayName)
  );
}
