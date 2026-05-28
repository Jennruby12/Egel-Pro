import { describe, it, expect } from 'vitest'
import { evaluateAchievements, type AchievementContext } from './achievements'
import type { AchievementType } from '@/lib/constants/gamification'

function makeCtx(overrides: Partial<AchievementContext> = {}): AchievementContext {
  return {
    totalCompletedSessions: 0,
    totalQuestionsAnswered: 0,
    streakCurrent: 0,
    hasFullSimulacro: false,
    hasSimulacroSobresaliente: false,
    hasQuickQuizUnder10Min: false,
    hasPerfectOn20Plus: false,
    hasPerseverantSequence: false,
    accuracyByArea: {},
    ...overrides,
  }
}

describe('evaluateAchievements', () => {
  it('first_quiz se desbloquea con primera sesion completada', () => {
    const result = evaluateAchievements(makeCtx({ totalCompletedSessions: 1 }), new Set())
    expect(result).toContain('first_quiz')
  })

  it('no devuelve un logro ya desbloqueado', () => {
    const result = evaluateAchievements(
      makeCtx({ totalCompletedSessions: 1 }),
      new Set<AchievementType>(['first_quiz']),
    )
    expect(result).not.toContain('first_quiz')
  })

  it('streak_3, _7, _14, _30 progresivos', () => {
    expect(evaluateAchievements(makeCtx({ streakCurrent: 3 }), new Set())).toEqual(
      expect.arrayContaining(['streak_3']),
    )
    expect(evaluateAchievements(makeCtx({ streakCurrent: 7 }), new Set())).toEqual(
      expect.arrayContaining(['streak_3', 'streak_7']),
    )
    expect(evaluateAchievements(makeCtx({ streakCurrent: 30 }), new Set())).toEqual(
      expect.arrayContaining(['streak_3', 'streak_7', 'streak_14', 'streak_30']),
    )
  })

  it('area_mastered requiere 90%+', () => {
    const r1 = evaluateAchievements(
      makeCtx({ accuracyByArea: { 1: 89 } }),
      new Set(),
    )
    expect(r1).not.toContain('area1_mastered')

    const r2 = evaluateAchievements(
      makeCtx({ accuracyByArea: { 1: 90 } }),
      new Set(),
    )
    expect(r2).toContain('area1_mastered')
  })

  it('all_areas_mastered solo con 4 areas a 90%+', () => {
    const r1 = evaluateAchievements(
      makeCtx({ accuracyByArea: { 1: 90, 2: 90, 3: 90 } }),
      new Set(),
    )
    expect(r1).not.toContain('all_areas_mastered')

    const r2 = evaluateAchievements(
      makeCtx({ accuracyByArea: { 1: 90, 2: 90, 3: 95, 4: 91 } }),
      new Set(),
    )
    expect(r2).toContain('all_areas_mastered')
  })

  it('questions_100/500/1000 progresivos', () => {
    expect(
      evaluateAchievements(makeCtx({ totalQuestionsAnswered: 500 }), new Set()),
    ).toEqual(expect.arrayContaining(['questions_100', 'questions_500']))
  })

  it('perfect_score requiere flag hasPerfectOn20Plus', () => {
    expect(
      evaluateAchievements(makeCtx({ hasPerfectOn20Plus: true }), new Set()),
    ).toContain('perfect_score')
  })

  it('sin condiciones cumplidas: lista vacia', () => {
    expect(evaluateAchievements(makeCtx(), new Set())).toEqual([])
  })

  it('logros v2 no se desbloquean automaticamente', () => {
    const ctx = makeCtx({
      totalCompletedSessions: 100,
      totalQuestionsAnswered: 5000,
      streakCurrent: 50,
    })
    const result = evaluateAchievements(ctx, new Set())
    expect(result).not.toContain('all_guides_read')
    expect(result).not.toContain('night_owl')
    expect(result).not.toContain('secret_1')
  })
})
