'use client'

import { motion } from 'framer-motion'
import { Crown, Lock } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import {
  ACHIEVEMENTS_CATALOG,
  type AchievementType,
} from '@/lib/constants/gamification'
import { cn } from '@/lib/utils/cn'

type AchievementBadgeProps = {
  type: AchievementType
  earned: boolean
  earnedAt?: string | Date | null
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES = {
  sm: {
    padding: 'sm' as const,
    icon: 'text-2xl',
    title: 'text-xs',
    description: 'hidden',
  },
  md: {
    padding: 'md' as const,
    icon: 'text-5xl',
    title: 'text-sm',
    description: 'text-xs',
  },
  lg: {
    padding: 'lg' as const,
    icon: 'text-6xl',
    title: 'text-base',
    description: 'text-sm',
  },
} as const

function formatEarnedDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function AchievementBadge({
  type,
  earned,
  earnedAt,
  size = 'md',
}: AchievementBadgeProps) {
  const meta = ACHIEVEMENTS_CATALOG.find((a) => a.type === type)
  const styles = SIZE_CLASSES[size]

  if (!meta) return null

  // Logro secreto que aun no se obtiene: ocultar detalles
  const isSecret = meta.phase === 'v2' && !earned
  const displayTitle = isSecret ? '???' : meta.title
  const displayDescription = isSecret ? 'Condicion oculta' : meta.description

  const tooltip =
    earned && earnedAt
      ? `Obtenido: ${formatEarnedDate(earnedAt)}`
      : isSecret
        ? 'Logro secreto'
        : meta.description

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
      className="group"
    >
      <GlassCard
        variant={earned ? 'elevated' : 'flat'}
        padding={styles.padding}
        className={cn(
          'relative h-full text-center transition-all duration-normal',
          earned
            ? 'border-xp/40 shadow-[0_0_28px_-6px_hsl(var(--xp)/0.5)] hover:border-xp/70 hover:shadow-[0_0_36px_-4px_hsl(var(--xp)/0.7)]'
            : 'opacity-60 grayscale hover:opacity-90 hover:grayscale-0',
          isSecret && 'border-dashed',
        )}
        data-testid={`achievement-badge-${type}`}
        title={tooltip}
      >
        {/* Shimmer overlay para los locked en hover */}
        {!earned && !isSecret ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-normal group-hover:opacity-100"
          >
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <div className="shimmer absolute inset-0 bg-shimmer-gradient" />
            </div>
          </div>
        ) : null}

        {/* Badge gold "earned" en la esquina */}
        {earned && size !== 'sm' ? (
          <div
            aria-hidden
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-xp shadow-[0_0_12px_hsl(var(--xp)/0.7)] ring-2 ring-bg-base"
          >
            <Crown className="h-3 w-3 text-[hsl(232_65%_8%)]" />
          </div>
        ) : null}

        <div className="relative flex flex-col items-center gap-2">
          <div className={cn('leading-none', styles.icon)} aria-hidden="true">
            {isSecret ? (
              <Lock className="mx-auto h-[1em] w-[1em] text-muted-foreground" />
            ) : (
              meta.icon
            )}
          </div>
          <p className={cn('font-bold text-foreground', styles.title)}>{displayTitle}</p>
          <p className={cn('text-muted-foreground leading-snug', styles.description)}>
            {displayDescription}
          </p>
          {earned && earnedAt && size !== 'sm' && (
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-success">
              {formatEarnedDate(earnedAt)}
            </p>
          )}
        </div>
      </GlassCard>
    </motion.div>
  )
}
