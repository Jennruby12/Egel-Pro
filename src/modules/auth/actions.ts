'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/modules/notifications/actions'
import {
  signUpSchema,
  signInSchema,
  magicLinkSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type SignUpInput,
  type SignInInput,
  type MagicLinkInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from '@/lib/validations/auth.schema'

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
}

// =====================================================
// SIGN UP — Email + Password
// =====================================================
export async function signUp(input: SignUpInput): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
      data: {
        full_name: parsed.data.full_name,
      },
    },
  })

  if (error) return { success: false, error: error.message }

  // Si el usuario fue creado pero requiere confirmacion de email,
  // data.user existe pero session no.
  if (data.user && !data.session) {
    return { success: true, data: undefined }
  }

  // Completar campos opcionales del profile creados por el trigger
  if (data.user && (parsed.data.university || parsed.data.exam_date)) {
    await supabase
      .from('profiles')
      .update({
        university: parsed.data.university || null,
        exam_date: parsed.data.exam_date || null,
      })
      .eq('id', data.user.id)
  }

  // Enviar welcome email (best-effort, no bloquea el signUp si falla)
  if (data.user) {
    void sendWelcomeEmail({
      userId: data.user.id,
      email: parsed.data.email,
      fullName: parsed.data.full_name,
    }).catch(() => {
      // RESEND_API_KEY puede no estar configurada en dev — esta bien
    })
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

// =====================================================
// SIGN IN — Email + Password
// =====================================================
export async function signIn(input: SignInInput): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) return { success: false, error: 'Email o contrasena incorrectos' }

  revalidatePath('/', 'layout')
  return { success: true }
}

// =====================================================
// SIGN OUT
// =====================================================
export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

// =====================================================
// GOOGLE OAUTH
// =====================================================
export async function signInWithGoogle(): Promise<ActionResult<{ url: string }>> {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') ?? getSiteUrl()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  })

  if (error || !data.url) return { success: false, error: error?.message ?? 'No se pudo iniciar Google OAuth' }
  return { success: true, data: { url: data.url } }
}

// =====================================================
// MAGIC LINK
// =====================================================
export async function sendMagicLink(input: MagicLinkInput): Promise<ActionResult> {
  const parsed = magicLinkSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Email invalido' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
      shouldCreateUser: true,
    },
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// =====================================================
// FORGOT PASSWORD
// =====================================================
export async function forgotPassword(input: ForgotPasswordInput): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Email invalido' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/profile/reset-password`,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// =====================================================
// RESET PASSWORD
// =====================================================
export async function resetPassword(input: ResetPasswordInput): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Sesion expirada. Solicita un nuevo link.' }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  return { success: true }
}
