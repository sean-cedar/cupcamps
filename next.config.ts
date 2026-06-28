import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/teams",
        destination: "/countries",
        permanent: true,
      },
      {
        source: "/teams/:slug",
        destination: "/countries/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
