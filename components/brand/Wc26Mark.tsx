type Wc26MarkProps = {
  className?: string;
  variant?: "gold" | "white" | "multicolor";
  size?: number;
};

/**
 * Geometric "26" mark inspired by the FIFA World Cup 26™ modular emblem
 * (squares + quarter-circles representing 48 nations).
 */
export function Wc26Mark({
  className = "",
  variant = "gold",
  size = 48,
}: Wc26MarkProps) {
  const fill =
    variant === "white"
      ? "#ffffff"
      : variant === "multicolor"
        ? "url(#wc26-multicolor)"
        : "url(#wc26-gold)";

  return (
    <svg
      viewBox="0 0 120 80"
      width={size}
      height={(size * 80) / 120}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wc26-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4bc82" />
          <stop offset="50%" stopColor="#b5985a" />
          <stop offset="100%" stopColor="#8a7344" />
        </linearGradient>
        <linearGradient id="wc26-multicolor" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c8102e" />
          <stop offset="33%" stopColor="#006847" />
          <stop offset="66%" stopColor="#003087" />
          <stop offset="100%" stopColor="#b5985a" />
        </linearGradient>
      </defs>

      {/* "2" — modular blocks */}
      <rect x="4" y="8" width="18" height="18" fill={fill} />
      <rect x="4" y="30" width="18" height="18" fill={fill} />
      <rect x="4" y="52" width="18" height="18" fill={fill} />
      <rect x="26" y="8" width="18" height="18" fill={fill} />
      <path d="M44 52 A18 18 0 0 1 62 70 L44 70 Z" fill={fill} />
      <rect x="26" y="30" width="18" height="18" fill={fill} />

      {/* "6" — modular blocks + ball curve */}
      <rect x="68" y="8" width="18" height="18" fill={fill} />
      <rect x="90" y="8" width="18" height="18" fill={fill} />
      <rect x="68" y="30" width="18" height="18" fill={fill} />
      <rect x="90" y="30" width="18" height="18" fill={fill} />
      <rect x="68" y="52" width="18" height="18" fill={fill} />
      <path d="M90 52 A18 18 0 1 1 126 52 A18 18 0 0 1 90 52" fill={fill} />
      <rect x="90" y="52" width="18" height="18" fill={fill} />
    </svg>
  );
}
