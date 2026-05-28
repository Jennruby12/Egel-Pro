/**
 * Helpers de niveles. Las constantes y funciones base viven en
 * `@/lib/constants/gamification`. Aqui agregamos solo logica derivada que
 * el motor de gamificacion necesita (deteccion de level-up).
 */

import {
  LEVELS,
  getLevelFromXP,
  getLevelProgress,
} from '@/lib/constants/gamification'

export type LevelUpResult = {
  leveledUp: boolean
  previousLevel: number
  newLevel: number
  /** El level def actual tras el cambio (util para celebrar) */
  newLevelDef?: typeof LEVELS[number]
}

/**
 * Detecta si el usuario subio de nivel al pasar de `prevXP` a `newXP`.
 * Funcion pura.
 */
export function detectLevelUp(prevXP: number, newXP: number): LevelUpResult {
  const before = getLevelFromXP(Math.max(0, prevXP))
  const after = getLevelFromXP(Math.max(0, newXP))
  const leveledUp = after.level > before.level
  return {
    leveledUp,
    previousLevel: before.level,
    newLevel: after.level,
    newLevelDef: leveledUp ? after : undefined,
  }
}

export { LEVELS, getLevelFromXP, getLevelProgress }
