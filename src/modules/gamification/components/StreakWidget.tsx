'use client'

import { Flame } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { cn } from '@/lib/utils/cn'

type StreakWidgetProps = {
  current: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES = {
  sm: {
    container:
      'gap-1 rounded-full bg-streak/10 px-2 py-0.5 text-xs border border-streak/30',
    icon: 'h-3.5 w-3.5',
    number: 'text-xs font-semibold tabular-nums',
  },
  md: {
    container:
      'gap-1.5 rounded-full bg-streak/10 px-3 py-1 text-sm border border-streak/30 shadow-[0_0_12px_-2px_hsl(var(--streak)/0.5)]',
    icon: 'h-4 w-4',
    number: 'text-sm font-semibold tabular-nums',
  },
  lg: {
    container:
      'gap-3 rounded-lg border border-streak/30 bg-bg-surface p-4 shadow-[0_0_24px_-6px_hsl(var(--streak)/0.6)]',
    icon: 'h-8 w-8',
    number: 'text-3xl font-bold tabular-nums',
  },
} as const

export function StreakWidget({ current, max, size = 'md' }: StreakWidgetProps) {
  const styles = SIZE_CLASSES[size]
  const dayLabel = current === 1 ? 'dia' : 'dias'

  if (size === 'lg') {
    return (
      <div
        className={cn('flex items-center', styles.container)}
        data-testid="streak-widget"
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Flame
            className={cn(
              styles.icon,
              'text-streak drop-shadow-[0_0_8px_hsl(var(--streak)/0.7)]',
            )}
          />
        </motion.div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Racha actual
          </span>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={current}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className={cn(styles.number, 'text-streak')}
            >
              <AnimatedCounter value={current} />{' '}
              <span className="text-base font-medium">{dayLabel}</span>
            </motion.span>
          </AnimatePresence>
          {typeof max === 'number' && max > 0 && (
            <span className="mt-0.5 text-xs text-muted-foreground">
              Maxima: {max} {max === 1 ? 'dia' : 'dias'}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('inline-flex items-center text-streak', styles.container)}
      data-testid="streak-widget"
      title={typeof max === 'number' ? `Racha maxima: ${max}` : undefined}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Flame
          className={cn(styles.icon, 'drop-shadow-[0_0_6px_hsl(var(--streak)/0.7)]')}
        />
      </motion.div>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={current}
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className={styles.number}
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
