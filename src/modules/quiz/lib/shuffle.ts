/**
 * Fisher-Yates shuffle seedable (mulberry32 PRNG).
 * Si se pasa seed, el shuffle es determinista (util para tests y para
 * reproducir el mismo orden de opciones cuando el usuario revisa preguntas).
 */

import type { CorrectAnswer } from '@/types/global'

export type Question = {
  option_a: string
  option_b: string
  option_c: string
  correct_answer: CorrectAnswer
}

export type ShuffledQuestion = {
  /** Opciones en el orden mostrado al usuario */
  options: Array<{ label: CorrectAnswer; text: string; isCorrect: boolean }>
  /** Letra original de la opcion correcta (siempre 'a' | 'b' | 'c') */
  originalCorrect: CorrectAnswer
}

/**
 * Mulberry32: PRNG simple y rapido para 32 bits. Determinista por seed.
 */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = t
    r = Math.imul(r ^ (r >>> 15), r | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4_294_967_296
  }
}

/**
 * Fisher-Yates shuffle de un array. Retorna un array NUEVO (no muta).
 * @param seed Si se provee, el resultado es determinista.
 */
export function shuffle<T>(arr: readonly T[], seed?: number): T[] {
  const result = [...arr]
  const rng = seed === undefined ? Math.random : mulberry32(seed)

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}

/**
 * Mezcla las opciones a/b/c de una pregunta. La letra correcta se mantiene
 * referenciada en `originalCorrect` para poder validar la respuesta.
 *
 * El array `options` ya viene en orden visual: la primera opcion mostrada
 * es options[0], la segunda options[1], la tercera options[2].
 */
export function shuffleQuestionOptions(
  question: Question,
  seed?: number,
): ShuffledQuestion {
  const baseOptions = [
    { label: 'a' as const, text: question.option_a, isCorrect: question.correct_answer === 'a' },
    { label: 'b' as const, text: question.option_b, isCorrect: question.correct_answer === 'b' },
    { label: 'c' as const, text: question.option_c, isCorrect: question.correct_answer === 'c' },
  ]

  return {
    options: shuffle(baseOptions, seed),
    originalCorrect: question.correct_answer,
  }
}

/**
 * Genera un seed deterministico a partir de un string (ej. quiz session id).
 * Util para que el mismo usuario vea las mismas opciones en el mismo orden
 * si refresca la pantalla.
 */
export function seedFromString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}
