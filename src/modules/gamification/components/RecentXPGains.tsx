'use client'

import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { EmptyStateNoXP } from '@/components/shared/EmptyState'
import { cn } from '@/lib/utils/cn'

export type XPGain = {
  source: string
  amount: number
  when: Date | string
}

type RecentXPGainsProps = {
  gains: XPGain[]
  limit?: number
  className?: string
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value)
}

function formatRelative(value: Date | string): string {
  const date = toDate(value)
  if (Number.isNaN(date.getTime())) return ''
  return formatDistanceToNow(date, { addSuffix: true, locale: es })
}

export function RecentXPGains({
  gains,
  limit = 5,
  className,
}: RecentXPGainsProps) {
  const recent = gains.slice(0, limit)

  if (recent.length === 0) {
    return (
      <div className={cn('glass rounded-xl', className)} data-testid="recent-xp-gains-empty">
        <EmptyStateNoXP />
      </div>
    )
  }

  return (
    <ul
      className={cn(
        'glass divide-y divide-bg-border/40 overflow-hidden rounded-xl',
        className,
      )}
      data-testid="recent-xp-gains"
    >
      {recent.map((gain, idx) => (
        <motion.li
          key={`${gain.source}-${idx}-${toDate(gain.when).getTime()}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-bg-raised/30"
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-xp/15 text-xp shadow-[0_0_12px_-2px_hsl(var(--xp)/0.6)]"
            aria-hidden="true"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{gain.source}</p>
            <p className="text-xs text-muted-foreground">{formatRelative(gain.when)}</p>
          </div>
          <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-xp">
            +{gain.amount} XP
          </span>
        </motion.li>
      ))}
    </ul>
  )
}
