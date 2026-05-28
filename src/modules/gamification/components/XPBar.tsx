'use client'

import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { getLevelProgress } from '@/lib/constants/gamification'
import { cn } from '@/lib/utils/cn'

type XPBarProps = {
  xpTotal: number
  showLabels?: boolean
}

export function XPBar({ xpTotal, showLabels = true }: XPBarProps) {
  const progress = getLevelProgress(xpTotal)
  const isMaxLevel = progress.next === null

  return (
    <div className="w-full space-y-1.5" data-testid="xp-bar">
      {showLabels && (
        <div className="flex items-baseline justify-between text-xs">
          <span className="font-medium text-foreground">
            Nivel{' '}
            <AnimatedCounter
              value={progress.current.level}
              className="text-foreground"
            />{' '}
            ·{' '}
            <span className="text-muted-foreground">{progress.current.name}</span>
          </span>
          <span className="font-mono tabular-nums text-muted-foreground">
            {isMaxLevel
              ? `${xpTotal.toLocaleString('es-MX')} XP`
              : `${progress.xpInLevel.toLocaleString('es-MX')} / ${progress.xpNeeded.toLocaleString('es-MX')} XP`}
          </span>
        </div>
      )}

      {isMaxLevel ? (
        <div className="flex h-2.5 w-full items-center justify-center overflow-hidden rounded-full bg-bg-raised">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-xp">
            Nivel maximo
          </span>
        </div>
      ) : (
        <div
          className={cn(
            'relative h-2.5 w-full overflow-hidden rounded-full bg-bg-raised',
          )}
          role="progressbar"
          aria-valuenow={progress.percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className={cn(
              'h-full rounded-full',
              // Gradient aurora animado (no solid color)
              'bg-[linear-gradient(90deg,hsl(var(--aurora-1)),hsl(var(--aurora-2))_50%,hsl(var(--aurora-3)))] bg-[length:200%_100%]',
            )}
            initial={{ width: 0, backgroundPosition: '0% 0%' }}
            animate={{
              width: `${progress.percent}%`,
              backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
            }}
            transition={{
              width: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              backgroundPosition: { duration: 6, repeat: Infinity, ease: 'linear' },
            }}
          />
        </div>
      )}
    </div>
  )
}
