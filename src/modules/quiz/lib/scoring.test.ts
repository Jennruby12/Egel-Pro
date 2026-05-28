import { describe, it, expect } from 'vitest'
import {
  calculateScore,
  wouldPassExam,
  distributeQuestionsByArea,
  type AnsweredQuestion,
} from './scoring'

describe('calculateScore', () => {
  it('retorna ceros cuando no hay respuestas', () => {
    const result = calculateScore([])
    expect(result).toEqual({
      correct: 0,
      wrong: 0,
      skipped: 0,
      total: 0,
      scorePercent: 0,
      performanceLevel: 'ans',
      isPerfectScore: false,
    })
  })

  it('cuenta correctas, incorrectas y saltadas correctamente', () => {
    const answers: AnsweredQuestion[] = [
      { correctAnswer: 'a', userAnswer: 'a' },   // correct
      { correctAnswer: 'b', userAnswer: 'a' },   // wrong
      { correctAnswer: 'c', userAnswer: null },  // skipped
      { correctAnswer: 'a', userAnswer: 'a' },   // correct
    ]
    const r = calculateScore(answers)
    expect(r.correct).toBe(2)
    expect(r.wrong).toBe(1)
    expect(r.skipped).toBe(1)
    expect(r.total).toBe(4)
    expect(r.scorePercent).toBe(50)
  })

  it('marca isPerfectScore cuando todas son correctas', () => {
    const r = calculateScore([
      { correctAnswer: 'a', userAnswer: 'a' },
      { correctAnswer: 'b', userAnswer: 'b' },
      { correctAnswer: 'c', userAnswer: 'c' },
    ])
    expect(r.isPerfectScore).toBe(true)
    expect(r.scorePercent).toBe(100)
    expect(r.performanceLevel).toBe('sobresaliente')
  })

  it('NO marca isPerfectScore con una saltada (aunque no haya wrong)', () => {
    const r = calculateScore([
      { correctAnswer: 'a', userAnswer: 'a' },
      { correctAnswer: 'b', userAnswer: null },
    ])
    expect(r.isPerfectScore).toBe(false)
  })

  it('clasifica como ANS por debajo de 60%', () => {
    const r = calculateScore([
      { correctAnswer: 'a', userAnswer: 'a' },
      { correctAnswer: 'b', userAnswer: 'a' },
      { correctAnswer: 'c', userAnswer: 'a' },
    ])
    expect(r.scorePercent).toBeCloseTo(33.33, 1)
    expect(r.performanceLevel).toBe('ans')
  })

  it('clasifica como Satisfactorio exactamente en 60%', () => {
    // 6 de 10 correctas = 60%
    const answers: AnsweredQuestion[] = Array.from({ length: 10 }, (_, i) => ({
      correctAnswer: 'a' as const,
      userAnswer: i < 6 ? ('a' as const) : ('b' as const),
    }))
    const r = calculateScore(answers)
    expect(r.scorePercent).toBe(60)
    expect(r.performanceLevel).toBe('satisfactorio')
  })

  it('clasifica como Sobresaliente exactamente en 80%', () => {
    const answers: AnsweredQuestion[] = Array.from({ length: 10 }, (_, i) => ({
      correctAnswer: 'a' as const,
      userAnswer: i < 8 ? ('a' as const) : ('b' as const),
    }))
    const r = calculateScore(answers)
    expect(r.scorePercent).toBe(80)
    expect(r.performanceLevel).toBe('sobresaliente')
  })

  it('redondea scorePercent a 2 decimales', () => {
    // 1 de 3 = 33.333...
    const r = calculateScore([
      { correctAnswer: 'a', userAnswer: 'a' },
      { correctAnswer: 'b', userAnswer: 'a' },
      { correctAnswer: 'c', userAnswer: 'a' },
    ])
    expect(r.scorePercent).toBe(33.33)
  })
})

describe('wouldPassExam', () => {
  it.each([
    [0, false],
    [59.99, false],
    [60, true],
    [75, true],
    [100, true],
  ])('porcentaje %f -> %s', (percent, expected) => {
    expect(wouldPassExam(percent)).toBe(expected)
  })
})

describe('distributeQuestionsByArea', () => {
  it('suma exactamente targetTotal', () => {
    const dist = distributeQuestionsByArea(50)
    const sum = Object.values(dist).reduce((a, b) => a + b, 0)
    expect(sum).toBe(50)
  })

  it('respeta pesos del EGEL (area 3 es la que mas tiene)', () => {
    const dist = distributeQuestionsByArea(100)
    expect(dist[3]).toBeGreaterThan(dist[1]!)
    expect(dist[3]).toBeGreaterThan(dist[2]!)
    expect(dist[3]).toBeGreaterThan(dist[4]!)
  })

  it('con targetTotal=143 reproduce la distribucion oficial EGEL', () => {
    const dist = distributeQuestionsByArea(143)
    expect(dist).toEqual({ 1: 31, 2: 33, 3: 49, 4: 30 })
  })

  it('respeta pesos custom', () => {
    const dist = distributeQuestionsByArea(10, { 1: 1, 2: 1 })
    expect(dist[1]! + dist[2]!).toBe(10)
    expect(Math.abs(dist[1]! - dist[2]!)).toBeLessThanOrEqual(1)
  })

  it('retorna objeto vacio si todos los pesos son 0', () => {
    expect(distributeQuestionsByArea(10, {})).toEqual({})
  })
})
