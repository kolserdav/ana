/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [process.env.NEXT_PUBLIC_SERVER?.replace(/^https?:\/\//, '').replace(/:\d+$/, '')],
    formats: ['image/avif'],
  },
  i18n: {
    locales: ['ru', 'en'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  getUrlDefault: () => {
    console.log(23);
  },
};

module.exports = nextConfig;
