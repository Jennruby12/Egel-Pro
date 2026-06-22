import {
  getPerformanceLevel,
  type PerformanceLevel,
} from '@/lib/constants/egel'
import type { CorrectAnswer } from '@/types/global'

/**
 * Una respuesta individual del usuario.
 * Si user_answer es null, la pregunta se salto.
 */
export type AnsweredQuestion = {
  /** Respuesta correcta de la pregunta (a|b|c) */
  correctAnswer: CorrectAnswer
  /** Respuesta del usuario (a|b|c) o null si se salto */
  userAnswer: CorrectAnswer | null
}

export type ScoringResult = {
  correct: number
  wrong: number
  skipped: number
  total: number
  /** 0-100 con 2 decimales */
  scorePercent: number
  performanceLevel: PerformanceLevel
  /** True si todas correctas (para bonus x1.5) */
  isPerfectScore: boolean
}

/**
 * Calcula el score de una sesion de quiz a partir de las respuestas del usuario.
 *
 * - Una pregunta sin respuesta cuenta como `skipped` (no como wrong).
 * - El porcentaje se calcula sobre el total de preguntas (incluyendo saltadas),
 *   porque saltarse equivale a no saber la respuesta.
 * - Empate de redondeo: 60.00 cuenta como satisfactorio, 80.00 como sobresaliente
 *   (los thresholds son inclusivos por abajo).
 */
export function calculateScore(answers: readonly AnsweredQuestion[]): ScoringResult {
  const total = answers.length

  if (total === 0) {
    return {
      correct: 0,
      wrong: 0,
      skipped: 0,
      total: 0,
      scorePercent: 0,
      performanceLevel: 'ans',
      isPerfectScore: false,
    }
  }

  let correct = 0
  let wrong = 0
  let skipped = 0

  for (const a of answers) {
    if (a.userAnswer === null) {
      skipped++
    } else if (a.userAnswer === a.correctAnswer) {
      correct++
    } else {
      wrong++
    }
  }

  const scorePercent = Math.round((correct / total) * 10_000) / 100
  return {
    correct,
    wrong,
    skipped,
    total,
    scorePercent,
    performanceLevel: getPerformanceLevel(scorePercent),
    isPerfectScore: correct === total && total > 0,
  }
}

/**
 * Estima si el usuario aprobaria el examen real basado en su porcentaje actual.
 * Aprueba a partir de Satisfactorio (>= 60%).
 */
export function wouldPassExam(scorePercent: number): boolean {
  return scorePercent >= 60
}

/**
 * Distribuye preguntas proporcionalmente por area segun los pesos oficiales del EGEL.
 * Util para construir un simulacro o quick exam balanceado.
 *
 * @param targetTotal Cuantas preguntas en total se quieren
 * @param areaWeights Objeto { [areaId]: pesoRelativo }. Si no se da, se usan los pesos del EGEL.
 * @returns Objeto { [areaId]: cantidadDePreguntas } cuya suma = targetTotal
 */
export function distributeQuestionsByArea(
  targetTotal: number,
  areaWeights?: Record<number, number>,
): Record<number, number> {
  // Pesos default = totalQuestions oficiales por area disciplinar
  const weights = areaWeights ?? {
    1: 31,
    2: 33,
    3: 49,
    4: 30,
  }

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
  if (totalWeight === 0) return {}

  const distribution: Record<number, number> = {}
  // Calcular fracciones exactas (multiplicacion primero para evitar perdida de
  // precision por floating point: ej. (31/143)*143 = 30.9999... pero
  // 31*143/143 = 31 exacto).
  const fractions: Array<{ areaId: number; floor: number; remainder: number }> = []
  let assigned = 0

  for (const [areaIdStr, weight] of Object.entries(weights)) {
    const areaId = Number(areaIdStr)
    const exact = (weight * targetTotal) / totalWeight
    const floor = Math.floor(exact)
    const remainder = exact - floor
    distribution[areaId] = floor
    assigned += floor
    fractions.push({ areaId, floor, remainder })
  }

  // Metodo de mayor residuo: distribuir las preguntas faltantes a las areas
  // con mayor parte fraccionaria. Desempate por mayor peso original.
  let remaining = targetTotal - assigned
  fractions.sort((a, b) => {
    if (b.remainder !== a.remainder) return b.remainder - a.remainder
    return (weights[b.areaId] ?? 0) - (weights[a.areaId] ?? 0)
  })
  for (const f of fractions) {
    if (remaining <= 0) break
    distribution[f.areaId] = (distribution[f.areaId] ?? 0) + 1
    remaining--
  }

  return distribution
}
