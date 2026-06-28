import type { ReactNode } from "react";

type KitPhotoLinkProps = {
  href: string;
  label: string;
  children: ReactNode;
  className?: string;
  showPhotoHint?: boolean;
  photoHintText?: string;
};

export function KitPhotoLink({
  href,
  label,
  children,
  className = "",
  showPhotoHint = true,
  photoHintText = "Official kit photo →",
}: KitPhotoLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group cursor-pointer transition hover:text-gold-light ${className}`}
      aria-label={`View ${label}`}
    >
      {children}
      {showPhotoHint && (
        <span className="mt-1 block font-display text-[10px] font-bold uppercase tracking-[0.12em] text-muted transition group-hover:text-gold">
          {photoHintText}
        </span>
      )}
    </a>
  );
}
