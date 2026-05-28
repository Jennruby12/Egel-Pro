'use client'

import Link from 'next/link'
import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { cn } from '@/lib/utils/cn'

type DailyChallengeProps = {
  completed: boolean
  xpReward: number
  href?: string
}

export function DailyChallenge({
  completed,
  xpReward,
  href = '/quiz?mode=daily_challenge',
}: DailyChallengeProps) {
  return (
    <GlassCard
      variant={completed ? 'flat' : 'interactive'}
      padding="md"
      className={cn(
        'transition-colors',
        completed
          ? 'border-success/40 shadow-[0_0_24px_-6px_hsl(var(--success)/0.5)]'
          : 'border-brand-400/30 hover:border-brand-400/60',
      )}
      data-testid="daily-challenge"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
              completed
                ? 'bg-success/20 text-success shadow-[0_0_18px_-2px_hsl(var(--success)/0.6)]'
                : 'bg-brand-400/20 text-brand-400 shadow-[0_0_18px_-2px_hsl(var(--brand-400)/0.6)]',
            )}
            aria-hidden="true"
          >
            {completed ? <CheckCircle2 className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              {completed ? 'Reto del dia completo' : 'Reto del dia'}
            </p>
            <p className="text-xs text-muted-foreground">
              {completed ? (
                <>
                  Recompensa obtenida:{' '}
                  <span className="font-mono font-semibold text-xp">+{xpReward} XP</span>
                </>
              ) : (
                <>
                  Completa un quiz corto y gana{' '}
                  <span className="font-mono font-semibold text-xp">+{xpReward} XP</span>
                </>
              )}
            </p>
          </div>
        </div>

        {!completed && (
          <Link href={href} className="shrink-0">
            <MagicButton variant="aurora" size="sm">
              Empezar reto
              <ArrowRight className="h-4 w-4" />
            </MagicButton>
          </Link>
        )}
      </div>
    </GlassCard>
  )
}
