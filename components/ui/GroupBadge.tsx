type GroupBadgeProps = {
  group: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-7 min-w-7 px-1.5 text-xs",
  md: "h-9 min-w-9 px-2 text-sm",
  lg: "h-14 min-w-14 px-3 text-xl",
};

export function GroupBadge({ group, size = "md" }: GroupBadgeProps) {
  return (
    <span
      className={`group-badge inline-flex items-center justify-center border border-gold/60 bg-gold/15 font-display font-black tracking-wider text-gold-light ${sizeClasses[size]}`}
      aria-label={`Group ${group}`}
    >
      {group}
    </span>
  );
}
