"use client";

import { useCallback, useEffect, useState } from "react";
import type { MatchHighlightsResponse } from "@/lib/highlights/types";

type MatchHighlightsPanelProps = {
  matchNumber: number;
  open: boolean;
};

export function MatchHighlightsPanel({
  matchNumber,
  open,
}: MatchHighlightsPanelProps) {
  const [data, setData] = useState<MatchHighlightsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHighlights = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/matches/${matchNumber}/highlights`);
      if (!response.ok) {
        throw new Error("Could not load highlights.");
      }
      const json = (await response.json()) as MatchHighlightsResponse;
      setData(json);
    } catch {
      setError("Could not load highlights.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [matchNumber]);

  useEffect(() => {
    if (!open || data) {
      return;
    }

    void loadHighlights();
  }, [open, data, loadHighlights]);

  if (!open) {
    return null;
  }

  return (
    <div className="border-t border-card-border bg-background/80 px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-xs font-bold uppercase tracking-[0.15em] text-gold">
          Match highlights
        </p>
        {data?.fallbackUrl && (
          <a
            href={data.fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-muted underline decoration-gold/40 underline-offset-2 hover:text-gold-light"
          >
            Watch on FIFA.com →
          </a>
        )}
      </div>

      {loading && (
        <div className="mt-4 space-y-3">
          <div className="highlight-skeleton aspect-video w-full max-w-2xl" />
          <p className="text-xs text-muted">Loading highlights…</p>
        </div>
      )}

      {!loading && error && (
        <p className="mt-3 text-sm text-red-300">{error}</p>
      )}

      {!loading && !error && data && (
        <div className="mt-4 space-y-4">
          {data.message && (
            <p className="text-sm text-muted">{data.message}</p>
          )}

          {data.videos.length > 0 ? (
            data.videos.map((video) => (
              <div key={video.id} className="max-w-2xl">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-cream">
                  {video.title}
                </p>
                {video.embedHtml ? (
                  <div
                    className="highlight-embed-shell overflow-hidden border border-card-border"
                    dangerouslySetInnerHTML={{ __html: video.embedHtml }}
                  />
                ) : video.watchUrl ? (
                  <a
                    href={video.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded border border-card-border bg-card px-3 py-2 text-sm text-cream transition hover:border-gold/40 hover:text-gold-light"
                  >
                    {video.id.startsWith("youtube-search-")
                      ? "Search highlights on YouTube →"
                      : "Watch highlight →"}
                  </a>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">
              No highlights found for this match yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
