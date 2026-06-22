'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, PlayCircle, Layers, Settings2, Hash } from 'lucide-react'

import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { ModeSelector, QUIZ_MODES } from './ModeSelector'
import { AreaSelector } from './AreaSelector'
import { startQuizSession } from '@/modules/quiz/actions'
import type { QuizMode } from '@/types/global'

type AvailableCountsShape =
  | Record<number, number>
  | { disciplinar: Record<number, number>; transversal: Record<number, number> }

type StartQuizFormProps = {
  availableCounts?: AvailableCountsShape
  /** Cantidad de preguntas que el user nunca ha tomado (para toggle "solo nuevas") */
  unseenCount?: number
}

function getDisciplinarCounts(ac?: AvailableCountsShape): Record<number, number> {
  if (!ac) return { 1: 0, 2: 0, 3: 0, 4: 0 }
  if ('disciplinar' in ac) return ac.disciplinar
  return ac
}

// Modos donde el usuario puede ajustar cuantas preguntas (no aplica a simulacro/reto diario, fijos)
const QUANTITY_EDITABLE_MODES: QuizMode[] = ['practice', 'quick_exam', 'review', 'speed_challenge']

const PRESETS = [10, 25, 50, 100] as const
const MIN_QUESTIONS = 5
const MAX_QUESTIONS = 250

