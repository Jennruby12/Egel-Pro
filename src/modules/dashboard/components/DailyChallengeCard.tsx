'use client'

import Link from 'next/link'
import { Calendar, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { MagicButton } from '@/components/ui/magic-button'
import { cn } from '@/lib/utils/cn'

type Props = {
  completed: boolean
  /** XP reward override. Default 5 */
  xpReward?: number
  /** Href override. Default /quiz?mode=daily_challenge */
  href?: string
}

export function DailyChallengeCard({
  completed,
  xpReward = 5,
  href = '/quiz?mode=daily_challenge',
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col gap-4"
      data-testid="daily-challenge"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl backdrop-blur-md',
            completed
              ? 'bg-success/15 text-success ring-1 ring-success/30'
              : 'bg-[linear-gradient(135deg,hsl(var(--aurora-1)/0.2),hsl(var(--aurora-2)/0.2))] text-aurora-2 ring-1 ring-aurora-2/30',
          )}
          aria-hidden="true"
        >
          {completed ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Calendar className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold">
              {completed ? 'Reto del dia completo' : 'Reto del dia'}
            </h3>
            {!completed && <Sparkles className="h-3.5 w-3.5 text-aurora-2" />}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {completed ? (
              <>
                Recompensa obtenida:{' '}
                <span className="font-semibold text-xp">+{xpReward} XP</span>
              </>
            ) : (
              <>
                Completa un quiz corto y gana{' '}
                <span className="font-semibold text-xp">+{xpReward} XP</span>
              </>
            )}
          </p>
        </div>
      </div>

      {!completed && (
        <MagicButton asChild variant="aurora" size="md" className="mt-auto w-full">
          <Link href={href}>
            Empezar reto del dia
            <ArrowRight className="h-4 w-4" />
          </Link>
        </MagicButton>
      )}
    </motion.div>
  )
}
