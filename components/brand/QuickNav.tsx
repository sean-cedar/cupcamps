import Link from "next/link";

const items = [
  {
    href: "/teams",
    value: "48",
    label: "Teams",
    hint: "Every nation & TBC",
  },
  {
    href: "/map",
    value: "48",
    label: "Map",
    hint: "All training sites",
  },
  {
    href: "/host-cities",
    value: "16",
    label: "Cities",
    hint: "Host venues",
  },
];

export function QuickNav() {
  return (
    <nav
      className="grid grid-cols-3 gap-2 sm:gap-3"
      aria-label="Quick navigation"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="wc26-panel group flex flex-col px-3 py-3 transition hover:border-gold/40 sm:px-4 sm:py-4"
        >
          <span className="font-display text-2xl font-black leading-none text-gold sm:text-3xl">
            {item.value}
          </span>
          <span className="mt-1 font-display text-sm font-bold uppercase tracking-[0.08em] text-cream group-hover:text-gold-light">
            {item.label}
          </span>
          <span className="mt-0.5 hidden text-xs text-muted sm:block">
            {item.hint}
          </span>
        </Link>
      ))}
    </nav>
  );
}
