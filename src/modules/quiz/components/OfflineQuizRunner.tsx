'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X, WifiOff, ChevronLeft, SkipForward, ChevronRight, Flag } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { QuestionDisplay } from './QuestionDisplay'
import { OptionsList } from './OptionsList'
import { cn } from '@/lib/utils/cn'
import type { OfflineQuestion } from '@/modules/quiz/offline-content-actions'
import type { QuizQuestionForClient } from '@/modules/quiz/types'
import type { CorrectAnswer } from '@/types/global'
import { scoreOfflineQuiz } from '@/modules/quiz/lib/offline-quiz'
import { enqueueOfflineSession } from '@/lib/offline/offline-sessions'

type Props = {
  questions: OfflineQuestion[]
  areas: number[]
}

// OfflineQuestion tiene los campos que QuestionDisplay/OptionsList leen
// (area, *_name, opciones, etc.). Cast acotado para reusar esa UI tal cual.
function asClient(q: OfflineQuestion): QuizQuestionForClient {
  return q as unknown as QuizQuestionForClient
}

export function OfflineQuizRunner({ questions, areas }: Props) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, CorrectAnswer | null>>({})
  const [finished, setFinished] = useState(false)
  const startedAtRef = useRef<number>(Date.now())
  const enterRef = useRef<number>(Date.now())
  const timeRef = useRef<Record<string, number>>({})

  const q = questions[index]
  const answer = q ? answers[q.id] : undefined
  const answered = answer !== undefined

  const answeredCount = useMemo(
    () => Object.values(answers).filter((a) => a !== null).length,
    [answers],
  )

  function accumulateTime(qid: string) {
    const elapsed = Math.floor((Date.now() - enterRef.current) / 1000)
    timeRef.current[qid] = (timeRef.current[qid] ?? 0) + elapsed
    enterRef.current = Date.now()
  }

  function handleSelect(a: CorrectAnswer) {
    if (!q || answered) return
    setAnswers((prev) => ({ ...prev, [q.id]: a }))
  }

  function goTo(next: number) {
    if (q) accumulateTime(q.id)
    setIndex(Math.max(0, Math.min(next, questions.length - 1)))
  }

  function handleSkip() {
    if (!q) return
    if (answers[q.id] === undefined) setAnswers((prev) => ({ ...prev, [q.id]: null }))
    goTo(index + 1)
  }

  function handleFinish() {
    if (q) accumulateTime(q.id)
    const result = scoreOfflineQuiz(questions, answers)
    enqueueOfflineSession({
      id: `off-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      mode: 'practice',
      areas,
      total: result.total,
      correct: result.correct,
      wrong: result.wrong,
      skipped: result.skipped,
      scorePercent: result.scorePercent,
      answers: questions.map((qq) => {
        const ua = answers[qq.id] ?? null
        return {
          questionId: qq.id,
          userAnswer: ua,
          isCorrect: ua === null ? null : ua === qq.correct_answer,
          timeSpentSeconds: timeRef.current[qq.id] ?? 0,
        }
      }),
      startedAt: startedAtRef.current,
      finishedAt: Date.now(),
    })
    setFinished(true)
  }

  if (!q) {
    return (
      <GlassCard variant="elevated" padding="lg" className="text-center text-muted-foreground">
        No hay preguntas disponibles offline.
      </GlassCard>
    )
  }

  if (finished) {
    const result = scoreOfflineQuiz(questions, answers)
    return (
      <GlassCard variant="elevated" padding="xl" className="space-y-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-aurora-2/15 text-aurora-2">
            <Check className="h-8 w-8" />
          </span>
          <h2 className="text-display-sm font-bold">Quiz offline completado</h2>
          <p className="text-5xl font-bold tabular-nums text-aurora-2">{result.scorePercent}%</p>
          <p className="text-sm text-muted-foreground">
            {result.correct} correctas · {result.wrong} incorrectas · {result.skipped} saltadas
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-xl border border-aurora-2/30 bg-aurora-2/5 p-3 text-xs text-muted-foreground">
          <WifiOff className="h-4 w-4 text-aurora-2" />
          Guardado. Se sincroniza con tu cuenta (XP, racha y progreso) cuando vuelvas a tener internet.
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <MagicButton asChild variant="outline" size="lg">
            <Link href="/quiz">Otro quiz</Link>
          </MagicButton>
          <MagicButton asChild variant="aurora" size="lg">
            <Link href="/dashboard">Ir al inicio</Link>
          </MagicButton>
        </div>
      </GlassCard>
    )
  }

  const isCorrect = answered && answer === q.correct_answer

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-aurora-2/40 bg-aurora-2/10 px-3 py-1 text-xs font-medium text-aurora-2">
          <WifiOff className="h-3.5 w-3.5" />
          Modo offline
        </div>
        <p className="text-sm text-muted-foreground">
          {index + 1} / {questions.length} · {answeredCount} respondidas
        </p>
      </div>

      <GlassCard variant="elevated" padding="lg" className="overflow-hidden md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <QuestionDisplay question={asClient(q)} />
            <OptionsList
              question={asClient(q)}
              selected={answer ?? null}
              disabled={answered}
              onSelect={handleSelect}
            />

            {answered ? (
              <div
                className={cn(
                  'space-y-2 rounded-xl border p-4 text-sm backdrop-blur-md',
                  isCorrect ? 'border-success/40 bg-success/10' : 'border-danger/40 bg-danger/10',
                )}
              >
                <p className={cn('flex items-center gap-2 font-semibold', isCorrect ? 'text-success' : 'text-danger')}>
                  {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  {isCorrect
                    ? '¡Correcta!'
                    : answer === null
                      ? 'Saltada'
                      : `Incorrecta · la respuesta es ${q.correct_answer.toUpperCase()}`}
                </p>
                {q.explanation ? (
                  <p className="leading-relaxed text-muted-foreground">{q.explanation}</p>
                ) : null}
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </GlassCard>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="inline-flex items-center gap-1 rounded-xl border border-glass-border/40 bg-glass-bg/40 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Anterior
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSkip}
            className="inline-flex items-center gap-1 rounded-xl border border-glass-border/40 bg-glass-bg/40 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground"
          >
            <SkipForward className="h-4 w-4" /> Saltar
          </button>
          {index === questions.length - 1 ? (
            <MagicButton variant="aurora" size="md" onClick={handleFinish}>
              <Flag className="h-4 w-4" /> Finalizar
            </MagicButton>
          ) : (
            <MagicButton variant="aurora" size="md" onClick={() => goTo(index + 1)}>
              Siguiente <ChevronRight className="h-4 w-4" />
            </MagicButton>
          )}
        </div>
      </div>
    </div>
  )
}
