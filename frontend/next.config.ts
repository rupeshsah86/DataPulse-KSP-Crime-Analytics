import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  // Add this block to fix the warning
  turbopack: {
    root: path.join(__dirname, ".."),
  },
};

export default nextConfig;
