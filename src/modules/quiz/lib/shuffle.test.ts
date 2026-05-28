import { describe, it, expect } from 'vitest'
import {
  shuffle,
  shuffleQuestionOptions,
  seedFromString,
  type Question,
} from './shuffle'

describe('shuffle', () => {
  it('retorna un array nuevo, no muta el original', () => {
    const original = [1, 2, 3, 4, 5]
    const result = shuffle(original)
    expect(result).not.toBe(original)
    expect(original).toEqual([1, 2, 3, 4, 5])
  })

  it('preserva todos los elementos', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = shuffle(arr)
    expect(result.sort()).toEqual([1, 2, 3, 4, 5])
  })

  it('es determinista con seed', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const r1 = shuffle(arr, 42)
    const r2 = shuffle(arr, 42)
    const r3 = shuffle(arr, 43)
    expect(r1).toEqual(r2)
    expect(r1).not.toEqual(r3)
  })

  it('maneja array vacio', () => {
    expect(shuffle([])).toEqual([])
  })

  it('maneja array de un elemento', () => {
    expect(shuffle([42])).toEqual([42])
  })
})

describe('shuffleQuestionOptions', () => {
  const question: Question = {
    option_a: 'Manzana',
    option_b: 'Pera',
    option_c: 'Sandia',
    correct_answer: 'b',
  }

  it('retorna 3 opciones', () => {
    const r = shuffleQuestionOptions(question)
    expect(r.options).toHaveLength(3)
  })

  it('preserva originalCorrect', () => {
    const r = shuffleQuestionOptions(question)
    expect(r.originalCorrect).toBe('b')
  })

  it('marca isCorrect en la opcion correcta original', () => {
    const r = shuffleQuestionOptions(question)
    const correct = r.options.find((o) => o.isCorrect)
    expect(correct?.text).toBe('Pera')
  })

  it('es determinista con seed', () => {
    const r1 = shuffleQuestionOptions(question, 100)
    const r2 = shuffleQuestionOptions(question, 100)
    expect(r1.options.map((o) => o.label)).toEqual(r2.options.map((o) => o.label))
  })

  it('preserva las 3 letras a/b/c en el resultado', () => {
    const r = shuffleQuestionOptions(question, 100)
    const labels = r.options.map((o) => o.label).sort()
    expect(labels).toEqual(['a', 'b', 'c'])
  })
})

describe('seedFromString', () => {
  it('mismo string produce mismo seed', () => {
    expect(seedFromString('quiz-abc-123')).toBe(seedFromString('quiz-abc-123'))
  })

  it('strings diferentes producen seeds diferentes', () => {
    expect(seedFromString('a')).not.toBe(seedFromString('b'))
  })

  it('siempre retorna un numero positivo', () => {
    for (const s of ['a', 'abcdef', 'session-uuid-12345', '!!!']) {
      expect(seedFromString(s)).toBeGreaterThanOrEqual(0)
    }
  })
})
