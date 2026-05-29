'use client'

import { useEffect, useState } from 'react'
import { Clock, Flame, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { msUntilLocalMidnight, formatCountdown, toLocalDate } from '@/lib/utils/local-date'

type Props = {
  /** YYYY-MM-DD (local) del ultimo dia con actividad registrada. */
  lastActivityDate: string | null
  currentStreak: number
  /** Layout compacto para Header / sidebar. Default 'card'. */
  variant?: 'card' | 'inline'
}

/**
 * Countdown visible de cuanto falta para que la racha:
 *   (a) se reinicie por nuevo dia local (si ya tocaste hoy)
 *   (b) se rompa (si NO tocaste hoy y ayer si tenias racha)
 *   (c) muestra placeholder si nunca empezaste
 *
 * Actualiza cada segundo client-side desde new Date().
 */
export function StreakCountdown({
  lastActivityDate,
  currentStreak,
  variant = 'card',
}: Props) {
  const [ms, setMs] = useState<number>(() => msUntilLocalMidnight())
  const [today, setToday] = useState<string>(() => toLocalDate())

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setMs(msUntilLocalMidnight(now))
      setToday(toLocalDate(now))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const touchedToday = lastActivityDate === today
  const yesterday = (() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return toLocalDate(d)
  })()
  const touchedYesterday = lastActivityDate === yesterday

  let state: 'safe' | 'at-risk' | 'inactive' = 'inactive'
  if (touchedToday && currentStreak > 0) state = 'safe'
  else if (!touchedToday && touchedYesterday && currentStreak > 0) state = 'at-risk'

  const label = (() => {
    if (state === 'safe') {
      return currentStreak > 1
        ? `Racha segura. Proximo dia en ${formatCountdown(ms)}`
        : `Empezaste racha hoy. Proximo dia en ${formatCountdown(ms)}`
    }
    if (state === 'at-risk') {
      return `Pierdes tu racha de ${currentStreak} dia${currentStreak === 1 ? '' : 's'} en ${formatCountdown(ms)}`
    }
    return currentStreak > 0
      ? 'Tu racha esta rota. Practica hoy para iniciar una nueva'
      : 'Practica hoy para empezar una racha'
  })()

  const Icon = state === 'at-risk' ? AlertTriangle : state === 'safe' ? Flame : Clock
  const colorClass =
    state === 'at-risk'
      ? 'text-warning'
      : state === 'safe'
        ? 'text-streak'
        : 'text-muted-foreground'
  const bgClass =
    state === 'at-risk'
      ? 'bg-warning/10 border-warning/40'
      : state === 'safe'
        ? 'bg-streak/10 border-streak/40'
        : 'bg-glass-bg/40 border-glass-border/30'

  if (variant === 'inline') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs', colorClass)}>
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </span>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3 backdrop-blur-md',
        bgClass,
      )}
    >
      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', colorClass, 'bg-current/10')}>
        <Icon className={cn('h-4 w-4', colorClass)} />
      </span>
      <p className="text-sm font-medium">{label}</p>
    </div>
  )
}
