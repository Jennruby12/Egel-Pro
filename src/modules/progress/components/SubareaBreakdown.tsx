'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'

export type SubareaBreakdownRow = {
  area: number
  areaName: string
  subarea: number
  subareaName: string
  /** 0-100 */
  accuracy: number
  attempted: number
  /** Una de: mastered | familiar | learning | untouched */
  mastery: string
}

type SubareaBreakdownProps = {
  rows: SubareaBreakdownRow[]
}

const MASTERY_LABEL: Record<string, string> = {
  mastered: 'Maestria',
  familiar: 'Familiar',
  learning: 'Aprendiendo',
  untouched: 'Sin tocar',
}

const MASTERY_VARIANT: Record<string, 'success' | 'warning' | 'secondary' | 'outline'> = {
  mastered: 'success',
  familiar: 'warning',
  learning: 'secondary',
  untouched: 'outline',
}

const AREA_GRADIENT: Record<number, string> = {
  1: 'bg-[linear-gradient(90deg,hsl(var(--area-1)),hsl(var(--aurora-1)))]',
  2: 'bg-[linear-gradient(90deg,hsl(var(--area-2)),hsl(var(--aurora-2)))]',
  3: 'bg-[linear-gradient(90deg,hsl(var(--area-3)),hsl(var(--success)))]',
  4: 'bg-[linear-gradient(90deg,hsl(var(--area-4)),hsl(var(--xp)))]',
}

function masteryLabel(m: string) {
  return MASTERY_LABEL[m] ?? 'Sin tocar'
}

function masteryVariant(m: string) {
  return MASTERY_VARIANT[m] ?? 'outline'
}

export function SubareaBreakdown({ rows }: SubareaBreakdownProps) {
  const sorted = [...rows].sort((a, b) => {
    if (a.area !== b.area) return a.area - b.area
    return a.subarea - b.subarea
  })

  const grouped = new Map<number, { areaName: string; subareas: SubareaBreakdownRow[] }>()
  for (const r of sorted) {
    const existing = grouped.get(r.area)
    if (existing) {
      existing.subareas.push(r)
    } else {
      grouped.set(r.area, { areaName: r.areaName, subareas: [r] })
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold">Desglose por subarea</h3>
        <p className="text-xs text-muted-foreground">Tu maestria en cada tema del EGEL</p>
      </div>
      {grouped.size === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Aun no hay datos. Responde algunas preguntas para ver tu desglose.
        </p>
      ) : (
        <div className="space-y-3">
          {Array.from(grouped.entries()).map(([areaNum, group]) => {
            const totalAttempted = group.subareas.reduce((acc, s) => acc + s.attempted, 0)
            const avgAccuracy =
              totalAttempted > 0
                ? Math.round(
                    group.subareas.reduce((acc, s) => acc + s.accuracy * s.attempted, 0) /
                      totalAttempted,
                  )
                : 0
            const gradientClass = AREA_GRADIENT[areaNum] ?? AREA_GRADIENT[1]
            return (
              <details
                key={areaNum}
                className="group overflow-hidden rounded-lg border border-bg-border/60 bg-bg-raised/40 backdrop-blur-sm transition-colors hover:border-bg-border"
                open={areaNum === 1}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground transition-transform group-open:rotate-90">
                      &#9656;
                    </span>
                    <div>
                      <p className="font-medium">
                        Area {areaNum} · {group.areaName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {group.subareas.length} subareas · {totalAttempted} preguntas respondidas
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-semibold tabular-nums">{avgAccuracy}%</span>
                </summary>

                <div className="space-y-2 border-t border-bg-border/60 px-4 py-3">
                  {group.subareas.map((s, idx) => (
                    <motion.div
                      key={`${s.area}-${s.subarea}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.4 }}
                      className="space-y-1 rounded-md bg-bg-base/60 px-3 py-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {s.subarea}. {s.subareaName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {s.attempted}{' '}
                            {s.attempted === 1
                              ? 'pregunta respondida'
                              : 'preguntas respondidas'}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="font-mono text-sm font-semibold tabular-nums">
                            {s.accuracy}%
                          </span>
                          <Badge variant={masteryVariant(s.mastery)}>
                            {masteryLabel(s.mastery)}
                          </Badge>
                        </div>
                      </div>
                      {/* Progress bar gradient por area */}
                      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-bg-raised">
                        <motion.div
                          className={cn('absolute inset-y-0 left-0 h-full', gradientClass)}
                          initial={{ width: 0 }}
                          animate={{ width: `${s.accuracy}%` }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </details>
            )
          })}
        </div>
      )}
    </div>
  )
}
