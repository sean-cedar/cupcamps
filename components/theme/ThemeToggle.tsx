"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";

type ThemeChoice = "system" | "light" | "dark";

const OPTIONS: Array<{
  value: ThemeChoice;
  label: string;
  title: string;
  icon: ReactNode;
}> = [
  {
    value: "system",
    label: "Auto",
    title: "Auto (system)",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    value: "light",
    label: "Light",
    title: "Light mode",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    title: "Dark mode",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
];

function normalizeTheme(theme: string | undefined): ThemeChoice {
  if (theme === "light" || theme === "dark") {
    return theme;
  }
  return "system";
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className="ml-1 inline-flex h-8 w-[5.75rem] rounded border border-card-border bg-card/60 sm:w-[7.5rem]"
        aria-hidden
      />
    );
  }

  const active = normalizeTheme(theme);

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="ml-1 inline-flex h-8 items-stretch rounded border border-card-border bg-card/60 p-0.5"
    >
      {OPTIONS.map((option) => {
        const isActive = active === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={`inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded px-1.5 font-display text-[10px] font-bold uppercase tracking-[0.08em] transition sm:px-2 ${
              isActive
                ? "bg-gold/15 text-gold-light"
                : "text-muted hover:text-cream"
            }`}
            aria-label={option.title}
            aria-pressed={isActive}
            title={option.title}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
