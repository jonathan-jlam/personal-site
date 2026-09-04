import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx$/,
  options: {
    providerImportSource: "",
    remarkPlugins: ["remark-gfm", "remark-frontmatter", "remark-mdx-frontmatter"],
  },
});

const nextConfig: NextConfig = {};

export default withMDX(nextConfig);
