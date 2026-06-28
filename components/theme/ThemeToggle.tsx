"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ThemeChoice = "system" | "light" | "dark";

const CYCLE: ThemeChoice[] = ["system", "light", "dark"];

function normalizeTheme(theme: string | undefined): ThemeChoice {
  if (theme === "light" || theme === "dark") {
    return theme;
  }
  return "system";
}

function nextTheme(current: ThemeChoice): ThemeChoice {
  const index = CYCLE.indexOf(current);
  return CYCLE[(index + 1) % CYCLE.length];
}

function themeLabel(theme: ThemeChoice): string {
  if (theme === "light") {
    return "Light mode";
  }
  if (theme === "dark") {
    return "Dark mode";
  }
  return "Auto theme";
}

type ThemeToggleProps = {
  layout?: "compact" | "menu";
};

export function ThemeToggle({ layout = "compact" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMenu = layout === "menu";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className={`inline-flex rounded border border-card-border bg-card/60 ${
          isMenu ? "h-11 w-11" : "ml-1 h-8 w-8"
        }`}
        aria-hidden
      />
    );
  }

  const active = normalizeTheme(theme);

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme(active))}
      className={`inline-flex cursor-pointer items-center justify-center rounded border border-card-border bg-card/60 text-cream transition hover:border-gold/40 hover:text-gold-light ${
        isMenu ? "h-11 w-11" : "ml-1 h-8 w-8"
      }`}
      aria-label={`Theme: ${themeLabel(active)}. Click to change.`}
      title={themeLabel(active)}
    >
      {active === "light" ? (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : active === "dark" ? (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      )}
    </button>
  );
}
