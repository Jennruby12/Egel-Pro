import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// OAuth + Magic Link callback handler
// Supabase redirige aqui con ?code=XYZ despues del login.
// Intercambiamos el code por una sesion y redirigimos al destino final.

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Fallback: redirigir a login con error
  return NextResponse.redirect(`${origin}/login?error=auth_callback`)
}
