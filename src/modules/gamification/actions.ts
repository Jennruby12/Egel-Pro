'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { calculateXPWithBreakdown, type XPMode } from './lib/xp'
import { detectLevelUp } from './lib/levels'
import { updateStreak, computeCurrentStreak } from './lib/streaks'
import { unlockAchievements } from './lib/achievements'
import { createNotification } from '@/modules/notifications/lib/create-notification'
import type { AchievementType } from '@/lib/constants/gamification'

const STREAK_MILESTONES = new Set([7, 14, 30, 60, 100, 200, 365])

/**
 * Racha estilo TikTok: cada vez que el usuario abre la app, si no ha
 * registrado actividad hoy, se inserta un registro minimo en streaks
 * que mantiene viva la racha. Si ya pasaron mas de un dia desde la
 * ultima actividad, la racha se rompe (recomputeCurrentStreak da 0)
 * y empieza desde 1 con este touch.
 *
 * No requiere completar un quiz para sumar dia.
 */
export type TouchStreakResult = {
  previousStreak: number
  currentStreak: number
  streakMax: number
  didGrow: boolean
  isNewMax: boolean
  alreadyToday: boolean
}

export async function touchStreakIfNeeded(
  input?: { localDate?: string },
): Promise<
  { success: true; data: TouchStreakResult } | { success: false; error: string }
> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  // Si el cliente envio fecha local valida, usarla. Sino, fallback a UTC.
  const isValid =
    typeof input?.localDate === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(input.localDate) &&
    Number(input.localDate.slice(0, 4)) >= 2020 &&
    Number(input.localDate.slice(0, 4)) <= 2100
  const today = isValid ? input!.localDate! : new Date().toISOString().slice(0, 10)

  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_current, streak_max')
    .eq('id', user.id)
    .single()

  const previousStreak = profile?.streak_current ?? 0
  const previousMax = profile?.streak_max ?? 0

  // Verificar si ya hay registro de hoy. Si si, no hacemos nada (idempotente).
  const { data: todayRow } = await supabase
    .from('streaks')
    .select('date')
    .eq('user_id', user.id)
    .eq('date', today)
    .maybeSingle()

  if (todayRow) {
    return {
      success: true,
      data: {
        previousStreak,
        currentStreak: previousStreak,
        streakMax: previousMax,
        didGrow: false,
        isNewMax: false,
        alreadyToday: true,
      },
    }
  }

  // Insertar touch minimo y recomputar
  await supabase.from('streaks').insert({
    user_id: user.id,
    date: today,
    xp_earned: 0,
    questions_answered: 0,
    daily_challenge_completed: false,
  })

  const { data: dates } = await supabase
    .from('streaks')
    .select('date')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(60)

  const newStreak = computeCurrentStreak(
    today,
    (dates ?? []).map((d) => d.date),
  )
  const newMax = Math.max(previousMax, newStreak)

  await supabase
    .from('profiles')
    .update({
      streak_current: newStreak,
      streak_max: newMax,
      last_activity_date: today,
    })
    .eq('id', user.id)

  // Evaluar logros nuevos relacionados a racha
  await unlockAchievements(supabase, user.id)

  // Notif: hito de racha (7, 14, 30, 60, 100 dias)
  if (STREAK_MILESTONES.has(newStreak) && newStreak > previousStreak) {
    await createNotification({
      userId: user.id,
      type: 'streak_milestone',
      title: `Racha de ${newStreak} dias!`,
      body: `Has mantenido tu racha por ${newStreak} dias consecutivos. Sigue asi!`,
      actionLink: '/dashboard',
    })
  }

  // Notif: racha se rompio (previa > 1, ahora 1)
  if (previousStreak > 1 && newStreak === 1) {
    await createNotification({
      userId: user.id,
      type: 'streak_warning',
      title: `Tu racha se rompio`,
      body: `Perdiste tu racha de ${previousStreak} dias. Empezaste una nueva hoy.`,
      actionLink: '/dashboard',
    })
  }

  revalidatePath('/dashboard')
  revalidatePath('/profile')

  return {
    success: true,
    data: {
      previousStreak,
      currentStreak: newStreak,
      streakMax: newMax,
      didGrow: newStreak > previousStreak,
      isNewMax: newMax > previousMax,
      alreadyToday: false,
    },
  }
}

