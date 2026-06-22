'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  examMetaSchema,
  examAreaSchema,
  examSubareaSchema,
  setActiveExamSchema,
  type ExamMetaInput,
  type ExamAreaInput,
  type ExamSubareaInput,
} from '@/lib/validations/exam.schema'

type ActionResult<T = { id: string }> =
  | { success: true; data: T }
  | { success: false; error: string }

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' as const, supabase, user: null }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return { error: 'Requiere rol admin' as const, supabase, user: null }
  return { error: null, supabase, user }
}

const emptyToNull = (v: string | null | undefined): string | null =>
  v && v.trim() !== '' ? v.trim() : null

// =====================================================
// EXAMENES (meta)
// =====================================================
export async function createExam(input: ExamMetaInput): Promise<ActionResult> {
  const parsed = examMetaSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }

  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const { data, error } = await supabase
    .from('exams')
    .insert(parsed.data)
    .select('id')
    .single()
  if (error || !data) return { success: false, error: error?.message ?? 'Error al crear examen' }

  revalidatePath('/admin/exams')
  return { success: true, data: { id: data.id } }
}

export async function updateExam(id: string, input: ExamMetaInput): Promise<ActionResult> {
  const parsed = examMetaSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }

  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const { error } = await supabase.from('exams').update(parsed.data).eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/exams')
  revalidatePath(`/admin/exams/${id}`)
  return { success: true, data: { id } }
}

export async function deleteExam(id: string): Promise<ActionResult> {
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  // Seguridad: no borrar un examen que tenga preguntas asociadas.
  const { count } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('exam_id', id)
  if ((count ?? 0) > 0) {
    return { success: false, error: `No se puede borrar: el examen tiene ${count} preguntas. Reasignalas primero.` }
  }

  const { error } = await supabase.from('exams').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/exams')
  return { success: true, data: { id } }
}

// =====================================================
// AREAS
// =====================================================
export async function upsertExamArea(
  input: ExamAreaInput & { id?: string },
): Promise<ActionResult> {
  const parsed = examAreaSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }

  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const row = {
    exam_id: parsed.data.exam_id,
    section: parsed.data.section,
    area_num: parsed.data.area_num,
    name: parsed.data.name,
    total_questions: parsed.data.total_questions,
    color: emptyToNull(parsed.data.color),
    color_class: emptyToNull(parsed.data.color_class),
  }

  const { data, error } = input.id
    ? await supabase.from('exam_areas').update(row).eq('id', input.id).select('id').single()
    : await supabase.from('exam_areas').insert(row).select('id').single()
  if (error || !data) return { success: false, error: error?.message ?? 'Error al guardar area' }

  revalidatePath(`/admin/exams/${parsed.data.exam_id}`)
  return { success: true, data: { id: data.id } }
}

export async function deleteExamArea(id: string, examId: string): Promise<ActionResult> {
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const { error } = await supabase.from('exam_areas').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/admin/exams/${examId}`)
  return { success: true, data: { id } }
}

// =====================================================
// SUBAREAS
// =====================================================
export async function upsertExamSubarea(
  input: ExamSubareaInput & { id?: string; examId: string },
): Promise<ActionResult> {
  const parsed = examSubareaSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }

  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const row = {
    exam_area_id: parsed.data.exam_area_id,
    subarea_num: parsed.data.subarea_num,
    name: parsed.data.name,
    questions: parsed.data.questions,
  }

  const { data, error } = input.id
    ? await supabase.from('exam_subareas').update(row).eq('id', input.id).select('id').single()
    : await supabase.from('exam_subareas').insert(row).select('id').single()
  if (error || !data) return { success: false, error: error?.message ?? 'Error al guardar subarea' }

  revalidatePath(`/admin/exams/${input.examId}`)
  return { success: true, data: { id: data.id } }
}

export async function deleteExamSubarea(id: string, examId: string): Promise<ActionResult> {
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const { error } = await supabase.from('exam_subareas').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/admin/exams/${examId}`)
  return { success: true, data: { id } }
}

// =====================================================
// EXAMEN ACTIVO DEL USUARIO (cualquier usuario autenticado)
// =====================================================
export async function setActiveExam(input: { examId: string }): Promise<ActionResult> {
  const parsed = setActiveExamSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Examen invalido' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  // Solo se puede activar un examen existente y activo.
  const { data: exam } = await supabase
    .from('exams')
    .select('id, is_active')
    .eq('id', parsed.data.examId)
    .single()
  if (!exam || !exam.is_active) return { success: false, error: 'Examen no disponible' }

  const { error } = await supabase
    .from('profiles')
    .update({ active_exam_id: parsed.data.examId })
    .eq('id', user.id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/quiz')
  revalidatePath('/progress')
  revalidatePath('/profile')
  return { success: true, data: { id: parsed.data.examId } }
}
