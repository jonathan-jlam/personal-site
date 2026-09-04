import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const entriesDir = path.join(root, "content", "entries");
const outputPath = path.join(root, "lib", "generatedEntries.ts");

const assertEntryType = (value, slug) => {
  if (value === "coding" || value === "music" || value === "learning") {
    return value;
  }
  throw new Error(
    `Entry "${slug}" has an invalid or missing "type" in its frontmatter.`
  );
};

const files = fs
  .readdirSync(entriesDir)
  .filter((filename) => filename.endsWith(".mdx"))
  .sort();

const entries = files.map((filename) => {
  const slug = filename.replace(/\.mdx$/, "");
  const { data } = matter(fs.readFileSync(path.join(entriesDir, filename), "utf8"));

  if (!data.title) throw new Error(`Entry "${slug}" is missing a "title".`);
  if (!data.date) throw new Error(`Entry "${slug}" is missing a "date".`);

  return {
    slug,
    type: assertEntryType(data.type, slug),
    date: String(data.date),
    title: String(data.title),
    excerpt: data.excerpt ? String(data.excerpt) : "",
    series: data.series ? String(data.series) : undefined,
    seriesTitle: data.seriesTitle ? String(data.seriesTitle) : undefined,
    importName: `Entry_${slug.replace(/[^a-zA-Z0-9_$]/g, "_")}`,
    importPath: `../content/entries/${filename}`,
  };
});

const imports = entries
  .map(({ importName, importPath }) => `import ${importName} from "${importPath}";`)
  .join("\n");
const objectEntries = entries
  .map(({ slug, importName, importPath: _path, ...metadata }) =>
    `  ${JSON.stringify(slug)}: { ...${JSON.stringify({ slug, ...metadata })}, Content: ${importName} },`,
  )
  .join("\n");

const output = `${imports}\n\nimport type { Entry } from "./entries";\n\nexport const compiledEntries: Record<string, Entry> = {\n${objectEntries}\n};\n`;
fs.writeFileSync(outputPath, output);
