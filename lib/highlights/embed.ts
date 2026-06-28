const ALLOWED_EMBED_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
]);

function escapeHtmlAttribute(value: string): string {
  return value.replace(/"/g, "&quot;");
}

function toEmbedUrl(rawUrl: string): URL | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  if (url.hostname === "youtu.be") {
    const videoId = url.pathname.replace("/", "");
    if (!videoId) {
      return null;
    }
    return new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  }

  if (
    (url.hostname.includes("youtube.com") || url.hostname === "youtu.be") &&
    url.pathname === "/watch"
  ) {
    const videoId = url.searchParams.get("v");
    if (!videoId) {
      return null;
    }
    return new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  }

  if (url.pathname.startsWith("/embed/")) {
    if (url.hostname.includes("youtube.com")) {
      return new URL(
        `https://www.youtube-nocookie.com${url.pathname}${url.search}`,
      );
    }
    return url;
  }

  return ALLOWED_EMBED_HOSTS.has(url.hostname) ? url : null;
}

/** Build a safe iframe from a highlight embed URL (YouTube / YouTube nocookie). */
export function buildHighlightEmbed(
  embedUrl: string,
  title: string,
): string | null {
  const url = toEmbedUrl(embedUrl);
  if (!url || !ALLOWED_EMBED_HOSTS.has(url.hostname)) {
    return null;
  }

  const safeTitle = escapeHtmlAttribute(title);
  return `<iframe src="${url.toString()}" title="${safeTitle}" class="highlight-embed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>`;
}
