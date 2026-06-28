/**
 * Maps openfootball World Cup 2026 kickoff times to FIFA match numbers.
 *
 * Source: https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json
 *
 * Run: node scripts/build-match-kickoffs.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const OPENFOOTBALL_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

const TEAM_ALIASES = {
  "South Korea": "korea-republic",
  "Korea Republic": "korea-republic",
  "Czech Republic": "czechia",
  "United States": "united-states",
  USA: "united-states",
  "Bosnia & Herzegovina": "bosnia-and-herzegovina",
  "Bosnia and Herzegovina": "bosnia-and-herzegovina",
  "Côte d'Ivoire": "ivory-coast",
  "Ivory Coast": "ivory-coast",
  "Cote d'Ivoire": "ivory-coast",
  Türkiye: "turkiye",
  Turkey: "turkiye",
  "IR Iran": "iran",
  Iran: "iran",
  "Congo DR": "congo-dr",
  "DR Congo": "congo-dr",
  "Cabo Verde": "cabo-verde",
  "Cape Verde": "cabo-verde",
  Curacao: "curacao",
  "Curaçao": "curacao",
};

function pairKey(a, b) {
  return [a, b].sort().join("|");
}

function parseOpenFootballTime(time, date) {
  const match = time.match(/^(\d{1,2}):(\d{2})\s+UTC([+-]?\d+(?:\.\d+)?)$/);
  if (!match) {
    throw new Error(`Unrecognized kickoff time: ${time}`);
  }

  const [, rawHour, minute, offsetHours] = match;
  const offsetNum = Number(offsetHours);
  const sign = offsetNum >= 0 ? "+" : "-";
  const abs = Math.abs(offsetNum);
  const offsetH = String(Math.floor(abs)).padStart(2, "0");
  const offsetM = String(Math.round((abs % 1) * 60)).padStart(2, "0");
  const utcOffset = `${sign}${offsetH}:${offsetM}`;
  const hour = String(Number(rawHour)).padStart(2, "0");

  return {
    kickoffIso: `${date}T${hour}:${minute}:00${utcOffset}`,
    localTime: `${hour}:${minute}`,
    utcOffset,
  };
}

function loadCupcampsFixtures() {
  const src = readFileSync(join(ROOT, "lib/schedule/matches.ts"), "utf8");
  const re =
    /f\(\{\s*matchNumber:\s*(\d+),\s*stage:\s*"([^"]+)"[\s\S]*?date:\s*"([^"]+)"[\s\S]*?home:\s*"([^"]+)",\s*away:\s*"([^"]+)"/g;
  const fixtures = [];
  let m;

  while ((m = re.exec(src))) {
    fixtures.push({
      matchNumber: Number(m[1]),
      stage: m[2],
      date: m[3],
      home: m[4],
      away: m[5],
    });
  }

  if (fixtures.length !== 104) {
    throw new Error(`Expected 104 fixtures, found ${fixtures.length}`);
  }

  return fixtures;
}

function buildNameToSlug() {
  const teams = JSON.parse(readFileSync(join(ROOT, "data/teams.json"), "utf8"));
  const nameToSlug = new Map(teams.map((team) => [team.name, team.slug]));

  for (const [name, slug] of Object.entries(TEAM_ALIASES)) {
    nameToSlug.set(name, slug);
  }

  return (name) => nameToSlug.get(name);
}

async function loadOpenFootballMatches() {
  const response = await fetch(OPENFOOTBALL_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch openfootball data (${response.status})`);
  }

  const payload = await response.json();
  return payload.matches;
}

function buildKickoffLookup(openFootballMatches, slugForName) {
  const byPair = new Map();
  const knockoutByDate = new Map();

  for (const fixture of openFootballMatches) {
    const home = slugForName(fixture.team1);
    const away = slugForName(fixture.team2);

    if (home && away) {
      byPair.set(pairKey(home, away), fixture);
    }

    if (!fixture.group) {
      if (!knockoutByDate.has(fixture.date)) {
        knockoutByDate.set(fixture.date, []);
      }
      knockoutByDate.get(fixture.date).push(fixture);
    }
  }

  for (const day of knockoutByDate.values()) {
    day.sort((a, b) => a.time.localeCompare(b.time));
  }

  return { byPair, knockoutByDate };
}

function mapKickoffs(fixtures, lookup, slugForName) {
  const knockoutOursByDate = new Map();

  for (const fixture of fixtures.filter((match) => match.stage !== "group")) {
    if (!knockoutOursByDate.has(fixture.date)) {
      knockoutOursByDate.set(fixture.date, []);
    }
    knockoutOursByDate.get(fixture.date).push(fixture);
  }

  for (const day of knockoutOursByDate.values()) {
    day.sort((a, b) => a.matchNumber - b.matchNumber);
  }

  const kickoffs = {};
  const missing = [];

  for (const fixture of fixtures) {
    let source;

    if (fixture.stage === "group") {
      source = lookup.byPair.get(pairKey(fixture.home, fixture.away));
    } else {
      const oursDay = knockoutOursByDate.get(fixture.date) ?? [];
      const ofDay = lookup.knockoutByDate.get(fixture.date) ?? [];
      const index = oursDay.findIndex((match) => match.matchNumber === fixture.matchNumber);
      source = index >= 0 ? ofDay[index] : undefined;
    }

    if (!source) {
      missing.push(fixture);
      continue;
    }

    kickoffs[String(fixture.matchNumber)] = parseOpenFootballTime(
      source.time,
      source.date,
    );
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing kickoff mapping for ${missing.length} matches: ${missing
        .slice(0, 5)
        .map((match) => match.matchNumber)
        .join(", ")}`,
    );
  }

  return kickoffs;
}

async function main() {
  const fixtures = loadCupcampsFixtures();
  const slugForName = buildNameToSlug();
  const openFootballMatches = await loadOpenFootballMatches();
  const lookup = buildKickoffLookup(openFootballMatches, slugForName);
  const kickoffs = mapKickoffs(fixtures, lookup, slugForName);

  const output = {
    source: OPENFOOTBALL_URL,
    generatedAt: new Date().toISOString(),
    kickoffs,
  };

  writeFileSync(
    join(ROOT, "data/match-kickoffs.json"),
    `${JSON.stringify(output, null, 2)}\n`,
  );

  console.log(`Wrote ${Object.keys(kickoffs).length} kickoffs to data/match-kickoffs.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
