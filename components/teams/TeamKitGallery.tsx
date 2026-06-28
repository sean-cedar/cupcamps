import Link from "next/link";
import { TeamKit } from "@/components/ui/TeamKit";
import { getFirstMatchForKitVariant } from "@/lib/kits/match-kits";
import type { KitVariant } from "@/lib/kits/types";

type TeamKitGalleryProps = {
  teamSlug: string;
  teamName: string;
  variants: KitVariant[];
  layout?: "gallery" | "hero";
};

type KitGalleryCardProps = {
  teamSlug: string;
  teamName: string;
  variant: KitVariant;
  size: "xl" | "2xl";
  showSublabel?: boolean;
};

function KitGalleryCard({
  teamSlug,
  teamName,
  variant,
  size,
  showSublabel = false,
}: KitGalleryCardProps) {
  const matchNumber = getFirstMatchForKitVariant(teamSlug, variant.id);
  const href = matchNumber
    ? `/matches/${matchNumber}`
    : (variant.photoUrl ?? null);
  const isExternal = !matchNumber && Boolean(variant.photoUrl);
  const label = `${teamName} ${variant.label.toLowerCase()} kit`;
  const sublabel =
    variant.id === "home"
      ? "Primary"
      : variant.id === "away"
        ? "Alternate"
        : "Third";

  const content = (
    <>
      <TeamKit
        outfit={{ shirt: variant.shirt, shorts: variant.shorts }}
        size={size}
        title={label}
        framed={false}
      />
      <figcaption className={showSublabel ? "text-center" : undefined}>
        <p className="kit-gallery-label font-display text-xs font-bold uppercase tracking-[0.14em]">
          {variant.label}
        </p>
        {showSublabel && (
          <p className="kit-gallery-sublabel mt-1 text-[10px] uppercase tracking-wider">
            {sublabel}
          </p>
        )}
      </figcaption>
    </>
  );

  const className =
    "kit-gallery-cell kit-gallery-cell--link transition hover:border-gold/40 hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--gold)_35%,transparent)]";

  if (!href) {
    return <figure className="kit-gallery-cell">{content}</figure>;
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={`${label} photos`}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      aria-label={`${label} worn in match ${matchNumber}`}
    >
      {content}
    </Link>
  );
}

export function TeamKitGallery({
  teamSlug,
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
            <KitGalleryCard
              key={variant.id}
              teamSlug={teamSlug}
              teamName={teamName}
              variant={variant}
              size="2xl"
              showSublabel
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {variants.map((variant) => (
        <KitGalleryCard
          key={variant.id}
          teamSlug={teamSlug}
          teamName={teamName}
          variant={variant}
          size="xl"
        />
      ))}
    </div>
  );
}
