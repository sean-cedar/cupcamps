const ALLOWED_FROM_PREFIXES = [
  "/matches/",
  "/groups/",
  "/schedule",
  "/host-cities/",
  "/bracket",
  "/map",
  "/countries",
  "/champions",
] as const;

function isSafeFromPath(from: string | undefined): from is string {
  if (!from || !from.startsWith("/") || from.startsWith("//")) {
    return false;
  }

  return ALLOWED_FROM_PREFIXES.some(
    (prefix) => from === prefix || from.startsWith(`${prefix}/`) || from.startsWith(prefix),
  );
}

export function countryHref(slug: string, from?: string): string {
  const base = `/countries/${slug}`;
  if (!from || !isSafeFromPath(from)) {
    return base;
  }

  return `${base}?from=${encodeURIComponent(from)}`;
}

export type BackLink = {
  href: string;
  label: string;
};

export function resolveBackLink(from: string | undefined): BackLink | null {
  if (!isSafeFromPath(from)) {
    return null;
  }

  const match = from.match(/^\/matches\/(\d+)$/);
  if (match) {
    return { href: from, label: `← Match ${match[1]}` };
  }

  const group = from.match(/^\/groups\/([a-l])$/i);
  if (group) {
    return {
      href: from,
      label: `← Group ${group[1]!.toUpperCase()}`,
    };
  }

  const hostCity = from.match(/^\/host-cities\/([^/?#]+)$/);
  if (hostCity) {
    const slug = hostCity[1]!.replace(/-/g, " ");
    return {
      href: from,
      label: `← ${slug.replace(/\b\w/g, (char) => char.toUpperCase())}`,
    };
  }

  if (from === "/schedule") {
    return { href: from, label: "← Schedule" };
  }

  if (from === "/bracket") {
    return { href: from, label: "← Bracket & schedule" };
  }

  if (from === "/map") {
    return { href: from, label: "← Map" };
  }

  if (from === "/champions") {
    return { href: from, label: "← Champions" };
  }

  if (from === "/countries") {
    return { href: from, label: "← All countries" };
  }

  return { href: from, label: "← Back" };
}
