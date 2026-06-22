'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AlertTriangle, Clock, FileText, ListChecks, Play } from 'lucide-react'

import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { SparklesText } from '@/components/ui/sparkles-text'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { startSimulacroFullExam } from '@/modules/quiz/actions'
import { ROUTES } from '@/lib/constants/routes'

function fmtHours(seconds: number): string {
  const h = seconds / 3600
  return Number.isInteger(h) ? `${h} horas` : `${h.toFixed(1)} horas`
}

export type SimulacroIntroProps = {
  examName: string
  totalQuestions: number
  disciplinarQuestions: number
  transversalQuestions: number
  sessions: number
  sessionDurationSeconds: number
  /** Reactivos por sesion (longitud = sessions). */
  sessionTotals: number[]
}

const SESSION_TILE_ICON_CLASS = ['text-area3', 'text-warning', 'text-area2', 'text-area4']

export function SimulacroIntro({
  examName,
  totalQuestions,
  disciplinarQuestions,
  transversalQuestions,
  sessions,
  sessionDurationSeconds,
  sessionTotals,
}: SimulacroIntroProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleStart() {
    startTransition(async () => {
      const result = await startSimulacroFullExam()
      if (!result.success) {
        toast.error(result.error)
        return
      }
      router.push(ROUTES.simulacro.group(result.data.simulacroGroupId))
      router.refresh()
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Hero epico con SparklesText + AnimatedCounter del 203 */}
      <div className="relative space-y-6 text-center">
        <SparklesText count={14}>
          <h1 className="text-2xl font-bold tracking-tight text-aurora sm:text-3xl md:text-display-md lg:text-display-lg">
            Simulacro EGEL
          </h1>
        </SparklesText>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
          Replica fiel del examen oficial {examName}. {sessions} sesiones de{' '}
          {fmtHours(sessionDurationSeconds)} cada una, distribucion oficial CENEVAL.
        </p>

        {/* Numero gigante 203 */}
        <div className="flex items-center justify-center">
          <div className="relative inline-flex flex-col items-center">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-aurora-mesh blur-2xl opacity-60"
            />
            <span className="font-mono text-5xl font-bold leading-none tabular-nums text-aurora sm:text-7xl md:text-[6rem] lg:text-[8rem]">
              <AnimatedCounter value={totalQuestions} duration={2} />
            </span>
            <span className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
              reactivos totales
            </span>
          </div>
        </div>
      </div>

      {/* Info cards en BentoGrid */}
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoTile
          icon={<FileText className="h-5 w-5 text-aurora-1" />}
          label="Reactivos"
          value={`${totalQuestions}`}
          hint={`${disciplinarQuestions} disciplinar + ${transversalQuestions} transversal`}
        />
        <InfoTile
          icon={<Clock className="h-5 w-5 text-cyan-ice" />}
          label="Duracion por sesion"
          value={fmtHours(sessionDurationSeconds)}
          hint={`${sessionDurationSeconds.toLocaleString('es-MX')} segundos`}
        />
        {sessionTotals.map((count, i) => (
          <InfoTile
            key={i}
            icon={<ListChecks className={`h-5 w-5 ${SESSION_TILE_ICON_CLASS[i % SESSION_TILE_ICON_CLASS.length]}`} />}
            label={`Sesion ${i + 1}`}
            value={`${count} reactivos`}
            hint={i === 0 ? 'Areas disciplinares y transversales mezcladas' : 'Sin preguntas repetidas de sesiones previas'}
          />
        ))}
      </div>

      {/* Alert importante */}
      <Alert
        variant="destructive"
        className="border-warning/40 bg-warning/10 text-warning backdrop-blur-md"
      >
        <AlertTriangle className="size-4" />
        <AlertTitle>Lee antes de empezar</AlertTitle>
        <AlertDescription className="space-y-2 text-sm">
          <p>
            Cada sesion dura {fmtHours(sessionDurationSeconds)} y no se puede
            pausar dentro de la sesion. Tu progreso se guarda automaticamente, asi que puedes
            cerrar la pestana y volver, pero el cronometro sigue corriendo.
          </p>
          <p>
            Entre la sesion 1 y la sesion 2 puedes tomar el descanso que necesites: no hay limite
            de tiempo en la pantalla intermedia.
          </p>
        </AlertDescription>
      </Alert>

      {/* CTA principal */}
      <div className="flex justify-center pt-2">
        <MagicButton
          variant="aurora"
          size="xl"
          onClick={handleStart}
          disabled={isPending}
          className="animate-pulse-glow"
          data-testid="start-simulacro-btn"
        >
          <Play className="h-5 w-5" />
          {isPending ? 'Preparando simulacro...' : 'Empezar simulacro'}
        </MagicButton>
      </div>
    </div>
  )
}

function InfoTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint?: string
}) {
  return (
    <GlassCard variant="flat" padding="md" className="flex items-start gap-3">
      <div
        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-raised/70"
        aria-hidden
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-lg font-semibold">{value}</p>
        {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </GlassCard>
  )
}
