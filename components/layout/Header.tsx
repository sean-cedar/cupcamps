import Link from "next/link";
import { HostNationStripe } from "@/components/brand/HostNationStripe";
import { SiteLogo } from "@/components/brand/SiteLogo";

const navLinks = [
  { href: "/teams", label: "Teams" },
  { href: "/host-cities", label: "Cities" },
  { href: "/map", label: "Map" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-[1100] border-b border-card-border bg-background/98 backdrop-blur-sm">
      <HostNationStripe height={2} />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <Link href="/" className="min-w-0 shrink">
          <SiteLogo markSize={30} />
        </Link>
        <nav className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative px-2.5 py-1.5 font-display text-xs font-bold uppercase tracking-[0.1em] text-cream transition hover:text-gold-light sm:px-3 sm:text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
