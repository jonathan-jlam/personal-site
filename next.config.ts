import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// NOTE: `outputFileTracingIncludes` has been removed on purpose.
// content/entries/*.mdx is no longer read via fs at request time - each file is
// compiled into the bundle by @next/mdx at build time, and its frontmatter is
// baked into src/lib/entries.generated.ts. Nothing needs to be traced.

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // IMPORTANT: plugins must be referenced by STRING NAME, not imported and
    // passed as functions. Next 16 builds with Turbopack, which serializes
    // loader options to Rust - function references cannot survive that and
    // produce "does not have serializable options" / "Cannot use 'in' operator"
    // errors at build time.
    remarkPlugins: [
      // Strips the leading `---` YAML block so it is not rendered as content.
      // Required: gray-matter used to do this before MDX ever saw the file.
      ["remark-frontmatter", ["yaml"]],
      ["remark-gfm", {}],
    ],
    rehypePlugins: [["rehype-slug", {}]],
  },
});

export default withMDX(nextConfig);
