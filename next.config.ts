import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.plantuml.com',
      },
    ],
  },
  allowedDevOrigins: ['10.7.10.120']
};

export default nextConfig;
