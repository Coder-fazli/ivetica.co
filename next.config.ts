import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "200mb",
    },
  },
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/:slug",
          destination: "/?w=:slug",
        },
      ],
    };
  },
};

export default nextConfig;
