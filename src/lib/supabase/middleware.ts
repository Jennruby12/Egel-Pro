import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

type CookieToSet = { name: string; value: string; options: CookieOptions }

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/auth', '/offline', '/join']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Defensa: si faltan las env vars de Supabase (p.ej. mal configuradas en un
  // entorno de preview), NO reventar el middleware con un 500 global. Dejamos
  // pasar la request para que al menos las paginas publicas rendericen.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[middleware] Faltan NEXT_PUBLIC_SUPABASE_URL / ANON_KEY en este entorno')
    return supabaseResponse
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }: CookieToSet) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }: CookieToSet) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: getUser() refresca el token si esta por expirar.
  // No usar getSession() en server-side por seguridad.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isPublic =
    pathname === '/' || PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  // Sin sesion y ruta privada -> redirigir a /login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Con sesion y en pagina de auth -> redirigir a /dashboard
  if (user && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
