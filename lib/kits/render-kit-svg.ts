import type { TeamKit } from "@/lib/kits/types";
import {
  kitBodyFill,
  kitColors,
  kitOverlayElements,
  kitPatternDef,
} from "@/lib/kits/kit-svg-parts";

/** Static SVG markup for kits (map popups, markers, etc.). */
export function renderTeamKitSvg(
  kit: TeamKit,
  options: { id: string; width: number; title?: string },
): string {
  const { id, width, title } = options;
  const height = Math.round(width * 1.15);
  const { collar, sleeves } = kitColors(kit);
  const fill = kitBodyFill(kit, id);
  const pattern = kitPatternDef(kit, id) ?? "";
  const overlays = kitOverlayElements(kit)
    .map((element) => {
      const attrs = Object.entries(element.props)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");
      return `<${element.type} ${attrs}/>`;
    })
    .join("");

  return `<svg viewBox="0 0 32 36" width="${width}" height="${height}" aria-hidden="${title ? "false" : "true"}" role="${title ? "img" : "presentation"}" style="display:inline-block;vertical-align:middle;filter:drop-shadow(0 1px 1px rgba(0,0,0,.15))">${title ? `<title>${title}</title>` : ""}<defs>${pattern}<clipPath id="${id}-shirt"><path d="M8 9 L11 9 L12.5 6 L14.5 6 L16 9 L24 9 L24 33 L8 33 Z"/></clipPath></defs><path d="M4 10 L8 9 L8 14 L4 16 Z" fill="${sleeves}" stroke="#00000022" stroke-width="0.5"/><path d="M24 9 L28 10 L28 16 L24 14 Z" fill="${sleeves}" stroke="#00000022" stroke-width="0.5"/><g clip-path="url(#${id}-shirt)"><rect x="6" y="5" width="20" height="30" fill="${fill}"/>${overlays}</g><path d="M11 9 Q16 12.5 21 9" fill="none" stroke="${collar}" stroke-width="1.6" stroke-linecap="round"/><path d="M8 9 L11 9 L12.5 6 L14.5 6 L16 9 L24 9 L24 33 L8 33 Z M4 10 L8 9 L8 14 L4 16 Z M24 9 L28 10 L28 16 L24 14 Z" fill="none" stroke="#00000033" stroke-width="0.75" stroke-linejoin="round"/></svg>`;
}
