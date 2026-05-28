import { describe, it, expect } from 'vitest'
import { calculateXPWithBreakdown } from './xp'

describe('calculateXPWithBreakdown', () => {
  it('practice mode sin bonus', () => {
    const r = calculateXPWithBreakdown({ mode: 'practice', correct: 5, total: 10, streakActive: false })
    expect(r.baseXP).toBe(50) // 5 * 10
    expect(r.appliedMultipliers).toEqual([])
    expect(r.finalXP).toBe(50)
  })

  it('aplica bonus de racha (x1.2)', () => {
    const r = calculateXPWithBreakdown({ mode: 'practice', correct: 5, total: 10, streakActive: true })
    expect(r.appliedMultipliers).toHaveLength(1)
    expect(r.appliedMultipliers[0]?.label).toBe('Racha activa')
    expect(r.finalXP).toBe(60) // 50 * 1.2
  })

  it('aplica bonus de score perfecto (x1.5)', () => {
    const r = calculateXPWithBreakdown({ mode: 'quick_exam', correct: 10, total: 10, streakActive: false })
    // base = 15 * 10 = 150, perfect = 225
    expect(r.baseXP).toBe(150)
    expect(r.finalXP).toBe(225)
  })

  it('apila ambos bonuses (racha + perfecto)', () => {
    const r = calculateXPWithBreakdown({ mode: 'full_simulacro', correct: 10, total: 10, streakActive: true })
    // base = 20 * 10 = 200, *1.2 *1.5 = 360
    expect(r.appliedMultipliers).toHaveLength(2)
    expect(r.finalXP).toBe(360)
  })

  it('redondea el resultado final', () => {
    // 10 base * 1.2 = 12 exact, pero con muchos correct podria dar decimales
    const r = calculateXPWithBreakdown({ mode: 'review', correct: 7, total: 10, streakActive: true })
    // base = 12 * 7 = 84, *1.2 = 100.8 -> round 101
    expect(r.finalXP).toBe(101)
  })

  it('cero correctas = cero XP', () => {
    const r = calculateXPWithBreakdown({ mode: 'practice', correct: 0, total: 10, streakActive: true })
    expect(r.finalXP).toBe(0)
  })
})
