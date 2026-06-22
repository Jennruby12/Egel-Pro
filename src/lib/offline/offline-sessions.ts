'use client'

import type { CorrectAnswer } from '@/types/global'

/**
 * Cola de SESIONES de quiz hechas sin internet, en localStorage. Cada una se
 * sube al servidor cuando vuelve la conexion (fase 4 de sync). Distinto de la
 * cola de respuestas sueltas (offline-queue.ts), que es para quizzes online que
 * pierden red a media sesion.
 */

const KEY = 'egelpro-offline-sessions-v1'

export type OfflineSessionAnswer = {
  questionId: string
  userAnswer: CorrectAnswer | null
  isCorrect: boolean | null
  timeSpentSeconds: number
}

export type PendingOfflineSession = {
  id: string
  mode: 'practice'
  areas: number[]
  total: number
  correct: number
  wrong: number
  skipped: number
  scorePercent: number
  answers: OfflineSessionAnswer[]
  startedAt: number
  finishedAt: number
}

export function readOfflineSessions(): PendingOfflineSession[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeOfflineSessions(items: PendingOfflineSession[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // localStorage lleno/disabled: no romper la app.
  }
}

export function enqueueOfflineSession(session: PendingOfflineSession): void {
  const items = readOfflineSessions()
  items.push(session)
  writeOfflineSessions(items)
}

export function offlineSessionsCount(): number {
  return readOfflineSessions().length
}

export function clearOfflineSessions(): void {
  writeOfflineSessions([])
}
