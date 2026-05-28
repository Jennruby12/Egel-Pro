/**
 * Calculo de XP. La formula base vive en `@/lib/constants/gamification`.
 * Aqui se exportan helpers tipados para el motor de gamificacion.
 */

import {
  XP_VALUES,
  XP_MULTIPLIERS,
  calculateXP as calculateXPBase,
} from '@/lib/constants/gamification'

export type XPMode = keyof typeof XP_VALUES

export type XPBreakdown = {
  baseXP: number
  appliedMultipliers: Array<{ label: string; multiplier: number }>
  finalXP: number
}

/**
 * Calcula XP con desglose explicito (util para mostrar al usuario "+10 base
 * x1.2 racha = +12 XP").
 */
export function calculateXPWithBreakdown(args: {
  mode: XPMode
  correct: number
  total: number
  streakActive: boolean
}): XPBreakdown {
  const baseXP = XP_VALUES[args.mode] * args.correct
  const multipliers: Array<{ label: string; multiplier: number }> = []

  if (args.streakActive) {
    multipliers.push({ label: 'Racha activa', multiplier: XP_MULTIPLIERS.streak_active })
  }
  if (args.correct === args.total && args.total > 0) {
    multipliers.push({ label: 'Score perfecto', multiplier: XP_MULTIPLIERS.perfect_score })
  }

  const finalXP = Math.round(
    baseXP * multipliers.reduce((acc, m) => acc * m.multiplier, 1),
  )

  return { baseXP, appliedMultipliers: multipliers, finalXP }
}

export { calculateXPBase as calculateXP, XP_VALUES, XP_MULTIPLIERS }
