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
  // Runtime caching. IMPORTANTE: NUNCA cachear /auth/v1/* (login, tokens, signup,
  // logout, /user). Si lo haces, en mobile el SW puede retornar respuestas stale
  // del cache y la sesion se rompe (user aparece logged in cuando ya no lo esta,
  // o login no se aplica). NetworkOnly garantiza que el browser SIEMPRE pega al
  // server, sin cache intermedio. Mismo para /rest/v1/* en mutaciones.
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/[^/]+\.supabase\.co\/auth\/v1\/.*/i,
      handler: 'NetworkOnly',
    },
    {
      // Solo cachear GET reads, no POST/PATCH/DELETE
      urlPattern: ({ url, request }) =>
        /^https:\/\/[^/]+\.supabase\.co\/rest\/v1\/.*/i.test(url.href) && request.method === 'GET',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-rest-get',
        networkTimeoutSeconds: 8,
        expiration: { maxEntries: 64, maxAgeSeconds: 60 * 5 },
        cacheableResponse: { statuses: [200] },
      },
    },
    {
      // Storage (avatares, imagenes publicas): CacheFirst, son inmutables por URL
      urlPattern: /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'supabase-storage',
        expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 7 },
        cacheableResponse: { statuses: [200] },
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
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fcissioekvahzklhvsnd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },
}

export default withPWA(nextConfig)
