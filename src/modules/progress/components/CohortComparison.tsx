'use client'

import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { cn } from '@/lib/utils/cn'

type CohortComparisonProps = {
  /** 0-100 */
  userPercent: number
  /** 0-100 */
  cohortAvg: number
  cohortSize: number
}

export function CohortComparison({ userPercent, cohortAvg, cohortSize }: CohortComparisonProps) {
  const hasEnoughData = cohortSize >= 5
  const diff = Math.round(userPercent - cohortAvg)
  const isAbove = diff >= 0

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Tu posicion vs tu cohorte</h3>
        <p className="text-xs text-muted-foreground">
          Estudiantes con fecha de examen similar a la tuya
        </p>
      </div>

      {!hasEnoughData ? (
        <div className="rounded-md border border-bg-border/60 bg-bg-base/50 px-3 py-4 text-center text-sm text-muted-foreground">
          <p>Estamos recolectando datos.</p>
          <p className="mt-1 text-xs">
            {cohortSize === 0
              ? 'Aun no hay estudiantes con tu misma fecha de examen.'
              : `Solo ${cohortSize} estudiante${cohortSize === 1 ? '' : 's'} en tu cohorte. Vuelve mas tarde.`}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {/* Barra del usuario - aurora gradient */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Tu precision</span>
                <span className="font-mono font-semibold tabular-nums">
                  <AnimatedCounter value={userPercent} suffix="%" />
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-bg-raised">
                <motion.div
                  className="absolute inset-y-0 left-0 h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--aurora-1)),hsl(var(--aurora-2)),hsl(var(--aurora-3)))]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, Math.min(100, userPercent))}%` }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            {/* Barra del promedio - tono mas neutro */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">Promedio de la cohorte</span>
                <span className="font-mono font-semibold tabular-nums text-muted-foreground">
                  <AnimatedCounter value={cohortAvg} suffix="%" />
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-bg-raised">
                <motion.div
                  className="absolute inset-y-0 left-0 h-full rounded-full bg-muted-foreground/50"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, Math.min(100, cohortAvg))}%` }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border border-bg-border/60 bg-bg-base/50 px-3 py-2 text-xs">
            <p>
              Estas{' '}
              <span className={cn('font-semibold', isAbove ? 'text-success' : 'text-warning')}>
                {Math.abs(diff)} puntos {isAbove ? 'arriba' : 'abajo'}
              </span>{' '}
              del promedio de {cohortSize} estudiante{cohortSize === 1 ? '' : 's'} en tu cohorte.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
