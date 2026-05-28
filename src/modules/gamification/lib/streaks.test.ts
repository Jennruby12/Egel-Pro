import { describe, it, expect } from 'vitest'
import { computeCurrentStreak } from './streaks'

describe('computeCurrentStreak', () => {
  it('cero dias si no hay registros', () => {
    expect(computeCurrentStreak('2026-05-25', [])).toBe(0)
  })

  it('cero si el ultimo registro es de hace mas de 1 dia (racha rota)', () => {
    expect(computeCurrentStreak('2026-05-25', ['2026-05-23', '2026-05-22'])).toBe(0)
  })

  it('1 dia si solo se registro hoy', () => {
    expect(computeCurrentStreak('2026-05-25', ['2026-05-25'])).toBe(1)
  })

  it('1 dia si solo se registro ayer (racha sigue viva pero solo 1)', () => {
    expect(computeCurrentStreak('2026-05-25', ['2026-05-24'])).toBe(1)
  })

  it('cuenta dias consecutivos correctamente', () => {
    expect(
      computeCurrentStreak('2026-05-25', [
        '2026-05-25',
        '2026-05-24',
        '2026-05-23',
        '2026-05-22',
        '2026-05-21',
      ]),
    ).toBe(5)
  })

  it('se detiene en el primer hueco', () => {
    expect(
      computeCurrentStreak('2026-05-25', [
        '2026-05-25',
        '2026-05-24',
        '2026-05-22', // <- hueco, falta 23
        '2026-05-21',
      ]),
    ).toBe(2)
  })

  it('streak desde ayer continua si hay registros previos consecutivos', () => {
    expect(
      computeCurrentStreak('2026-05-25', ['2026-05-24', '2026-05-23', '2026-05-22']),
    ).toBe(3)
  })
})
