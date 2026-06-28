"use client";

import { useTheme } from "next-themes";
import { useEffect, useId, useRef, useState } from "react";

type ThemeChoice = "system" | "light" | "dark";

const OPTIONS: { value: ThemeChoice; label: string; hint: string }[] = [
  { value: "system", label: "Auto", hint: "Match device" },
  { value: "light", label: "Light", hint: "Light background" },
  { value: "dark", label: "Dark", hint: "Dark background" },
];

function normalizeTheme(theme: string | undefined): ThemeChoice {
  if (theme === "light" || theme === "dark") {
    return theme;
  }
  return "system";
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

function ThemeIcon({ theme }: { theme: ThemeChoice }) {
  if (theme === "light") {
    return (
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
    );
  }

  if (theme === "dark") {
    return (
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
    );
  }

  return (
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
  );
}

type ThemeToggleProps = {
  layout?: "compact" | "menu";
};

export function ThemeToggle({ layout = "compact" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const isMenu = layout === "menu";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

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
    <div ref={rootRef} className={`relative ${isMenu ? "" : "ml-1"}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex cursor-pointer items-center justify-center rounded border border-card-border bg-card/60 text-cream transition hover:border-gold/40 hover:text-gold-light ${
          isMenu ? "h-11 w-11" : "h-8 w-8"
        }`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Theme: ${themeLabel(active)}. Choose theme.`}
        title={themeLabel(active)}
      >
        <ThemeIcon theme={active} />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Choose theme"
          className={`absolute z-[1200] min-w-[11rem] overflow-hidden rounded border border-card-border bg-background shadow-lg ${
            isMenu ? "right-0 top-full mt-2" : "right-0 top-full mt-2"
          }`}
        >
          <div className="border-b border-card-border px-3 py-2">
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              Theme
            </p>
          </div>
          <ul className="p-1">
            {OPTIONS.map((option) => {
              const selected = active === option.value;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={selected}
                    onClick={() => {
                      setTheme(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded px-3 py-2 text-left transition ${
                      selected
                        ? "bg-gold/15 text-gold-light"
                        : "text-cream hover:bg-card/60 hover:text-gold-light"
                    }`}
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded border border-card-border bg-card/40">
                      <ThemeIcon theme={option.value} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-xs font-bold uppercase tracking-[0.08em]">
                        {option.label}
                      </span>
                      <span className="block text-[10px] text-muted">{option.hint}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
