import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
  /** Si es true, usa el text-aurora gradient en el titulo */
  gradient?: boolean
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  gradient = false,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-start justify-between gap-4', className)}>
      <div>
        <h1
          className={cn(
            'text-3xl font-bold tracking-tight md:text-4xl',
            gradient && 'text-aurora',
          )}
        >
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-sm text-muted-foreground md:text-base">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}
