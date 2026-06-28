/**
 * Curated FIFA World Cup 26™ kit specs for simplified SVG rendering.
 * Sources: official manufacturer releases, Goal.com kit guide, Footy Headlines.
 *
 * Run: node scripts/build-wc26-kits.mjs
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

function home(shirt, shorts) {
  return { id: "home", label: "Home", shirt, shorts };
}

function away(shirt, shorts) {
  return { id: "away", label: "Away", shirt, shorts };
}

function set(...variants) {
  return { variants };
}

/** @type {Record<string, { variants: unknown[] }>} */
const WC26_KITS = {
  algeria: set(
    home(
      {
        pattern: "horizontal-stripes",
        primary: "#E8DCC8",
        secondary: "#FFFFFF",
        accent: "#006233",
        collar: "#006233",
        sleeves: "#006233",
      },
      { primary: "#006233", accent: "#E8DCC8", pattern: "solid" },
    ),
    away(
      {
        pattern: "vertical-stripes",
        primary: "#004D2E",
        secondary: "#006233",
        accent: "#006233",
        collar: "#006233",
      },
      { primary: "#004D2E", accent: "#006233", pattern: "solid" },
    ),
  ),
  argentina: set(
    home(
      {
        pattern: "tricolor-vertical",
        primary: "#6CACE4",
        secondary: "#FFFFFF",
        accent: "#003E7E",
        collar: "#003E7E",
      },
      { primary: "#000000", accent: "#6CACE4", pattern: "solid" },
    ),
    away(
      {
        pattern: "split-diagonal",
        primary: "#111111",
        secondary: "#2E6DB4",
        accent: "#FFFFFF",
        collar: "#FFFFFF",
        sleeves: "#111111",
      },
      { primary: "#111111", accent: "#2E6DB4", pattern: "solid" },
    ),
  ),
  australia: set(
    home(
      {
        pattern: "solid",
        primary: "#FFCD00",
        accent: "#00843D",
        collar: "#00843D",
        sleeves: "#00843D",
      },
      { primary: "#00843D", accent: "#FFCD00", pattern: "solid" },
    ),
    away(
      {
        pattern: "split-diagonal",
        primary: "#FF6B5A",
        secondary: "#0B4F3F",
        accent: "#FFFFFF",
        collar: "#0B4F3F",
      },
      { primary: "#0B4F3F", accent: "#FF6B5A", pattern: "solid" },
    ),
  ),
  austria: set(
    home(
      {
        pattern: "solid",
        primary: "#E30613",
        accent: "#FFFFFF",
        collar: "#FFFFFF",
        sleeves: "#111111",
      },
      { primary: "#111111", accent: "#E30613", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#F5F7F0",
        secondary: "#A8C4A0",
        accent: "#E30613",
        collar: "#A8C4A0",
        sleeves: "#F5F7F0",
      },
      { primary: "#F5F7F0", accent: "#A8C4A0", pattern: "solid" },
    ),
  ),
  belgium: set(
    home(
      {
        pattern: "side-panels",
        primary: "#EF3340",
        secondary: "#000000",
        accent: "#FDDA24",
        collar: "#000000",
        sleeves: "#000000",
      },
      { primary: "#FDDA24", accent: "#EF3340", pattern: "solid" },
    ),
    away(
      {
        pattern: "small-checker",
        primary: "#D8E8F5",
        secondary: "#F5C6D8",
        accent: "#EF3340",
        collar: "#EF3340",
        sleeves: "#FFFFFF",
      },
      { primary: "#FFFFFF", accent: "#EF3340", pattern: "solid" },
    ),
  ),
  "bosnia-and-herzegovina": set(
    home(
      {
        pattern: "vertical-pinstripes",
        primary: "#002395",
        secondary: "#FFCC00",
        accent: "#FFCC00",
        collar: "#FFCC00",
        sleeves: "#002395",
      },
      { primary: "#002395", accent: "#FFCC00", pattern: "solid" },
    ),
    away(
      {
        pattern: "vertical-pinstripes",
        primary: "#FFFFFF",
        secondary: "#002395",
        accent: "#FFCC00",
        collar: "#002395",
        sleeves: "#002395",
      },
      { primary: "#002395", accent: "#FFCC00", pattern: "solid" },
    ),
  ),
  brazil: set(
    home(
      {
        pattern: "shoulder-yoke",
        primary: "#FFDF00",
        accent: "#009C3B",
        collar: "#009C3B",
        sleeves: "#009C3B",
      },
      { primary: "#009C3B", accent: "#FFDF00", pattern: "solid" },
    ),
    away(
      {
        pattern: "small-checker",
        primary: "#041E42",
        secondary: "#FFDF00",
        accent: "#009C3B",
        collar: "#009C3B",
        sleeves: "#041E42",
      },
      { primary: "#041E42", accent: "#009C3B", pattern: "solid" },
    ),
  ),
  "cabo-verde": set(
    home(
      {
        pattern: "solid",
        primary: "#003893",
        accent: "#FFFFFF",
        collar: "#CF2027",
        sleeves: "#003893",
      },
      { primary: "#CF2027", accent: "#003893", pattern: "solid" },
    ),
    away(
      {
        pattern: "solid",
        primary: "#FFFFFF",
        accent: "#003893",
        collar: "#003893",
        sleeves: "#FFFFFF",
      },
      { primary: "#FFFFFF", accent: "#003893", pattern: "solid" },
    ),
  ),
  canada: set(
    home(
      {
        pattern: "central-band",
        primary: "#FF0000",
        secondary: "#FFFFFF",
        accent: "#FF0000",
        collar: "#FFFFFF",
        sleeves: "#FF0000",
      },
      { primary: "#FFFFFF", accent: "#FF0000", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#1A1A2E",
        secondary: "#4A6FA5",
        accent: "#FF0000",
        collar: "#4A6FA5",
        sleeves: "#1A1A2E",
      },
      { primary: "#1A1A2E", accent: "#FF0000", pattern: "solid" },
    ),
  ),
  colombia: set(
    home(
      {
        pattern: "central-band",
        primary: "#FCD116",
        secondary: "#003893",
        accent: "#CE1126",
        collar: "#003893",
      },
      { primary: "#003893", accent: "#FCD116", pattern: "solid" },
    ),
    away(
      {
        pattern: "vertical-stripes",
        primary: "#0A2A5E",
        secondary: "#1E4F91",
        accent: "#FCD116",
        collar: "#FCD116",
      },
      { primary: "#0A2A5E", accent: "#FCD116", pattern: "solid" },
    ),
  ),
  "congo-dr": set(
    home(
      {
        pattern: "small-checker",
        primary: "#6EC6F5",
        secondary: "#4FA3D9",
        accent: "#C8102E",
        collar: "#C8102E",
        sleeves: "#6EC6F5",
      },
      { primary: "#6EC6F5", accent: "#C8102E", pattern: "solid" },
    ),
    away(
      {
        pattern: "split-diagonal",
        primary: "#FFFFFF",
        secondary: "#4FA3D9",
        accent: "#C8102E",
        collar: "#C8102E",
      },
      { primary: "#FFFFFF", accent: "#4FA3D9", pattern: "solid" },
    ),
  ),
  croatia: set(
    home(
      {
        pattern: "small-checker",
        primary: "#FFFFFF",
        secondary: "#E4002B",
        accent: "#0047AB",
        collar: "#0047AB",
      },
      { primary: "#0047AB", accent: "#E4002B", pattern: "solid" },
    ),
    away(
      {
        pattern: "small-checker",
        primary: "#001A57",
        secondary: "#003087",
        accent: "#E4002B",
        collar: "#E4002B",
      },
      { primary: "#001A57", accent: "#E4002B", pattern: "solid" },
    ),
  ),
  curacao: set(
    home(
      {
        pattern: "side-panels",
        primary: "#002B7F",
        secondary: "#4DA6FF",
        accent: "#F9E814",
        collar: "#F9E814",
        sleeves: "#4DA6FF",
      },
      { primary: "#F9E814", accent: "#002B7F", pattern: "solid" },
    ),
    away(
      {
        pattern: "tricolor-vertical",
        primary: "#FFF4B8",
        secondary: "#FF6FA8",
        accent: "#2EC4C6",
        collar: "#002B7F",
      },
      { primary: "#FFF4B8", accent: "#002B7F", pattern: "solid" },
    ),
  ),
  czechia: set(
    home(
      {
        pattern: "side-panels",
        primary: "#D7141A",
        secondary: "#11457E",
        accent: "#FFFFFF",
        collar: "#11457E",
        sleeves: "#11457E",
      },
      { primary: "#11457E", accent: "#D7141A", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#FFFFFF",
        secondary: "#C8C8C8",
        accent: "#C9A227",
        collar: "#C9A227",
        sleeves: "#FFFFFF",
      },
      { primary: "#FFFFFF", accent: "#C9A227", pattern: "solid" },
    ),
  ),
  ecuador: set(
    home(
      {
        pattern: "solid",
        primary: "#FCD116",
        accent: "#003893",
        collar: "#003893",
        sleeves: "#003893",
      },
      { primary: "#003893", accent: "#FCD116", pattern: "solid" },
    ),
    away(
      {
        pattern: "solid",
        primary: "#001A57",
        accent: "#B87333",
        collar: "#B87333",
        sleeves: "#001A57",
      },
      { primary: "#001A57", accent: "#B87333", pattern: "solid" },
    ),
  ),
  egypt: set(
    home(
      {
        pattern: "shoulder-yoke",
        primary: "#C8102E",
        secondary: "#7A0015",
        accent: "#C9A227",
        collar: "#111111",
        sleeves: "#111111",
      },
      { primary: "#111111", accent: "#C9A227", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#F5F5F0",
        secondary: "#D8D2C4",
        accent: "#006233",
        collar: "#006233",
        sleeves: "#F5F5F0",
      },
      { primary: "#F5F5F0", accent: "#006233", pattern: "solid" },
    ),
  ),
  england: set(
    home(
      {
        pattern: "solid",
        primary: "#FFFFFF",
        accent: "#041E42",
        collar: "#041E42",
        sleeves: "#041E42",
      },
      { primary: "#041E42", accent: "#FFFFFF", pattern: "solid" },
    ),
    away(
      {
        pattern: "solid",
        primary: "#E31837",
        accent: "#041E42",
        collar: "#041E42",
        sleeves: "#E31837",
      },
      { primary: "#041E42", accent: "#FFFFFF", pattern: "solid" },
    ),
  ),
  france: set(
    home(
      {
        pattern: "solid",
        primary: "#0055A4",
        accent: "#B87333",
        collar: "#FFFFFF",
        sleeves: "#0055A4",
      },
      { primary: "#FFFFFF", accent: "#0055A4", pattern: "solid" },
    ),
    away(
      {
        pattern: "solid",
        primary: "#98D4C2",
        accent: "#B87333",
        collar: "#FFFFFF",
        sleeves: "#0055A4",
      },
      { primary: "#98D4C2", accent: "#B87333", pattern: "solid" },
    ),
  ),
  germany: set(
    home(
      {
        pattern: "shoulder-yoke",
        primary: "#FFFFFF",
        accent: "#000000",
        secondary: "#DD0000",
        collar: "#000000",
        sleeves: "#FFFFFF",
      },
      { primary: "#000000", accent: "#FFFFFF", pattern: "solid" },
    ),
    away(
      {
        pattern: "split-diagonal",
        primary: "#0B1F3A",
        secondary: "#1E4F91",
        accent: "#00A3E0",
        collar: "#00A3E0",
      },
      { primary: "#0B1F3A", accent: "#00A3E0", pattern: "solid" },
    ),
  ),
  ghana: set(
    home(
      {
        pattern: "side-panels",
        primary: "#FFFFFF",
        secondary: "#EF3340",
        accent: "#009639",
        collar: "#009639",
        sleeves: "#FCD116",
      },
      { primary: "#009639", accent: "#FCD116", pattern: "solid" },
    ),
    away(
      {
        pattern: "small-checker",
        primary: "#D4AF37",
        secondary: "#B8941F",
        accent: "#EF3340",
        collar: "#EF3340",
      },
      { primary: "#D4AF37", accent: "#EF3340", pattern: "solid" },
    ),
  ),
  haiti: set(
    home(
      {
        pattern: "solid",
        primary: "#0033A0",
        accent: "#D21034",
        collar: "#D21034",
        sleeves: "#0033A0",
      },
      { primary: "#0033A0", accent: "#D21034", pattern: "solid" },
    ),
    away(
      {
        pattern: "solid",
        primary: "#FFFFFF",
        accent: "#D21034",
        collar: "#D21034",
        sleeves: "#FFFFFF",
      },
      { primary: "#FFFFFF", accent: "#D21034", pattern: "solid" },
    ),
  ),
  iran: set(
    home(
      {
        pattern: "solid",
        primary: "#FFFFFF",
        accent: "#239F40",
        collar: "#239F40",
        sleeves: "#FFFFFF",
      },
      { primary: "#239F40", accent: "#FFFFFF", pattern: "solid" },
    ),
    away(
      {
        pattern: "solid",
        primary: "#C8102E",
        accent: "#239F40",
        collar: "#239F40",
        sleeves: "#C8102E",
      },
      { primary: "#C8102E", accent: "#239F40", pattern: "solid" },
    ),
  ),
  iraq: set(
    home(
      {
        pattern: "topographic",
        primary: "#FFFFFF",
        secondary: "#D8D8D8",
        accent: "#007A3D",
        collar: "#007A3D",
        sleeves: "#FFFFFF",
      },
      { primary: "#FFFFFF", accent: "#007A3D", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#007A3D",
        secondary: "#005A2D",
        accent: "#FFFFFF",
        collar: "#FFFFFF",
        sleeves: "#007A3D",
      },
      { primary: "#007A3D", accent: "#FFFFFF", pattern: "solid" },
    ),
  ),
  "ivory-coast": set(
    home(
      {
        pattern: "side-panels",
        primary: "#FF8200",
        secondary: "#009639",
        accent: "#FFFFFF",
        collar: "#009639",
      },
      { primary: "#009639", accent: "#FF8200", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#FFFFFF",
        secondary: "#E8E0D0",
        accent: "#FF8200",
        collar: "#009639",
        sleeves: "#FFFFFF",
      },
      { primary: "#FFFFFF", accent: "#FF8200", pattern: "solid" },
    ),
  ),
  japan: set(
    home(
      {
        pattern: "topographic",
        primary: "#004C99",
        secondary: "#6B9AC4",
        accent: "#BC002D",
        collar: "#BC002D",
      },
      { primary: "#004C99", accent: "#BC002D", pattern: "solid" },
    ),
    away(
      {
        pattern: "tricolor-vertical",
        primary: "#F5F0E6",
        secondary: "#BC002D",
        accent: "#004C99",
        collar: "#BC002D",
      },
      { primary: "#F5F0E6", accent: "#BC002D", pattern: "solid" },
    ),
  ),
  jordan: set(
    home(
      {
        pattern: "central-band",
        primary: "#007A3D",
        secondary: "#FFFFFF",
        accent: "#000000",
        collar: "#000000",
      },
      { primary: "#007A3D", accent: "#000000", pattern: "solid" },
    ),
    away(
      {
        pattern: "solid",
        primary: "#FFFFFF",
        accent: "#007A3D",
        collar: "#007A3D",
        sleeves: "#FFFFFF",
      },
      { primary: "#FFFFFF", accent: "#007A3D", pattern: "solid" },
    ),
  ),
  "korea-republic": set(
    home(
      {
        pattern: "small-checker",
        primary: "#FFFFFF",
        secondary: "#C8C8C8",
        accent: "#C8102E",
        collar: "#C8102E",
      },
      { primary: "#FFFFFF", accent: "#C8102E", pattern: "solid" },
    ),
    away(
      {
        pattern: "solid",
        primary: "#5B2C83",
        accent: "#C8102E",
        collar: "#C8102E",
        sleeves: "#5B2C83",
      },
      { primary: "#5B2C83", accent: "#C8102E", pattern: "solid" },
    ),
  ),
  mexico: set(
    home(
      {
        pattern: "solid",
        primary: "#006847",
        accent: "#FFFFFF",
        collar: "#CE1126",
        sleeves: "#006847",
      },
      { primary: "#006847", accent: "#CE1126", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#FFFFFF",
        secondary: "#B8B8B8",
        accent: "#006847",
        collar: "#006847",
        sleeves: "#FFFFFF",
      },
      { primary: "#FFFFFF", accent: "#006847", pattern: "solid" },
    ),
  ),
  morocco: set(
    home(
      {
        pattern: "solid",
        primary: "#C1272D",
        accent: "#006233",
        collar: "#006233",
        sleeves: "#C1272D",
      },
      { primary: "#006233", accent: "#C1272D", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#FFFFFF",
        secondary: "#D8D8D8",
        accent: "#C1272D",
        collar: "#006233",
        sleeves: "#FFFFFF",
      },
      { primary: "#FFFFFF", accent: "#C1272D", pattern: "solid" },
    ),
  ),
  netherlands: set(
    home(
      {
        pattern: "solid",
        primary: "#FF6600",
        accent: "#041E42",
        collar: "#041E42",
        sleeves: "#FF6600",
      },
      { primary: "#041E42", accent: "#FF6600", pattern: "solid" },
    ),
    away(
      {
        pattern: "horizontal-fade",
        primary: "#FFFFFF",
        secondary: "#FF6600",
        accent: "#041E42",
        collar: "#041E42",
        sleeves: "#FFFFFF",
      },
      { primary: "#FFFFFF", accent: "#FF6600", pattern: "solid" },
    ),
  ),
  "new-zealand": set(
    home(
      {
        pattern: "topographic",
        primary: "#111111",
        secondary: "#333333",
        accent: "#C0C0C0",
        collar: "#C0C0C0",
        sleeves: "#111111",
      },
      { primary: "#111111", accent: "#C0C0C0", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#B8D4E8",
        secondary: "#8FB8D4",
        accent: "#111111",
        collar: "#111111",
        sleeves: "#B8D4E8",
      },
      { primary: "#B8D4E8", accent: "#111111", pattern: "solid" },
    ),
  ),
  norway: set(
    home(
      {
        pattern: "nordic-cross",
        primary: "#BA0C2F",
        secondary: "#FFFFFF",
        accent: "#00205B",
        collar: "#00205B",
        sleeves: "#BA0C2F",
      },
      { primary: "#00205B", accent: "#FFFFFF", pattern: "solid" },
    ),
    away(
      {
        pattern: "solid",
        primary: "#111111",
        accent: "#BA0C2F",
        collar: "#BA0C2F",
        sleeves: "#111111",
      },
      { primary: "#111111", accent: "#BA0C2F", pattern: "solid" },
    ),
  ),
  panama: set(
    home(
      {
        pattern: "topographic",
        primary: "#C8102E",
        secondary: "#9A0C24",
        accent: "#005EB8",
        collar: "#005EB8",
        sleeves: "#C8102E",
      },
      { primary: "#005EB8", accent: "#C8102E", pattern: "solid" },
    ),
    away(
      {
        pattern: "solid",
        primary: "#FFFFFF",
        accent: "#C9A227",
        collar: "#C9A227",
        sleeves: "#FFFFFF",
      },
      { primary: "#FFFFFF", accent: "#C9A227", pattern: "solid" },
    ),
  ),
  paraguay: set(
    home(
      {
        pattern: "vertical-stripes",
        primary: "#FFFFFF",
        secondary: "#D52B1E",
        accent: "#0038A8",
        collar: "#0038A8",
      },
      { primary: "#0038A8", accent: "#D52B1E", pattern: "solid" },
    ),
    away(
      {
        pattern: "small-checker",
        primary: "#111111",
        secondary: "#0D4F4F",
        accent: "#009C3B",
        collar: "#009C3B",
      },
      { primary: "#111111", accent: "#009C3B", pattern: "solid" },
    ),
  ),
  portugal: set(
    home(
      {
        pattern: "shoulder-yoke",
        primary: "#C8102E",
        secondary: "#006233",
        accent: "#C9A227",
        collar: "#006233",
        sleeves: "#C8102E",
      },
      { primary: "#006233", accent: "#C9A227", pattern: "solid" },
    ),
    away(
      {
        pattern: "side-panels",
        primary: "#FFFFFF",
        secondary: "#008080",
        accent: "#C8102E",
        collar: "#008080",
      },
      { primary: "#FFFFFF", accent: "#008080", pattern: "solid" },
    ),
  ),
  qatar: set(
    home(
      {
        pattern: "central-stripe",
        primary: "#8A1538",
        secondary: "#6B0F2A",
        accent: "#FFFFFF",
        collar: "#FFFFFF",
      },
      { primary: "#8A1538", accent: "#FFFFFF", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#E8E8E8",
        secondary: "#B8B8B8",
        accent: "#8A1538",
        collar: "#8A1538",
        sleeves: "#E8E8E8",
      },
      { primary: "#E8E8E8", accent: "#8A1538", pattern: "solid" },
    ),
  ),
  "saudi-arabia": set(
    home(
      {
        pattern: "small-checker",
        primary: "#006C35",
        secondary: "#4A148C",
        accent: "#FFFFFF",
        collar: "#FFFFFF",
      },
      { primary: "#006C35", accent: "#FFFFFF", pattern: "solid" },
    ),
    away(
      {
        pattern: "solid",
        primary: "#F5F5F0",
        accent: "#C9A227",
        collar: "#006C35",
        sleeves: "#F5F5F0",
      },
      { primary: "#F5F5F0", accent: "#C9A227", pattern: "solid" },
    ),
  ),
  scotland: set(
    home(
      {
        pattern: "nordic-cross",
        primary: "#003DA5",
        secondary: "#002A75",
        accent: "#FFFFFF",
        collar: "#FFFFFF",
      },
      { primary: "#003DA5", accent: "#FFFFFF", pattern: "solid" },
    ),
    away(
      {
        pattern: "vertical-pinstripes",
        primary: "#C8102E",
        secondary: "#6B2D5C",
        accent: "#006233",
        collar: "#006233",
      },
      { primary: "#C8102E", accent: "#006233", pattern: "solid" },
    ),
  ),
  senegal: set(
    home(
      {
        pattern: "topographic",
        primary: "#FFFFFF",
        secondary: "#D8D8D8",
        accent: "#00853F",
        collar: "#00853F",
        sleeves: "#FFFFFF",
      },
      { primary: "#00853F", accent: "#FDEF42", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#006B5A",
        secondary: "#004D40",
        accent: "#FDEF42",
        collar: "#E31B23",
      },
      { primary: "#006B5A", accent: "#FDEF42", pattern: "solid" },
    ),
  ),
  "south-africa": set(
    home(
      {
        pattern: "solid",
        primary: "#FFB612",
        accent: "#007A4D",
        collar: "#007A4D",
        sleeves: "#FFB612",
      },
      { primary: "#007A4D", accent: "#FFB612", pattern: "solid" },
    ),
    away(
      {
        pattern: "solid",
        primary: "#007A4D",
        accent: "#FFB612",
        collar: "#FFFFFF",
        sleeves: "#007A4D",
      },
      { primary: "#007A4D", accent: "#FFB612", pattern: "solid" },
    ),
  ),
  spain: set(
    home(
      {
        pattern: "vertical-pinstripes",
        primary: "#C60B1E",
        secondary: "#FCD116",
        accent: "#FCD116",
        collar: "#041E42",
      },
      { primary: "#041E42", accent: "#FCD116", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#F5F0E6",
        secondary: "#C9A227",
        accent: "#6B0F1A",
        collar: "#6B0F1A",
        sleeves: "#F5F0E6",
      },
      { primary: "#F5F0E6", accent: "#6B0F1A", pattern: "solid" },
    ),
  ),
  sweden: set(
    home(
      {
        pattern: "topographic",
        primary: "#FECC00",
        secondary: "#005293",
        accent: "#005293",
        collar: "#005293",
      },
      { primary: "#005293", accent: "#FECC00", pattern: "solid" },
    ),
    away(
      {
        pattern: "tricolor-vertical",
        primary: "#004B87",
        secondary: "#1E6BB8",
        accent: "#6B9AC4",
        collar: "#FECC00",
      },
      { primary: "#004B87", accent: "#FECC00", pattern: "solid" },
    ),
  ),
  switzerland: set(
    home(
      {
        pattern: "chest-stripe",
        primary: "#C8102E",
        secondary: "#FFFFFF",
        accent: "#FFFFFF",
        collar: "#FFFFFF",
      },
      { primary: "#FFFFFF", accent: "#C8102E", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#B8E986",
        secondary: "#8BC34A",
        accent: "#111111",
        collar: "#111111",
        sleeves: "#B8E986",
      },
      { primary: "#B8E986", accent: "#111111", pattern: "solid" },
    ),
  ),
  tunisia: set(
    home(
      {
        pattern: "shoulder-yoke",
        primary: "#FFFFFF",
        accent: "#C8102E",
        collar: "#C8102E",
        sleeves: "#FFFFFF",
      },
      { primary: "#C8102E", accent: "#FFFFFF", pattern: "solid" },
    ),
    away(
      {
        pattern: "shoulder-yoke",
        primary: "#C8102E",
        accent: "#FFFFFF",
        collar: "#FFFFFF",
        sleeves: "#C8102E",
      },
      { primary: "#C8102E", accent: "#FFFFFF", pattern: "solid" },
    ),
  ),
  turkiye: set(
    home(
      {
        pattern: "central-band",
        primary: "#E30A17",
        secondary: "#FFFFFF",
        accent: "#FFFFFF",
        collar: "#FFFFFF",
      },
      { primary: "#FFFFFF", accent: "#E30A17", pattern: "solid" },
    ),
    away(
      {
        pattern: "central-band",
        primary: "#FFFFFF",
        secondary: "#E30A17",
        accent: "#E30A17",
        collar: "#E30A17",
        sleeves: "#FFFFFF",
      },
      { primary: "#E30A17", accent: "#FFFFFF", pattern: "solid" },
    ),
  ),
  "united-states": set(
    home(
      {
        pattern: "vertical-stripes",
        primary: "#FFFFFF",
        secondary: "#BF0A30",
        accent: "#002868",
        collar: "#002868",
      },
      { primary: "#002868", accent: "#BF0A30", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#1B2838",
        secondary: "#2C3E50",
        accent: "#FFFFFF",
        collar: "#FFFFFF",
        sleeves: "#1B2838",
      },
      { primary: "#1B2838", accent: "#FFFFFF", pattern: "solid" },
    ),
  ),
  uruguay: set(
    home(
      {
        pattern: "solid",
        primary: "#65BDE0",
        accent: "#003DA5",
        collar: "#003DA5",
        sleeves: "#65BDE0",
      },
      { primary: "#003DA5", accent: "#65BDE0", pattern: "solid" },
    ),
    away(
      {
        pattern: "chest-stripe",
        primary: "#FFFFFF",
        secondary: "#003DA5",
        accent: "#65BDE0",
        collar: "#003DA5",
      },
      { primary: "#003DA5", accent: "#65BDE0", pattern: "solid" },
    ),
  ),
  uzbekistan: set(
    home(
      {
        pattern: "topographic",
        primary: "#0099B5",
        secondary: "#007A94",
        accent: "#FFFFFF",
        collar: "#FFFFFF",
      },
      { primary: "#0099B5", accent: "#FFFFFF", pattern: "solid" },
    ),
    away(
      {
        pattern: "topographic",
        primary: "#FFFFFF",
        secondary: "#D8D8D8",
        accent: "#0099B5",
        collar: "#0099B5",
        sleeves: "#FFFFFF",
      },
      { primary: "#FFFFFF", accent: "#0099B5", pattern: "solid" },
    ),
  ),
};

const EXPECTED = 48;
const slugs = Object.keys(WC26_KITS).sort();
if (slugs.length !== EXPECTED) {
  console.error(`Expected ${EXPECTED} teams, got ${slugs.length}`);
  process.exit(1);
}

const outputPath = join(__dirname, "..", "data", "team-kits.json");
writeFileSync(outputPath, `${JSON.stringify(WC26_KITS, null, 2)}\n`);
console.log(`Wrote ${slugs.length} team kit sets to ${outputPath}`);
