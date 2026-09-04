import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // IMPORTANT NOTE:
  /**  content/entries/*.mdx is read via fs at request time (see lib/entries.ts).
  Next's automatic output file tracing can't detect dynamically-built fs
  paths, so without this, the directory is omitted from the
  deployed server bundle (Cloudflare Worker) and every entry-reading page
  renders as if there were zero entries. **/
  outputFileTracingIncludes: {
    "*": ["./content/entries/**/*"],
  },
};

export default nextConfig;
