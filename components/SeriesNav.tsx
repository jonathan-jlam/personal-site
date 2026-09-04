import Link from "next/link";
import type { EntryMeta } from "@/lib/entries";

type SeriesNavProps = {
  items: EntryMeta[];
  currentSlug: string;
  seriesTitle: string;
  currentPosition: number;
  totalCount: number;
};

function dotSizeClass(distance: number) {
  if (distance === 0) return "h-2.5 w-2.5";
  if (distance === 1) return "h-2 w-2";
  return "h-1.5 w-1.5";
}

function dotOpacityClass(distance: number) {
  if (distance === 0) return "opacity-100";
  if (distance === 1) return "opacity-55";
  return "opacity-30";
}

// desktop or wide display 
export function SeriesRail({
  items,
  currentSlug,
  seriesTitle,
  currentPosition,
  totalCount,
}: SeriesNavProps) {
  const currentIndex = items.findIndex((item) => item.slug === currentSlug);

  return (
    <nav aria-label={`${seriesTitle} series navigation`}>
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted">
        {seriesTitle}
      </p>
      <p className="mt-0.5 font-mono text-[11px] text-muted">
        Part {currentPosition} of {totalCount}
      </p>

      <div className="relative mt-4">
        <div
          aria-hidden
          className="absolute left-[7px] top-[7px] bottom-[7px] w-px bg-line"
        />
        <ol className="relative z-10 flex flex-col gap-4">
          {items.map((item, idx) => {
            const distance = Math.abs(idx - currentIndex);
            const isCurrent = distance === 0;
            return (
              <li key={item.slug}>
                <Link
                  href={`/entries/${item.slug}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className="group flex items-start gap-3"
                >
                  <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center">
                    <span
                      className={`rounded-full transition-transform group-hover:scale-110 ${
                        isCurrent ? "bg-accent ring-2 ring-accent ring-offset-2 ring-offset-background" : "bg-ink"
                      } ${dotSizeClass(distance)} ${dotOpacityClass(distance)}`}
                    />
                  </span>
                  <span
                    className={`pt-px text-xs leading-tight ${
                      isCurrent ? "font-medium text-ink" : "text-muted group-hover:text-ink"
                    }`}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

// Mobile/narrow display
export function SeriesStrip({
  items,
  currentSlug,
  seriesTitle,
  currentPosition,
  totalCount,
}: SeriesNavProps) {
  const currentIndex = items.findIndex((item) => item.slug === currentSlug);

  return (
    <nav
      aria-label={`${seriesTitle} series navigation`}
      className="border-b border-line pb-6"
    >
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted">
        {seriesTitle} · Part {currentPosition} of {totalCount}
      </p>

      <div className="relative mt-4">
        <div aria-hidden className="absolute left-0 right-0 top-[7px] h-px bg-line" />
        <ol className="relative z-10 flex justify-between">
          {items.map((item, idx) => {
            const distance = Math.abs(idx - currentIndex);
            const isCurrent = distance === 0;
            return (
              <li key={item.slug} className="flex max-w-[76px] flex-1 justify-center">
                <Link
                  href={`/entries/${item.slug}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className="group flex flex-col items-center gap-2"
                >
                  <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center">
                    <span
                      className={`rounded-full transition-transform group-hover:scale-110 ${
                        isCurrent ? "bg-accent ring-2 ring-accent ring-offset-2 ring-offset-background" : "bg-ink"
                      } ${dotSizeClass(distance)} ${dotOpacityClass(distance)}`}
                    />
                  </span>
                  <span
                    className={`line-clamp-2 text-center text-[10px] leading-tight ${
                      isCurrent ? "font-medium text-ink" : "text-muted group-hover:text-ink"
                    }`}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
