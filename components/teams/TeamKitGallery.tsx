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
        <div className="border-b border-card-border px-4 py-3 sm:px-5">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
            Tournament kits
          </p>
          <p className="mt-1 text-xs text-muted">Home and away designs for World Cup 26™</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-card-border">
          {variants.map((variant) => (
            <figure
              key={variant.id}
              className="flex flex-col items-center px-3 py-5 sm:px-4 sm:py-6"
            >
              <div className="flex min-h-[5.5rem] items-end justify-center sm:min-h-[6.5rem]">
                <TeamKit
                  outfit={{ shirt: variant.shirt, shorts: variant.shorts }}
                  size="2xl"
                  title={`${teamName} ${variant.label.toLowerCase()} kit`}
                  framed={false}
                />
              </div>
              <figcaption className="mt-4 text-center">
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
    <div className="grid gap-3 sm:grid-cols-2">
      {variants.map((variant) => (
        <figure
          key={variant.id}
          className="wc26-panel flex flex-col items-center px-4 py-5"
        >
          <TeamKit
            outfit={{ shirt: variant.shirt, shorts: variant.shorts }}
            size="xl"
            title={`${teamName} ${variant.label.toLowerCase()} kit`}
            framed={false}
          />
          <figcaption className="mt-4 font-display text-xs font-bold uppercase tracking-[0.14em] text-cream">
            {variant.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
