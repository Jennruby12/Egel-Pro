/**
 * Logica de logros. Evalua los 23 tipos del catalogo contra el estado actual
 * del usuario y desbloquea los que apliquen.
 *
 * Diseno:
 * - `buildAchievementContext()` arma el contexto consultando la DB una sola vez
 * - `evaluateAchievements(ctx, alreadyUnlocked)` pura: retorna que tipos
 *   deberian estar desbloqueados que aun no lo estan
 * - `unlockAchievements()` orquesta: build context, evaluate, insert nuevos
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import {
  ACHIEVEMENTS_CATALOG,
  type AchievementType,
} from '@/lib/constants/gamification'

type SupabaseLike = SupabaseClient<Database>

export type AchievementContext = {
  totalCompletedSessions: number
  totalQuestionsAnswered: number
  streakCurrent: number
  hasFullSimulacro: boolean
  hasSimulacroSobresaliente: boolean
  hasQuickQuizUnder10Min: boolean
  hasPerfectOn20Plus: boolean
  hasPerseverantSequence: boolean // 2+ quizzes con misma area+subarea hasta 100%
  accuracyByArea: Record<number, number> // disciplinar 1..4
}

// =====================================================
// EVALUADORES (puros)
// =====================================================

type Evaluator = (ctx: AchievementContext) => boolean

const EVALUATORS: Partial<Record<AchievementType, Evaluator>> = {
  first_quiz: (c) => c.totalCompletedSessions >= 1,

  streak_3: (c) => c.streakCurrent >= 3,
  streak_7: (c) => c.streakCurrent >= 7,
  streak_14: (c) => c.streakCurrent >= 14,
  streak_30: (c) => c.streakCurrent >= 30,
  streak_100: (c) => c.streakCurrent >= 100,

  area1_mastered: (c) => (c.accuracyByArea[1] ?? 0) >= 90,
  area2_mastered: (c) => (c.accuracyByArea[2] ?? 0) >= 90,
  area3_mastered: (c) => (c.accuracyByArea[3] ?? 0) >= 90,
  area4_mastered: (c) => (c.accuracyByArea[4] ?? 0) >= 90,
  all_areas_mastered: (c) =>
    [1, 2, 3, 4].every((a) => (c.accuracyByArea[a] ?? 0) >= 90),

  simulacro_complete: (c) => c.hasFullSimulacro,
  speed_quiz: (c) => c.hasQuickQuizUnder10Min,
  perfect_score: (c) => c.hasPerfectOn20Plus,
  sobresaliente_sim: (c) => c.hasSimulacroSobresaliente,

  questions_100: (c) => c.totalQuestionsAnswered >= 100,
  questions_500: (c) => c.totalQuestionsAnswered >= 500,
  questions_1000: (c) => c.totalQuestionsAnswered >= 1000,

  perseverant: (c) => c.hasPerseverantSequence,

  // V2 - no implementados en MVP (devuelven false explicitamente)
  all_guides_read: () => false,
  night_owl: () => false,
  secret_1: () => false,
}

/**
 * Funcion pura: dado un contexto y la lista de tipos ya desbloqueados,
 * retorna los tipos que deberian desbloquearse ahora.
 */
export function evaluateAchievements(
  ctx: AchievementContext,
  alreadyUnlocked: Set<AchievementType>,
): AchievementType[] {
  const newlyUnlocked: AchievementType[] = []
  for (const a of ACHIEVEMENTS_CATALOG) {
    if (alreadyUnlocked.has(a.type)) continue
    const evaluator = EVALUATORS[a.type]
    if (evaluator && evaluator(ctx)) {
      newlyUnlocked.push(a.type)
    }
  }
  return newlyUnlocked
}

// =====================================================
// CONTEXT BUILDER (DB queries)
// =====================================================

