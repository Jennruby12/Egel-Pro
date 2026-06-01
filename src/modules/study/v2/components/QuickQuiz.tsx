'use client'

import { useEffect, useState } from 'react'
import { Check, X, Loader2, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { fetchQuickQuizQuestions } from '@/modules/study/v2/actions'

type Q = {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  correct_answer: 'a' | 'b' | 'c'
  explanation: string | null
  difficulty: string | null
}

type Props = {
  guideId: string
  guideSlug: string
  /** Pre-fetched (server) para evitar latencia. Si no, se carga client-side. */
  initialQuestions?: Q[]
}

export function QuickQuiz({ guideId, guideSlug, initialQuestions }: Props) {
  const [questions, setQuestions] = useState<Q[]>(initialQuestions ?? [])
  const [loading, setLoading] = useState(initialQuestions === undefined)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, 'a' | 'b' | 'c'>>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (initialQuestions !== undefined) return
    void (async () => {
      const res = await fetchQuickQuizQuestions(guideId)
      if (!res.success) {
        setError(res.error)
        setLoading(false)
        return
      }
      setQuestions(res.data ?? [])
      setLoading(false)
    })()
  }, [guideId, initialQuestions])

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-glass-border/40 bg-glass-bg/40 p-6 text-muted-foreground backdrop-blur-md">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando reactivos...
      </div>
    )
  }
  if (error) {
    return <p className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">{error}</p>
  }
  if (questions.length === 0) {
    return <p className="rounded-xl border border-glass-border/40 bg-glass-bg/40 p-4 text-sm text-muted-foreground">No hay reactivos disponibles para esta subarea aun.</p>
  }

  const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.correct_answer ? 1 : 0), 0)
  const allAnswered = questions.every((q) => answers[q.id] !== undefined)

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => {
        const userAns = answers[q.id]
        const showResult = submitted && userAns !== undefined
        return (
          <div
            key={q.id}
            className="rounded-xl border border-glass-border/40 bg-glass-bg/40 p-4 backdrop-blur-md"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <p className="text-sm font-semibold">
                <span className="text-aurora-2">{idx + 1}.</span> {q.question_text}
              </p>
              {q.difficulty ? (
                <span className="shrink-0 rounded-full border border-bg-border/40 px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                  {q.difficulty}
                </span>
              ) : null}
            </div>
            <ul className="space-y-1.5">
              {(['a', 'b', 'c'] as const).map((letter) => {
                const text = letter === 'a' ? q.option_a : letter === 'b' ? q.option_b : q.option_c
                const isUser = userAns === letter
                const isCorrect = q.correct_answer === letter
                return (
                  <li key={letter}>
                    <button
                      type="button"
                      disabled={submitted}
                      onClick={() => setAnswers((p) => ({ ...p, [q.id]: letter }))}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                        showResult && isCorrect && 'border-success/60 bg-success/10',
                        showResult && isUser && !isCorrect && 'border-danger/60 bg-danger/10',
                        !showResult && isUser && 'border-aurora-2/60 bg-aurora-2/10',
                        !showResult && !isUser && 'border-glass-border/40 bg-glass-bg/40 hover:border-aurora-2/30',
                      )}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bg-raised/60 text-xs font-bold uppercase">
                        {letter}
                      </span>
                      <span className="flex-1">{text}</span>
                      {showResult && isCorrect ? <Check className="h-4 w-4 text-success" /> : null}
                      {showResult && isUser && !isCorrect ? <X className="h-4 w-4 text-danger" /> : null}
                    </button>
                  </li>
                )
              })}
            </ul>
            {submitted && q.explanation ? (
              <div className="mt-3 flex gap-2 rounded-lg border border-aurora-3/30 bg-aurora-3/5 p-3 text-xs">
                <Lightbulb className="h-3.5 w-3.5 shrink-0 text-aurora-3" />
                <p className="text-muted-foreground">{q.explanation}</p>
              </div>
            ) : null}
          </div>
        )
      })}

      {!submitted ? (
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={!allAnswered}
          className="w-full rounded-xl bg-aurora-2 px-4 py-2 text-sm font-semibold text-bg-base transition-colors hover:bg-aurora-2/90 disabled:opacity-50"
        >
          Calificar quiz ({Object.keys(answers).length}/{questions.length} respondidas)
        </button>
      ) : (
        <div className="rounded-xl border border-aurora-2/40 bg-aurora-2/10 p-4 text-center backdrop-blur-md">
          <p className="text-sm font-semibold">
            Tu puntaje: <span className="text-aurora-2">{score}/{questions.length}</span>
          </p>
          <a
            href={`/quiz?from=${encodeURIComponent(guideSlug)}`}
            className="mt-2 inline-block text-xs text-aurora-2 underline hover:text-aurora-1"
          >
            Practicar mas reactivos de esta subarea
          </a>
        </div>
      )}
    </div>
  )
}
