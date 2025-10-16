import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['utfs.io','6uq07ih5qj.ufs.sh'],
  },
};

export default nextConfig;
