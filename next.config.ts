import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Off so dev doesn't double-mount components (which replayed the hero
  // mockup entrance animation and looked like a bounce).
  reactStrictMode: false,
};

export default nextConfig;
