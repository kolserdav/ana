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
  async headers() {
    return [
      {
        source: '/api/check',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'uyem.ru' },
          { key: 'Access-Control-Allow-Methods', value: 'GET' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