export function StartQuizForm({ availableCounts, unseenCount = 0 }: StartQuizFormProps = {}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [mode, setMode] = useState<QuizMode | null>(null)
  const [areas, setAreas] = useState<number[]>([])
  const [totalQuestions, setTotalQuestions] = useState<number>(20)
  const [onlyUnseen, setOnlyUnseen] = useState<boolean>(false)

  const disciplinarCounts = useMemo(() => getDisciplinarCounts(availableCounts), [availableCounts])

  const selectedMode = QUIZ_MODES.find((m) => m.id === mode)
  const allowAreaSelection =
    mode === 'practice' || mode === 'quick_exam' || mode === 'speed_challenge'
  const allowQuantityEdit = mode !== null && QUANTITY_EDITABLE_MODES.includes(mode)
  const allowOnlyUnseen = mode === 'practice' || mode === 'quick_exam' || mode === 'speed_challenge'

  // Max real basado en areas seleccionadas (o todas si areas vacio)
  const maxAvailable = useMemo(() => {
    if (!disciplinarCounts) return MAX_QUESTIONS
    const relevant = areas.length > 0 ? areas : [1, 2, 3, 4]
    const sum = relevant.reduce((acc, a) => acc + (disciplinarCounts[a] ?? 0), 0)
    return Math.min(sum || MAX_QUESTIONS, MAX_QUESTIONS)
  }, [disciplinarCounts, areas])

  // Al cambiar de modo, sincroniza con el default del modo (clamped a max)
  useEffect(() => {
    if (selectedMode) {
      setTotalQuestions(Math.min(selectedMode.defaults.total, maxAvailable))
    }
  }, [selectedMode, maxAvailable])

  // Si el usuario reduce areas y el total queda sobre el max, ajusta
  useEffect(() => {
    if (totalQuestions > maxAvailable) {
      setTotalQuestions(maxAvailable)
    }
  }, [maxAvailable, totalQuestions])

  function handleStart() {
    if (!mode || !selectedMode) {
      toast.error('Selecciona un modo para comenzar')
      return
    }

    const finalTotal = allowQuantityEdit
      ? Math.min(Math.max(totalQuestions, MIN_QUESTIONS), maxAvailable)
      : selectedMode.defaults.total

    // Sin conexion: el quiz se arma localmente desde IndexedDB (solo modos con
    // seleccion de area: practica / examen rapido / contrarreloj).
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine
    if (isOffline) {
      if (!allowAreaSelection) {
        toast.error('Sin internet solo esta disponible la practica. Conectate para este modo.')
        return
      }
      const params = new URLSearchParams({ n: String(finalTotal) })
      if (areas.length > 0) params.set('areas', areas.join(','))
      router.push(`/quiz/offline?${params.toString()}`)
      return
    }

    if (allowOnlyUnseen && onlyUnseen && unseenCount === 0) {
      toast.error('Ya tomaste todas las preguntas. Usa modo Repaso o desactiva "solo nuevas"')
      return
    }

    startTransition(async () => {
      const result = await startQuizSession({
        mode,
        section: 'disciplinar',
        areas: allowAreaSelection ? areas : [],
        subareas: [],
        totalQuestions: finalTotal,
        timeLimitSeconds: selectedMode.defaults.timeLimitSeconds,
        onlyUnseen: allowOnlyUnseen ? onlyUnseen : false,
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      router.push(`/quiz/session/${result.data.sessionId}`)
    })
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <StepHeader
          step={1}
          icon={<Layers className="h-4 w-4" />}
          title="Elige un modo"
        />
        <ModeSelector selected={mode} onSelect={setMode} />
      </section>

      <AnimatePresence>
        {selectedMode && (
          <motion.section
            key="config"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <StepHeader
              step={2}
              icon={<Settings2 className="h-4 w-4" />}
              title="Configura"
            />
            <GlassCard variant="elevated" padding="lg" className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <Stat label="Modo" value={selectedMode.label} />
                <Stat
                  label="Preguntas"
                  value={`${allowQuantityEdit ? totalQuestions : selectedMode.defaults.total}`}
                />
                <Stat
                  label="Tiempo limite"
                  value={
                    selectedMode.defaults.timeLimitSeconds === null
                      ? 'Sin limite'
                      : `${Math.round(selectedMode.defaults.timeLimitSeconds / 60)} min`
                  }
                />
              </div>

              {allowAreaSelection ? (
                <AreaSelector selected={areas} onChange={setAreas} availableCounts={disciplinarCounts} />
              ) : null}

              {allowOnlyUnseen ? (
                <button
                  type="button"
                  onClick={() => setOnlyUnseen((v) => !v)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors backdrop-blur-md ${
                    onlyUnseen
                      ? 'border-aurora-2/60 bg-aurora-2/10'
                      : 'border-glass-border/30 bg-glass-bg/40 hover:border-aurora-2/30'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">Solo preguntas nuevas</p>
                    <p className="text-xs text-muted-foreground">
                      Garantiza que ninguna pregunta repetida aparezca. Tienes <span className="font-semibold text-aurora-2">{unseenCount.toLocaleString('es-MX')}</span> sin tomar.
                    </p>
                  </div>
                  <span
                    className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${
                      onlyUnseen ? 'border-aurora-2 bg-aurora-2/30' : 'border-bg-border bg-bg-raised'
                    }`}
                    aria-hidden
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground shadow-sm transition-transform ${
                        onlyUnseen ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </span>
                </button>
              ) : null}

              {allowQuantityEdit ? (
                <div className="space-y-3 rounded-lg border border-glass-border/30 bg-glass-bg/40 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-aurora-2" />
                      <p className="text-sm font-medium">Cantidad de preguntas</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Max disponible: <span className="font-semibold text-aurora-2">{maxAvailable}</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={MIN_QUESTIONS}
                    max={maxAvailable}
                    step={1}
                    value={Math.min(totalQuestions, maxAvailable)}
                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                    className="w-full accent-brand-400"
                    aria-label="Cantidad de preguntas"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {PRESETS.filter((p) => p <= maxAvailable).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setTotalQuestions(p)}
                          className={`rounded-md border px-2 py-0.5 text-xs font-medium transition-colors ${
                            totalQuestions === p
                              ? 'border-brand-400 bg-brand-400/20 text-brand-400'
                              : 'border-glass-border/40 bg-glass-bg/60 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setTotalQuestions(maxAvailable)}
                        className={`rounded-md border px-2 py-0.5 text-xs font-medium transition-colors ${
                          totalQuestions === maxAvailable
                            ? 'border-aurora-2 bg-aurora-2/20 text-aurora-2'
                            : 'border-glass-border/40 bg-glass-bg/60 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Todas
                      </button>
                    </div>
                    <input
                      type="number"
                      min={MIN_QUESTIONS}
                      max={maxAvailable}
                      value={totalQuestions}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        if (!Number.isFinite(v)) return
                        setTotalQuestions(Math.min(Math.max(v, MIN_QUESTIONS), maxAvailable))
                      }}
                      className="w-20 rounded-md border border-glass-border/40 bg-bg-base/60 px-2 py-0.5 text-right text-sm font-semibold backdrop-blur-md"
                    />
                  </div>
                </div>
              ) : null}

              {!allowAreaSelection ? (
                <div className="rounded-lg border border-glass-border/30 bg-glass-bg/40 p-4 text-sm text-muted-foreground backdrop-blur-md">
                  {selectedMode.id === 'full_simulacro'
                    ? 'El simulacro completo usa la distribucion oficial del EGEL (todas las areas).'
                    : selectedMode.id === 'review'
                      ? 'El modo repaso usa preguntas que has fallado antes.'
                      : 'Reto diario: set predefinido del dia.'}
                </div>
              ) : null}
            </GlassCard>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        <MagicButton
          variant="aurora"
          size="xl"
          onClick={handleStart}
          disabled={!mode || pending}
          className="min-w-48"
        >
          {pending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <PlayCircle className="h-5 w-5" />
          )}
          Comenzar quiz
        </MagicButton>
      </div>
    </div>
  )
}

function StepHeader({
  step,
  icon,
  title,
}: {
  step: number
  icon: React.ReactNode
  title: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,hsl(var(--aurora-1)/0.3),hsl(var(--aurora-2)/0.3))] text-aurora-2 ring-1 ring-aurora-2/30">
        {icon}
      </div>
      <h2 className="text-lg font-semibold">
        <span className="mr-2 font-mono text-sm text-muted-foreground">
          {step.toString().padStart(2, '0')}
        </span>
        {title}
      </h2>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-glass-border/30 bg-glass-bg/40 p-3 backdrop-blur-md">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  )
}
