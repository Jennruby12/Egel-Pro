'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { TrendingDown, ArrowRight } from 'lucide-react'
import { MagicButton } from '@/components/ui/magic-button'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { EmptyStateNoWeakAreas } from '@/components/shared/EmptyState'

export type WeakArea = {
  area: number
  areaName: string
  subarea: number
  subareaName: string
  accuracy: number
  attempted: number
}

type WeakAreasCardProps = {
  areas: WeakArea[]
}

const AREA_COLOR: Record<number, string> = {
  1: 'bg-area1',
  2: 'bg-area2',
  3: 'bg-area3',
  4: 'bg-area4',
}

export function WeakAreasCard({ areas }: WeakAreasCardProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/15 text-warning">
            <TrendingDown className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold">Puntos debiles</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Subareas donde mas necesitas practicar
        </p>
      </div>

      <div className="flex-1 space-y-3">
        {areas.length === 0 ? (
          <EmptyStateNoWeakAreas className="h-full" />
        ) : (
          areas.map((a, i) => (
            <motion.div
              key={`${a.area}-${a.subarea}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1.5"
            >
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="line-clamp-1">
                  <span className={`mr-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${AREA_COLOR[a.area] ?? 'bg-bg-raised'}`}>
                    A{a.area}.{a.subarea}
                  </span>
                  <span className="font-medium">{a.subareaName}</span>
                </span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  <AnimatedCounter value={a.accuracy} suffix="%" />
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-bg-raised/60">
                <motion.div
                  className={`h-full rounded-full ${AREA_COLOR[a.area] ?? 'bg-brand-400'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${a.accuracy}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {areas.length > 0 && (
        <MagicButton asChild variant="aurora" size="md" className="w-full">
          <Link href="/quiz">
            Practicar puntos debiles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </MagicButton>
      )}
    </div>
  )
}
