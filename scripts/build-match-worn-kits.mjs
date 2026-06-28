/**
 * Builds explicit FIFA World Cup 26™ group-stage worn kit catalog.
 *
 * Primary source: FIFA FWC2026 Match Colours Designation (inside.fifa.com, 3 Jun 2026)
 * Cross-checked against:
 * - Khel Now unused group-stage kit matrix (22 Jun 2026)
 * - Bolavip match-day uniform articles (Jun 2026)
 * - Footy Headlines FIFA designation summary (5 Jun 2026)
 *
 * Run: node scripts/build-match-worn-kits.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const FIFA_SOURCE =
  "FIFA FWC2026 Match Colours Designation (inside.fifa.com, 3 Jun 2026)";

/** Group-stage fixtures: matchNumber, home slug, away slug */
const GROUP_FIXTURES = [
  [1, "mexico", "south-africa"],
  [2, "korea-republic", "czechia"],
  [25, "czechia", "south-africa"],
  [26, "mexico", "korea-republic"],
  [49, "south-africa", "korea-republic"],
  [50, "czechia", "mexico"],
  [3, "canada", "bosnia-and-herzegovina"],
  [4, "qatar", "switzerland"],
  [27, "switzerland", "bosnia-and-herzegovina"],
  [28, "canada", "qatar"],
  [51, "switzerland", "canada"],
  [52, "bosnia-and-herzegovina", "qatar"],
  [5, "haiti", "scotland"],
  [6, "brazil", "morocco"],
  [29, "brazil", "haiti"],
  [30, "scotland", "morocco"],
  [53, "scotland", "brazil"],
  [54, "morocco", "haiti"],
  [7, "united-states", "paraguay"],
  [8, "australia", "turkiye"],
  [31, "turkiye", "paraguay"],
  [32, "united-states", "australia"],
  [55, "turkiye", "united-states"],
  [56, "paraguay", "australia"],
  [9, "ivory-coast", "ecuador"],
  [10, "germany", "curacao"],
  [33, "germany", "ivory-coast"],
  [34, "ecuador", "curacao"],
  [57, "curacao", "ivory-coast"],
  [58, "ecuador", "germany"],
  [11, "netherlands", "japan"],
  [12, "sweden", "tunisia"],
  [35, "netherlands", "sweden"],
  [36, "tunisia", "japan"],
  [59, "japan", "sweden"],
  [60, "tunisia", "netherlands"],
  [13, "iran", "new-zealand"],
  [14, "belgium", "egypt"],
  [37, "egypt", "iran"],
  [38, "new-zealand", "belgium"],
  [61, "egypt", "new-zealand"],
  [62, "iran", "belgium"],
  [15, "saudi-arabia", "uruguay"],
  [16, "spain", "cabo-verde"],
  [39, "uruguay", "cabo-verde"],
  [40, "spain", "saudi-arabia"],
  [63, "cabo-verde", "saudi-arabia"],
  [64, "uruguay", "spain"],
  [17, "france", "senegal"],
  [18, "iraq", "norway"],
  [41, "norway", "senegal"],
  [42, "france", "iraq"],
  [65, "norway", "france"],
  [66, "senegal", "iraq"],
  [19, "argentina", "algeria"],
  [20, "austria", "jordan"],
  [43, "argentina", "austria"],
  [44, "jordan", "algeria"],
  [67, "algeria", "austria"],
  [68, "jordan", "argentina"],
  [21, "portugal", "congo-dr"],
  [22, "uzbekistan", "colombia"],
  [45, "portugal", "uzbekistan"],
  [46, "colombia", "congo-dr"],
  [69, "colombia", "portugal"],
  [70, "congo-dr", "uzbekistan"],
  [23, "ghana", "panama"],
  [24, "england", "croatia"],
  [47, "england", "ghana"],
  [48, "panama", "croatia"],
  [71, "panama", "england"],
  [72, "croatia", "ghana"],
];

/** Teams that always wear a specific variant regardless of home/away role. */
const ALWAYS_HOME_VARIANT = new Set(["ghana"]);
const ALWAYS_AWAY_VARIANT = new Set(["uzbekistan"]);

