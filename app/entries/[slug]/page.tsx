import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getAllSlugs, getEntry, getSeriesContext } from "@/lib/entries";
import { SeriesRail, SeriesStrip } from "@/components/SeriesNav";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// <Video url="https://www.youtube.com/embed/..." title="" />
const mdxComponents = {
  Video: ({ url, title }: { url: string; title: string }) => (
    <div className="overflow-hidden rounded border border-line">
      <div className="aspect-video w-full">
        <iframe
          src={url}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  ),
  // Standard md images: ![alt](src "optional caption")
  img: ({ src, alt, title }: { src?: string; alt?: string; title?: string }) => (
    <figure className="space-y-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? ""} className="w-full rounded border border-line" />
      {title && <figcaption className="text-xs text-muted">{title}</figcaption>}
    </figure>
  ),
  // code blocks (```language ... ```) render via SyntaxHighlighter
  pre: ({ children }: { children?: ReactNode }) => {
    const codeElement = children as {
      props?: { className?: string; children?: ReactNode };
    };
    const className = codeElement?.props?.className ?? "";
    const match = /language-(\w+)/.exec(className);
    const language = match?.[1] ?? "text";
    const code = String(codeElement?.props?.children ?? "").replace(/\n$/, "");

    return (
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers
        customStyle={{
          margin: 0,
          borderRadius: "0.75rem",
          fontSize: "0.75rem",
          padding: "1rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    );
  },
};

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const series = getSeriesContext(entry);

  return (
    <article className="relative max-w-md">
      <Link href="/" className="font-mono text-xs text-muted hover:text-ink">
        ← back to log
      </Link>
      <div className="mt-4 flex items-center gap-2 font-mono text-xs text-muted">
        <span>[{entry.type}]</span>
        <span aria-hidden>·</span>
        <time dateTime={entry.date}>{formatDate(entry.date)}</time>
      </div>
      <h1 className="mt-2 text-xl font-medium text-ink">{entry.title}</h1>

      {series && (
        <div className="mt-6 xl:hidden">
          <SeriesStrip
            items={series.items}
            currentSlug={series.currentSlug}
            seriesTitle={series.seriesTitle}
            currentPosition={series.currentPosition}
            totalCount={series.totalCount}
          />
        </div>
      )}

      <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink/90">
        <MDXRemote
          source={entry.content}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>

      {series && (
        <div className="hidden xl:block absolute left-full top-0 ml-12 w-56">
          <SeriesRail
            items={series.items}
            currentSlug={series.currentSlug}
            seriesTitle={series.seriesTitle}
            currentPosition={series.currentPosition}
            totalCount={series.totalCount}
          />
        </div>
      )}
    </article>
  );
}
