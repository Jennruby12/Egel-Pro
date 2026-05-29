import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Excluir de middleware:
     * - _next/static, _next/image, favicon.ico
     * - rutas API (manejan auth en su propio handler)
     * - Service Worker (sw.js, workbox-*.js, worker-*.js, fallback-*.js) — PWA next-pwa
     * - manifest.json, robots.txt, sitemap.xml — archivos publicos del root
     * - Cualquier archivo con extension de assets (imagenes, fuentes, .js, .css, .map, .json)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|sw\\.js|workbox-.*\\.js|worker-.*\\.js|fallback-.*\\.js|manifest\\.json|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|js|css|map|json|txt|xml)$).*)',
  ],
}
