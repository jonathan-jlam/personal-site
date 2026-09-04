import { compiledEntries } from "./generatedEntries";
import type { MDXContent } from "mdx/types";

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

export type Entry = EntryMeta & { Content: MDXContent };

// All entries, sorted in date desc
export function getAllEntries(): EntryMeta[] {
  return Object.values(compiledEntries)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .map(({ Content: _Content, ...meta }) => meta);
}

// All entry slugs, for generateStaticParams
export function getAllSlugs(): string[] {
  return Object.keys(compiledEntries);
}

// A single entry, including raw MDX body content
export function getEntry(slug: string): Entry | null {
  return compiledEntries[slug] ?? null;
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
