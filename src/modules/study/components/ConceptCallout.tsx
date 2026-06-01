'use client'

import { Sparkles, Star, Circle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type Concept = {
  concept: string
  definition_md: string | null
  importance: 'alta' | 'media' | 'baja' | null
}

const STYLES = {
  alta: 'border-aurora-2/60 bg-aurora-2/10',
  media: 'border-aurora-3/40 bg-aurora-3/5',
  baja: 'border-glass-border/40 bg-glass-bg/40',
} as const

const ICONS = {
  alta: Sparkles,
  media: Star,
  baja: Circle,
} as const

const LABELS = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
} as const

type Props = {
  concepts: Concept[]
}

/**
 * Grid de tarjetas para conceptos clave de la guia, ordenadas por importancia.
 */
export function ConceptCallout({ concepts }: Props) {
  if (concepts.length === 0) return null
  const sorted = [...concepts].sort((a, b) => {
    const order = { alta: 0, media: 1, baja: 2 }
    return (order[a.importance ?? 'media'] ?? 1) - (order[b.importance ?? 'media'] ?? 1)
  })
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {sorted.map((c, i) => {
        const imp = c.importance ?? 'media'
        const Icon = ICONS[imp]
        return (
          <div
            key={i}
            className={cn(
              'flex gap-3 rounded-xl border p-4 backdrop-blur-md',
              STYLES[imp],
            )}
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-raised/70">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{c.concept}</p>
                <span className="rounded-full border border-bg-border/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {LABELS[imp]}
                </span>
              </div>
              {c.definition_md ? (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {c.definition_md}
                </p>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
