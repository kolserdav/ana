/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.NEXT_PUBLIC_SERVER.replace(/^https?:\/\//, '').replace(/:\d+$/, '')],
    formats: ['image/avif'],
  },
  i18n: {
    locales: ['ru'],
    defaultLocale: 'ru',
    localeDetection: false,
  },
};

module.exports = nextConfig;
