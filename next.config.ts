import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async rewrites() {
    return [
      {
        source: "/bing/:path*",
        destination: "https://cn.bing.com/:path*",
      },
    ];
  },
  allowedDevOrigins: ["view.qazz.site"],
};

export default nextConfig;