/**
 * Khel Now / BBC audit: away kits not worn in the group stage.
 * When away, these teams wear their home variant instead.
 */
const AWAY_KIT_UNUSED = new Set([
  "south-africa",
  "australia",
  "austria",
  "belgium",
  "ivory-coast",
  "congo-dr",
  "curacao",
  "iran",
  "iraq",
  "japan",
  "netherlands",
  "portugal",
  "senegal",
]);

/**
 * Per-match overrides for FIFA coordination exceptions.
 * Applied after automatic designation rules.
 */
const TEAM_KIT_OVERRIDES = {
  "2": { czechia: "away" },
  "4": { qatar: "home", switzerland: "away" },
  "16": { "cabo-verde": "away" },
  "17": { senegal: "home" },
  "18": { norway: "away" },
  "20": { jordan: "away" },
  "23": { panama: "home" },
  "39": { "cabo-verde": "home" },
  "48": { panama: "away" },
  "41": { norway: "away", senegal: "home" },
  "53": { brazil: "home", scotland: "home" },
  "58": { ecuador: "home" },
  "65": { france: "away" },
  "66": { senegal: "home" },
  "68": { jordan: "away", argentina: "away" },
  "71": { panama: "third" },
};

/**
 * Match-day outfit patches keyed by team slug.
 * Use when FIFA assigns a variant but with different shorts/shirt pieces.
 */
const OUTFIT_PATCHES = {
  "41": {
    senegal: {
      shorts: { primary: "#FFFFFF", accent: "#00853F", pattern: "solid" },
    },
  },
  "43": {
    argentina: {
      shorts: { primary: "#003E7E", accent: "#6CACE4", pattern: "solid" },
    },
    austria: {
      shorts: { primary: "#FFFFFF", accent: "#E30613", pattern: "solid" },
    },
  },
  "53": {
    brazil: {
      shorts: { primary: "#FFFFFF", accent: "#009C3B", pattern: "solid" },
    },
  },
  "65": {
    france: {
      shirt: {
        primary: "#7FD4C8",
        secondary: "#FFFFFF",
        accent: "#E30613",
      },
    },
  },
  "66": {
    senegal: {
      shorts: { primary: "#FFFFFF", accent: "#00853F", pattern: "solid" },
    },
  },
};

/** Extra source citations for played matches with photo/article verification. */
const MATCH_SOURCE_NOTES = {
  "6": "Footy Headlines FIFA designation · Brazil yellow/blue vs Morocco",
  "14":
    "Bolavip Belgium vs Egypt debut kit assignment (Jun 2026)",
  "16":
    "Ministry of Sport · Cabo Verde all-white debut vs Spain",
  "17":
    "FIFA designation · Khel Now audit (Senegal home kit in Group I)",
  "18":
    "FIFA match centre · Iraq vs Norway kit confirmation",
  "41":
    "Bolavip Matchday 2 Norway vs Senegal kit confirmation (22 Jun 2026)",
  "43":
    "Bolavip Matchday 2 Argentina vs Austria kit confirmation (22 Jun 2026)",
  "53":
    "Footy Headlines FIFA designation · Brazil white shorts vs Scotland (24 Jun 2026)",
  "58":
    "Bolavip Ecuador vs Germany kit assignment (Jun 2026)",
  "65":
    "The Mirror France mint away vs Norway home (27 Jun 2026)",
  "66":
    "FIFA designation · Senegal white shorts vs Iraq",
  "68":
    "Bolavip · Footy Headlines Argentina away vs Jordan (27 Jun 2026)",
  "71":
    "Footy Headlines · Panama three-kit rotation (Group L MD3)",
  "72":
    "Khel Now audit · Footy Headlines referee kit note (Croatia vs Ghana)",
};

