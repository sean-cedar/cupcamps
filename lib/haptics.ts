export type HapticPattern = "light" | "medium" | "selection" | "confirm";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 16,
  selection: [10, 40, 10],
  confirm: [12, 70, 14],
};

export function parseHapticPattern(value: string | null): HapticPattern {
  if (value === "medium" || value === "selection" || value === "confirm") {
    return value;
  }
  return "light";
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function prefersCoarsePointer(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(pointer: coarse)").matches;
}

/** Short vibration for touch devices; no-op on desktop or when reduced motion is on. */
export function triggerHaptic(pattern: HapticPattern = "light"): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) {
    return;
  }
  if (prefersReducedMotion() || !prefersCoarsePointer()) {
    return;
  }

  try {
    navigator.vibrate(PATTERNS[pattern]);
  } catch {
    // Vibration blocked or unsupported.
  }
}
