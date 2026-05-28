import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { GlassCard, type GlassCardProps } from './glass-card'

type BentoGridProps = React.HTMLAttributes<HTMLDivElement>

export function BentoGrid({ className, children, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

type BentoCardProps = GlassCardProps & {
  /** Span de columnas: 1, 2, 3 o 6 (full row) */
  colSpan?: 1 | 2 | 3 | 4 | 6
  /** Span de filas */
  rowSpan?: 1 | 2 | 3
}

const COL_SPAN = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  6: 'lg:col-span-6',
} as const

const ROW_SPAN = {
  1: '',
  2: 'lg:row-span-2',
  3: 'lg:row-span-3',
} as const

export function BentoCard({
  colSpan = 2,
  rowSpan = 1,
  className,
  children,
  ...props
}: BentoCardProps) {
  return (
    <GlassCard
      className={cn(COL_SPAN[colSpan], ROW_SPAN[rowSpan], className)}
      {...props}
    >
      {children}
    </GlassCard>
  )
}
