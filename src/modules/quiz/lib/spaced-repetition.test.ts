import { describe, it, expect } from 'vitest'
import {
  calculateNextReview,
  qualityFromBinary,
  getCardsDueToday,
  DEFAULT_EASE_FACTOR,
  MIN_EASE_FACTOR,
} from './spaced-repetition'

// Fecha fija para tests deterministas: 2026-01-15 (UTC).
const TODAY = new Date(Date.UTC(2026, 0, 15))

describe('calculateNextReview', () => {
  it('quality 0 reinicia repeticiones e intervalo a 1', () => {
    const r = calculateNextReview(
      { quality: 0, easeFactor: 2.5, interval: 10, repetitions: 3 },
      TODAY,
    )
    expect(r.repetitions).toBe(0)
    expect(r.interval).toBe(1)
    // Olvidar reduce el ease factor
    expect(r.easeFactor).toBeLessThan(2.5)
    expect(r.nextReviewISO).toBe('2026-01-16')
  })

  it('quality 1 y 2 tambien resetean (fallos)', () => {
    const r1 = calculateNextReview(
      { quality: 1, easeFactor: 2.5, interval: 6, repetitions: 2 },
      TODAY,
    )
    const r2 = calculateNextReview(
      { quality: 2, easeFactor: 2.5, interval: 6, repetitions: 2 },
      TODAY,
    )
    expect(r1.repetitions).toBe(0)
    expect(r1.interval).toBe(1)
    expect(r2.repetitions).toBe(0)
    expect(r2.interval).toBe(1)
  })

  it('quality 3 con repetitions=0 -> interval=1 y reps=1', () => {
    const r = calculateNextReview(
      { quality: 3, easeFactor: 2.5, interval: 0, repetitions: 0 },
      TODAY,
    )
    expect(r.interval).toBe(1)
    expect(r.repetitions).toBe(1)
    expect(r.nextReviewISO).toBe('2026-01-16')
  })

  it('quality 4 con repetitions=1 -> interval=6 y reps=2', () => {
    const r = calculateNextReview(
      { quality: 4, easeFactor: 2.5, interval: 1, repetitions: 1 },
      TODAY,
    )
    expect(r.interval).toBe(6)
    expect(r.repetitions).toBe(2)
    expect(r.nextReviewISO).toBe('2026-01-21')
  })

  it('quality 5 perfecto sube el ease factor', () => {
    const r = calculateNextReview(
      { quality: 5, easeFactor: 2.5, interval: 6, repetitions: 2 },
      TODAY,
    )
    // EF' = 2.5 + (0.1 - 0*(0.08 + 0)) = 2.6
    expect(r.easeFactor).toBeCloseTo(2.6, 4)
    expect(r.repetitions).toBe(3)
    // interval = round(6 * 2.6) = 16
    expect(r.interval).toBe(16)
  })

  it('repetitions >= 2 con quality >= 3 multiplica intervalo por nuevo ease', () => {
    // EF previo 2.5, quality 4 -> EF' = 2.5 + (0.1 - 1*(0.08 + 0.02)) = 2.5
    const r = calculateNextReview(
      { quality: 4, easeFactor: 2.5, interval: 6, repetitions: 2 },
      TODAY,
    )
    expect(r.easeFactor).toBeCloseTo(2.5, 4)
    expect(r.interval).toBe(15) // round(6 * 2.5)
    expect(r.repetitions).toBe(3)
  })

  it('ease factor nunca cae por debajo de 1.3', () => {
    // Empezar con un ease ya bajo y fallar varias veces para forzar floor
    let ease = 1.4
    for (let i = 0; i < 10; i++) {
      const r = calculateNextReview(
        { quality: 0, easeFactor: ease, interval: 1, repetitions: 0 },
        TODAY,
      )
      ease = r.easeFactor
    }
    expect(ease).toBeGreaterThanOrEqual(MIN_EASE_FACTOR)
    expect(ease).toBe(MIN_EASE_FACTOR)
  })

  it('quality 3 reduce ease factor segun formula SM-2', () => {
    // q=3: EF' = EF + (0.1 - 2*(0.08 + 2*0.02)) = EF + 0.1 - 0.24 = EF - 0.14
    const r = calculateNextReview(
      { quality: 3, easeFactor: 2.5, interval: 1, repetitions: 1 },
      TODAY,
    )
    expect(r.easeFactor).toBeCloseTo(2.36, 2)
  })

  it('progresion completa de una card desde cero (1, 6, ~15 dias)', () => {
    // Primera vez bien
    const step1 = calculateNextReview(
      { quality: 4, easeFactor: DEFAULT_EASE_FACTOR, interval: 0, repetitions: 0 },
      TODAY,
    )
    expect(step1.interval).toBe(1)
    expect(step1.repetitions).toBe(1)

    // Segunda vez bien
    const step2 = calculateNextReview(
      {
        quality: 4,
        easeFactor: step1.easeFactor,
        interval: step1.interval,
        repetitions: step1.repetitions,
      },
      TODAY,
    )
    expect(step2.interval).toBe(6)
    expect(step2.repetitions).toBe(2)

    // Tercera vez bien -> round(6 * easeFactor)
    const step3 = calculateNextReview(
      {
        quality: 4,
        easeFactor: step2.easeFactor,
        interval: step2.interval,
        repetitions: step2.repetitions,
      },
      TODAY,
    )
    expect(step3.interval).toBe(Math.round(6 * step2.easeFactor))
    expect(step3.repetitions).toBe(3)
  })

  it('nextReviewISO se calcula correctamente sumando dias en UTC', () => {
    const r = calculateNextReview(
      { quality: 5, easeFactor: 2.5, interval: 6, repetitions: 5 },
      TODAY,
    )
    // 6 * 2.6 = 15.6 -> round = 16
    expect(r.interval).toBe(16)
    // 2026-01-15 + 16 dias = 2026-01-31
    expect(r.nextReviewISO).toBe('2026-01-31')
  })

  it('cruza correctamente cambios de mes', () => {
    const r = calculateNextReview(
      { quality: 3, easeFactor: 2.5, interval: 0, repetitions: 0 },
      new Date(Date.UTC(2026, 0, 31)),
    )
    // interval = 1, asi que el siguiente dia es 2026-02-01
    expect(r.nextReviewISO).toBe('2026-02-01')
  })
})

