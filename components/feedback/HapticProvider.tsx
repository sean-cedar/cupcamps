"use client";

import { parseHapticPattern, triggerHaptic } from "@/lib/haptics";
import { useEffect } from "react";

type HapticProviderProps = {
  children: React.ReactNode;
};

export function HapticProvider({ children }: HapticProviderProps) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest("[data-haptic]");
      if (!target || target.closest("[data-haptic-off]")) {
        return;
      }

      triggerHaptic(parseHapticPattern(target.getAttribute("data-haptic")));
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return children;
}
