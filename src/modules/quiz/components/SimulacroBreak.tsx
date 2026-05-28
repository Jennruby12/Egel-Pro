'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Coffee, Play, Trophy } from 'lucide-react'

import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { startSimulacroSession2 } from '@/modules/quiz/actions'
import { ROUTES } from '@/lib/constants/routes'
import type { QuizSession } from '@/modules/quiz/types'

type SimulacroBreakProps = {
  simulacroGroupId: string
  session1: QuizSession
}

function fmtTime(s: number | null): string {
  if (s === null || s < 0) return '—'
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

// Tips motivacionales rotativos para el descanso.
const BREAK_TIPS = [
  'Hidratate, estira las piernas y respira profundo antes de la sesion 2.',
  'Repasa mentalmente las preguntas que se sintieron mas dificiles.',
  'Una caminata corta puede ayudarte a despejar la mente.',
  'Recuerda: la sesion 2 son temas distintos. Empieza con la mente fresca.',
]

export function SimulacroBreak({ simulacroGroupId, session1 }: SimulacroBreakProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const correct = session1.correct_answers ?? 0
  const wrong = session1.wrong_answers ?? 0
  const skipped = session1.skipped ?? 0
  const total = session1.total_questions
  const score = Number(session1.score_percent ?? 0)

  // Seleccionar tip pseudo-aleatorio basado en el id del simulacro.
  const tipIdx =
    simulacroGroupId
      .split('')
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % BREAK_TIPS.length
  const motivacional = BREAK_TIPS[tipIdx]

  function handleStartSession2() {
    startTransition(async () => {
      const result = await startSimulacroSession2({ simulacroGroupId })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      router.push(ROUTES.simulacro.group(simulacroGroupId))
      router.refresh()
    })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <GlassCard variant="elevated" padding="xl" className="relative overflow-hidden">
        {/* Aura sutil */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-warning/15 blur-3xl"
        />
        <div className="relative space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-warning/20 text-warning shadow-[0_0_28px_-4px_hsl(var(--warning)/0.6)]">
              <Coffee className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-display-sm font-bold tracking-tight text-aurora">
              Sesion 1 completa
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Toma el tiempo que necesites antes de comenzar la sesion 2: no hay cronometro
              corriendo en esta pantalla.
            </p>
          </div>

          {/* Score grande */}
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Tu precision
            </p>
            <p className="font-mono text-display-lg font-bold tabular-nums text-aurora">
              <AnimatedCounter value={score} decimals={1} suffix="%" />
            </p>
            <p className="text-sm text-muted-foreground">
              {correct} de {total} correctas · Tiempo usado: {fmtTime(session1.time_taken_seconds)}
            </p>
          </div>

          {/* Stats */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Trophy className="h-4 w-4 text-xp" />
              Resultados parciales
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Correctas" value={correct} color="text-success" />
              <Stat label="Incorrectas" value={wrong} color="text-danger" />
              <Stat label="Saltadas" value={skipped} color="text-muted-foreground" />
              <Stat
                label="Precision"
                value={score}
                color="text-aurora-2"
                decimals={1}
                suffix="%"
              />
            </div>
          </div>

          {/* Tip motivacional */}
          <GlassCard
            variant="flat"
            padding="md"
            className="border-cyan-ice/30 bg-cyan-ice/5"
          >
            <p className="text-sm text-cyan-ice/90">
              <span className="font-semibold">Tip ·</span> {motivacional}
            </p>
          </GlassCard>

          <Alert>
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription className="text-sm">
              Cuando inicies la sesion 2 comenzara un nuevo cronometro de 4.5 horas. Tu progreso
              de la sesion 1 ya esta guardado y no se perdera.
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap justify-between gap-3">
            <Link href={ROUTES.dashboard}>
              <MagicButton variant="outline">Volver al dashboard</MagicButton>
            </Link>
            <MagicButton
              variant="aurora"
              size="lg"
              onClick={handleStartSession2}
              disabled={isPending}
              data-testid="start-simulacro-session2-btn"
            >
              <Play className="h-4 w-4" />
              {isPending ? 'Preparando sesion 2...' : 'Empezar sesion 2'}
            </MagicButton>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

function Stat({
  label,
  value,
  color,
  decimals = 0,
  suffix,
}: {
  label: string
  value: number
  color: string
  decimals?: number
  suffix?: string
}) {
  return (
    <GlassCard variant="flat" padding="sm" className="text-center">
      <p className={`font-mono text-2xl font-bold tabular-nums ${color}`}>
        <AnimatedCounter value={value} decimals={decimals} suffix={suffix ?? ''} />
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </GlassCard>
  )
}
