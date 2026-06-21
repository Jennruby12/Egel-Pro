'use client'

import { useState, useTransition } from 'react'
import { Flag } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { toggleQuestionFeedback } from '@/modules/quiz/feedback-actions'
import {
  QUESTION_FEEDBACK_REASONS,
  FEEDBACK_REASON_LABELS,
  type QuestionFeedbackReason,
} from '@/lib/constants/question-feedback'

type Props = {
  questionId: string
  /** Razones que el usuario ya marco (para precargar el estado). */
  initialReasons?: string[]
}

/**
 * Chips para que el usuario marque como percibio una pregunta (feedback de
 * calidad). Toggle optimista: actualiza la UI al instante y revierte si la
 * Server Action falla. Cada marca alimenta el contador en BD (question_feedback).
 */
export function QuestionFeedbackChips({ questionId, initialReasons = [] }: Props) {
  const [marked, setMarked] = useState<Set<string>>(() => new Set(initialReasons))
  const [pending, startTransition] = useTransition()

  function toggle(reason: QuestionFeedbackReason) {
    const wasMarked = marked.has(reason)
    // Optimista
    setMarked((prev) => {
      const next = new Set(prev)
      if (wasMarked) next.delete(reason)
      else next.add(reason)
      return next
    })
    startTransition(async () => {
      const res = await toggleQuestionFeedback({ questionId, reason })
      if (!res.success) {
        // Revertir
        setMarked((prev) => {
          const next = new Set(prev)
          if (wasMarked) next.add(reason)
          else next.delete(reason)
          return next
        })
        toast.error(res.error)
      }
    })
  }

  return (
    <div className="rounded-lg border border-glass-border/30 bg-bg-base/40 p-3 backdrop-blur-md">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Flag className="h-3.5 w-3.5 text-aurora-2" />
        ¿Como se te hizo esta pregunta? <span className="font-normal text-muted-foreground/60">(opcional)</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {QUESTION_FEEDBACK_REASONS.map((reason) => {
          const active = marked.has(reason)
          return (
            <button
              key={reason}
              type="button"
              onClick={() => toggle(reason)}
              disabled={pending}
              aria-pressed={active}
              data-testid={`qf-chip-${reason}`}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60',
                active
                  ? 'border-aurora-2/60 bg-aurora-2/15 text-aurora-2'
                  : 'border-glass-border/40 bg-glass-bg/40 text-muted-foreground hover:border-aurora-2/40 hover:text-foreground',
              )}
            >
              {FEEDBACK_REASON_LABELS[reason]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
