'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { importRowSchema, type ImportRowOutput } from '@/lib/validations/import-questions.schema'

type ActionResult =
  | { success: true; data: { inserted: number } }
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

/**
 * Importa preguntas validas en batch. El cliente envia el array ya parseado
 * y filtrado (solo las filas que pasaron la validacion en el preview).
 */
export async function importQuestions(rows: ImportRowOutput[]): Promise<ActionResult> {
  if (rows.length === 0) return { success: false, error: 'No hay filas para importar' }
  if (rows.length > 500) return { success: false, error: 'Maximo 500 filas por importacion' }

  // Re-validar server-side (defensa en profundidad)
  for (let i = 0; i < rows.length; i++) {
    const parsed = importRowSchema.safeParse(rows[i])
    if (!parsed.success) {
      return { success: false, error: `Fila ${i + 1}: ${parsed.error.errors[0]?.message}` }
    }
  }

  const { error: authError, supabase, user } = await requireAdmin()
  if (authError || !user) return { success: false, error: authError ?? 'No autorizado' }

  const payload = rows.map((r) => ({
    section: r.section,
    area: r.area,
    area_name: r.area_name,
    subarea: r.subarea,
    subarea_name: r.subarea_name,
    type: r.type,
    question_text: r.question_text,
    option_a: r.option_a,
    option_b: r.option_b,
    option_c: r.option_c,
    correct_answer: r.correct_answer,
    explanation: r.explanation,
    difficulty: r.difficulty,
    is_pilot: r.is_pilot ?? false,
    is_active: true,
    created_by: user.id,
  }))

  const { error, count } = await supabase.from('questions').insert(payload, { count: 'exact' })
  if (error) return { success: false, error: `Error al insertar: ${error.message}` }

  revalidatePath('/admin/questions')
  revalidatePath('/quiz')
  return { success: true, data: { inserted: count ?? payload.length } }
}
