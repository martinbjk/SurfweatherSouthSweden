/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.stormglass\.io\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'stormglass-cache',
        expiration: { maxEntries: 50, maxAgeSeconds: 30 * 60 },
      },
    },
    {
      urlPattern: /^https:\/\/marine-api\.open-meteo\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'openmeteo-cache',
        expiration: { maxEntries: 50, maxAgeSeconds: 30 * 60 },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['openweathermap.org'],
  },
};

module.exports = withPWA(nextConfig);
