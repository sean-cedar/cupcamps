import Link from "next/link";
import { HostNationStripe } from "@/components/brand/HostNationStripe";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { EspnScoreTicker } from "@/components/layout/EspnScoreTicker";
import { MobileNav } from "@/components/layout/MobileNav";
import { StickySiteChrome } from "@/components/layout/StickySiteChrome";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navLinks = [
  { href: "/countries", label: "Countries" },
  { href: "/groups", label: "Groups" },
  { href: "/schedule", label: "Schedule" },
  { href: "/host-cities", label: "Cities" },
  { href: "/map", label: "Map" },
  { href: "/bracket", label: "Bracket" },
];

export function Header() {
  return (
    <StickySiteChrome>
      <header className="border-b border-card-border bg-background/98 backdrop-blur-sm">
        <HostNationStripe height={2} />
        <div className="site-shell-inline mx-auto flex max-w-7xl items-center justify-between gap-4 py-2.5 sm:px-6">
          <Link href="/" className="min-w-0 shrink">
            <SiteLogo />
          </Link>
          <nav
            className="hidden shrink-0 items-center gap-1 lg:flex"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative px-3 py-1.5 font-display text-sm font-bold uppercase tracking-[0.1em] text-cream transition hover:text-gold-light"
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
          <MobileNav />
        </div>
      </header>
      <EspnScoreTicker />
    </StickySiteChrome>
  );
}
