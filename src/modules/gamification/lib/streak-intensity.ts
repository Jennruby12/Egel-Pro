/**
 * Mapa centralizado streak (dias) -> intensity de la animacion.
 * Server-safe (no es 'use client') asi que se puede importar desde
 * Server Components como Header.tsx.
 */

export type StreakIntensity = 'dim' | 'medium' | 'intense'

export function streakToIntensity(streakDays: number): StreakIntensity {
  if (streakDays >= 30) return 'intense'
  if (streakDays >= 7) return 'medium'
  return 'dim'
}
