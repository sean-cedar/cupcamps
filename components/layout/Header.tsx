import Link from "next/link";
import { HostNationStripe } from "@/components/brand/HostNationStripe";
import { TournamentLockup } from "@/components/brand/TournamentLockup";

const navLinks = [
  { href: "/teams", label: "Teams" },
  { href: "/host-cities", label: "Host Cities" },
  { href: "/map", label: "Map" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-[1100] border-b border-card-border bg-background backdrop-blur-md">
      <HostNationStripe height={3} />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <TournamentLockup subtitle="CupCamps · Base Camps" size="sm" />
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative px-3 py-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-cream transition hover:text-gold-light"
            >
              {link.label}
              <span className="absolute bottom-0 left-3 right-3 h-0.5 scale-x-0 bg-gold transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
