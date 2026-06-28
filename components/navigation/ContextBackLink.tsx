import Link from "next/link";
import { resolveBackLink } from "@/lib/navigation/country-links";

type ContextBackLinkProps = {
  from?: string;
  fallbackHref: string;
  fallbackLabel: string;
};

export function ContextBackLink({
  from,
  fallbackHref,
  fallbackLabel,
}: ContextBackLinkProps) {
  const back = resolveBackLink(from);

  return (
    <Link
      href={back?.href ?? fallbackHref}
      className="font-display text-xs font-bold uppercase tracking-[0.15em] text-muted transition hover:text-gold-light"
    >
      {back?.label ?? fallbackLabel}
    </Link>
  );
}
