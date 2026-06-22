'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  createGroupSchema,
  joinGroupSchema,
  type CreateGroupInput,
  type JoinGroupInput,
} from '@/lib/validations/group.schema'

type ActionResult<T = { id: string }> =
  | { success: true; data: T }
  | { success: false; error: string }

// Charset sin caracteres ambiguos (0/O, 1/I/L).
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function generateCode(len = 6): string {
  let out = ''
  for (let i = 0; i < len; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  }
  return out
}

async function getUserRole(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<string | null> {
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).single()
  return data?.role ?? null
}

/**
 * Autoservicio: convierte al usuario actual en maestro (student -> teacher).
 * No degrada a un admin.
 */
export async function becomeTeacher(): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const role = await getUserRole(supabase, user.id)
  if (role === 'admin' || role === 'teacher') {
    return { success: true, data: { id: user.id } }
  }

  const { error } = await supabase.from('profiles').update({ role: 'teacher' }).eq('id', user.id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/teacher')
  revalidatePath('/profile')
  return { success: true, data: { id: user.id } }
}

export async function createGroup(input: CreateGroupInput): Promise<ActionResult> {
  const parsed = createGroupSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const role = await getUserRole(supabase, user.id)
  if (role !== 'teacher' && role !== 'admin') {
    return { success: false, error: 'Necesitas ser maestro para crear grupos' }
  }

  // Validar que el examen existe y esta activo.
  const { data: exam } = await supabase
    .from('exams')
    .select('id')
    .eq('id', parsed.data.examId)
    .eq('is_active', true)
    .single()
  if (!exam) return { success: false, error: 'Examen no disponible' }

  // Insertar con reintentos por si el join_code colisiona (unique).
  for (let attempt = 0; attempt < 6; attempt++) {
    const join_code = generateCode()
    const { data, error } = await supabase
      .from('groups')
      .insert({
        name: parsed.data.name,
        exam_id: parsed.data.examId,
        owner_id: user.id,
        join_code,
      })
      .select('id')
      .single()
    if (!error && data) {
      revalidatePath('/teacher')
      return { success: true, data: { id: data.id } }
    }
    // 23505 = unique_violation (colisión de join_code) → reintentar
    if (error && error.code !== '23505') {
      return { success: false, error: error.message }
    }
  }
  return { success: false, error: 'No se pudo generar un codigo unico, intenta de nuevo' }
}

export async function regenerateJoinCode(groupId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  for (let attempt = 0; attempt < 6; attempt++) {
    const join_code = generateCode()
    const { error } = await supabase
      .from('groups')
      .update({ join_code })
      .eq('id', groupId)
      .eq('owner_id', user.id)
    if (!error) {
      revalidatePath(`/teacher/${groupId}`)
      revalidatePath('/teacher')
      return { success: true, data: { id: groupId } }
    }
    if (error.code !== '23505') return { success: false, error: error.message }
  }
  return { success: false, error: 'No se pudo regenerar el codigo' }
}

export async function setGroupActive(groupId: string, active: boolean): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { error } = await supabase
    .from('groups')
    .update({ is_active: active })
    .eq('id', groupId)
    .eq('owner_id', user.id)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/teacher/${groupId}`)
  revalidatePath('/teacher')
  return { success: true, data: { id: groupId } }
}

export async function deleteGroup(groupId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', groupId)
    .eq('owner_id', user.id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/teacher')
  return { success: true, data: { id: groupId } }
}

/**
 * Un alumno se une a un grupo por codigo. Usa el RPC SECURITY DEFINER para no
 * exponer la tabla de grupos. Al unirse, fija el examen del grupo como activo.
 */
export async function joinGroupByCode(input: JoinGroupInput): Promise<ActionResult<{ groupId: string }>> {
  const parsed = joinGroupSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? 'Codigo invalido' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { data, error } = await supabase.rpc('join_group_by_code', { p_code: parsed.data.code })
  if (error) {
    const msg = error.message.includes('GROUP_NOT_FOUND')
      ? 'No existe un grupo activo con ese codigo'
      : 'No se pudo unir al grupo'
    return { success: false, error: msg }
  }
  const row = Array.isArray(data) ? data[0] : data
  if (!row) return { success: false, error: 'No existe un grupo activo con ese codigo' }

  // Fijar el examen del grupo como activo para el alumno.
  await supabase.from('profiles').update({ active_exam_id: row.exam_id }).eq('id', user.id)

  revalidatePath('/dashboard')
  revalidatePath('/profile')
  revalidatePath('/quiz')
  return { success: true, data: { groupId: row.group_id } }
}

export async function leaveGroup(groupId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', user.id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/profile')
  return { success: true, data: { id: groupId } }
}
