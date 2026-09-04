import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

export type Entry = EntryMeta & { content: string };

const ENTRIES_DIR = path.join(process.cwd(), "content", "entries");

function assertEntryType(value: unknown, slug: string): EntryType {
  if (value === "coding" || value === "music" || value === "learning") {
    return value;
  }
  throw new Error(
    `Entry "${slug}" has an invalid or missing "type" in its frontmatter (got: ${String(value)}). Expected one of: coding, music, learning.`
  );
}

function readEntryFile(filename: string): Entry {
  const slug = filename.replace(/\.mdx$/, "");
  const fullPath = path.join(ENTRIES_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  if (!data.title) {
    throw new Error(`Entry "${slug}" is missing a "title" in its frontmatter.`);
  }
  if (!data.date) {
    throw new Error(`Entry "${slug}" is missing a "date" in its frontmatter.`);
  }

  return {
    slug,
    type: assertEntryType(data.type, slug),
    date: String(data.date),
    title: String(data.title),
    excerpt: data.excerpt ? String(data.excerpt) : "",
    series: data.series ? String(data.series) : undefined,
    seriesTitle: data.seriesTitle ? String(data.seriesTitle) : undefined,
    content,
  };
}

function getAllSlugsFromDisk(): string[] {
  if (!fs.existsSync(ENTRIES_DIR)) {
    throw new Error(
      `content/entries directory not found at "${ENTRIES_DIR}".`
    );
  }
  return fs
    .readdirSync(ENTRIES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

// All entries, sorted in date desc
export function getAllEntries(): EntryMeta[] {
  return getAllSlugsFromDisk()
    .map((slug) => readEntryFile(`${slug}.mdx`))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .map(({ content: _content, ...meta }) => meta);
}

// All entry slugs, for generateStaticParams
export function getAllSlugs(): string[] {
  return getAllSlugsFromDisk();
}

// A single entry, including raw MDX body content
export function getEntry(slug: string): Entry | null {
  const filename = `${slug}.mdx`;
  if (!fs.existsSync(path.join(ENTRIES_DIR, filename))) return null;
  return readEntryFile(filename);
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
