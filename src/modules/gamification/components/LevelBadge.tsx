'use client'

import { LEVELS } from '@/lib/constants/gamification'
import { cn } from '@/lib/utils/cn'

type LevelBadgeProps = {
  level: number
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES = {
  sm: {
    outer: 'h-8 w-8 p-[2px]',
    inner: 'text-xs',
    label: 'text-[10px]',
    wrapper: 'gap-1',
  },
  md: {
    outer: 'h-11 w-11 p-[2px]',
    inner: 'text-sm',
    label: 'text-xs',
    wrapper: 'gap-1.5',
  },
  lg: {
    outer: 'h-20 w-20 p-[3px]',
    inner: 'text-2xl',
    label: 'text-sm',
    wrapper: 'gap-2',
  },
} as const

export function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  // Clamp al rango valido del catalogo
  const safeLevel = Math.max(1, Math.min(LEVELS.length, level))
  const meta = LEVELS[safeLevel - 1]
  const styles = SIZE_CLASSES[size]

  return (
    <div
      className={cn('inline-flex flex-col items-center', styles.wrapper)}
      data-testid="level-badge"
      title={`Nivel ${meta.level} · ${meta.name}`}
    >
      {/* Borde aurora rotando lento */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full',
          styles.outer,
        )}
      >
        <div
          aria-hidden
          className="absolute inset-0 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,hsl(var(--aurora-1)),hsl(var(--aurora-2)),hsl(var(--aurora-3)),hsl(var(--aurora-1)))]"
        />
        <div
          className={cn(
            'relative z-10 flex h-full w-full items-center justify-center rounded-full font-bold text-white',
            styles.inner,
          )}
          style={{
            backgroundColor: meta.color,
            boxShadow: `0 0 18px -2px ${meta.color}aa, inset 0 0 14px ${meta.color}55`,
          }}
        >
          {meta.level}
        </div>
      </div>
      {size !== 'sm' && (
        <span className={cn('font-medium text-muted-foreground', styles.label)}>
          {meta.name}
        </span>
      )}
    </div>
  )
}
