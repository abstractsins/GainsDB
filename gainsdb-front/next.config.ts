import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    qualities: [25, 50, 70, 75],
  },
};

export default nextConfig;
