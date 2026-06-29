"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navLinks = [
  { href: "/countries", label: "Countries" },
  { href: "/champions", label: "Champions" },
  { href: "/groups", label: "Groups" },
  { href: "/schedule", label: "Schedule" },
  { href: "/host-cities", label: "Cities" },
  { href: "/map", label: "Map" },
  { href: "/bracket", label: "Bracket" },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav() {
  const pathname = usePathname();
  const panelId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const menuPanel =
    open && mounted ? (
      <div
        className="fixed inset-x-0 bottom-0 z-[1200] flex flex-col"
        style={{ top: "var(--site-chrome-height, 5.5rem)" }}
      >
        <nav
          id={panelId}
          className="animate-panel-enter relative z-[1201] shrink-0 overflow-y-auto border-b border-card-border bg-background/98 px-4 py-4 shadow-lg backdrop-blur-sm site-shell-inline"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const active = isActivePath(pathname, link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`interaction-press ui-focus-ring flex min-h-11 items-center rounded px-3 font-display text-sm font-bold uppercase tracking-[0.12em] transition ${
                      active
                        ? "bg-gold/15 text-gold-light"
                        : "text-cream hover:bg-card/60 hover:text-gold-light"
                    }`}
                    data-haptic="light"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 border-t border-card-border pt-4">
            <p className="mb-3 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              Theme
            </p>
            <ThemeToggle layout="menu" />
          </div>
        </nav>
        <button
          type="button"
          className="animate-overlay-enter min-h-0 flex-1 bg-black/50"
          aria-label="Dismiss menu overlay"
          data-haptic="light"
          onClick={() => setOpen(false)}
        />
      </div>
    ) : null;

  return (
    <div className="lg:hidden">
      <button
        ref={menuButtonRef}
        type="button"
        className="touch-target interaction-press ui-focus-ring inline-flex items-center justify-center rounded border border-card-border bg-card/60 text-cream transition hover:border-gold/40 hover:text-gold-light"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        data-haptic="light"
        onClick={() => {
          setOpen((current) => {
            const next = !current;
            if (next) {
              const chrome = document.getElementById("site-sticky-chrome");
              if (chrome) {
                document.documentElement.style.setProperty(
                  "--site-chrome-height",
                  `${chrome.getBoundingClientRect().height}px`,
                );
              }
              window.scrollTo({ top: 0, behavior: "auto" });
            }
            return next;
          });
        }}
      >
        {open ? (
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {menuPanel ? createPortal(menuPanel, document.body) : null}
    </div>
  );
}
