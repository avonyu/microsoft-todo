import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles build/run directly, standalone is only for Docker
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
