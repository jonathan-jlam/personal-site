import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // IMPORTANT NOTE:
  /**  content/entries/*.mdx is read via fs at request time (see lib/entries.ts).
  Next's automatic output file tracing can't detect dynamically-built fs
  paths, so without this, the directory is omitted from the
  deployed server bundle (Cloudflare Worker) and every entry-reading page
  renders as if there were zero entries. **/
  outputFileTracingIncludes: {
  "*": [
    "./content/entries/**/*",
    "./node_modules/next-mdx-remote/**",
    "./node_modules/@mdx-js/**",
    "./node_modules/estree-*/**",
    "./node_modules/hast-util-*/**",
    "./node_modules/mdast-util-*/**",
    "./node_modules/micromark*/**",
    "./node_modules/remark-*/**",
    "./node_modules/rehype-*/**",
    "./node_modules/recma-*/**",
    "./node_modules/unist-util-*/**",
    "./node_modules/unified/**",
    "./node_modules/vfile*/**",
    "./node_modules/trough/**",
    "./node_modules/is-plain-obj/**",
    "./node_modules/property-information/**",
    ],
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
