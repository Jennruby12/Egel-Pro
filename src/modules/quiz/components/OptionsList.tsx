'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { CorrectAnswer } from '@/types/global'
import type { QuizQuestionForClient } from '@/modules/quiz/types'
import { OptionMedia } from './OptionMedia'
import {
  QuizAnswerFeedback,
  type AnswerFeedbackStatus,
} from './QuizAnswerFeedback'

type OptionsListProps = {
  question: QuizQuestionForClient
  selected: CorrectAnswer | null
  disabled?: boolean
  onSelect: (answer: CorrectAnswer) => void
  /**
   * Status del ultimo intento para mostrar feedback visual breve.
   * Modo practice / review: padre puede pasar 'correct' / 'wrong' al revelar
   * la respuesta. Modo examen normal: omitir (no se revela).
   */
  feedbackStatus?: AnswerFeedbackStatus
  onFeedbackComplete?: () => void
}

export function OptionsList({
  question,
  selected,
  disabled,
  onSelect,
  feedbackStatus,
  onFeedbackComplete,
}: OptionsListProps) {
  const options: {
    label: CorrectAnswer
    text: string
    image: string | null
    diagram: string | null
  }[] = [
    { label: 'a', text: question.option_a, image: question.option_a_image, diagram: question.option_a_diagram },
    { label: 'b', text: question.option_b, image: question.option_b_image, diagram: question.option_b_diagram },
    { label: 'c', text: question.option_c, image: question.option_c_image, diagram: question.option_c_diagram },
  ]

  // Estado local para auto-limpiar el feedback (en caso de no recibir
  // onFeedbackComplete del padre).
  const [internalStatus, setInternalStatus] =
    useState<AnswerFeedbackStatus>(null)
  const currentStatus = feedbackStatus ?? internalStatus

  return (
    <ul className="relative space-y-3">
      {options.map((opt, i) => {
        const isSelected = selected === opt.label
        return (
          <motion.li
            key={opt.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: i * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative"
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelect(opt.label)}
              data-state={isSelected ? 'selected' : 'idle'}
              data-testid={`option-${opt.label}`}
              className={cn(
                'group relative flex w-full items-start gap-4 overflow-hidden rounded-xl border bg-glass-bg/40 p-4 text-left backdrop-blur-md transition-all duration-normal ease-out-expo',
                'hover:-translate-y-0.5',
                isSelected
                  ? [
                      'border-transparent shadow-glow-aurora',
                      // gradient border
                      '[background-image:linear-gradient(hsl(var(--glass-bg)/0.7),hsl(var(--glass-bg)/0.7)),linear-gradient(135deg,hsl(var(--aurora-1)),hsl(var(--aurora-2)),hsl(var(--aurora-3)))]',
                      '[background-origin:border-box]',
                      '[background-clip:padding-box,border-box]',
                      'border-2',
                    ]
                  : 'border-glass-border/30 hover:border-brand-400/50 hover:bg-glass-bg/60 hover:shadow-glow-brand',
                disabled && 'pointer-events-none opacity-60',
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold uppercase transition-all duration-normal',
                  isSelected
                    ? 'bg-[linear-gradient(135deg,hsl(var(--aurora-1)),hsl(var(--aurora-2)))] text-white shadow-glow-aurora ring-2 ring-aurora-2/40'
                    : 'border border-bg-border bg-bg-raised/60 text-muted-foreground group-hover:border-brand-400/40 group-hover:text-brand-400',
                )}
              >
                {opt.label}
              </span>
              <span className="min-w-0 flex-1 pt-1 leading-relaxed">
                {opt.text}
                <OptionMedia image={opt.image} diagram={opt.diagram} />
              </span>

              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 20,
                    }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,hsl(var(--aurora-1)),hsl(var(--aurora-2)))] text-white"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            {/* Feedback overlay sobre la opcion seleccionada cuando hay status */}
            {isSelected && currentStatus && (
              <QuizAnswerFeedback
                status={currentStatus}
                onComplete={() => {
                  setInternalStatus(null)
                  onFeedbackComplete?.()
                }}
                withConfetti={currentStatus === 'correct'}
              />
            )}
          </motion.li>
        )
      })}
    </ul>
  )
}
