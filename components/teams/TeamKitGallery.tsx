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

  return (
    <div
      className={
        isHero
          ? "flex shrink-0 flex-wrap items-end justify-start gap-3 lg:justify-end"
          : "flex flex-wrap gap-4"
      }
    >
      {variants.map((variant) => (
        <figure
          key={variant.id}
          className={
            isHero
              ? "flex flex-col items-center"
              : "wc26-panel flex min-w-[7rem] flex-col items-center p-4"
          }
        >
          <KitPhotoLink
            href={variant.photoUrl!}
            label={`${teamName} ${variant.label.toLowerCase()}`}
            className="flex flex-col items-center text-center"
            showPhotoHint={!isHero}
          >
            <TeamKit
              outfit={{ shirt: variant.shirt, shorts: variant.shorts }}
              size={isHero ? "md" : "lg"}
              title={`${teamName} ${variant.label.toLowerCase()} kit`}
            />
            <figcaption
              className={`font-display font-bold uppercase tracking-[0.14em] text-cream ${
                isHero
                  ? "mt-2 text-[10px] tracking-[0.12em] text-muted"
                  : "mt-3 text-xs"
              }`}
            >
              {variant.label}
            </figcaption>
          </KitPhotoLink>
        </figure>
      ))}
    </div>
  );
}
