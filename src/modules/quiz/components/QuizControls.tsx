'use client'

import {
  ChevronLeft,
  ChevronRight,
  Flag,
  SkipForward,
  Send,
  Loader2,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { MagicButton } from '@/components/ui/magic-button'
import { cn } from '@/lib/utils/cn'

type QuizControlsProps = {
  canPrev: boolean
  isLast: boolean
  isMarked: boolean
  isFinishing: boolean
  onPrev: () => void
  onNext: () => void
  onSkip: () => void
  onToggleMark: () => void
  onFinish: () => void
}

export function QuizControls({
  canPrev,
  isLast,
  isMarked,
  isFinishing,
  onPrev,
  onNext,
  onSkip,
  onToggleMark,
  onFinish,
}: QuizControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <MagicButton
          variant="ghost"
          size="md"
          onClick={onPrev}
          disabled={!canPrev || isFinishing}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </MagicButton>
        <MagicButton
          variant="ghost"
          size="md"
          onClick={onToggleMark}
          disabled={isFinishing}
          className={cn(isMarked && 'text-warning')}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={isMarked ? 'on' : 'off'}
              initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.6, rotate: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="inline-flex items-center"
            >
              <Flag
                className={cn(
                  'mr-2 h-4 w-4',
                  isMarked && 'fill-warning text-warning',
                )}
              />
              {isMarked ? 'Marcada' : 'Marcar'}
            </motion.span>
          </AnimatePresence>
        </MagicButton>
      </div>

      <div className="flex items-center gap-2">
        {!isLast ? (
          <>
            <MagicButton
              variant="outline"
              size="md"
              onClick={onSkip}
              disabled={isFinishing}
            >
              <SkipForward className="h-4 w-4" />
              Saltar
            </MagicButton>
            <MagicButton
              variant="solid"
              size="md"
              onClick={onNext}
              disabled={isFinishing}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </MagicButton>
          </>
        ) : (
          <MagicButton
            variant="aurora"
            size="lg"
            onClick={onFinish}
            disabled={isFinishing}
          >
            {isFinishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Finalizar quiz
          </MagicButton>
        )}
      </div>
    </div>
  )
}
