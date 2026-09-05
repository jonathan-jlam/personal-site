// Runtime-safe entry API.
//
// NOTE: there is deliberately no `fs`, `path`, or `gray-matter` import in this
// file. All disk access happens in scripts/build-content.mjs at build time.
// This module only reads the generated, bundled data - which is why it works
// inside a Cloudflare Worker, where no filesystem exists.

import { entryMeta, entryModules } from "./entries.generated";
import type { MDXEntryComponent } from "./entries.generated";

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

// All entries, sorted in date desc
export function getAllEntries(): EntryMeta[] {
  return [...entryMeta].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0
  );
}

// All entry slugs, for generateStaticParams
export function getAllSlugs(): string[] {
  return entryMeta.map((e) => e.slug);
}

// Metadata for a single entry
export function getEntry(slug: string): EntryMeta | null {
  return entryMeta.find((e) => e.slug === slug) ?? null;
}

// The compiled MDX component for a single entry.
// Compilation happened at build time; this is just a module import.
export async function getEntryContent(
  slug: string
): Promise<MDXEntryComponent | null> {
  const loader = entryModules[slug];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
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
