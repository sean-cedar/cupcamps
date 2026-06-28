import Link from "next/link";

const navLinks = [
  { href: "/teams", label: "Teams" },
  { href: "/host-cities", label: "Host Cities" },
  { href: "/map", label: "Map" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-card-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center bg-gold font-display text-xl text-background">
            26
          </span>
          <div>
            <span className="font-display text-2xl tracking-wide text-cream group-hover:text-gold-light">
              CUPCAMPS
            </span>
            <p className="text-xs text-muted">World Cup 2026 Base Camps</p>
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm px-3 py-2 text-sm font-medium text-cream transition hover:bg-card hover:text-gold-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
