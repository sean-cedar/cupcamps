/** Match-level media links (photos, search) — not kit archive pages. */
export function getMatchPhotoSearchUrl(
  homeName: string,
  awayName: string,
): string {
  const query = encodeURIComponent(
    `${homeName} v ${awayName} FIFA World Cup 2026 match photos`,
  );
  return `https://www.fifa.com/fifaplus/en/search?q=${query}`;
}

export function getYouTubeHighlightsSearchUrl(
  homeName: string,
  awayName: string,
): string {
  const query = encodeURIComponent(
    `${homeName} vs ${awayName} FIFA World Cup 2026 highlights`,
  );
  return `https://www.youtube.com/results?search_query=${query}`;
}
