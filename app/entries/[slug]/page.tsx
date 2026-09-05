import Link from "next/link";
import { notFound } from "next/navigation";
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

      <div
        className="prose-entry mt-4 space-y-4 text-sm leading-relaxed text-ink/90"
        // entry.html is generated at build time from local md files
        // (see scripts/build-content.mjs)
        dangerouslySetInnerHTML={{ __html: entry.html }}
      />

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
