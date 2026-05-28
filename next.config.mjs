import { createRequire } from 'node:module'

// next-pwa es CommonJS; lo cargamos con createRequire para mantener este archivo como ESM
const require = createRequire(import.meta.url)
const withPWA = require('next-pwa')({
  dest: 'public',
  scope: '/',
  sw: 'sw.js',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Runtime caching: NetworkFirst para datos dinamicos de Supabase, CacheFirst para estaticos
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/[^/]+\.supabase\.co\/auth\/v1\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-auth',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 32, maxAgeSeconds: 60 * 5 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /^https:\/\/[^/]+\.supabase\.co\/rest\/v1\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-rest',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 128, maxAgeSeconds: 60 * 10 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|avif)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-images',
        expiration: { maxEntries: 128, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      urlPattern: /\.(?:js|css|woff2?|ttf|otf)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: { maxEntries: 128, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
  ],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fcissioekvahzklhvsnd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default withPWA(nextConfig)
