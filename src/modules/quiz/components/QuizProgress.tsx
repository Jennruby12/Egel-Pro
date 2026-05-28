'use client'

import { motion } from 'framer-motion'
import { Flag } from 'lucide-react'

type QuizProgressProps = {
  current: number
  total: number
  answered: number
  marked: number
}

export function QuizProgress({
  current,
  total,
  answered,
  marked,
}: QuizProgressProps) {
  const percent = total === 0 ? 0 : Math.round(((current + 1) / total) * 100)
  return (
    <div className="flex-1 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-medium">
          <span className="font-mono text-aurora-2">{current + 1}</span>
          <span className="text-muted-foreground"> / {total}</span>
        </span>
        <span className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            <span className="font-mono font-semibold text-success">
              {answered}
            </span>{' '}
            respondidas
          </span>
          {marked > 0 && (
            <span className="inline-flex items-center gap-1 text-warning">
              <Flag className="h-3 w-3" />
              <span className="font-mono font-semibold">{marked}</span> marcadas
            </span>
          )}
        </span>
      </div>
      <div
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-bg-raised/60"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--aurora-1)),hsl(var(--aurora-2))_50%,hsl(var(--aurora-3)))] bg-[length:200%_100%]"
          initial={{ width: 0, backgroundPosition: '0% 0%' }}
          animate={{
            width: `${percent}%`,
            backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
          }}
          transition={{
            width: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            backgroundPosition: {
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        />
      </div>
    </div>
  )
}
