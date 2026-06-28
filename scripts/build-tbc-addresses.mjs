#!/usr/bin/env node
/**
 * Geocode FIFA TBC training sites via OpenStreetMap Nominatim and write
 * street addresses + coordinates back into data/teams.json.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const teamsPath = join(__dirname, "../data/teams.json");
const USER_AGENT = "cupcamps-tbc-geocoder/1.0 (https://github.com/sean-cedar/cupcamps)";

const COUNTRY_NAMES = {
  USA: "United States",
  Mexico: "Mexico",
  Canada: "Canada",
};

const MANUAL_OVERRIDES = {
  algeria: "1100 S Kansas Ave, Lawrence, KS 66044, USA",
  argentina: "1600 Sporting Way, Kansas City, KS 66111, USA",
  australia: "3900 San Pablo Ave, Oakland, CA 94608, USA",
  austria: "Harder Stadium, UC Santa Barbara, Goleta, CA 93117, USA",
  belgium: "7500 212th Ave SE, Renton, WA 98059, USA",
  "bosnia-and-herzegovina": "9256 S State St, Sandy, UT 84070, USA",
  brazil: "1 Ducks Dr, Harrison, NJ 07029, USA",
  "cabo-verde": "5802 N 30th St, Tampa, FL 33610, USA",
  canada: "375 Water St, Vancouver, BC V6B 5C6, Canada",
  colombia: "Av. Circunvalación Agustín Yáñez 600, Guadalajara, Jalisco 44690, Mexico",
  "congo-dr": "1000 Houston Ave, Houston, TX 77007, USA",
  "ivory-coast": "501 Chester Pike, Chester, PA 19013, USA",
  croatia: "1200 N Quaker Ln, Alexandria, VA 22302, USA",
  curacao: "777 Glades Rd, Boca Raton, FL 33431, USA",
  czechia: "1500 N US Hwy 287, Mansfield, TX 76063, USA",
  ecuador: "5700 Columbus Crew Way, Columbus, OH 43228, USA",
  england: "6310 Lewis Rd, Kansas City, MO 64132, USA",
  egypt: "502 E Boone Ave, Spokane, WA 99258, USA",
  france: "175 Forest St, Waltham, MA 02452, USA",
  germany: "1834 Wake Forest Rd, Winston-Salem, NC 27106, USA",
  ghana: "1150 Douglas Pike, Smithfield, RI 02917, USA",
  haiti: "101 Vera King Farris Dr, Galloway, NJ 08205, USA",
  iran: "Blvd. Agua Caliente 4558, Tijuana, Baja California 22014, Mexico",
  iraq: "101 Main St W, White Sulphur Springs, WV 24986, USA",
  japan: "501 Benton Ave, Nashville, TN 37203, USA",
  jordan: "5000 N Willamette Blvd, Portland, OR 97203, USA",
  "korea-republic": "Av. Patria 1201, Zapopan, Jalisco 45116, Mexico",
  mexico: "Calz. de Tlalpan 3097, Coapa, Ciudad de México 14000, Mexico",
  morocco: "131 Upper Mountain Ave, Basking Ridge, NJ 07920, USA",
  netherlands: "1600 Sporting Way, Kansas City, KS 66111, USA",
  "new-zealand": "5998 Alcala Park Way, San Diego, CA 92110, USA",
  norway: "1400 Spring Garden St, Greensboro, NC 27412, USA",
  panama: "5000 County Rd 12, Alliston, ON L9R 1V1, Canada",
  paraguay: "500 El Camino Real, Santa Clara, CA 95053, USA",
  portugal: "11000 Northlake Blvd, Palm Beach Gardens, FL 33412, USA",
  qatar: "955 La Paz Rd, Santa Barbara, CA 93108, USA",
  "saudi-arabia": "10414 McKalla Place, Austin, TX 78753, USA",
  scotland: "19177 Interstate 485 Access Rd, Charlotte, NC 28262, USA",
  senegal: "600 Bartholomew Rd, Piscataway, NJ 08854, USA",
  "south-africa": "Carretera Pachuca-Tulancingo Km 20, Ex-Hacienda El Copal, Pachuca, Hidalgo 42184, Mexico",
  spain: "171 Baylor School Rd, Chattanooga, TN 37405, USA",
  sweden: "9200 World Cup Way, Frisco, TX 75034, USA",
  switzerland: "11860 Carmel Creek Rd, San Diego, CA 92130, USA",
  tunisia: "Av. Manuel J. Clouthier 100, San Pedro Garza García, Nuevo León 66270, Mexico",
  turkiye: "6321 S Ellsworth Rd, Mesa, AZ 85212, USA",
  "united-states": "8000 Great Park Blvd, Irvine, CA 92618, USA",
  uruguay: "Carretera Federal Cancún-Playa del Carmen Km 298, Solidaridad, Quintana Roo 77710, Mexico",
  uzbekistan: "600 Barret Pkwy NW, Marietta, GA 30060, USA",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatAddress(address) {
  if (!address) {
    return null;
  }

  const line1 = [address.house_number, address.road].filter(Boolean).join(" ");
  const locality =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.suburb;
  const region = address.state || address.province || address.region;
  const postal = address.postcode;
  const country = address.country;

  const cityLine = [locality, region, postal].filter(Boolean).join(", ");
  const parts = [line1, cityLine, country].filter(Boolean);

  return parts.join(", ").replace(/\s+,/g, ",") || null;
}

async function geocode(query) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`Nominatim failed (${response.status})`);
  }

  const results = await response.json();
  const hit = results[0];
  if (!hit) {
    return null;
  }

  return {
    address: formatAddress(hit.address) ?? hit.display_name,
    lat: Number(hit.lat),
    lng: Number(hit.lon),
  };
}

async function resolveTeam(team) {
  const manual = MANUAL_OVERRIDES[team.slug];
  if (manual) {
    const query = manual;
    const geocoded = await geocode(query);
    return {
      address: manual,
      coordinates: geocoded
        ? { lat: geocoded.lat, lng: geocoded.lng }
        : team.tbc.coordinates,
      source: "manual+geocode",
    };
  }

  const countryName = COUNTRY_NAMES[team.tbc.country] ?? team.tbc.country;
  const query = `${team.tbc.trainingSite}, ${team.tbc.city}, ${team.tbc.region}, ${countryName}`;
  const geocoded = await geocode(query);

  if (!geocoded) {
    return {
      address: `${team.tbc.trainingSite}, ${team.tbc.city}, ${team.tbc.region}, ${team.tbc.country}`,
      coordinates: team.tbc.coordinates,
      source: "fallback",
    };
  }

  return {
    address: geocoded.address,
    coordinates: { lat: geocoded.lat, lng: geocoded.lng },
    source: "nominatim",
  };
}

async function main() {
  const teams = JSON.parse(readFileSync(teamsPath, "utf8"));

  for (const team of teams) {
    const resolved = await resolveTeam(team);
    team.tbc.address = resolved.address;
    team.tbc.coordinates = resolved.coordinates;
    console.log(`${team.slug}: ${resolved.address}`);
    await sleep(1100);
  }

  writeFileSync(teamsPath, `${JSON.stringify(teams, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
