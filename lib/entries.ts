// This module is a plain `import`, not a filesystem read. This is to avoid CloudFlare
// errors where reading from disk is challenging.
// Actual content lives in lib/generated-entries.json, which scripts/build-content.mjs
// generates from content/entries/ before every `next build` 
// Because it's a normal JS import, the bundler always includes it 
// there's nothing for Cloudflare to search for at request time.
// Basically moving the generation of the entries from request to build time.
import generatedEntries from "./generated-entries.json";

export type EntryType = "coding" | "music" | "learning";

export type EntryMeta = {
  slug: string;
  type: EntryType;
  date: string;
  title: string;
  excerpt: string;
  series?: string;
  seriesTitle?: string;
};

// `html` is pre-rendered, sanitized-at-build-time markup (see build-content.mjs).
export type Entry = EntryMeta & { html: string };

type GeneratedEntry = EntryMeta & { html: string };

const ALL_ENTRIES = generatedEntries as GeneratedEntry[];

// All entries sorted date desc 
export function getAllEntries(): EntryMeta[] {
  return [...ALL_ENTRIES]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .map(({ html: _html, ...meta }) => meta);
}

// All entry slugs, for generateStaticParams
export function getAllSlugs(): string[] {
  return ALL_ENTRIES.map((e) => e.slug);
}

// A single entry, including its pre-rendered HTML body
export function getEntry(slug: string): Entry | null {
  return ALL_ENTRIES.find((e) => e.slug === slug) ?? null;
}

export type SeriesContext = {
  seriesTitle: string;
  items: EntryMeta[];
  currentSlug: string;
  currentPosition: number;
  totalCount: number;
};

// Returns series navigation context for an entry
export function getSeriesContext(entry: EntryMeta): SeriesContext | null {
  if (!entry.series) return null;

  const siblings = getAllEntries()
    .filter((e) => e.series === entry.series)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  if (siblings.length < 2) return null;

  const currentIndex = siblings.findIndex((e) => e.slug === entry.slug);
  if (currentIndex === -1) return null;

  const start = Math.max(0, currentIndex - 2);
  const end = Math.min(siblings.length, currentIndex + 3);

  return {
    seriesTitle: entry.seriesTitle ?? entry.series,
    items: siblings.slice(start, end),
    currentSlug: entry.slug,
    currentPosition: currentIndex + 1,
    totalCount: siblings.length,
  };
}

export const typeLabel: Record<EntryType, string> = {
  coding: "coding",
  music: "music",
  learning: "learning",
};