export type ProcessQuizCompletionInput = {
  sessionId: string
}

export type ProcessQuizCompletionResult = {
  xpEarned: number
  xpBreakdown: { label: string; multiplier: number }[]
  baseXP: number
  previousXP: number
  newXP: number
  leveledUp: boolean
  previousLevel: number
  newLevel: number
  streak: {
    previous: number
    current: number
    didGrow: boolean
    isNewMax: boolean
  }
  newAchievements: AchievementType[]
}

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

/**
 * Orchestrator que se llama al completar un quiz. Encadena:
 * 1. Calculo final de XP con bonuses (streak, perfect score)
 * 2. Update de profile.xp_total y level
 * 3. Update de streak (recomputa current_streak en profile)
 * 4. Deteccion de level-up
 * 5. Evaluacion y desbloqueo de logros
 *
 * Asume que el caller ya marco la sesion como 'completed' y cargo
 * correct/wrong/skipped/score_percent/estimated_level en quiz_sessions.
 */
export async function processQuizCompletion(
  input: ProcessQuizCompletionInput,
): Promise<ActionResult<ProcessQuizCompletionResult>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const [sessionRes, profileRes] = await Promise.all([
    supabase
      .from('quiz_sessions')
      .select('user_id, mode, correct_answers, total_questions, status')
      .eq('id', input.sessionId)
      .single(),
    supabase
      .from('profiles')
      .select('xp_total, streak_current')
      .eq('id', user.id)
      .single(),
  ])

  if (sessionRes.error || !sessionRes.data) {
    return { success: false, error: 'Sesion no encontrada' }
  }
  if (sessionRes.data.user_id !== user.id) {
    return { success: false, error: 'No autorizado' }
  }
  if (sessionRes.data.status !== 'completed') {
    return { success: false, error: 'La sesion debe estar completada antes de procesar XP' }
  }

  const session = sessionRes.data
  const previousXP = profileRes.data?.xp_total ?? 0
  const previousStreakAtStart = profileRes.data?.streak_current ?? 0

  // 1. XP con bonuses
  const xpBreakdown = calculateXPWithBreakdown({
    mode: session.mode as XPMode,
    correct: session.correct_answers ?? 0,
    total: session.total_questions,
    streakActive: previousStreakAtStart > 0,
  })

  const xpEarned = xpBreakdown.finalXP
  const newXP = previousXP + xpEarned

  // 2. Level-up?
  const levelChange = detectLevelUp(previousXP, newXP)

  // 3. Update profile (xp + level)
  await supabase
    .from('profiles')
    .update({ xp_total: newXP, level: levelChange.newLevel })
    .eq('id', user.id)

  // 4. Update streak
  const streakResult = await updateStreak(supabase, user.id, {
    xpEarned,
    questionsAnswered: session.total_questions,
    dailyChallengeCompleted: session.mode === 'daily_challenge',
  })

  // 5. Sincronizar xp_earned de la sesion con el calculo final
  await supabase
    .from('quiz_sessions')
    .update({ xp_earned: xpEarned })
    .eq('id', input.sessionId)

  // 6. Logros (despues del update de profile/streak para tener valores frescos)
  const newAchievements = await unlockAchievements(supabase, user.id)

  // 7. Notif: subio de nivel
  if (levelChange.leveledUp) {
    await createNotification({
      userId: user.id,
      type: 'level_up',
      title: `Subiste a Nivel ${levelChange.newLevel}!`,
      body: `Has acumulado ${newXP.toLocaleString('es-MX')} XP. Sigue practicando para llegar al siguiente nivel.`,
      actionLink: '/dashboard',
    })
  }

  revalidatePath('/dashboard')
  revalidatePath('/progress')
  revalidatePath('/achievements')
  revalidatePath('/notifications')

  return {
    success: true,
    data: {
      xpEarned,
      xpBreakdown: xpBreakdown.appliedMultipliers,
      baseXP: xpBreakdown.baseXP,
      previousXP,
      newXP,
      leveledUp: levelChange.leveledUp,
      previousLevel: levelChange.previousLevel,
      newLevel: levelChange.newLevel,
      streak: {
        previous: streakResult.previousStreak,
        current: streakResult.newStreak,
        didGrow: streakResult.didGrow,
        isNewMax: streakResult.isNewMax,
      },
      newAchievements,
    },
  }
}
