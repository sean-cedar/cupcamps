import Link from "next/link";

type GroupBadgeProps = {
  group: string;
  size?: "sm" | "md" | "lg";
  /** When set, the badge links to the group page. */
  href?: string;
};

const sizeClasses = {
  sm: "h-7 min-w-7 px-1.5 text-xs",
  md: "h-9 min-w-9 px-2 text-sm",
  lg: "h-14 min-w-14 px-3 text-xl",
};

const baseClassName =
  "group-badge inline-flex items-center justify-center border border-gold/60 bg-gold/15 font-display font-black tracking-wider text-gold-light";

export function GroupBadge({ group, size = "md", href }: GroupBadgeProps) {
  const className = `${baseClassName} ${sizeClasses[size]}`;

  if (href) {
    return (
      <Link
        href={href}
        className={`${className} transition hover:border-gold hover:bg-gold/25`}
        aria-label={`View Group ${group}`}
        title={`Group ${group}`}
      >
        {group}
      </Link>
    );
  }

  return (
    <span className={className} aria-label={`Group ${group}`}>
      {group}
    </span>
  );
}

export function groupPageHref(group: string): string {
  return `/groups/${group.toLowerCase()}`;
}
