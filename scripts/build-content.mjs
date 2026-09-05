// Runs before `next build`. package.json prebuild
//
// Reads every content/entries/*.md file, parses its frontmatter, and
// compiles the md body to static HTML at build time. Writes out 
// result to lib/generated-entries.json, which lib/entries.ts
// then pulls in with a normal import.
//
// Why this exists: the previous approach called fs.readFileSync() from
// inside the Next.js server code at request time. On Cloudflare that
// server code runs inside a Worker, and Worker bundles only contain files
// Next can prove are needed - it can't prove that for paths built dynamically
// at runtime, so content/entries wasn't being found. Compiling the etnries into
// a single JSON file at build time turnsthe content into an ordinary JS import,
// which the bundler always finds/deems necessary and thus includes
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

const ROOT = process.cwd();
const ENTRIES_DIR = path.join(ROOT, "content", "entries");
const OUT_FILE = path.join(ROOT, "lib", "generated-entries.json");

const VALID_TYPES = new Set(["coding", "music", "learning"]);

/**
 * fenced ```video block:
 *   ```video
 *   url: https://www.youtube.com/embed/xxx
 *   title: Some title
 *   ```
 */
function rehypeVideoEmbed() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (!parent || index === null || node.tagName !== "pre") return;
      const code = node.children.find(
        (c) => c.type === "element" && c.tagName === "code"
      );
      if (!code) return;
      const classNames = code.properties?.className || [];
      if (!classNames.includes("language-video")) return;

      const raw = code.children
        .map((c) => (c.type === "text" ? c.value : ""))
        .join("");
      const data = {};
      for (const line of raw.split("\n")) {
        const sep = line.indexOf(":");
        if (sep === -1) continue;
        const key = line.slice(0, sep).trim();
        const value = line.slice(sep + 1).trim();
        if (key) data[key] = value;
      }
      if (!data.url) return;

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["overflow-hidden", "rounded", "border", "border-line"] },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { className: ["aspect-video", "w-full"] },
            children: [
              {
                type: "element",
                tagName: "iframe",
                properties: {
                  src: data.url,
                  title: data.title || "",
                  className: ["h-full", "w-full"],
                  allow:
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                  allowFullScreen: true,
                },
                children: [],
              },
            ],
          },
        ],
      };
    });
  };
}

/**
 * Standard markdown images (`![alt](src "caption")`) render as a lone <img> inside a <p>
 */
function rehypeImageFigure() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (!parent || index === null || node.tagName !== "p") return;
      if (node.children.length !== 1) return;
      const child = node.children[0];
      if (!child || child.type !== "element" || child.tagName !== "img") return;

      const props = child.properties || {};
      const children = [
        {
          type: "element",
          tagName: "img",
          properties: {
            src: props.src,
            alt: props.alt ?? "",
            className: ["w-full", "rounded", "border", "border-line"],
          },
          children: [],
        },
      ];
      if (props.title) {
        children.push({
          type: "element",
          tagName: "figcaption",
          properties: { className: ["text-xs", "text-muted"] },
          children: [{ type: "text", value: String(props.title) }],
        });
      }
      parent.children[index] = {
        type: "element",
        tagName: "figure",
        properties: { className: ["space-y-2"] },
        children,
      };
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeVideoEmbed)
  .use(rehypePrettyCode, {
    theme: "one-dark-pro",
    keepBackground: true,
    defaultLang: "text",
  })
  .use(rehypeImageFigure)
  .use(rehypeStringify);

function assertEntryType(value, slug) {
  if (VALID_TYPES.has(value)) return value;
  throw new Error(
    `Entry "${slug}" has an invalid or missing "type" in its frontmatter (got: ${String(value)}). Expected one of: coding, music, learning.`
  );
}

async function buildEntry(filename) {
  const slug = filename.replace(/\.mdx?$/, "");
  const fullPath = path.join(ENTRIES_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  if (!data.title) {
    throw new Error(`Entry "${slug}" is missing a "title" in its frontmatter.`);
  }
  if (!data.date) {
    throw new Error(`Entry "${slug}" is missing a "date" in its frontmatter.`);
  }

  const html = String(await processor.process(content));

  return {
    slug,
    type: assertEntryType(data.type, slug),
    date: String(data.date),
    title: String(data.title),
    excerpt: data.excerpt ? String(data.excerpt) : "",
    series: data.series ? String(data.series) : undefined,
    seriesTitle: data.seriesTitle ? String(data.seriesTitle) : undefined,
    html,
  };
}

async function main() {
  if (!fs.existsSync(ENTRIES_DIR)) {
    throw new Error(`content/entries directory not found at "${ENTRIES_DIR}".`);
  }

  const filenames = fs
    .readdirSync(ENTRIES_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const entries = [];
  for (const filename of filenames) {
    entries.push(await buildEntry(filename));
  }

  entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(entries, null, 2));

  console.log(`[build-content] wrote ${entries.length} entries to ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
