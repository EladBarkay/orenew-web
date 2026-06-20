import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Marketing visuals are local SVG/PNG; no remote image hosts are needed yet.
  // When the demo video / screenshots move to Supabase Storage or a CDN, add the
  // host here.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
