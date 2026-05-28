'use client'

import { cn } from '@/lib/utils/cn'

export type HeatmapDay = {
  /** ISO yyyy-mm-dd */
  date: string
  xpEarned: number
  questionsAnswered: number
}

type ActivityHeatmapProps = {
  /** Ultimos 90 dias ordenados ASC (mas antiguo primero). El componente acomoda. */
  days: HeatmapDay[]
}

const WEEKS = 13
const DAYS_IN_WEEK = 7

const MONTH_LABELS_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

const DAY_LABELS_ES = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

// Devuelve clase tailwind con bg + glow proporcional al xp.
function intensityClasses(xp: number, maxXP: number): { bg: string; glow: string } {
  if (xp <= 0) return { bg: 'bg-bg-raised/60', glow: '' }
  const ratio = xp / Math.max(1, maxXP)
  if (ratio >= 0.8) {
    return {
      bg: 'bg-[hsl(var(--aurora-2))]',
      glow: 'hover:shadow-[0_0_12px_2px_hsl(var(--aurora-2)/0.7)]',
    }
  }
  if (ratio >= 0.55) {
    return {
      bg: 'bg-brand-400',
      glow: 'hover:shadow-[0_0_10px_2px_hsl(var(--brand-400)/0.6)]',
    }
  }
  if (ratio >= 0.3) {
    return {
      bg: 'bg-brand-400/70',
      glow: 'hover:shadow-[0_0_8px_1px_hsl(var(--brand-400)/0.5)]',
    }
  }
  return {
    bg: 'bg-brand-400/40',
    glow: 'hover:shadow-[0_0_6px_1px_hsl(var(--brand-400)/0.35)]',
  }
}

export function ActivityHeatmap({ days }: ActivityHeatmapProps) {
  // Construir mapa por fecha para lookup O(1)
  const byDate = new Map<string, HeatmapDay>()
  for (const d of days) byDate.set(d.date, d)

  const maxXP = Math.max(1, ...days.map((d) => d.xpEarned))

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayDow = today.getDay()
  const daysSinceMonday = (todayDow + 6) % 7
  const currentMonday = new Date(today)
  currentMonday.setDate(today.getDate() - daysSinceMonday)

  const grid: Array<Array<{ date: string; xp: number; questions: number; isFuture: boolean } | null>> = []
  const monthLabels: Array<{ col: number; label: string }> = []
  let lastMonth = -1

  for (let w = WEEKS - 1; w >= 0; w--) {
    const col: Array<{ date: string; xp: number; questions: number; isFuture: boolean } | null> = []
    const weekStart = new Date(currentMonday)
    weekStart.setDate(currentMonday.getDate() - w * 7)

    for (let row = 0; row < DAYS_IN_WEEK; row++) {
      const cell = new Date(weekStart)
      cell.setDate(weekStart.getDate() + row)
      const iso = cell.toISOString().slice(0, 10)
      const isFuture = cell.getTime() > today.getTime()
      const found = byDate.get(iso)
      col.push({
        date: iso,
        xp: found?.xpEarned ?? 0,
        questions: found?.questionsAnswered ?? 0,
        isFuture,
      })

      if (row === 0) {
        const month = cell.getMonth()
        if (month !== lastMonth) {
          monthLabels.push({ col: WEEKS - 1 - w, label: MONTH_LABELS_ES[month] })
          lastMonth = month
        }
      }
    }
    grid.unshift(col)
  }

  const totalXP = days.reduce((acc, d) => acc + d.xpEarned, 0)
  const activeDays = days.filter((d) => d.xpEarned > 0 || d.questionsAnswered > 0).length

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold">Mapa de actividad</h3>
        <p className="text-xs text-muted-foreground">
          {activeDays} dias activos · {totalXP.toLocaleString('es-MX')} XP en los ultimos 90 dias
        </p>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Etiquetas de mes */}
          <div className="ml-7 mb-1 flex" style={{ width: `${WEEKS * 16}px` }}>
            {Array.from({ length: WEEKS }).map((_, col) => {
              const label = monthLabels.find((m) => m.col === col)?.label
              return (
                <div
                  key={col}
                  className="text-[10px] text-muted-foreground"
                  style={{ width: 16 }}
                >
                  {label ?? ''}
                </div>
              )
            })}
          </div>

          <div className="flex gap-1">
            {/* Etiquetas de dia (lunes a domingo) */}
            <div
              className="flex flex-col justify-between pr-1 text-[10px] text-muted-foreground"
              style={{ height: 7 * 14 }}
            >
              {DAY_LABELS_ES.map((d, i) => (
                <span key={i} className={cn(i % 2 === 0 ? '' : 'opacity-0')}>
                  {d}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {grid.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-1">
                  {col.map((cell, ri) => {
                    if (!cell || cell.isFuture) {
                      return <div key={ri} className="h-3 w-3 rounded-sm bg-transparent" />
                    }
                    const cls = intensityClasses(cell.xp, maxXP)
                    return (
                      <div
                        key={ri}
                        className={cn(
                          'h-3 w-3 cursor-pointer rounded-sm transition-all duration-fast',
                          cls.bg,
                          cls.glow,
                        )}
                        title={`${cell.date}: ${cell.xp} XP · ${cell.questions} preguntas`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Leyenda */}
          <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>Menos</span>
            <div className="h-3 w-3 rounded-sm bg-bg-raised/60" />
            <div className="h-3 w-3 rounded-sm bg-brand-400/40" />
            <div className="h-3 w-3 rounded-sm bg-brand-400/70" />
            <div className="h-3 w-3 rounded-sm bg-brand-400" />
            <div className="h-3 w-3 rounded-sm bg-[hsl(var(--aurora-2))]" />
            <span>Mas</span>
          </div>
        </div>
      </div>
    </div>
  )
}
