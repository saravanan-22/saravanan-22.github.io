import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so the site can be hosted on GitHub Pages (no Node server).
  output: "export",
  // GitHub Pages can't run Next's image optimizer; serve images as-is.
  images: { unoptimized: true },
  // cacheComponents / partialPrefetching enable Partial Prerendering, which
  // needs a server and is not allowed with `output: "export"`.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
