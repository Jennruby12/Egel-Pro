'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

import { AuroraBackground } from '@/components/ui/aurora-background'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { SparklesText } from '@/components/ui/sparkles-text'
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid'
import { fireConfetti } from '@/components/ui/confetti'
import { ScoreAnimation } from './ScoreAnimation'
import { AreaBreakdown, type AreaBreakdownRow } from './AreaBreakdown'
import { getPerformanceLevel } from '@/lib/constants/egel'
import type { PerformanceLevel } from '@/types/global'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

export type SimulacroSessionSummary = {
  sessionNumber: 1 | 2
  total: number
  correct: number
  wrong: number
  skipped: number
  scorePercent: number
  timeTakenSeconds: number | null
  xpEarned: number
}

type SimulacroResultsProps = {
  session1: SimulacroSessionSummary
  session2: SimulacroSessionSummary
  /** Breakdown combinado (sesion 1 + sesion 2) por area */
  breakdown: AreaBreakdownRow[]
}

function fmtTime(s: number | null): string {
  if (s === null || s < 0) return '—'
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export function SimulacroResults({ session1, session2, breakdown }: SimulacroResultsProps) {
  const totalCorrect = session1.correct + session2.correct
  const totalWrong = session1.wrong + session2.wrong
  const totalSkipped = session1.skipped + session2.skipped
  const totalQuestions = session1.total + session2.total
  const totalXP = session1.xpEarned + session2.xpEarned
  const totalTime =
    (session1.timeTakenSeconds ?? 0) + (session2.timeTakenSeconds ?? 0)

  const scoreCombined =
    totalQuestions > 0
      ? Math.round((totalCorrect / totalQuestions) * 10_000) / 100
      : 0
  const performanceLevel: PerformanceLevel = getPerformanceLevel(scoreCombined)
  const isSobresaliente = performanceLevel === 'sobresaliente'

  // Confetti automatico si sobresaliente.
  useEffect(() => {
    if (isSobresaliente) {
      fireConfetti('perfectScore')
    }
  }, [isSobresaliente])

  const content = (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Hero score con SparklesText si sobresaliente */}
      <GlassCard variant="elevated" padding="xl" className="relative overflow-hidden">
        {isSobresaliente ? (
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-4 bg-aurora-mesh opacity-40 blur-3xl"
          />
        ) : null}
        <div className="relative space-y-8 text-center">
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-400/15 text-brand-400 shadow-[0_0_24px_-4px_hsl(var(--brand-400)/0.6)]">
              <GraduationCap className="h-7 w-7" />
            </div>
            {isSobresaliente ? (
              <SparklesText count={12}>
                <h1 className="mt-4 text-display-md font-bold tracking-tight text-aurora">
                  Resultados del simulacro
                </h1>
              </SparklesText>
            ) : (
              <h1 className="mt-4 text-display-md font-bold tracking-tight text-aurora">
                Resultados del simulacro
              </h1>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Combinacion de tus dos sesiones segun la distribucion oficial CENEVAL.
            </p>
          </div>

          <ScoreAnimation
            scorePercent={scoreCombined}
            performanceLevel={performanceLevel}
          />

          <p className="text-sm text-muted-foreground">
            {totalCorrect} de {totalQuestions} preguntas correctas
          </p>
        </div>
      </GlassCard>

      {/* Bento de stats combinados */}
      <BentoGrid>
        <BentoCard colSpan={2} variant="elevated" padding="md">
          <StatBlock label="Correctas" value={totalCorrect} color="text-success" />
        </BentoCard>
        <BentoCard colSpan={2} variant="elevated" padding="md">
          <StatBlock label="Incorrectas" value={totalWrong} color="text-danger" />
        </BentoCard>
        <BentoCard colSpan={2} variant="elevated" padding="md">
          <StatBlock label="Saltadas" value={totalSkipped} color="text-muted-foreground" />
        </BentoCard>
        <BentoCard colSpan={3} variant="elevated" padding="md">
          <StatBlock label="XP ganado" value={totalXP} color="text-xp" prefix="+" />
        </BentoCard>
        <BentoCard colSpan={3} variant="elevated" padding="md">
          <div className="text-center">
            <p className="font-mono text-3xl font-bold tabular-nums text-foreground">
              {fmtTime(totalTime)}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Tiempo total
            </p>
          </div>
        </BentoCard>
      </BentoGrid>

      {/* Desglose por sesion */}
      <GlassCard variant="elevated" padding="lg">
        <h2 className="mb-4 text-lg font-semibold">Desglose por sesion</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <SessionSummaryCard summary={session1} />
          <SessionSummaryCard summary={session2} />
        </div>
      </GlassCard>

      {breakdown.length > 0 ? (
        <GlassCard variant="elevated" padding="lg">
          <AreaBreakdown rows={breakdown} />
        </GlassCard>
      ) : null}

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link href={ROUTES.dashboard}>
          <MagicButton variant="outline" size="lg">
            Volver al dashboard
          </MagicButton>
        </Link>
        <Link href={ROUTES.simulacro.root}>
          <MagicButton variant="aurora" size="lg">
            Hacer otro simulacro
          </MagicButton>
        </Link>
      </div>
    </div>
  )

  if (isSobresaliente) {
    return (
      <AuroraBackground
        variant="intense"
        className="-mx-4 -mt-4 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {content}
      </AuroraBackground>
    )
  }

  return (
    <AuroraBackground
      variant="subtle"
      className="-mx-4 -mt-4 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      {content}
    </AuroraBackground>
  )
}

function StatBlock({
  label,
  value,
  color,
  prefix,
}: {
  label: string
  value: number
  color: string
  prefix?: string
}) {
  return (
    <div className="text-center">
      <p className={cn('font-mono text-3xl font-bold tabular-nums', color)}>
        <AnimatedCounter value={value} prefix={prefix ?? ''} />
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  )
}

function SessionSummaryCard({ summary }: { summary: SimulacroSessionSummary }) {
  const level = getPerformanceLevel(summary.scorePercent)
  const levelLabel =
    level === 'sobresaliente'
      ? 'Sobresaliente'
      : level === 'satisfactorio'
        ? 'Satisfactorio'
        : 'Aun no satisfactorio'
  const levelColor =
    level === 'sobresaliente'
      ? 'text-success'
      : level === 'satisfactorio'
        ? 'text-warning'
        : 'text-danger'
  return (
    <GlassCard variant="flat" padding="md">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Sesion {summary.sessionNumber}</p>
        <p className="font-mono text-sm font-medium tabular-nums text-aurora">
          {summary.scorePercent.toFixed(1)}%
        </p>
      </div>
      <p className={cn('mt-1 text-xs', levelColor)}>{levelLabel}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <p className="font-mono text-base font-semibold tabular-nums text-success">
            {summary.correct}
          </p>
          <p className="text-muted-foreground">Correctas</p>
        </div>
        <div>
          <p className="font-mono text-base font-semibold tabular-nums text-danger">
            {summary.wrong}
          </p>
          <p className="text-muted-foreground">Incorrectas</p>
        </div>
        <div>
          <p className="font-mono text-base font-semibold tabular-nums">{summary.skipped}</p>
          <p className="text-muted-foreground">Saltadas</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Tiempo: {fmtTime(summary.timeTakenSeconds)} ·{' '}
        <span className="font-mono text-xp">+{summary.xpEarned} XP</span>
      </p>
    </GlassCard>
  )
}
