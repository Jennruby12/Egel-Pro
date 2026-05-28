'use client'

import { Clock, Infinity as InfinityIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatTime, getTimeUrgency } from '@/modules/quiz/lib/timer'
import { cn } from '@/lib/utils/cn'

type QuizTimerProps = {
  remainingSeconds: number
  totalSeconds: number | null
}

const SIZE = 64
const STROKE = 5
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const URGENCY_COLOR = {
  safe: 'hsl(var(--cyan-ice))',
  warning: 'hsl(var(--warning))',
  critical: 'hsl(var(--danger))',
} as const

const URGENCY_TEXT = {
  safe: 'text-cyan-ice',
  warning: 'text-warning',
  critical: 'text-danger',
} as const

export function QuizTimer({ remainingSeconds, totalSeconds }: QuizTimerProps) {
  if (totalSeconds === null) {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full border border-glass-border/40 bg-glass-bg/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md"
        title="Sin limite de tiempo"
      >
        <InfinityIcon className="h-4 w-4" />
        Sin limite
      </div>
    )
  }

  const urgency = getTimeUrgency(remainingSeconds, totalSeconds)
  const color = URGENCY_COLOR[urgency]
  const textClass = URGENCY_TEXT[urgency]

  const fraction = Math.max(
    0,
    Math.min(1, remainingSeconds / Math.max(1, totalSeconds)),
  )
  const dashOffset = CIRCUMFERENCE * (1 - fraction)

  return (
    <div
      className={cn(
        'relative inline-flex items-center gap-3 rounded-full border border-glass-border/40 bg-glass-bg/60 py-1.5 pl-2 pr-4 backdrop-blur-md transition-all',
        urgency === 'critical' && 'animate-pulse-glow border-danger/50',
      )}
      data-testid="quiz-timer"
    >
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
        >
          <defs>
            <linearGradient
              id="quiz-timer-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(var(--aurora-1))" />
              <stop offset="50%" stopColor="hsl(var(--aurora-2))" />
              <stop offset="100%" stopColor="hsl(var(--aurora-3))" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="hsl(var(--bg-border))"
            strokeWidth={STROKE}
            fill="none"
            strokeOpacity={0.5}
          />
          {/* Progress */}
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={urgency === 'safe' ? 'url(#quiz-timer-gradient)' : color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: dashOffset }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock className={cn('h-4 w-4', textClass)} />
        </div>
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            'font-mono text-sm font-bold tabular-nums',
            textClass,
          )}
        >
          {formatTime(remainingSeconds)}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          restante
        </span>
      </div>
    </div>
  )
}