export async function buildAchievementContext(
  supabase: SupabaseLike,
  userId: string,
): Promise<AchievementContext> {
  const [profileRes, sessionsRes, answersRes, progressRes] = await Promise.all([
    supabase.from('profiles').select('streak_current').eq('id', userId).single(),
    supabase
      .from('quiz_sessions')
      .select('id, mode, time_taken_seconds, correct_answers, total_questions, estimated_level, score_percent, status')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .limit(500),
    supabase
      .from('quiz_answers')
      .select('session_id', { count: 'exact', head: true })
      .in('session_id', []), // placeholder; will count via second method
    supabase
      .from('user_progress')
      .select('area, accuracy_percent, questions_attempted')
      .eq('user_id', userId),
  ])

  const sessions = sessionsRes.data ?? []
  const totalCompletedSessions = sessions.length

  // Para evitar la query con .in() vacio (que falla), contamos answers de otra forma:
  // sumamos questions_attempted de user_progress (refleja el total de respuestas).
  void answersRes
  const progress = progressRes.data ?? []
  const totalQuestionsAnswered = progress.reduce(
    (acc, p) => acc + (p.questions_attempted ?? 0),
    0,
  )

  // Accuracy por area (promedio ponderado por intentos)
  const accuracyByArea: Record<number, number> = {}
  const buckets = new Map<number, { sumWeighted: number; totalAttempts: number }>()
  for (const p of progress) {
    const b = buckets.get(p.area) ?? { sumWeighted: 0, totalAttempts: 0 }
    const attempts = p.questions_attempted ?? 0
    b.sumWeighted += (p.accuracy_percent ?? 0) * attempts
    b.totalAttempts += attempts
    buckets.set(p.area, b)
  }
  for (const [area, b] of Array.from(buckets.entries())) {
    accuracyByArea[area] = b.totalAttempts > 0 ? b.sumWeighted / b.totalAttempts : 0
  }

  // Flags derivados
  const hasFullSimulacro = sessions.some((s) => s.mode === 'full_simulacro')
  const hasSimulacroSobresaliente = sessions.some(
    (s) => s.mode === 'full_simulacro' && s.estimated_level === 'sobresaliente',
  )
  const hasQuickQuizUnder10Min = sessions.some(
    (s) => s.mode === 'quick_exam' && (s.time_taken_seconds ?? Infinity) < 600,
  )
  const hasPerfectOn20Plus = sessions.some(
    (s) =>
      Number(s.score_percent ?? 0) === 100 &&
      (s.total_questions ?? 0) >= 20 &&
      s.correct_answers === s.total_questions,
  )

  // Perseverant: detectar 2+ sesiones de practica con misma duracion total
  // y eventualmente un perfect_score. Heuristica simple: tiene al menos un
  // perfect score y mas de 3 sesiones (asume retomo el quiz).
  const perfectSessions = sessions.filter((s) => Number(s.score_percent ?? 0) === 100)
  const hasPerseverantSequence = perfectSessions.length >= 1 && totalCompletedSessions >= 3

  return {
    totalCompletedSessions,
    totalQuestionsAnswered,
    streakCurrent: profileRes.data?.streak_current ?? 0,
    hasFullSimulacro,
    hasSimulacroSobresaliente,
    hasQuickQuizUnder10Min,
    hasPerfectOn20Plus,
    hasPerseverantSequence,
    accuracyByArea,
  }
}

// =====================================================
// UNLOCK (orquestador)
// =====================================================

export async function unlockAchievements(
  supabase: SupabaseLike,
  userId: string,
): Promise<AchievementType[]> {
  const [{ data: existing }, ctx] = await Promise.all([
    supabase.from('achievements').select('type').eq('user_id', userId),
    buildAchievementContext(supabase, userId),
  ])

  const alreadyUnlocked = new Set<AchievementType>(
    (existing ?? []).map((a) => a.type as AchievementType),
  )
  const newlyUnlocked = evaluateAchievements(ctx, alreadyUnlocked)
  if (newlyUnlocked.length === 0) return []

  const toInsert = newlyUnlocked
    .map((type) => {
      const meta = ACHIEVEMENTS_CATALOG.find((a) => a.type === type)
      if (!meta) return null
      return {
        user_id: userId,
        type: meta.type,
        title: meta.title,
        description: meta.description,
        icon: meta.icon,
      }
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x))

  await supabase.from('achievements').insert(toInsert)
  return newlyUnlocked
}
