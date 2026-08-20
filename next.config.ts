import type { NextConfig } from "next";
import { execSync } from 'child_process';

if (process.env.VERCEL) {
  console.log('Running Prisma DB Push on Vercel...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
}

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
