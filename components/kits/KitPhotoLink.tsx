import type { ReactNode } from "react";

type KitPhotoLinkProps = {
  href: string;
  label: string;
  children: ReactNode;
  className?: string;
  showPhotoHint?: boolean;
};

export function KitPhotoLink({
  href,
  label,
  children,
  className = "",
  showPhotoHint = true,
}: KitPhotoLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block cursor-pointer transition hover:text-gold-light ${className}`}
      aria-label={`View official ${label} World Cup 2026 kit photo`}
    >
      {children}
      {showPhotoHint && (
        <span className="mt-2 block font-display text-[10px] font-bold uppercase tracking-[0.12em] text-muted transition group-hover:text-gold">
          Official kit photo →
        </span>
      )}
    </a>
  );
}
