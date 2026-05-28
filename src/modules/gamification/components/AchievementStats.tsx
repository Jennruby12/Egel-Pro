'use client'

import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { AnimatedCounter } from '@/components/ui/animated-counter'

type Props = {
  earned: number
  total: number
  totalXPFromAchievements?: number
}

export function AchievementStats({ earned, total }: Props) {
  const percent = total === 0 ? 0 : Math.round((earned / total) * 100)

  const helper =
    earned === 0
      ? 'Completa tu primer quiz para empezar a desbloquear logros.'
      : earned === total
        ? 'Todos los logros desbloqueados. Eres una leyenda!'
        : `${total - earned} logros por desbloquear. Sigue practicando.`

  return (
    <GlassCard variant="elevated" padding="lg" className="relative overflow-hidden">
      {/* Aura xp en la esquina */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-xp/15 blur-3xl"
      />
      <div className="relative space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-xp/15 text-xp shadow-[0_0_24px_-4px_hsl(var(--xp)/0.7)]">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Tus logros
              </p>
              <h2 className="text-2xl font-bold md:text-3xl">
                <span className="text-xp tabular-nums">
                  <AnimatedCounter value={earned} />
                </span>
                <span className="text-muted-foreground"> / {total}</span>
              </h2>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-3xl font-bold tabular-nums text-aurora">
              <AnimatedCounter value={percent} suffix="%" />
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              completado
            </p>
          </div>
        </div>

        {/* Progress bar aurora gradient */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-bg-raised">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--aurora-1)),hsl(var(--aurora-2))_50%,hsl(var(--aurora-3)))]"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <p className="text-sm text-muted-foreground">{helper}</p>
      </div>
    </GlassCard>
  )
}