const CURATED_PHOTO_URLS = {
  "6": "https://www.outlookindia.com/sports/football/brazil-vs-morocco-fifa-world-cup-2026",
  "14":
    "https://bolavip.com/en/world-cup/lineups-uniforms-and-referee-for-belgium-vs-egypt-in-2026-world-cup-debut",
  "16":
    "https://www.fifa.com/en/match-centre/match/17/285023/289273/400021488",
  "17":
    "https://www.fifa.com/en/match-centre/match/17/285023/289273/400021490",
  "18":
    "https://www.fifa.com/en/match-centre/match/17/285023/289273/400021492",
  "41":
    "https://www.outlookindia.com/sports/football/norway-vs-senegal-fifa-world-cup-2026-group-i-nor-vs-sen-new-york-new-jersey-stadium-in-pics",
  "43":
    "https://bolavip.com/en/world-cup/the-uniforms-argentina-and-austria-are-wearing-today-for-2026-world-cup-matchday-2",
  "53":
    "https://www.footyheadlines.com/2026/06/all-71-2026-world-cup-group-stage-kit.html",
  "58":
    "https://bolavip.com/en/world-cup/who-is-the-referee-for-ecuador-vs-germany-and-what-uniforms-are-they-wearing-today-at-2026-world-cup",
  "65":
    "https://www.footyheadlines.com/2026/06/all-71-2026-world-cup-group-stage-kit.html",
  "68":
    "https://bolavip.com/en/world-cup/the-uniforms-argentina-and-jordan-are-wearing-today-for-2026-world-cup-matchday-3",
  "72":
    "https://www.footyheadlines.com/2481096030/panama-wear-three-kits-at-2026-world-cup.html",
};

function defaultVariant(teamSlug, role) {
  if (ALWAYS_HOME_VARIANT.has(teamSlug)) {
    return "home";
  }

  if (ALWAYS_AWAY_VARIANT.has(teamSlug)) {
    return "away";
  }

  if (role === "home") {
    return "home";
  }

  if (AWAY_KIT_UNUSED.has(teamSlug)) {
    return "home";
  }

  return "away";
}

function resolveMatchKits(matchNumber, homeSlug, awaySlug) {
  const overrides = TEAM_KIT_OVERRIDES[String(matchNumber)] ?? {};

  return {
    [homeSlug]: overrides[homeSlug] ?? defaultVariant(homeSlug, "home"),
    [awaySlug]: overrides[awaySlug] ?? defaultVariant(awaySlug, "away"),
  };
}

function matchPhotoUrl(matchNumber, homeSlug, awaySlug) {
  const curated = CURATED_PHOTO_URLS[String(matchNumber)];
  if (curated) {
    return curated;
  }

  const label = `${homeSlug} vs ${awaySlug} FIFA World Cup 2026 match photos`;
  return `https://www.fifa.com/fifaplus/en/search?q=${encodeURIComponent(label)}`;
}

function buildKitSpec(matchNumber, teamSlug, variant) {
  const patch = OUTFIT_PATCHES[String(matchNumber)]?.[teamSlug];
  if (!patch) {
    return variant;
  }

  return {
    variant,
    ...patch,
  };
}

function buildSource(matchNumber) {
  const notes = MATCH_SOURCE_NOTES[String(matchNumber)];
  if (!notes) {
    return FIFA_SOURCE;
  }

  return `${FIFA_SOURCE} · ${notes}`;
}

function buildEntry(matchNumber, homeSlug, awaySlug) {
  const kitVariants = resolveMatchKits(matchNumber, homeSlug, awaySlug);

  return {
    source: buildSource(matchNumber),
    photoUrl: matchPhotoUrl(matchNumber, homeSlug, awaySlug),
    kits: {
      [homeSlug]: buildKitSpec(matchNumber, homeSlug, kitVariants[homeSlug]),
      [awaySlug]: buildKitSpec(matchNumber, awaySlug, kitVariants[awaySlug]),
    },
  };
}

const catalog = Object.fromEntries(
  GROUP_FIXTURES.map(([matchNumber, homeSlug, awaySlug]) => [
    String(matchNumber),
    buildEntry(matchNumber, homeSlug, awaySlug),
  ]),
);

if (Object.keys(catalog).length !== 72) {
  console.error(`Expected 72 group fixtures, got ${Object.keys(catalog).length}`);
  process.exit(1);
}

const outputPath = join(__dirname, "..", "data", "match-worn-kits.json");
writeFileSync(outputPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Wrote ${Object.keys(catalog).length} match worn kit entries to ${outputPath}`);
