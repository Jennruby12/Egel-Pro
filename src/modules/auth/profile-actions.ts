'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
  type DeleteAccountInput,
} from '@/lib/validations/profile.schema'

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

// =====================================================
// UPDATE PROFILE — datos basicos
// =====================================================
export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult> {
  const parsed = updateProfileSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: parsed.data.full_name,
      university: parsed.data.university || null,
      exam_date: parsed.data.exam_date && parsed.data.exam_date !== '' ? parsed.data.exam_date : null,
      goal_level: parsed.data.goal_level,
    })
    .eq('id', user.id)

  if (error) return { success: false, error: `Error al guardar: ${error.message}` }

  revalidatePath('/profile')
  revalidatePath('/dashboard')
  return { success: true }
}

// =====================================================
// CHANGE PASSWORD
// =====================================================
export async function changePassword(input: ChangePasswordInput): Promise<ActionResult> {
  const parsed = changePasswordSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.new_password })
  if (error) return { success: false, error: error.message }

  return { success: true }
}

// =====================================================
// UPLOAD AVATAR (URL ya generada por el cliente)
// =====================================================
export async function setAvatarUrl(input: { avatarUrl: string | null }): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: input.avatarUrl })
    .eq('id', user.id)

  if (error) return { success: false, error: `Error al actualizar avatar: ${error.message}` }

  revalidatePath('/profile')
  revalidatePath('/dashboard')
  return { success: true }
}

// =====================================================
// DELETE ACCOUNT (usa admin client porque el user no puede borrar
// su propio auth.users sin privilegios)
// =====================================================
export async function deleteAccount(input: DeleteAccountInput): Promise<ActionResult> {
  const parsed = deleteAccountSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Confirmacion invalida' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const adminClient = createAdminClient()

  // Borrar el row de profiles (cascadeara via ON DELETE CASCADE el resto)
  // En realidad CASCADE solo aplica desde auth.users -> profiles, no al reves.
  // Borramos primero las tablas dependientes del user, luego el auth.user.
  const userId = user.id

  // Soft delete-able o hard delete: vamos por hard delete.
  // Si hay RLS bloqueando, el admin client la bypassea.
  await Promise.allSettled([
    adminClient.from('quiz_answers').delete().in(
      'session_id',
      (await adminClient.from('quiz_sessions').select('id').eq('user_id', userId)).data?.map((s) => s.id) ?? [],
    ),
    adminClient.from('quiz_sessions').delete().eq('user_id', userId),
    adminClient.from('user_progress').delete().eq('user_id', userId),
    adminClient.from('streaks').delete().eq('user_id', userId),
    adminClient.from('achievements').delete().eq('user_id', userId),
    adminClient.from('user_flashcard_progress').delete().eq('user_id', userId),
    adminClient.from('user_notes').delete().eq('user_id', userId),
    adminClient.from('question_reports').delete().eq('reported_by', userId),
    adminClient.from('email_logs').delete().eq('user_id', userId),
  ])

  // El profile se elimina automaticamente al borrar el auth.user (ON DELETE CASCADE)
  const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(userId)
  if (deleteAuthError) {
    return { success: false, error: `Error al eliminar cuenta: ${deleteAuthError.message}` }
  }

  // Cerrar sesion del cliente
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login?deleted=1')
}
