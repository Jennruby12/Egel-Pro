import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Excluir de middleware:
     * - _next/static, _next/image, favicon.ico, archivos publicos
     * - rutas API (manejan auth en su propio handler)
     * Match en todo lo demas para refrescar sesion
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf)$).*)',
  ],
}
