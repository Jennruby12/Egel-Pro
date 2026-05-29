'use client'

import type { SubmitAnswerInput } from '@/lib/validations/quiz.schema'

/**
 * Cola de respuestas pendientes guardada en localStorage. Permite que el
 * usuario conteste preguntas sin red (ej. en el metro) y al recuperar
 * conexion se hace flush al servidor.
 */

const KEY = 'egelpro-offline-answers-queue-v1'

type QueueItem = {
  id: string
  payload: SubmitAnswerInput
  createdAt: number
  attempts: number
}

function readQueue(): QueueItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeQueue(items: QueueItem[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // localStorage lleno o disabled. La perdida de cola offline no debe romper la app.
  }
}

export function enqueueAnswer(payload: SubmitAnswerInput): void {
  const items = readQueue()
  // De-dup: si ya hay un item para esta (sessionId, questionId), lo reemplazamos.
  const filtered = items.filter(
    (i) =>
      !(i.payload.sessionId === payload.sessionId && i.payload.questionId === payload.questionId),
  )
  filtered.push({
    id: `${payload.sessionId}-${payload.questionId}-${Date.now()}`,
    payload,
    createdAt: Date.now(),
    attempts: 0,
  })
  writeQueue(filtered)
}

export function queueSize(): number {
  return readQueue().length
}

export function clearQueue(): void {
  writeQueue([])
}

/**
 * Intenta enviar todos los items pendientes. Cada item recibe un callback
 * `submit` que devuelve {success}. Si falla, queda en cola para reintento.
 */
export async function flushQueue(
  submit: (payload: SubmitAnswerInput) => Promise<{ success: boolean; error?: string }>,
): Promise<{ flushed: number; remaining: number; failed: number }> {
  const items = readQueue()
  if (items.length === 0) return { flushed: 0, remaining: 0, failed: 0 }

  const remaining: QueueItem[] = []
  let flushed = 0
  let failed = 0

  for (const item of items) {
    try {
      const r = await submit(item.payload)
      if (r.success) {
        flushed++
        continue
      }
      failed++
      remaining.push({ ...item, attempts: item.attempts + 1 })
    } catch {
      failed++
      remaining.push({ ...item, attempts: item.attempts + 1 })
    }
  }

  writeQueue(remaining)
  return { flushed, remaining: remaining.length, failed }
}
