import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — JKWLAM",
};

export default function AboutPage() {
  return (
    <div className="max-w-md">
      <h1 className="text-lg font-medium text-ink">About</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Just someone trying to figure out what they want to do in life.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        
      </p>
      <div className="mt-8 flex gap-4 font-mono text-sm text-accent">
        <a href="mailto:you@example.com" className="hover:underline">
          email
        </a>
        <a href="https://github.com" className="hover:underline">
          github
        </a>
      </div>
    </div>
  );
}
