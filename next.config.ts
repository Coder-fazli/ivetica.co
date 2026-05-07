import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable type checking during build (faster) — run separately in CI
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === "true",
  },
  // Disable linting during build (faster)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure remote image domains for next/image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pub-9f82f1fa7c2d4cc6baedfb1e76b26ddb.r2.dev" },
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.cloudinary.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Optimize webpack to reduce memory usage
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: "all",
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        minSize: 20000,
        maxSize: 244000,
      },
    };
    return config;
  },
  // Reduce build verbosity
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
