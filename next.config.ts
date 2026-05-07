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
