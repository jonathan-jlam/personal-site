"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "all" },
  { href: "/coding", label: "coding" },
  { href: "/music", label: "music" },
  { href: "/learnings", label: "learnings" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line py-8">
      <div className="flex items-baseline justify-between">
        <Link href="/" className="group">
          <span className="font-mono text-sm text-accent">jkwlam</span>
          <span className="block text-lg font-medium tracking-tight text-ink">
            personal log
          </span>
        </Link>
        <Link
          href="/about"
          className="font-mono text-sm text-muted hover:text-ink"
        >
          about
        </Link>
      </div>

      <nav className="mt-6 flex gap-1 font-mono text-sm">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3 py-1 transition-colors ${
                active
                  ? "bg-accent-soft text-accent"
                  : "text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
