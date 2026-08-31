import Link from "next/link";
import type { Entry } from "@/lib/entries";

const dotColor: Record<Entry["type"], string> = {
  coding: "bg-muted",
  music: "bg-[#a8543a]",
  learning: "bg-accent",
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EntryCard({ entry }: { entry: Entry }) {
  return (
    <Link
      href={`/entries/${entry.slug}`}
      className="group block border-b border-line py-6 first:pt-0"
    >
      <div className="flex items-center gap-2 font-mono text-xs text-muted">
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor[entry.type]}`} />
        <span>[{entry.type}]</span>
        <span aria-hidden>·</span>
        <time dateTime={entry.date}>{formatDate(entry.date)}</time>
      </div>
      <h2 className="mt-2 text-lg font-medium text-ink group-hover:text-accent">
        {entry.title}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">{entry.excerpt}</p>
    </Link>
  );
}
