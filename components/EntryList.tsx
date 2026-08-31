import EntryCard from "@/components/EntryCard";
import { entries, type EntryType } from "@/lib/entries";

const intro: Record<"all" | EntryType, string> = {
  all: "A running log of things I'm up to. Written mostly for future me.",
  coding: "Just general LeetCode practice.",
  music: "Musical endeavors.",
  learning: "Things I'm learning.",
};

export default function EntryList({ filter }: { filter?: EntryType }) {
  const list = filter ? entries.filter((e) => e.type === filter) : entries;

  return (
    <div>
      <p className="max-w-md text-sm leading-relaxed text-muted">
        {intro[filter ?? "all"]}
      </p>
      <div className="mt-10">
        {list.length === 0 ? (
          <p className="border-t border-line pt-6 font-mono text-sm text-muted">
            nothing here yet.
          </p>
        ) : (
          list.map((entry) => <EntryCard key={entry.slug} entry={entry} />)
        )}
      </div>
    </div>
  );
}
