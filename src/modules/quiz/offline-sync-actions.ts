'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { completeSession } from './actions'

const answerSchema = z.object({
  questionId: z.string().uuid(),
  userAnswer: z.enum(['a', 'b', 'c']).nullable(),
  timeSpentSeconds: z.number().int().min(0).max(86400).catch(0),
})

const syncSchema = z.object({
  areas: z.array(z.number().int()).default([]),
  startedAt: z.number(),
  answers: z.array(answerSchema).min(1).max(300),
})

type Result = { success: true; data: { sessionId: string } } | { success: false; error: string }

/**
 * Sube al servidor una sesion de quiz hecha sin internet. NO confia en el
 * cliente: recomputa is_correct desde la BD y delega el score/XP/progreso/racha
 * a completeSession (misma logica que online). Asi un cliente manipulado no
 * puede inflar su puntaje.
 */
export async function syncOfflineSession(input: z.infer<typeof syncSchema>): Promise<Result> {
  const parsed = syncSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Datos invalidos' }
  const { areas, startedAt, answers } = parsed.data

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Necesitas iniciar sesion' }

  // Respuesta correcta autoritativa desde la BD
  const ids = answers.map((a) => a.questionId)
  const { data: qs } = await supabase.from('questions').select('id, correct_answer').in('id', ids)
  const correctMap = new Map((qs ?? []).map((q) => [q.id, q.correct_answer]))
  const valid = answers.filter((a) => correctMap.has(a.questionId))
  if (valid.length === 0) return { success: false, error: 'Preguntas no encontradas' }

  // Crear la sesion (in_progress) para que completeSession la cierre
  const { data: session, error: sErr } = await supabase
    .from('quiz_sessions')
    .insert({
      user_id: user.id,
      mode: 'practice',
      areas,
      total_questions: valid.length,
      started_at: new Date(startedAt).toISOString(),
      question_ids: valid.map((a) => a.questionId),
      status: 'in_progress',
    })
    .select('id')
    .single()
  if (sErr || !session) return { success: false, error: 'No se pudo crear la sesion' }

  const rows = valid.map((a, i) => ({
    session_id: session.id,
    question_id: a.questionId,
    user_answer: a.userAnswer,
    is_correct: a.userAnswer === null ? null : a.userAnswer === correctMap.get(a.questionId),
    order_in_quiz: i,
    time_spent_seconds: a.timeSpentSeconds,
  }))
  const { error: aErr } = await supabase.from('quiz_answers').insert(rows)
  if (aErr) return { success: false, error: 'No se pudieron guardar las respuestas' }

  const res = await completeSession({ sessionId: session.id, earlyEnd: false })
  if (!res.success) return { success: false, error: res.error }

  return { success: true, data: { sessionId: session.id } }
}
