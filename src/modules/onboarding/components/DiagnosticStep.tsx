'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Brain } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { cn } from '@/lib/utils/cn'

type DiagnosticQuestion = {
  id: string
  area: number
  subarea: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  correct_answer: 'a' | 'b' | 'c'
}

type AnswerMap = Record<string, 'a' | 'b' | 'c'>

type Props = {
  questions: DiagnosticQuestion[]
  answers: AnswerMap
  onAnswersChange: (answers: AnswerMap) => void
  onBack: () => void
  onNext: () => void
}

export function DiagnosticStep({
  questions,
  answers,
  onAnswersChange,
  onBack,
  onNext,
}: Props) {
  const [index, setIndex] = useState(0)
  const current = questions[index]

  if (!current) {
    return (
      <GlassCard variant="elevated" padding="lg" className="space-y-4 text-center">
        <p className="text-muted-foreground">
          Aun no hay suficientes preguntas en el banco. Saltando este paso.
        </p>
        <div className="flex justify-center">
          <MagicButton variant="aurora" size="md" onClick={onNext}>
            Continuar
          </MagicButton>
        </div>
      </GlassCard>
    )
  }

  const currentAnswer = answers[current.id]
  const allAnswered = questions.every((q) => answers[q.id])

  function selectAnswer(answer: 'a' | 'b' | 'c') {
    onAnswersChange({ ...answers, [current.id]: answer })
  }

  function handleNext() {
    if (index < questions.length - 1) {
      setIndex(index + 1)
    } else {
      onNext()
    }
  }

  const options: { label: 'a' | 'b' | 'c'; text: string }[] = [
    { label: 'a', text: current.option_a },
    { label: 'b', text: current.option_b },
    { label: 'c', text: current.option_c },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <div
          className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl text-aurora-1"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--aurora-1) / 0.25), hsl(var(--aurora-2) / 0.1))',
            boxShadow: '0 0 24px -8px hsl(var(--aurora-1) / 0.5)',
          }}
        >
          <Brain className="h-6 w-6" />
        </div>
        <h2 className="text-display-sm tracking-tight">
          Diagnostico <span className="text-aurora">inicial</span>
        </h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Responde {questions.length} preguntas para que sepamos tu nivel
          actual. No se cuenta para tu XP.
        </p>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">
          Pregunta {index + 1} de {questions.length}
        </span>
        <span
          className="rounded-full px-2.5 py-1 font-mono font-semibold"
          style={{
            background: `hsl(var(--area-${current.area}) / 0.15)`,
            color: `hsl(var(--area-${current.area}))`,
            boxShadow: `0 0 12px -4px hsl(var(--area-${current.area}) / 0.4)`,
          }}
        >
          A{current.area}.{current.subarea}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassCard variant="elevated" padding="lg" className="space-y-5">
            <p className="text-base font-medium leading-relaxed">
              {current.question_text}
            </p>
            <ul className="space-y-2.5">
              {options.map((opt) => {
                const isSelected = currentAnswer === opt.label
                return (
                  <li key={opt.label}>
                    <button
                      type="button"
                      onClick={() => selectAnswer(opt.label)}
                      className={cn(
                        'group flex w-full items-start gap-3 rounded-lg border p-4 text-left text-sm transition-all duration-fast',
                        isSelected
                          ? 'border-aurora-2 bg-aurora-2/10 shadow-[0_0_24px_-4px_hsl(var(--aurora-2)/0.5)]'
                          : 'border-bg-border/60 bg-bg-raised/40 hover:border-brand-400/60 hover:bg-bg-raised/70 hover:shadow-glow-brand',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase transition-all',
                          isSelected
                            ? 'bg-[linear-gradient(135deg,hsl(var(--aurora-1)),hsl(var(--aurora-2)))] text-white shadow-glow-brand'
                            : 'bg-bg-elevated text-muted-foreground group-hover:text-foreground',
                        )}
                      >
                        {opt.label}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{opt.text}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <MagicButton
          variant="ghost"
          size="md"
          onClick={index === 0 ? onBack : () => setIndex(index - 1)}
        >
          <ArrowLeft className="h-4 w-4" />
          {index === 0 ? 'Atras' : 'Anterior'}
        </MagicButton>
        <MagicButton
          variant="aurora"
          size="md"
          onClick={handleNext}
          disabled={!currentAnswer || (index === questions.length - 1 && !allAnswered)}
        >
          {index === questions.length - 1 ? 'Continuar' : 'Siguiente'}
          <ArrowRight className="h-4 w-4" />
        </MagicButton>
      </div>

      {/* Progreso visual */}
      <div className="flex justify-center gap-1.5">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className={cn(
              'h-1.5 rounded-full transition-all duration-normal',
              i === index
                ? 'w-10 bg-aurora-2 shadow-[0_0_8px_hsl(var(--aurora-2)/0.6)]'
                : answers[q.id]
                  ? 'w-6 bg-success/60'
                  : 'w-6 bg-bg-elevated',
            )}
          />
        ))}
      </div>
    </div>
  )
}

export type { DiagnosticQuestion, AnswerMap }
