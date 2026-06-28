"use client";

import { useId } from "react";

type Wc26MarkProps = {
  className?: string;
  variant?: "gold" | "white";
  size?: number;
};

/**
 * Compact modular "26" inspired by the WC26 emblem grid.
 * Optimized for small sizes (header, favicon).
 */
export function Wc26Mark({
  className = "",
  variant = "gold",
  size = 40,
}: Wc26MarkProps) {
  const gradientId = useId();
  const fill = variant === "white" ? "#ffffff" : `url(#${gradientId})`;

  return (
    <svg
      viewBox="0 0 56 28"
      width={size}
      height={(size * 28) / 56}
      className={className}
      aria-hidden="true"
    >
      {variant === "gold" && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4bc82" />
            <stop offset="55%" stopColor="#b5985a" />
            <stop offset="100%" stopColor="#8a7344" />
          </linearGradient>
        </defs>
      )}

      {/* 2 — left stem + top bar + curve foot */}
      <rect x="0" y="0" width="7" height="7" fill={fill} />
      <rect x="0" y="8" width="7" height="7" fill={fill} />
      <rect x="0" y="16" width="7" height="7" fill={fill} />
      <rect x="8" y="0" width="7" height="7" fill={fill} />
      <rect x="8" y="8" width="7" height="7" fill={fill} />
      <path d="M8 21 H15 V28 H8 Z" fill={fill} />
      <path d="M15 21 A7 7 0 0 1 15 28 H8" fill={fill} />

      {/* 6 — block grid + bowl */}
      <rect x="32" y="0" width="7" height="7" fill={fill} />
      <rect x="40" y="0" width="7" height="7" fill={fill} />
      <rect x="32" y="8" width="7" height="7" fill={fill} />
      <rect x="40" y="8" width="7" height="7" fill={fill} />
      <rect x="32" y="16" width="7" height="7" fill={fill} />
      <path
        d="M39 23 A8 8 0 1 1 55 23 A8 8 0 0 1 39 23 Z"
        fill={fill}
      />
    </svg>
  );
}
