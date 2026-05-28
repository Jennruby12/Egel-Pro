/**
 * Algoritmo de repeticion espaciada SM-2 (SuperMemo / Anki).
 *
 * Referencia: https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm
 *
 * NOTA DE DISENO sobre nuestro schema de DB
 * ------------------------------------------
 * La tabla `user_flashcard_progress` almacena:
 *   - times_seen     -> total acumulado de revisiones
 *   - times_correct  -> total acumulado de aciertos (quality >= 3)
 *   - ease_factor    -> factor SM-2 (default 2.5)
 *   - last_seen      -> ISO date de la ultima revision
 *   - next_review    -> ISO date (yyyy-mm-dd) de la proxima revision
 *
 * El algoritmo SM-2 original mantiene un contador `repetitions` que cuenta
 * cuantas veces seguidas se respondio bien (quality >= 3) y se RESETEA a 0
 * cuando se falla. Nuestro schema no almacena ese contador, asi que la
 * funcion `calculateNextReview` lo recibe explicitamente y lo devuelve para
 * que el caller decida como persistirlo.
 *
 * Convencion de derivacion usada por la Server Action:
 *   - Si quality < 3 (fallo)  -> repetitions = 0
 *   - Si quality >= 3 (exito) -> repetitions = max(0, times_correct - times_wrong)
 *     donde times_wrong = times_seen - times_correct. Esto aproxima la racha
 *     actual de aciertos consecutivos. Es una heuristica, no exacto, pero
 *     suficiente para producir intervalos crecientes razonables sin agregar
 *     columnas nuevas.
 */

/** Calidad del recuerdo: 0 (nada) -> 5 (perfecto). */
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5

export type CalculateNextReviewInput = {
  /** Calidad de la respuesta 0-5 (SM-2). */
  quality: ReviewQuality
  /** Ease factor previo. Default 2.5 segun SM-2. */
  easeFactor: number
  /** Intervalo previo en dias. 0 si nunca se ha revisado. */
  interval: number
  /** Cuantas veces seguidas se respondio bien. 0 si nunca o si se fallo la ultima. */
  repetitions: number
}

export type CalculateNextReviewOutput = {
  /** Nuevo ease factor (>= 1.3). */
  easeFactor: number
  /** Nuevo intervalo en dias. */
  interval: number
  /** Fecha de proxima revision en formato yyyy-mm-dd (UTC, sin hora). */
  nextReviewISO: string
  /** Nueva cuenta de repeticiones consecutivas. */
  repetitions: number
}

/** Ease factor inicial recomendado por SM-2. */
export const DEFAULT_EASE_FACTOR = 2.5
/** Limite inferior del ease factor segun SM-2. */
export const MIN_EASE_FACTOR = 1.3

/**
 * Calcula el siguiente intervalo y ease factor segun SM-2.
 *
 * Reglas:
 *   - quality < 3  -> repetitions=0, interval=1 (re-aprender manana).
 *   - quality >= 3 -> avanza intervalo:
 *       repetitions == 0 -> interval = 1
 *       repetitions == 1 -> interval = 6
 *       repetitions >= 2 -> interval = round(interval_anterior * easeFactor)
 *     repetitions se incrementa en 1.
 *
 *   - easeFactor siempre se recalcula:
 *       EF' = EF + (0.1 - (5-q) * (0.08 + (5-q)*0.02))
 *     con piso en 1.3.
 *
 * El `today` se puede inyectar para tests deterministas; en produccion se
 * usa `new Date()`.
 */
export function calculateNextReview(
  input: CalculateNextReviewInput,
  today: Date = new Date(),
): CalculateNextReviewOutput {
  const { quality } = input
  const prevEase = input.easeFactor > 0 ? input.easeFactor : DEFAULT_EASE_FACTOR
  const prevInterval = Math.max(0, input.interval)
  const prevReps = Math.max(0, input.repetitions)

  // Recalcular ease factor (formula SM-2)
  const q = quality
  const newEaseRaw = prevEase + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const newEase = Math.max(MIN_EASE_FACTOR, newEaseRaw)

  let nextInterval: number
  let nextReps: number

  if (quality < 3) {
    // Olvido: reiniciar
    nextReps = 0
    nextInterval = 1
  } else {
    if (prevReps === 0) {
      nextInterval = 1
    } else if (prevReps === 1) {
      nextInterval = 6
    } else {
      // round() de SM-2; usamos Math.round (banker no es necesario aqui).
      nextInterval = Math.max(1, Math.round(prevInterval * newEase))
    }
    nextReps = prevReps + 1
  }

  const nextReviewISO = addDaysISO(today, nextInterval)

  return {
    easeFactor: roundTo(newEase, 4),
    interval: nextInterval,
    nextReviewISO,
    repetitions: nextReps,
  }
}

/**
 * Convierte una respuesta binaria (correcto/incorrecto) a una calidad SM-2.
 * Si el usuario respondio bien y marca dificultad:
 *   - 'easy' -> 5 (perfecto)
 *   - undefined -> 4 (correcto con duda)
 *   - 'hard' -> 3 (correcto pero costo)
 * Si fallo:
 *   - 'hard' -> 1 (familiar pero mal)
 *   - undefined o 'easy' -> 0 (olvido total)
 */
export function qualityFromBinary(
  isCorrect: boolean,
  difficulty?: 'easy' | 'hard',
): ReviewQuality {
  if (isCorrect) {
    if (difficulty === 'easy') return 5
    if (difficulty === 'hard') return 3
    return 4
  }
  if (difficulty === 'hard') return 1
  return 0
}

/**
 * Filtra las flashcards que estan listas para revisar hoy.
 * Una card esta "due" si:
 *   - nunca fue revisada (next_review null), o
 *   - su next_review (yyyy-mm-dd) es <= hoy (UTC).
 */
export function getCardsDueToday<T extends { next_review?: string | null }>(
  cards: readonly T[],
  today: Date = new Date(),
): T[] {
  const todayISO = toISODate(today)
  return cards.filter((c) => {
    if (!c.next_review) return true
    // Comparacion lexicografica funciona con formato yyyy-mm-dd.
    const reviewDay = c.next_review.slice(0, 10)
    return reviewDay <= todayISO
  })
}

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

/** Devuelve yyyy-mm-dd (UTC) de un Date. */
function toISODate(d: Date): string {
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/** Suma `days` dias a `from` y devuelve yyyy-mm-dd (UTC). */
function addDaysISO(from: Date, days: number): string {
  // Construir con UTC para evitar saltos por DST.
  const base = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate())
  const next = new Date(base + days * 24 * 60 * 60 * 1000)
  return toISODate(next)
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}
