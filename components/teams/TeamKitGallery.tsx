import { TeamKit } from "@/components/ui/TeamKit";
import type { KitVariant } from "@/lib/kits/types";

type TeamKitGalleryProps = {
  teamName: string;
  variants: KitVariant[];
  layout?: "gallery" | "hero";
};

export function TeamKitGallery({
  teamName,
  variants,
  layout = "gallery",
}: TeamKitGalleryProps) {
  if (variants.length === 0) {
    return null;
  }

  const isHero = layout === "hero";

  if (isHero) {
    return (
      <div className="wc26-panel w-full shrink-0 overflow-hidden lg:max-w-md">
        <div className="border-b border-card-border px-5 py-4 sm:px-6">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
            Tournament kits
          </p>
          <p className="mt-1 text-xs text-muted">
            Home and away designs for World Cup 26™
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-5">
          {variants.map((variant) => (
            <figure key={variant.id} className="kit-gallery-cell">
              <TeamKit
                outfit={{ shirt: variant.shirt, shorts: variant.shorts }}
                size="2xl"
                title={`${teamName} ${variant.label.toLowerCase()} kit`}
                framed={false}
              />
              <figcaption className="text-center">
                <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-cream">
                  {variant.label}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">
                  {variant.id === "home" ? "Primary" : "Alternate"}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {variants.map((variant) => (
        <figure key={variant.id} className="kit-gallery-cell">
          <TeamKit
            outfit={{ shirt: variant.shirt, shorts: variant.shorts }}
            size="xl"
            title={`${teamName} ${variant.label.toLowerCase()} kit`}
            framed={false}
          />
          <figcaption className="font-display text-xs font-bold uppercase tracking-[0.14em] text-cream">
            {variant.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
