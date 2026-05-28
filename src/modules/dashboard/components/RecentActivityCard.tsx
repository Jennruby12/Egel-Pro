'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Activity, ChevronRight } from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { EmptyStateNoActivity } from '@/components/shared/EmptyState'
import { cn } from '@/lib/utils/cn'

export type RecentSession = {
  id: string
  mode: string
  scorePercent: number | null
  estimatedLevel: string | null
  xpEarned: number | null
  finishedAt: string | null
}

const MODE_LABEL: Record<string, string> = {
  practice: 'Practica',
  quick_exam: 'Examen rapido',
  full_simulacro: 'Simulacro',
  review: 'Repaso',
  speed_challenge: 'Reto rapido',
  daily_challenge: 'Reto diario',
}

const LEVEL_META: Record<
  string,
  { label: string; bg: string; border: string; text: string }
> = {
  sobresaliente: {
    label: 'Sobresaliente',
    bg: 'bg-success/15',
    border: 'border-success/40',
    text: 'text-success',
  },
  satisfactorio: {
    label: 'Satisfactorio',
    bg: 'bg-warning/15',
    border: 'border-warning/40',
    text: 'text-warning',
  },
  ans: {
    label: 'ANS',
    bg: 'bg-danger/15',
    border: 'border-danger/40',
    text: 'text-danger',
  },
}

type Props = { sessions: RecentSession[] }

export function RecentActivityCard({ sessions }: Props) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-ice/15 text-cyan-ice">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold">Actividad reciente</h3>
          <p className="text-xs text-muted-foreground">
            Tus ultimos {sessions.length} quizzes
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {sessions.length === 0 ? (
          <EmptyStateNoActivity className="h-full" />
        ) : (
          sessions.map((s, i) => {
            const when = s.finishedAt
              ? formatDistanceToNow(new Date(s.finishedAt), {
                  addSuffix: true,
                  locale: es,
                })
              : '—'
            const lvl = s.estimatedLevel ?? 'ans'
            const meta = LEVEL_META[lvl] ?? LEVEL_META.ans!
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/quiz/results/${s.id}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-glass-border/30 bg-glass-bg/40 px-4 py-3 text-sm backdrop-blur-md transition-all duration-normal ease-out-expo hover:border-brand-400/40 hover:bg-glass-bg/60 hover:shadow-glow-brand hover:-translate-y-0.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {MODE_LABEL[s.mode] ?? s.mode}
                    </p>
                    <p className="text-xs text-muted-foreground">{when}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold">
                      <AnimatedCounter value={s.scorePercent ?? 0} suffix="%" />
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-md',
                        meta.bg,
                        meta.border,
                        meta.text,
                      )}
                    >
                      {meta.label}
                    </span>
                    <span className="font-mono text-xs font-semibold text-xp">
                      +{s.xpEarned ?? 0}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand-400" />
                  </div>
                </Link>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
