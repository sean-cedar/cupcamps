import { KitPhotoLink } from "@/components/kits/KitPhotoLink";
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
      <div className="wc26-panel shrink-0 px-5 py-4 sm:px-6 sm:py-5">
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
          World Cup kits
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-center gap-5 sm:gap-6 lg:justify-end">
          {variants.map((variant, index) => (
            <div key={variant.id} className="flex items-end gap-5 sm:gap-6">
              {index > 0 && (
                <div
                  className="hidden h-[4.5rem] w-px shrink-0 bg-card-border sm:block"
                  aria-hidden
                />
              )}
              <figure className="flex flex-col items-center">
                <KitPhotoLink
                  href={variant.photoUrl!}
                  label={`${teamName} ${variant.label.toLowerCase()}`}
                  className="flex flex-col items-center text-center"
                  showPhotoHint={false}
                >
                  <TeamKit
                    outfit={{ shirt: variant.shirt, shorts: variant.shorts }}
                    size="2xl"
                    title={`${teamName} ${variant.label.toLowerCase()} kit`}
                    className="transition group-hover:scale-[1.03]"
                  />
                  <figcaption className="mt-3 font-display text-xs font-bold uppercase tracking-[0.14em] text-cream">
                    {variant.label}
                  </figcaption>
                  <span className="mt-1 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-muted transition group-hover:text-gold">
                    Kit photo →
                  </span>
                </KitPhotoLink>
              </figure>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {variants.map((variant) => (
        <figure
          key={variant.id}
          className="wc26-panel flex min-w-[7rem] flex-col items-center p-4"
        >
          <KitPhotoLink
            href={variant.photoUrl!}
            label={`${teamName} ${variant.label.toLowerCase()}`}
            className="flex flex-col items-center text-center"
          >
            <TeamKit
              outfit={{ shirt: variant.shirt, shorts: variant.shorts }}
              size="lg"
              title={`${teamName} ${variant.label.toLowerCase()} kit`}
            />
            <figcaption className="mt-3 font-display text-xs font-bold uppercase tracking-[0.14em] text-cream">
              {variant.label}
            </figcaption>
          </KitPhotoLink>
        </figure>
      ))}
    </div>
  );
}
