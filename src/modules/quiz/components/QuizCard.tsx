'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'

import { GlassCard } from '@/components/ui/glass-card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { QuizTimer } from './QuizTimer'
import { QuizProgress } from './QuizProgress'
import { QuestionDisplay } from './QuestionDisplay'
import { OptionsList } from './OptionsList'
import { QuizControls } from './QuizControls'
import { useQuizStore } from '@/modules/quiz/store/quiz-store'
import { useQuizTimer } from '@/modules/quiz/hooks/useQuizTimer'
import { submitAnswer, completeSession } from '@/modules/quiz/actions'
import type { QuizQuestionForClient } from '@/modules/quiz/types'
import type { CorrectAnswer } from '@/types/global'
import { cn } from '@/lib/utils/cn'

type QuizCardProps = {
  sessionId: string
  questions: QuizQuestionForClient[]
  timeLimitSeconds: number | null
}

export function QuizCard({
  sessionId,
  questions,
  timeLimitSeconds,
}: QuizCardProps) {
  const router = useRouter()
  const [isFinishing, startFinishing] = useTransition()
  const [direction, setDirection] = useState(1)

  const init = useQuizStore((s) => s.init)
  const currentIndex = useQuizStore((s) => s.currentIndex)
  const goToIndex = useQuizStore((s) => s.goToIndex)
  const next = useQuizStore((s) => s.next)
  const prev = useQuizStore((s) => s.prev)
  const answers = useQuizStore((s) => s.answers)
  const setAnswer = useQuizStore((s) => s.setAnswer)
  const toggleMark = useQuizStore((s) => s.toggleMark)
  const addTimeSpent = useQuizStore((s) => s.addTimeSpent)
  const answeredCount = useQuizStore(
    (s) => Object.values(s.answers).filter((a) => a.userAnswer !== null).length,
  )
  const markedCount = useQuizStore(
    (s) => Object.values(s.answers).filter((a) => a.isMarked).length,
  )

  // Inicializar el store SOLO al montar / cambiar sessionId
  useEffect(() => {
    init(sessionId, questions.length)
  }, [sessionId, questions.length, init])

  // Track tiempo por pregunta — guardar segundos cuando cambia el currentIndex
  const enterTimeRef = useRef<number>(Date.now())
  const lastQuestionIdRef = useRef<string | null>(null)
  const currentQuestion = questions[currentIndex]

  useEffect(() => {
    // Al cambiar de pregunta: acumular tiempo en la anterior
    if (
      lastQuestionIdRef.current &&
      lastQuestionIdRef.current !== currentQuestion?.id
    ) {
      const elapsed = Math.floor((Date.now() - enterTimeRef.current) / 1000)
      addTimeSpent(lastQuestionIdRef.current, elapsed)
    }
    enterTimeRef.current = Date.now()
    lastQuestionIdRef.current = currentQuestion?.id ?? null
  }, [currentIndex, currentQuestion?.id, addTimeSpent])

  // Timer
  const handleTimeUp = useCallback(() => {
    toast.warning('Se acabo el tiempo. Finalizando...')
    void handleFinish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startedAt = useQuizStore((s) => s.startedAt) ?? Date.now()
  const { remainingSeconds } = useQuizTimer({
    startedAt,
    timeLimitSeconds,
    onExpire: handleTimeUp,
  })

  // Submit en background al cambiar la respuesta / marca
  const submitInBackground = useCallback(
    async (questionId: string) => {
      const a = useQuizStore.getState().answers[questionId]
      if (!a) return
      const elapsed = Math.floor((Date.now() - enterTimeRef.current) / 1000)
      await submitAnswer({
        sessionId,
        questionId,
        userAnswer: a.userAnswer,
        timeSpentSeconds: a.timeSpentSeconds + elapsed,
        orderInQuiz: currentIndex,
        isMarked: a.isMarked,
      })
    },
    [sessionId, currentIndex],
  )

  function handleSelect(answer: CorrectAnswer) {
    if (!currentQuestion) return
    setAnswer(currentQuestion.id, answer)
    void submitInBackground(currentQuestion.id)
  }

  function handleSkip() {
    if (!currentQuestion) return
    setAnswer(currentQuestion.id, null)
    void submitInBackground(currentQuestion.id)
    setDirection(1)
    next()
  }

  function handleToggleMark() {
    if (!currentQuestion) return
    toggleMark(currentQuestion.id)
    void submitInBackground(currentQuestion.id)
  }

  function handleNext() {
    if (currentQuestion) void submitInBackground(currentQuestion.id)
    setDirection(1)
    next()
  }

  function handlePrev() {
    if (currentQuestion) void submitInBackground(currentQuestion.id)
    setDirection(-1)
    prev()
  }

  function handleJumpTo(i: number) {
    setDirection(i > currentIndex ? 1 : -1)
    goToIndex(i)
  }

  async function handleFinish() {
    if (currentQuestion) await submitInBackground(currentQuestion.id)
    startFinishing(async () => {
      const result = await completeSession({ sessionId, earlyEnd: false })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      useQuizStore.getState().reset()
      router.push(`/quiz/results/${sessionId}`)
      router.refresh()
    })
  }

  async function handleEndEarly() {
    if (currentQuestion) await submitInBackground(currentQuestion.id)
    startFinishing(async () => {
      const result = await completeSession({ sessionId, earlyEnd: true })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      useQuizStore.getState().reset()
      router.push(`/quiz/results/${sessionId}`)
      router.refresh()
    })
  }

  if (!currentQuestion) {
    return (
      <GlassCard variant="elevated" padding="lg" className="text-center text-muted-foreground">
        No hay preguntas en esta sesion.
      </GlassCard>
    )
  }

  const currentAnswer = answers[currentQuestion.id]

  return (
    <TooltipProvider delayDuration={150}>
      <div className="space-y-5">
        {/* Top bar: progress + timer */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <QuizProgress
            current={currentIndex}
            total={questions.length}
            answered={answeredCount}
            marked={markedCount}
          />
          <QuizTimer
            remainingSeconds={remainingSeconds}
            totalSeconds={timeLimitSeconds}
          />
        </div>

        {/* Main quiz card */}
        <GlassCard variant="elevated" padding="lg" className="overflow-hidden md:p-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 24 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <QuestionDisplay question={currentQuestion} />
              <OptionsList
                question={currentQuestion}
                selected={currentAnswer?.userAnswer ?? null}
                disabled={isFinishing}
                onSelect={handleSelect}
              />
            </motion.div>
          </AnimatePresence>
        </GlassCard>

        <QuizControls
          canPrev={currentIndex > 0}
          isLast={currentIndex === questions.length - 1}
          isMarked={currentAnswer?.isMarked ?? false}
          isFinishing={isFinishing}
          onPrev={handlePrev}
          onNext={handleNext}
          onSkip={handleSkip}
          onToggleMark={handleToggleMark}
          onFinish={handleFinish}
          onEndEarly={answeredCount > 0 ? handleEndEarly : undefined}
          answeredCount={answeredCount}
          total={questions.length}
        />

        {/* Mini-mapa para saltar a cualquier pregunta */}
        <GlassCard variant="flat" padding="md">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Mapa de preguntas</span>
            <div className="flex items-center gap-3">
              <Legend color="bg-brand-400" label="Actual" />
              <Legend color="bg-success" label="Respondida" />
              <Legend color="bg-warning" label="Marcada" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, i) => {
              const ans = answers[q.id]
              const active = i === currentIndex
              const answered =
                ans?.userAnswer !== null && ans?.userAnswer !== undefined
              const marked = ans?.isMarked
              return (
                <Tooltip key={q.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => handleJumpTo(i)}
                      data-testid={`quiz-map-${i}`}
                      className={cn(
                        'h-8 w-8 rounded-md text-xs font-semibold transition-all duration-fast ease-out-expo',
                        'hover:scale-110',
                        active
                          ? 'bg-[linear-gradient(135deg,hsl(var(--aurora-1)),hsl(var(--aurora-2)))] text-white shadow-glow-brand ring-2 ring-aurora-2/50'
                          : marked
                            ? 'bg-warning/20 text-warning ring-1 ring-warning/40 hover:bg-warning/30'
                            : answered
                              ? 'bg-success/20 text-success ring-1 ring-success/40 hover:bg-success/30'
                              : 'bg-bg-raised/60 text-muted-foreground hover:bg-bg-border/80 hover:text-foreground',
                      )}
                    >
                      {i + 1}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Pregunta {i + 1}
                    {marked ? ' · marcada' : ''}
                    {answered && !marked ? ' · respondida' : ''}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </GlassCard>
      </div>
    </TooltipProvider>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('h-2 w-2 rounded-full', color)} />
      <span>{label}</span>
    </span>
  )
}
