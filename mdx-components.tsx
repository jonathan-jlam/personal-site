import type { ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const components: MDXComponents = {
  // Usage in MDX: <Video url="https://www.youtube.com/embed/..." title="..." />
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

  // Standard markdown images: ![alt](src "optional caption")
  img: ({ src, alt, title }: { src?: string; alt?: string; title?: string }) => (
    <figure className="space-y-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ""}
        className="w-full rounded border border-line"
      />
      {title && <figcaption className="text-xs text-muted">{title}</figcaption>}
    </figure>
  ),

  // Fenced code blocks (```language ... ```) render via SyntaxHighlighter
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

export function useMDXComponents(): MDXComponents {
  return components;
}
