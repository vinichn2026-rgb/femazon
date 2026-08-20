import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
