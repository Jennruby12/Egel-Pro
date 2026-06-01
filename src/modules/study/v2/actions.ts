'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { unlockAchievements } from '@/modules/gamification/lib/achievements'
import { createNotification } from '@/modules/notifications/lib/create-notification'
import { shuffle } from '@/modules/quiz/lib/shuffle'

type ActionResult<T = void> = { success: true; data?: T } | { success: false; error: string }

/**
 * Marca la guia como en_progreso (idempotente). Crea row en user_guide_progress
 * con status='en_progreso' y started_at si aun no existe.
 */
export async function markGuideStarted(guideId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }
  if (!isUuid(guideId)) return { success: false, error: 'ID invalido' }

  const { data: existing } = await supabase
    .from('user_guide_progress')
    .select('status')
    .eq('user_id', user.id)
    .eq('guide_id', guideId)
    .maybeSingle()

  if (existing) {
    return { success: true }
  }

  const { error } = await supabase.from('user_guide_progress').insert({
    user_id: user.id,
    guide_id: guideId,
    status: 'en_progreso',
    percent_read: 0,
    started_at: new Date().toISOString(),
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

const progressSchema = z.object({
  guideId: z.string().uuid(),
  percent: z.number().int().min(0).max(100),
  lastSectionId: z.string().uuid().nullable().optional(),
  deltaSeconds: z.number().int().min(0).max(3600).optional(),
})

/**
 * Heartbeat de lectura: actualiza percent_read, last_section_id y suma tiempo.
 * El cliente lo llama cada ~30s.
 */
export async function updateReadingProgress(input: z.infer<typeof progressSchema>): Promise<ActionResult> {
  const parsed = progressSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Datos invalidos' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { data: existing } = await supabase
    .from('user_guide_progress')
    .select('status, percent_read, time_spent_seconds')
    .eq('user_id', user.id)
    .eq('guide_id', parsed.data.guideId)
    .maybeSingle()

  const newPercent = Math.max(existing?.percent_read ?? 0, parsed.data.percent)
  const newTime = (existing?.time_spent_seconds ?? 0) + (parsed.data.deltaSeconds ?? 0)

  if (existing) {
    const { error } = await supabase
      .from('user_guide_progress')
      .update({
        percent_read: newPercent,
        last_section_id: parsed.data.lastSectionId ?? null,
        time_spent_seconds: newTime,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('guide_id', parsed.data.guideId)
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase.from('user_guide_progress').insert({
      user_id: user.id,
      guide_id: parsed.data.guideId,
      status: 'en_progreso',
      percent_read: newPercent,
      last_section_id: parsed.data.lastSectionId ?? null,
      time_spent_seconds: newTime,
      started_at: new Date().toISOString(),
    })
    if (error) return { success: false, error: error.message }
  }
  return { success: true }
}

/**
 * Marca la guia como completada y otorga XP + dispara achievements.
 * Solo si el user llego a percent >= 80% y time_spent >= 180s (3 min).
 * Idempotente: si ya estaba completada no otorga XP de nuevo.
 */
export async function completeGuide(guideId: string): Promise<ActionResult<{ xpEarned: number }>> {
  if (!isUuid(guideId)) return { success: false, error: 'ID invalido' }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const [progressRes, guideRes] = await Promise.all([
    supabase
      .from('user_guide_progress')
      .select('status, percent_read, time_spent_seconds')
      .eq('user_id', user.id)
      .eq('guide_id', guideId)
      .maybeSingle(),
    supabase.from('guides').select('id, title, weight_in_exam, slug, area_name, subarea_name').eq('id', guideId).single(),
  ])

  const progress = progressRes.data
  const guide = guideRes.data
  if (!guide) return { success: false, error: 'Guia no encontrada' }
  if (!progress) return { success: false, error: 'No hay progreso registrado' }
  if (progress.status === 'completado') {
    return { success: true, data: { xpEarned: 0 } }
  }
  if ((progress.percent_read ?? 0) < 80) {
    return { success: false, error: 'Aun no completaste 80% de la guia' }
  }
  if ((progress.time_spent_seconds ?? 0) < 180) {
    return { success: false, error: 'Necesitas al menos 3 minutos leyendo' }
  }

  // XP: guias pesadas (weight_in_exam >= 12) dan 100 XP, las demas 50.
  const xpEarned = (guide.weight_in_exam ?? 0) >= 12 ? 100 : 50

  // Actualizar profile.xp_total
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp_total')
    .eq('id', user.id)
    .single()
  const newXP = (profile?.xp_total ?? 0) + xpEarned
  await supabase.from('profiles').update({ xp_total: newXP }).eq('id', user.id)

  // Marcar guia como completada
  await supabase
    .from('user_guide_progress')
    .update({
      status: 'completado',
      percent_read: 100,
      completed_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .eq('guide_id', guideId)

  // Disparar achievements y notificacion
  await unlockAchievements(supabase, user.id)
  await createNotification({
    userId: user.id,
    type: 'level_up',
    title: `Completaste "${guide.title}"`,
    body: `Ganaste ${xpEarned} XP por completar la guia ${guide.area_name} — ${guide.subarea_name}`,
    actionLink: '/study/v2',
  })

  revalidatePath('/study/v2')
  revalidatePath(`/study/v2/${guide.slug}`)
  return { success: true, data: { xpEarned } }
}

/**
 * Trae 5 reactivos del banco filtrados por seccion+area+subarea de la guia.
 * Usados en el componente QuickQuiz embebido al final de la guia.
 */
export async function fetchQuickQuizQuestions(guideId: string): Promise<
  ActionResult<Array<{
    id: string
    question_text: string
    option_a: string
    option_b: string
    option_c: string
    correct_answer: 'a' | 'b' | 'c'
    explanation: string | null
    difficulty: string | null
  }>>
> {
  if (!isUuid(guideId)) return { success: false, error: 'ID invalido' }
  const admin = createAdminClient()

  const { data: guide } = await admin
    .from('guides')
    .select('section, area_num, subarea_num')
    .eq('id', guideId)
    .single()
  if (!guide) return { success: false, error: 'Guia no encontrada' }

  const { data, error } = await admin
    .from('questions')
    .select('id, question_text, option_a, option_b, option_c, correct_answer, explanation, difficulty')
    .eq('is_active', true)
    .eq('is_deleted', false)
    .eq('section', guide.section)
    .eq('area', guide.area_num)
    .eq('subarea', guide.subarea_num)
    .limit(50)
  if (error) return { success: false, error: error.message }

  const sample = shuffle(data ?? []).slice(0, 5).map((q) => ({
    id: q.id,
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    correct_answer: (q.correct_answer as 'a' | 'b' | 'c'),
    explanation: q.explanation,
    difficulty: q.difficulty,
  }))
  return { success: true, data: sample }
}

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
}