describe('qualityFromBinary', () => {
  it('correcto sin difficulty -> 4', () => {
    expect(qualityFromBinary(true)).toBe(4)
  })

  it('correcto easy -> 5', () => {
    expect(qualityFromBinary(true, 'easy')).toBe(5)
  })

  it('correcto hard -> 3', () => {
    expect(qualityFromBinary(true, 'hard')).toBe(3)
  })

  it('incorrecto sin difficulty -> 0', () => {
    expect(qualityFromBinary(false)).toBe(0)
  })

  it('incorrecto hard (familiar) -> 1', () => {
    expect(qualityFromBinary(false, 'hard')).toBe(1)
  })
})

describe('getCardsDueToday', () => {
  it('incluye cards nunca revisadas (next_review null o undefined)', () => {
    const cards = [
      { id: 'a', next_review: null },
      { id: 'b', next_review: undefined },
      { id: 'c', next_review: '2050-01-01' },
    ]
    const due = getCardsDueToday(cards, TODAY)
    expect(due.map((c) => c.id).sort()).toEqual(['a', 'b'])
  })

  it('incluye cards cuya next_review es hoy o antes', () => {
    const cards = [
      { id: 'past', next_review: '2026-01-10' },
      { id: 'today', next_review: '2026-01-15' },
      { id: 'tomorrow', next_review: '2026-01-16' },
    ]
    const due = getCardsDueToday(cards, TODAY)
    expect(due.map((c) => c.id).sort()).toEqual(['past', 'today'])
  })

  it('soporta next_review en formato ISO con hora', () => {
    const cards = [
      { id: 'a', next_review: '2026-01-15T23:59:59.000Z' },
      { id: 'b', next_review: '2026-01-16T00:00:00.000Z' },
    ]
    const due = getCardsDueToday(cards, TODAY)
    expect(due.map((c) => c.id)).toEqual(['a'])
  })

  it('devuelve array vacio si nada esta due', () => {
    const cards = [
      { id: 'a', next_review: '2030-01-01' },
      { id: 'b', next_review: '2030-01-02' },
    ]
    expect(getCardsDueToday(cards, TODAY)).toEqual([])
  })
})
