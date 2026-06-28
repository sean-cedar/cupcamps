"use client";

import { useEffect, useRef } from "react";

type StickySiteChromeProps = {
  children: React.ReactNode;
};

export function StickySiteChrome({ children }: StickySiteChromeProps) {
  const chromeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = chromeRef.current;
    if (!element) {
      return;
    }

    const syncChromeHeight = () => {
      const height = element.getBoundingClientRect().height;
      document.documentElement.style.setProperty(
        "--site-chrome-height",
        `${height}px`,
      );
    };

    syncChromeHeight();

    const observer = new ResizeObserver(syncChromeHeight);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={chromeRef}
      id="site-sticky-chrome"
      className="sticky top-0 z-[1100]"
    >
      {children}
    </div>
  );
}
