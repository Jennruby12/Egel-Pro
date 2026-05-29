'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, PlayCircle, Layers, Settings2 } from 'lucide-react'

import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { ModeSelector, QUIZ_MODES } from './ModeSelector'
import { AreaSelector } from './AreaSelector'
import { startQuizSession } from '@/modules/quiz/actions'
import type { QuizMode } from '@/types/global'

type StartQuizFormProps = {
  availableCounts?: Record<number, number>
}

export function StartQuizForm({ availableCounts }: StartQuizFormProps = {}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [mode, setMode] = useState<QuizMode | null>(null)
  const [areas, setAreas] = useState<number[]>([])

  const selectedMode = QUIZ_MODES.find((m) => m.id === mode)
  const allowAreaSelection =
    mode === 'practice' || mode === 'quick_exam' || mode === 'speed_challenge'

  function handleStart() {
    if (!mode || !selectedMode) {
      toast.error('Selecciona un modo para comenzar')
      return
    }

    startTransition(async () => {
      const result = await startQuizSession({
        mode,
        section: 'disciplinar',
        areas: allowAreaSelection ? areas : [],
        subareas: [],
        totalQuestions: selectedMode.defaults.total,
        timeLimitSeconds: selectedMode.defaults.timeLimitSeconds,
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
                  value={`${selectedMode.defaults.total}`}
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
                <AreaSelector selected={areas} onChange={setAreas} availableCounts={availableCounts} />
              ) : (
                <div className="rounded-lg border border-glass-border/30 bg-glass-bg/40 p-4 text-sm text-muted-foreground backdrop-blur-md">
                  {selectedMode.id === 'full_simulacro'
                    ? 'El simulacro completo usa la distribucion oficial del EGEL (todas las areas).'
                    : selectedMode.id === 'review'
                      ? 'El modo repaso usa preguntas que has fallado antes.'
                      : 'Reto diario: set predefinido del dia.'}
                </div>
              )}
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
