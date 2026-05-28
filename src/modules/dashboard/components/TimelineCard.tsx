'use client'

import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type TimelineDay = {
  date: string // ISO yyyy-mm-dd
  xpEarned: number
  questionsAnswered: number
}

type Props = {
  /** Ultimos 7 dias en orden cronologico ASC */
  days: TimelineDay[]
}

const DAY_LABELS_ES = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

export function TimelineCard({ days }: Props) {
  const maxXP = Math.max(1, ...days.map((d) => d.xpEarned))
  const todayISO = new Date().toISOString().slice(0, 10)
  const totalXP = days.reduce((acc, d) => acc + d.xpEarned, 0)

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aurora-2/15 text-aurora-2">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Ultimos 7 dias</h3>
            <p className="text-xs text-muted-foreground">XP ganado</p>
          </div>
        </div>
        <span className="text-right font-mono text-xs text-xp">+{totalXP} XP</span>
      </div>

      <div className="flex flex-1 items-end justify-between gap-2">
        {days.map((d, i) => {
          const heightPercent = Math.round((d.xpEarned / maxXP) * 100)
          const dateObj = new Date(d.date + 'T00:00:00')
          const dayLabel = DAY_LABELS_ES[dateObj.getDay()]
          const isToday = d.date === todayISO
          const hasActivity = d.xpEarned > 0 || d.questionsAnswered > 0

          return (
            <div
              key={d.date}
              className="flex flex-1 flex-col items-center gap-2"
              title={`${d.date}: ${d.xpEarned} XP, ${d.questionsAnswered} preguntas`}
            >
              <div className="relative flex h-28 w-full items-end overflow-hidden rounded-md bg-bg-raised/40">
                <motion.div
                  initial={{ height: '4%' }}
                  animate={{
                    height: hasActivity ? `${Math.max(8, heightPercent)}%` : '4%',
                  }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    'w-full rounded-md',
                    !hasActivity && 'bg-bg-raised',
                    hasActivity && !isToday &&
                      'bg-[linear-gradient(180deg,hsl(var(--aurora-2)),hsl(var(--aurora-1)))]',
                    hasActivity && isToday &&
                      'bg-[linear-gradient(180deg,hsl(var(--xp)),hsl(var(--streak)))] shadow-glow-xp',
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-xs',
                  isToday
                    ? 'font-bold text-xp'
                    : 'text-muted-foreground',
                )}
              >
                {dayLabel}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
