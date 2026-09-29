import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static HTML export to `out/`, served by VS Code Live Server ("Go Live").
  output: "export",
  // Emit /chi-siamo/index.html etc. so plain static servers resolve every page.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
