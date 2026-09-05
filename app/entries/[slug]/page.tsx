import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllSlugs,
  getEntry,
  getEntryContent,
  getSeriesContext,
} from "@/lib/entries";
import { SeriesRail, SeriesStrip } from "@/components/SeriesNav";

// Only the slugs returned by generateStaticParams can ever be rendered.
// Anything else 404s at the routing layer instead of entering the render path
// inside the Worker.
export const dynamicParams = false;

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

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const entry = getEntry(slug);
  if (!entry) notFound();

  // Resolves a module that was already compiled at build time.
  const Content = await getEntryContent(slug);
  if (!Content) notFound();

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
        {/* Component overrides come from the root mdx-components.tsx */}
        <Content />
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
