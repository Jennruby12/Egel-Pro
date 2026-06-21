'use server'

import { createClient } from '@/lib/supabase/server'
import {
  toggleQuestionFeedbackSchema,
  type ToggleQuestionFeedbackInput,
} from '@/lib/validations/question-feedback.schema'

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

/**
 * Marca/desmarca (toggle) el feedback de calidad de una pregunta para el usuario.
 * Ej: "respuestas muy obvias", "muy facil". Si ya existe esa razon para ese
 * usuario+pregunta, la quita; si no, la agrega. El UNIQUE en BD evita duplicados.
 */
export async function toggleQuestionFeedback(
  input: ToggleQuestionFeedbackInput,
): Promise<ActionResult<{ marked: boolean }>> {
  // 1. VALIDAR
  const validated = toggleQuestionFeedbackSchema.safeParse(input)
  if (!validated.success) return { success: false, error: 'Datos invalidos' }
  const { questionId, reason } = validated.data

  // 2. AUTH
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Necesitas iniciar sesion' }

  // 3. Toggle: si ya existe esa marca del usuario, la borra; si no, la inserta.
  const { data: existing, error: selErr } = await supabase
    .from('question_feedback')
    .select('id')
    .eq('user_id', user.id)
    .eq('question_id', questionId)
    .eq('reason', reason)
    .maybeSingle()
  if (selErr) return { success: false, error: 'No se pudo leer tu feedback' }

  if (existing) {
    const { error } = await supabase.from('question_feedback').delete().eq('id', existing.id)
    if (error) return { success: false, error: 'No se pudo quitar la marca' }
    return { success: true, data: { marked: false } }
  }

  const { error } = await supabase
    .from('question_feedback')
    .insert({ user_id: user.id, question_id: questionId, reason })
  if (error) return { success: false, error: 'No se pudo guardar tu feedback' }
  return { success: true, data: { marked: true } }
}

/**
 * Devuelve las razones que el usuario ya marco para un conjunto de preguntas.
 * Mapa questionId -> reason[]. Se usa para precargar el estado en la UI.
 */
export async function getMyQuestionFeedback(
  questionIds: string[],
): Promise<Record<string, string[]>> {
  if (questionIds.length === 0) return {}
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return {}

  const { data } = await supabase
    .from('question_feedback')
    .select('question_id, reason')
    .eq('user_id', user.id)
    .in('question_id', questionIds)

  const map: Record<string, string[]> = {}
  for (const row of data ?? []) {
    ;(map[row.question_id] ??= []).push(row.reason)
  }
  return map
}
