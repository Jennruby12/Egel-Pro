'use client'

import { motion } from 'framer-motion'
import { Trophy, ThumbsUp, Sprout } from 'lucide-react'
import { SparklesText } from '@/components/ui/sparkles-text'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { cn } from '@/lib/utils/cn'
import type { PerformanceLevel } from '@/types/global'

type ScoreAnimationProps = {
  scorePercent: number
  performanceLevel: PerformanceLevel
}

const LEVEL_META: Record<
  PerformanceLevel,
  {
    label: string
    Icon: typeof Trophy
    color: string
    glow: string
    bg: string
  }
> = {
  ans: {
    label: 'Aun No Satisfactorio',
    Icon: Sprout,
    color: 'text-danger',
    glow: 'drop-shadow-[0_0_24px_hsl(var(--danger)/0.5)]',
    bg: 'bg-danger/10',
  },
  satisfactorio: {
    label: 'Satisfactorio',
    Icon: ThumbsUp,
    color: 'text-warning',
    glow: 'drop-shadow-[0_0_24px_hsl(var(--warning)/0.5)]',
    bg: 'bg-warning/10',
  },
  sobresaliente: {
    label: 'Sobresaliente',
    Icon: Trophy,
    color: 'text-success',
    glow: 'drop-shadow-[0_0_32px_hsl(var(--success)/0.6)]',
    bg: 'bg-success/10',
  },
}

export function ScoreAnimation({
  scorePercent,
  performanceLevel,
}: ScoreAnimationProps) {
  const meta = LEVEL_META[performanceLevel]
  const Icon = meta.Icon
  const isPerfect = scorePercent >= 95

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-4 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 220,
          damping: 14,
          delay: 0.15,
        }}
        className={cn(
          'flex h-20 w-20 items-center justify-center rounded-full ring-2 ring-glass-border/40 backdrop-blur-md animate-float',
          meta.bg,
        )}
      >
        <Icon className={cn('h-10 w-10', meta.color, meta.glow)} />
      </motion.div>

      <div className="relative">
        {isPerfect ? (
          <SparklesText count={12}>
            <span
              className={cn(
                'block text-display-xl font-bold tabular-nums md:text-display-2xl',
                'text-aurora',
              )}
            >
              <AnimatedCounter value={scorePercent} decimals={1} suffix="%" duration={1.6} />
            </span>
          </SparklesText>
        ) : (
          <span
            className={cn(
              'block text-display-xl font-bold tabular-nums md:text-display-2xl',
              meta.color,
              meta.glow,
            )}
          >
            <AnimatedCounter value={scorePercent} decimals={1} suffix="%" duration={1.6} />
          </span>
        )}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className={cn('text-lg font-semibold tracking-wide', meta.color)}
      >
        {meta.label}
      </motion.p>
    </motion.div>
  )
}
