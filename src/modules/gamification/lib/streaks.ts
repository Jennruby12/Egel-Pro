/**
 * Logica de rachas. Maneja la actualizacion en la tabla `streaks` y la
 * recomputacion de current_streak / streak_max en profile.
 *
 * Una "racha activa" cuenta dias consecutivos en los que el usuario tuvo
 * actividad (al menos una pregunta respondida o reto diario).
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export type StreakUpdate = {
  /** Racha antes de hoy */
  previousStreak: number
  /** Racha despues de incluir hoy */
  newStreak: number
  /** True si la racha aumento (incluye empezar racha desde 0) */
  didGrow: boolean
  /** True si esta es la racha mas larga jamas */
  isNewMax: boolean
}

type SupabaseLike = SupabaseClient<Database>

function toISODate(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10)
}

function daysBetween(aISO: string, bISO: string): number {
  const a = new Date(aISO + 'T00:00:00Z')
  const b = new Date(bISO + 'T00:00:00Z')
  return Math.round((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Computa el current_streak revisando la tabla `streaks` hacia atras
 * desde la fecha dada. Cuenta dias consecutivos que existen.
 *
 * Funcion pura sobre el array de fechas (orden DESC).
 */
export function computeCurrentStreak(
  todayISO: string,
  streakDatesDesc: string[],
): number {
  if (streakDatesDesc.length === 0) return 0
  // Si el dia mas reciente NO es hoy ni ayer, racha rota
  const mostRecent = streakDatesDesc[0]!
  const gap = daysBetween(todayISO, mostRecent)
  if (gap > 1) return 0

  let streak = 1
  for (let i = 1; i < streakDatesDesc.length; i++) {
    const prev = streakDatesDesc[i - 1]!
    const curr = streakDatesDesc[i]!
    if (daysBetween(prev, curr) === 1) {
      streak++
    } else {
      break
    }
  }
  return streak
}

/**
 * Actualiza la racha del usuario. Si hoy no hay registro en streaks, lo crea.
 * Luego recomputa current_streak y actualiza profile.
 */
export async function updateStreak(
  supabase: SupabaseLike,
  userId: string,
  delta: { xpEarned?: number; questionsAnswered?: number; dailyChallengeCompleted?: boolean } = {},
): Promise<StreakUpdate> {
  const today = toISODate()

  // 1. Leer profile actual
  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_current, streak_max')
    .eq('id', userId)
    .single()

  const previousStreak = profile?.streak_current ?? 0
  const previousMax = profile?.streak_max ?? 0

  // 2. Upsert del registro de hoy (acumula valores si ya existia)
  const { data: existingToday } = await supabase
    .from('streaks')
    .select('xp_earned, questions_answered, daily_challenge_completed')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle()

  await supabase.from('streaks').upsert(
    {
      user_id: userId,
      date: today,
      xp_earned: (existingToday?.xp_earned ?? 0) + (delta.xpEarned ?? 0),
      questions_answered:
        (existingToday?.questions_answered ?? 0) + (delta.questionsAnswered ?? 0),
      daily_challenge_completed:
        existingToday?.daily_challenge_completed || (delta.dailyChallengeCompleted ?? false),
    },
    { onConflict: 'user_id,date' },
  )

  // 3. Cargar ultimos N dias (60 suficientes para racha) y computar
  const { data: dates } = await supabase
    .from('streaks')
    .select('date')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(60)

  const datesDesc = (dates ?? []).map((d) => d.date)
  const newStreak = computeCurrentStreak(today, datesDesc)
  const newMax = Math.max(previousMax, newStreak)

  // 4. Actualizar profile
  await supabase
    .from('profiles')
    .update({
      streak_current: newStreak,
      streak_max: newMax,
      last_activity_date: today,
    })
    .eq('id', userId)

  return {
    previousStreak,
    newStreak,
    didGrow: newStreak > previousStreak,
    isNewMax: newMax > previousMax,
  }
}
