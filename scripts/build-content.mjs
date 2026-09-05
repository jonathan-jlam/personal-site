// Reads content/entries/*.mdx at BUILD TIME (plain Node, real filesystem)
// and emits src/lib/entries.generated.ts containing:
//   1. entryMeta      - validated frontmatter for every entry
//   2. entryModules   - a literal map of slug -> dynamic import of the .mdx
//
// Nothing in the deployed Cloudflare Worker ever touches the filesystem.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const ENTRIES_DIR = path.join(ROOT, "content", "entries");
const OUT_FILE = path.join(ROOT, "src", "lib", "entries.generated.ts");

function assertEntryType(value, slug) {
  if (value === "coding" || value === "music" || value === "learning") {
    return value;
  }
  throw new Error(
    `Entry "${slug}" has an invalid or missing "type" in its frontmatter (got: ${String(
      value
    )}). Expected one of: coding, music, learning.`
  );
}

function readEntryMeta(slug) {
  const raw = fs.readFileSync(path.join(ENTRIES_DIR, `${slug}.mdx`), "utf8");
  const { data } = matter(raw);

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
  };
}

if (!fs.existsSync(ENTRIES_DIR)) {
  throw new Error(`content/entries directory not found at "${ENTRIES_DIR}".`);
}

const slugs = fs
  .readdirSync(ENTRIES_DIR)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => f.replace(/\.mdx$/, ""))
  .sort();

if (slugs.length === 0) {
  throw new Error(`No .mdx files found in "${ENTRIES_DIR}".`);
}

const meta = slugs.map(readEntryMeta);

// Literal import specifiers only. A computed/template-literal import() is not
// reliably statically analysable by the bundler; an explicit map always is.
const importMap = slugs
  .map(
    (slug) =>
      `  ${JSON.stringify(slug)}: () =>\n    import("../../content/entries/${slug}.mdx"),`
  )
  .join("\n");

const banner = `// ---------------------------------------------------------------------------
// GENERATED FILE - DO NOT EDIT.
// Produced by scripts/build-content.mjs (runs via npm "prebuild" / "predev").
// Edit content/entries/*.mdx instead, then re-run the build.
// ---------------------------------------------------------------------------
`;

const output = `${banner}
import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import type { EntryMeta } from "./entries";

export type MDXEntryComponent = ComponentType<{ components?: MDXComponents }>;

export const entryMeta: EntryMeta[] = ${JSON.stringify(meta, null, 2)};

export const entryModules: Record<
  string,
  () => Promise<{ default: MDXEntryComponent }>
> = {
${importMap}
};
`;

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, output, "utf8");

console.log(
  `[build-content] wrote ${meta.length} entr${
    meta.length === 1 ? "y" : "ies"
  } to src/lib/entries.generated.ts`
);
