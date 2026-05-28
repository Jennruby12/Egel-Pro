import { describe, it, expect } from 'vitest'
import {
  breakdownSeconds,
  formatTime,
  formatTimeCompact,
  calculateTimeRemaining,
  calculateTimeElapsed,
  isTimeUp,
  getTimeUrgency,
} from './timer'

describe('breakdownSeconds', () => {
  it('desglosa correctamente', () => {
    expect(breakdownSeconds(3725)).toEqual({ hours: 1, minutes: 2, seconds: 5 })
    expect(breakdownSeconds(75)).toEqual({ hours: 0, minutes: 1, seconds: 15 })
    expect(breakdownSeconds(0)).toEqual({ hours: 0, minutes: 0, seconds: 0 })
  })

  it('trunca decimales', () => {
    expect(breakdownSeconds(75.9)).toEqual({ hours: 0, minutes: 1, seconds: 15 })
  })

  it('clamps negativos a 0', () => {
    expect(breakdownSeconds(-100)).toEqual({ hours: 0, minutes: 0, seconds: 0 })
  })
})

describe('formatTime', () => {
  it.each([
    [0, '0:00'],
    [5, '0:05'],
    [75, '1:15'],
    [3725, '1:02:05'],
    [16200, '4:30:00'], // tiempo oficial EGEL (4.5 horas)
  ])('formatTime(%i) === %s', (s, expected) => {
    expect(formatTime(s)).toBe(expected)
  })

  it('negativos se renderizan como 0:00', () => {
    expect(formatTime(-10)).toBe('0:00')
  })
})

describe('formatTimeCompact', () => {
  it.each([
    [45, '45s'],
    [75, '1m 15s'],
    [3725, '1h 2m'],
  ])('formatTimeCompact(%i) === %s', (s, expected) => {
    expect(formatTimeCompact(s)).toBe(expected)
  })
})

describe('calculateTimeRemaining', () => {
  it('retorna el limite cuando recien empezo', () => {
    const start = new Date('2026-01-01T10:00:00Z')
    const now = new Date('2026-01-01T10:00:00Z')
    expect(calculateTimeRemaining(start, 600, now)).toBe(600)
  })

  it('descuenta el tiempo transcurrido', () => {
    const start = new Date('2026-01-01T10:00:00Z')
    const now = new Date('2026-01-01T10:05:00Z') // +5 min
    expect(calculateTimeRemaining(start, 600, now)).toBe(300)
  })

  it('clamps a 0 cuando se paso del limite', () => {
    const start = new Date('2026-01-01T10:00:00Z')
    const now = new Date('2026-01-01T11:00:00Z') // +1 hora
    expect(calculateTimeRemaining(start, 600, now)).toBe(0)
  })

  it('acepta string ISO como startedAt', () => {
    const start = '2026-01-01T10:00:00Z'
    const now = new Date('2026-01-01T10:01:00Z')
    expect(calculateTimeRemaining(start, 600, now)).toBe(540)
  })
})

describe('calculateTimeElapsed', () => {
  it('cuenta segundos desde el inicio', () => {
    const start = new Date('2026-01-01T10:00:00Z')
    const now = new Date('2026-01-01T10:01:30Z')
    expect(calculateTimeElapsed(start, now)).toBe(90)
  })

  it('clamps a 0 si "now" es anterior a start', () => {
    const start = new Date('2026-01-01T10:00:00Z')
    const now = new Date('2026-01-01T09:00:00Z')
    expect(calculateTimeElapsed(start, now)).toBe(0)
  })
})

describe('isTimeUp', () => {
  it('false si todavia hay tiempo', () => {
    const start = new Date('2026-01-01T10:00:00Z')
    const now = new Date('2026-01-01T10:00:30Z')
    expect(isTimeUp(start, 60, now)).toBe(false)
  })

  it('true exacto en el limite', () => {
    const start = new Date('2026-01-01T10:00:00Z')
    const now = new Date('2026-01-01T10:01:00Z')
    expect(isTimeUp(start, 60, now)).toBe(true)
  })

  it('true cuando se paso', () => {
    const start = new Date('2026-01-01T10:00:00Z')
    const now = new Date('2026-01-01T10:05:00Z')
    expect(isTimeUp(start, 60, now)).toBe(true)
  })
})

describe('getTimeUrgency', () => {
  it('safe cuando hay mucho tiempo (>25%)', () => {
    expect(getTimeUrgency(800, 1000)).toBe('safe')
  })

  it('warning cuando queda <= 25% (pero arriba de 10% y >= 60s)', () => {
    // 200/1000 = 20% (warning), pero 200s > 60s
    expect(getTimeUrgency(200, 1000)).toBe('warning')
  })

  it('critical cuando queda <= 10%', () => {
    expect(getTimeUrgency(100, 1000)).toBe('critical')
  })

  it('critical siempre que queden menos de 60s, sin importar %', () => {
    expect(getTimeUrgency(45, 10_000)).toBe('critical')
  })

  it('safe si totalSeconds es 0 (evita NaN)', () => {
    expect(getTimeUrgency(0, 0)).toBe('safe')
  })
})
