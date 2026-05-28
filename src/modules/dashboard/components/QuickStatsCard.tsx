'use client'

import { Brain, Target, Clock, TrendingUp, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/animated-counter'

type QuickStatsCardProps = {
  totalQuestions: number
  averageAccuracy: number
  totalQuizzes: number
  bestStreak: number
}

type StatDef = {
  key: 'totalQuestions' | 'averageAccuracy' | 'totalQuizzes' | 'bestStreak'
  label: string
  icon: LucideIcon
  color: string
  glow: string
  suffix?: string
}

const STATS: StatDef[] = [
  { key: 'totalQuestions',  label: 'Preguntas resueltas', icon: Brain,      color: 'text-brand-400', glow: 'shadow-glow-brand' },
  { key: 'averageAccuracy', label: 'Precision promedio',  icon: Target,     color: 'text-success',   glow: 'shadow-[0_0_24px_-4px_hsl(var(--success)/0.6)]', suffix: '%' },
  { key: 'totalQuizzes',    label: 'Quizzes hechos',      icon: Clock,      color: 'text-cyan-ice',  glow: 'shadow-[0_0_24px_-4px_hsl(var(--cyan-ice)/0.6)]' },
  { key: 'bestStreak',      label: 'Racha maxima',        icon: TrendingUp, color: 'text-streak',    glow: 'shadow-[0_0_24px_-4px_hsl(var(--streak)/0.6)]' },
]

export function QuickStatsCard(props: QuickStatsCardProps) {
  const values: Record<StatDef['key'], number> = {
    totalQuestions: props.totalQuestions,
    averageAccuracy: props.averageAccuracy,
    totalQuizzes: props.totalQuizzes,
    bestStreak: props.bestStreak,
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {STATS.map((s, i) => {
        const Icon = s.icon
        return (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col gap-3 rounded-xl border border-glass-border/30 bg-glass-bg/40 p-4 backdrop-blur-md transition-all duration-normal ease-out-expo hover:border-brand-400/40 hover:-translate-y-0.5"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg bg-bg-raised/60 ${s.color} transition-shadow duration-normal group-hover:${s.glow}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`mt-1 text-2xl font-bold tabular-nums ${s.color}`}>
                <AnimatedCounter value={values[s.key]} suffix={s.suffix ?? ''} />
                {s.key === 'bestStreak' && (
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    {values.bestStreak === 1 ? 'dia' : 'dias'}
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
