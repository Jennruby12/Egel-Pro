'use client'

import { useEffect, useState } from 'react'

/**
 * Hook simple de countdown. Si timeLimitSeconds es null, no cuenta.
 * Retorna remainingSeconds (0 cuando se acaba) y la prop isExpired.
 *
 * onExpire se llama una unica vez cuando el contador llega a 0.
 */
export function useQuizTimer({
  startedAt,
  timeLimitSeconds,
  onExpire,
}: {
  startedAt: number
  timeLimitSeconds: number | null
  onExpire?: () => void
}) {
  const initial = computeRemaining(startedAt, timeLimitSeconds)
  const [remaining, setRemaining] = useState(initial)

  useEffect(() => {
    if (timeLimitSeconds === null) return
    const interval = setInterval(() => {
      const r = computeRemaining(startedAt, timeLimitSeconds)
      setRemaining(r)
      if (r === 0) {
        clearInterval(interval)
        onExpire?.()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt, timeLimitSeconds, onExpire])

  return {
    remainingSeconds: remaining,
    isExpired: timeLimitSeconds !== null && remaining === 0,
    isUnlimited: timeLimitSeconds === null,
  }
}

function computeRemaining(startedAt: number, timeLimitSeconds: number | null): number {
  if (timeLimitSeconds === null) return Infinity
  const elapsed = Math.floor((Date.now() - startedAt) / 1000)
  return Math.max(0, timeLimitSeconds - elapsed)
}
