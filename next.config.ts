import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bhojonbox-server.onrender.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
