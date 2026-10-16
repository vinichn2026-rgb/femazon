import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'static3.azafashions.com',
      },
      {
        protocol: 'https',
        hostname: 'static.azafashions.com',
      },
      {
        protocol: 'https',
        hostname: 'www.azafashions.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/product/:slug',
        destination: '/products/:slug',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/',
        permanent: false,
      }
    ];
  },
};

export default nextConfig;
