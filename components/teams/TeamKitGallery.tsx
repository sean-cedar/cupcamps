import type { KitVariant } from "@/lib/kits/types";
import { TeamKit } from "@/components/ui/TeamKit";

type TeamKitGalleryProps = {
  teamName: string;
  variants: KitVariant[];
};

export function TeamKitGallery({ teamName, variants }: TeamKitGalleryProps) {
  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {variants.map((variant) => (
        <figure
          key={variant.id}
          className="wc26-panel flex min-w-[7rem] flex-col items-center p-4"
        >
          <TeamKit
            outfit={{ shirt: variant.shirt, shorts: variant.shorts }}
            size="lg"
            title={`${teamName} ${variant.label.toLowerCase()} kit`}
          />
          <figcaption className="mt-3 font-display text-xs font-bold uppercase tracking-[0.14em] text-cream">
            {variant.label}
          </figcaption>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">
            Shirt &amp; shorts
          </p>
        </figure>
      ))}
    </div>
  );
}
