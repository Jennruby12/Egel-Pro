import type { MetadataRoute } from 'next'

// Robots dinamico — Next.js App Router convention
// Permite paginas publicas, bloquea zonas privadas (dashboard, admin, api, callbacks).
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/register', '/forgot-password'],
        disallow: ['/dashboard', '/admin', '/api', '/auth/callback'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
