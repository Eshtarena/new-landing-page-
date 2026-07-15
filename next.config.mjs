import nextI18NextConfig from './next-i18next.config.js';

const { i18n } = nextI18NextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.eshtarena.com'
      }
    ],
    qualities: [100, 75],
    unoptimized: true
  },
  experimental: {
    scrollRestoration: true
  }
}

export default nextConfig
