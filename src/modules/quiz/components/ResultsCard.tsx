'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Check, X, MinusCircle, Sparkles, Clock } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { fireConfetti } from '@/components/ui/confetti'
import { ScoreAnimation } from './ScoreAnimation'
import { cn } from '@/lib/utils/cn'
import type { PerformanceLevel } from '@/types/global'

type ResultsCardProps = {
  scorePercent: number
  performanceLevel: PerformanceLevel
  correct: number
  wrong: number
  skipped: number
  total: number
  xpEarned: number
  timeTakenSeconds: number | null
}

function fmtTime(s: number | null) {
  if (s === null || s < 0) return '—'
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h > 0
    ? `${h}h ${m}m`
    : m > 0
      ? `${m}m ${sec}s`
      : `${sec}s`
}

type StatDef = {
  label: string
  icon: typeof Check
  color: string
  ring: string
}

const STATS_META: Record<'correct' | 'wrong' | 'skipped' | 'xp' | 'time', StatDef> = {
  correct: {
    label: 'Correctas',
    icon: Check,
    color: 'text-success',
    ring: 'ring-success/30 bg-success/10',
  },
  wrong: {
    label: 'Incorrectas',
    icon: X,
    color: 'text-danger',
    ring: 'ring-danger/30 bg-danger/10',
  },
  skipped: {
    label: 'Saltadas',
    icon: MinusCircle,
    color: 'text-muted-foreground',
    ring: 'ring-bg-border/40 bg-bg-raised/40',
  },
  xp: {
    label: 'XP ganado',
    icon: Sparkles,
    color: 'text-xp',
    ring: 'ring-xp/30 bg-xp/10',
  },
  time: {
    label: 'Tiempo',
    icon: Clock,
    color: 'text-cyan-ice',
    ring: 'ring-cyan-ice/30 bg-cyan-ice/10',
  },
}

export function ResultsCard({
  scorePercent,
  performanceLevel,
  correct,
  wrong,
  skipped,
  total,
  xpEarned,
  timeTakenSeconds,
}: ResultsCardProps) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true
    const ratio = total > 0 ? correct / total : 0
    if (ratio >= 0.95) {
      fireConfetti('perfectScore')
    } else if (performanceLevel === 'sobresaliente') {
      fireConfetti('levelUp')
    } else if (performanceLevel === 'satisfactorio') {
      fireConfetti('celebration')
    }
  }, [correct, total, performanceLevel])

  return (
    <GlassCard variant="elevated" padding="xl" className="space-y-8">
      <ScoreAnimation
        scorePercent={scorePercent}
        performanceLevel={performanceLevel}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatBox
          meta={STATS_META.correct}
          delay={0}
        >
          <AnimatedCounter value={correct} />
        </StatBox>
        <StatBox meta={STATS_META.wrong} delay={0.08}>
          <AnimatedCounter value={wrong} />
        </StatBox>
        <StatBox meta={STATS_META.skipped} delay={0.16}>
          <AnimatedCounter value={skipped} />
        </StatBox>
        <StatBox meta={STATS_META.xp} delay={0.24}>
          <AnimatedCounter value={xpEarned} prefix="+" />
        </StatBox>
        <StatBox meta={STATS_META.time} delay={0.32} isText>
          {fmtTime(timeTakenSeconds)}
        </StatBox>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-center text-sm text-muted-foreground"
      >
        <span className="font-mono text-success">{correct}</span> de{' '}
        <span className="font-mono text-foreground">{total}</span> preguntas correctas
      </motion.p>
    </GlassCard>
  )
}

function StatBox({
  meta,
  children,
  delay,
  isText,
}: {
  meta: StatDef
  children: React.ReactNode
  delay: number
  isText?: boolean
}) {
  const Icon = meta.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl border border-glass-border/30 bg-glass-bg/40 p-4 text-center backdrop-blur-md',
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg ring-1',
          meta.ring,
        )}
      >
        <Icon className={cn('h-4 w-4', meta.color)} />
      </div>
      <p
        className={cn(
          'text-2xl font-bold tabular-nums',
          meta.color,
          isText && 'font-mono',
        )}
      >
        {children}
      </p>
      <p className="text-xs text-muted-foreground">{meta.label}</p>
    </motion.div>
  )
}
