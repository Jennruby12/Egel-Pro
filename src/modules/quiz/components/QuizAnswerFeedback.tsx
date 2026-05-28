'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X, MinusCircle } from 'lucide-react'
import { fireConfetti } from '@/components/ui/confetti'
import { cn } from '@/lib/utils/cn'

export type AnswerFeedbackStatus = 'correct' | 'wrong' | 'skipped' | null

type QuizAnswerFeedbackProps = {
  status: AnswerFeedbackStatus
  onComplete?: () => void
  /** Si true, dispara confetti pequeno al ser 'correct'. Default false. */
  withConfetti?: boolean
  className?: string
}

// Cleanup a 800ms (suficiente para que se note pero no estorbe al siguiente
// reactivo). Si necesitas afinar, ajusta aqui en un solo lugar.
const AUTO_CLEANUP_MS = 800

const STATUS_META = {
  correct: {
    label: 'Correcta',
    icon: Check,
    iconColor: 'text-success',
    iconBg: 'bg-success/15 ring-success/40',
    glow: 'shadow-[0_0_36px_-4px_hsl(var(--success)/0.6)]',
    flash: 'bg-success/10',
  },
  wrong: {
    label: 'Incorrecta',
    icon: X,
    iconColor: 'text-danger',
    iconBg: 'bg-danger/15 ring-danger/40',
    glow: 'shadow-[0_0_36px_-4px_hsl(var(--danger)/0.6)]',
    flash: 'bg-danger/10',
  },
  skipped: {
    label: 'Saltada',
    icon: MinusCircle,
    iconColor: 'text-muted-foreground',
    iconBg: 'bg-bg-raised/60 ring-bg-border/60',
    glow: 'shadow-[0_0_24px_-6px_hsl(var(--bg-border)/0.5)]',
    flash: 'bg-bg-raised/30',
  },
} as const

/**
 * Overlay visual breve (800ms) que confirma la respuesta seleccionada.
 *
 * - correct: flash verde + check icon con glow (+ confetti opcional)
 * - wrong:   flash rojo + cross icon + shake horizontal
 * - skipped: pulse gris + minus icon
 *
 * Renderiza absoluto sobre su contenedor padre (`absolute inset-0`), asi que
 * el padre debe ser `relative` y permitir overflow visible.
 *
 * El componente se auto-cleanup llamando a onComplete despues de AUTO_CLEANUP_MS.
 */
export function QuizAnswerFeedback({
  status,
  onComplete,
  withConfetti = false,
  className,
}: QuizAnswerFeedbackProps) {
  // Auto-cleanup + confetti opcional al cambiar a 'correct'
  useEffect(() => {
    if (!status) return

    if (status === 'correct' && withConfetti) {
      fireConfetti('achievement')
    }

    const timeout = window.setTimeout(() => {
      onComplete?.()
    }, AUTO_CLEANUP_MS)

    return () => window.clearTimeout(timeout)
  }, [status, withConfetti, onComplete])

  return (
    <AnimatePresence>
      {status && (
        <motion.div
          key={status}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden rounded-xl',
            className,
          )}
          data-testid="quiz-answer-feedback"
          data-status={status}
          aria-live="polite"
        >
          {/* Capa flash de color */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4] }}
            transition={{ duration: 0.5, times: [0, 0.3, 1] }}
            className={cn('absolute inset-0', STATUS_META[status].flash)}
          />

          {/* Wrapper con shake (solo en wrong) */}
          <motion.div
            initial={{ scale: 0 }}
            animate={
              status === 'wrong'
                ? { scale: 1, x: [-4, 4, -2, 2, 0] }
                : status === 'skipped'
                  ? { scale: [0.8, 1.05, 1], opacity: [0.6, 1, 0.9] }
                  : { scale: 1 }
            }
            transition={
              status === 'wrong'
                ? {
                    scale: { type: 'spring', stiffness: 360, damping: 18 },
                    x: { duration: 0.4, ease: 'easeOut' },
                  }
                : { type: 'spring', stiffness: 320, damping: 18 }
            }
            className="relative"
          >
            <FeedbackIcon status={status} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function FeedbackIcon({
  status,
}: {
  status: NonNullable<AnswerFeedbackStatus>
}) {
  const meta = STATUS_META[status]
  const Icon = meta.icon
  return (
    <span
      className={cn(
        'flex h-20 w-20 items-center justify-center rounded-full ring-2 backdrop-blur-md',
        meta.iconBg,
        meta.glow,
      )}
      aria-label={meta.label}
      role="img"
    >
      <Icon
        className={cn('h-10 w-10', meta.iconColor)}
        strokeWidth={status === 'skipped' ? 2 : 3}
      />
    </span>
  )
}
