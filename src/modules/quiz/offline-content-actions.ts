'use server'

import { createClient } from '@/lib/supabase/server'
import type { CorrectAnswer } from '@/types/global'

/** Pregunta en su forma offline. Incluye correct_answer + explanation para poder
 *  scorear localmente sin red (es una app de estudio: el repaso ya revela la
 *  respuesta, asi que exponerla offline es aceptable). */
export type OfflineQuestion = {
  id: string
  section: string
  area: number
  area_name: string
  subarea: number
  subarea_name: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_a_image: string | null
  option_b_image: string | null
  option_c_image: string | null
  option_a_diagram: string | null
  option_b_diagram: string | null
  option_c_diagram: string | null
  correct_answer: CorrectAnswer
  explanation: string | null
  difficulty: string | null
  image_url: string | null
  diagram: string | null
}

export type OfflineBundle = {
  /** Huella del banco (count:maxUpdatedAt) para detectar cambios y auto-actualizar. */
  version: string
  downloadedAt: number
  questions: OfflineQuestion[]
}

type Result<T> = { success: true; data: T } | { success: false; error: string }

const SELECT =
  'id, section, area, area_name, subarea, subarea_name, question_text, option_a, option_b, option_c, option_a_image, option_b_image, option_c_image, option_a_diagram, option_b_diagram, option_c_diagram, correct_answer, explanation, difficulty, image_url, diagram, updated_at'

/** Descarga TODAS las preguntas activas (paginado: Supabase corta en 1000). */
export async function getOfflineQuestionBundle(): Promise<Result<OfflineBundle>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Necesitas iniciar sesion' }

  const PAGE = 1000
  let from = 0
  const rows: Array<OfflineQuestion & { updated_at: string | null }> = []
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await supabase
      .from('questions')
      .select(SELECT)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('id', { ascending: true })
      .range(from, from + PAGE - 1)
    if (error) return { success: false, error: 'No se pudo descargar el banco' }
    if (!data || data.length === 0) break
    rows.push(...(data as unknown as Array<OfflineQuestion & { updated_at: string | null }>))
    if (data.length < PAGE) break
    from += PAGE
  }

  const maxUpdated = rows.reduce((m, q) => (q.updated_at && q.updated_at > m ? q.updated_at : m), '')
  const version = `${rows.length}:${maxUpdated}`
  const questions: OfflineQuestion[] = rows.map(({ updated_at: _u, ...q }) => q)
  return { success: true, data: { version, downloadedAt: Date.now(), questions } }
}

/** Huella ligera del banco para checar si hay contenido nuevo (auto-update). */
export async function getOfflineBankVersion(): Promise<Result<{ version: string }>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Necesitas iniciar sesion' }

  const { count } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('is_deleted', false)

  const { data } = await supabase
    .from('questions')
    .select('updated_at')
    .eq('is_active', true)
    .eq('is_deleted', false)
    .order('updated_at', { ascending: false })
    .limit(1)

  const maxUpdated = data?.[0]?.updated_at ?? ''
  return { success: true, data: { version: `${count ?? 0}:${maxUpdated}` } }
}
