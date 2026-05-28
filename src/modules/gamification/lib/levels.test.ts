import { describe, it, expect } from 'vitest'
import { detectLevelUp } from './levels'

describe('detectLevelUp', () => {
  it('detecta subida de nivel 1 -> 2 al cruzar 200 XP', () => {
    const r = detectLevelUp(150, 220)
    expect(r.leveledUp).toBe(true)
    expect(r.previousLevel).toBe(1)
    expect(r.newLevel).toBe(2)
    expect(r.newLevelDef?.name).toBe('Estudiante')
  })

  it('NO sube de nivel si se queda en el mismo rango', () => {
    const r = detectLevelUp(50, 199)
    expect(r.leveledUp).toBe(false)
    expect(r.previousLevel).toBe(1)
    expect(r.newLevel).toBe(1)
  })

  it('detecta subida de nivel 6 -> 7 al cruzar 15000 XP', () => {
    const r = detectLevelUp(14_900, 15_100)
    expect(r.leveledUp).toBe(true)
    expect(r.previousLevel).toBe(6)
    expect(r.newLevel).toBe(7)
  })

  it('puede saltar varios niveles en una sola ganancia', () => {
    const r = detectLevelUp(0, 5000)
    expect(r.leveledUp).toBe(true)
    expect(r.previousLevel).toBe(1)
    expect(r.newLevel).toBe(5)
  })

  it('XP negativo clamps a 0 (no rompe)', () => {
    const r = detectLevelUp(-100, 250)
    expect(r.leveledUp).toBe(true)
    expect(r.previousLevel).toBe(1)
    expect(r.newLevel).toBe(2)
  })
})
