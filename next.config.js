/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['api.eshtarena.com'],
  },
  experimental: {
    scrollRestoration: true
  }
}

module.exports = nextConfig 