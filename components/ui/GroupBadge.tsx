type GroupBadgeProps = {
  group: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-12 w-12 text-lg",
};

export function GroupBadge({ group, size = "md" }: GroupBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center border border-gold/40 bg-gold/10 font-display tracking-wider text-gold ${sizeClasses[size]}`}
      aria-label={`Group ${group}`}
    >
      {group}
    </span>
  );
}
