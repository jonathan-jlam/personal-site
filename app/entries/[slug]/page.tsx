import Link from "next/link";
import { notFound } from "next/navigation";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { entries, type EntryBlock } from "@/lib/entries";

export function generateStaticParams() {
  return entries.map((entry) => ({ slug: entry.slug }));
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeEntryBlocks(entryBody: EntryBlock[] | string | undefined, excerpt: string): EntryBlock[] {
  if (Array.isArray(entryBody)) return entryBody;

  const text = entryBody ?? excerpt;
  return text.split("\n\n").map((paragraph) => ({
    type: "paragraph",
    text: paragraph,
  }));
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) notFound();

  const blocks = normalizeEntryBlocks(entry.body, entry.excerpt);

  return (
    <article className="max-w-md">
      <Link
        href="/"
        className="font-mono text-xs text-muted hover:text-ink"
      >
        ← back to log
      </Link>
      <div className="mt-4 flex items-center gap-2 font-mono text-xs text-muted">
        <span>[{entry.type}]</span>
        <span aria-hidden>·</span>
        <time dateTime={entry.date}>{formatDate(entry.date)}</time>
      </div>
      <h1 className="mt-2 text-xl font-medium text-ink">{entry.title}</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink/90">
        {blocks.map((block, index) => {
          if (block.type === "paragraph") {
            return <p key={index}>{block.text}</p>;
          }

          if (block.type === "code") {
            return (
              <SyntaxHighlighter
                key={index}
                language={block.language}
                style={oneDark}
                showLineNumbers
                customStyle={{
                  margin: 0,
                  borderRadius: "0.75rem",
                  fontSize: "0.75rem",
                  padding: "1rem",
                }}
              >
                {block.code}
              </SyntaxHighlighter>
            );
          }

          if (block.type === "video") {
            return (
              <div key={index} className="overflow-hidden rounded border border-line">
                <div className="aspect-video w-full">
                  <iframe
                    src={block.url}
                    title={block.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            );
          }

          if (block.type === "image") {
            return (
              <figure key={index} className="space-y-2">
                <img src={block.src} alt={block.alt} className="w-full rounded border border-line" />
                {block.caption && <figcaption className="text-xs text-muted">{block.caption}</figcaption>}
              </figure>
            );
          }

          return null;
        })}
      </div>
    </article>
  );
}
