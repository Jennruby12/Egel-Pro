'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  questionFormSchema,
  deleteQuestionSchema,
  type QuestionFormInput,
  type DeleteQuestionInput,
} from '@/lib/validations/question.schema'

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

// Convierte '' / undefined a null para columnas opcionales.
const emptyToNull = (v: string | null | undefined): string | null =>
  v && v !== '' ? v : null

function normalizeInput(input: QuestionFormInput) {
  return {
    ...input,
    // Columnas NOT NULL: una opcion puramente visual puede no tener texto → ''.
    option_a: input.option_a ?? '',
    option_b: input.option_b ?? '',
    option_c: input.option_c ?? '',
    stimulus_id: emptyToNull(input.stimulus_id),
    explanation: emptyToNull(input.explanation),
    diagram: emptyToNull(input.diagram),
    image_url: emptyToNull(input.image_url),
    option_a_image: emptyToNull(input.option_a_image),
    option_b_image: emptyToNull(input.option_b_image),
    option_c_image: emptyToNull(input.option_c_image),
    option_a_diagram: emptyToNull(input.option_a_diagram),
    option_b_diagram: emptyToNull(input.option_b_diagram),
    option_c_diagram: emptyToNull(input.option_c_diagram),
  }
}

// =====================================================
// CREATE QUESTION
// =====================================================
export async function createQuestion(input: QuestionFormInput): Promise<ActionResult> {
  const parsed = questionFormSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  }

  const { error: authError, supabase, user } = await requireAdmin()
  if (authError || !user) return { success: false, error: authError ?? 'No autorizado' }

  const data = normalizeInput(parsed.data)
  const { data: inserted, error } = await supabase
    .from('questions')
    .insert({ ...data, created_by: user.id })
    .select('id')
    .single()

  if (error || !inserted) {
    return { success: false, error: `Error al crear pregunta: ${error?.message ?? ''}` }
  }

  revalidatePath('/admin/questions')
  revalidatePath('/quiz')
  return { success: true, data: { id: inserted.id } }
}

// =====================================================
// UPDATE QUESTION
// =====================================================
export async function updateQuestion(
  id: string,
  input: QuestionFormInput,
): Promise<ActionResult> {
  const parsed = questionFormSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  }

  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const data = normalizeInput(parsed.data)
  const { error } = await supabase
    .from('questions')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { success: false, error: `Error al actualizar: ${error.message}` }

  revalidatePath('/admin/questions')
  revalidatePath(`/admin/questions/${id}`)
  revalidatePath('/quiz')
  return { success: true, data: { id } }
}

// =====================================================
// DELETE QUESTION (soft delete)
// =====================================================
export async function deleteQuestion(input: DeleteQuestionInput): Promise<ActionResult> {
  const parsed = deleteQuestionSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'ID invalido' }
  }

  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const { error } = await supabase
    .from('questions')
    .update({ is_deleted: true, is_active: false })
    .eq('id', parsed.data.id)

  if (error) return { success: false, error: `Error al eliminar: ${error.message}` }

  revalidatePath('/admin/questions')
  revalidatePath('/quiz')
  return { success: true, data: { id: parsed.data.id } }
}

// =====================================================
// TOGGLE ACTIVE
// =====================================================
export async function toggleQuestionActive(id: string, isActive: boolean): Promise<ActionResult> {
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const { error } = await supabase
    .from('questions')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) return { success: false, error: `Error: ${error.message}` }

  revalidatePath('/admin/questions')
  revalidatePath('/quiz')
  return { success: true, data: { id } }
}

/**
 * Activa en lote todas las preguntas piloto aun inactivas (flujo de revisar y
 * aprobar el contenido nuevo cargado como piloto). Devuelve cuantas se activaron
 * en el campo `id` del resultado.
 */
export async function activatePilotQuestions(): Promise<ActionResult> {
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const { data, error } = await supabase
    .from('questions')
    .update({ is_active: true })
    .eq('is_pilot', true)
    .eq('is_active', false)
    .eq('is_deleted', false)
    .select('id')

  if (error) return { success: false, error: `Error: ${error.message}` }

  revalidatePath('/admin/questions')
  revalidatePath('/quiz')
  return { success: true, data: { id: String(data?.length ?? 0) } }
}
