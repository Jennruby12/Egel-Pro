'use client'

import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { CheckCircle2, Layers, RotateCcw } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { SparklesText } from '@/components/ui/sparkles-text'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn } from '@/lib/utils/cn'
import { submitFlashcardReview } from '@/modules/study/actions'
import { FlashcardCard } from './FlashcardCard'

export type DeckFlashcard = {
  id: string
  front: string
  back: string
  /** Area id opcional para tematizar la card. */
  areaId?: number
}

type FlashcardDeckProps = {
  cards: DeckFlashcard[]
  /** id del usuario actual (no usado por la action, pero util para tracking futuro). */
  userId: string
  /** Ruta para volver al hub de la subarea. */
  backHref?: string
}

type QualityOption = {
  value: 0 | 1 | 2 | 3 | 4 | 5
  label: string
  description: string
  /** Color HSL del semantic (custom per quality). */
  bgClass: string
}

// 6 botones de calidad SM-2, ordenados de peor a mejor.
// Cada uno con un color semantic distinto: rojo / orange / amarillo / lime / verde / cyan.
const QUALITY_OPTIONS: ReadonlyArray<QualityOption> = [
  {
    value: 0,
    label: 'Olvide',
    description: 'No recordaba nada',
    bgClass:
      'bg-[hsl(0_85%_55%)] hover:bg-[hsl(0_85%_60%)] text-white shadow-[0_0_24px_-4px_hsl(0_85%_55%/0.6)]',
  },
  {
    value: 1,
    label: 'Mal',
    description: 'Algo familiar pero incorrecto',
    bgClass:
      'bg-[hsl(15_85%_55%)] hover:bg-[hsl(15_85%_60%)] text-white shadow-[0_0_24px_-4px_hsl(15_85%_55%/0.6)]',
  },
  {
    value: 2,
    label: 'Casi',
    description: 'Cerca pero incorrecto',
    bgClass:
      'bg-[hsl(43_95%_55%)] hover:bg-[hsl(43_95%_60%)] text-[hsl(232_65%_8%)] shadow-[0_0_24px_-4px_hsl(43_95%_55%/0.6)]',
  },
  {
    value: 3,
    label: 'Bien',
    description: 'Correcto con esfuerzo',
    bgClass:
      'bg-[hsl(80_75%_50%)] hover:bg-[hsl(80_75%_55%)] text-[hsl(232_65%_8%)] shadow-[0_0_24px_-4px_hsl(80_75%_50%/0.6)]',
  },
  {
    value: 4,
    label: 'Facil',
    description: 'Correcto con duda leve',
    bgClass:
      'bg-[hsl(142_71%_45%)] hover:bg-[hsl(142_71%_50%)] text-white shadow-[0_0_24px_-4px_hsl(142_71%_45%/0.6)]',
  },
  {
    value: 5,
    label: 'Perfecto',
    description: 'Recuerdo total',
    bgClass:
      'bg-[hsl(190_100%_55%)] hover:bg-[hsl(190_100%_60%)] text-[hsl(232_65%_8%)] shadow-[0_0_24px_-4px_hsl(190_100%_55%/0.6)]',
  },
]

export function FlashcardDeck({ cards, userId: _userId, backHref = '/study' }: FlashcardDeckProps) {
  const total = cards.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set())
  const [lastIntervalDays, setLastIntervalDays] = useState<number | null>(null)
  const [pending, startTransition] = useTransition()

  const currentCard = cards[currentIndex]
  const completedCount = completedIds.size
  const progressPercent = total === 0 ? 0 : Math.round((completedCount / total) * 100)
  const finished = completedCount >= total

  const summaryNextDays = useMemo(() => {
    return lastIntervalDays ?? null
  }, [lastIntervalDays])

  function handleFlip() {
    if (!finished && currentCard) {
      setFlipped((v) => !v)
    }
  }

  function handleQuality(quality: QualityOption['value']) {
    if (!currentCard || pending) return
    const card = currentCard

    startTransition(async () => {
      const result = await submitFlashcardReview({
        flashcardId: card.id,
        quality,
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      setLastIntervalDays(result.data.interval)
      setCompletedIds((prev) => {
        const next = new Set(prev)
        next.add(card.id)
        return next
      })

      setFlipped(false)
      setTimeout(() => {
        setCurrentIndex((i) => Math.min(i + 1, total))
      }, 280)
    })
  }

  function handleRestart() {
    setCurrentIndex(0)
    setFlipped(false)
    setCompletedIds(new Set())
    setLastIntervalDays(null)
  }

  if (total === 0) {
    return (
      <GlassCard variant="elevated" padding="lg">
        <EmptyState
          icon={<Layers className="h-7 w-7" aria-hidden="true" />}
          title="No hay tarjetas disponibles"
          description="Vuelve mas tarde para continuar tu repaso."
          size="sm"
        />
      </GlassCard>
    )
  }

  if (finished) {
    return (
      <GlassCard
        variant="elevated"
        padding="xl"
        className="text-center"
        data-testid="flashcards-session-complete"
      >
        <div className="flex flex-col items-center gap-4 py-8">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 14 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success shadow-[0_0_40px_-6px_hsl(var(--success)/0.6)]"
          >
            <CheckCircle2 className="h-10 w-10" />
          </motion.div>
          <SparklesText>
            <h2 className="text-display-sm font-bold text-aurora">Sesion completa</h2>
          </SparklesText>
          <p className="text-sm text-muted-foreground">
            Revisaste{' '}
            <AnimatedCounter
              value={completedCount}
              className="font-semibold text-foreground"
            />{' '}
            {completedCount === 1 ? 'tarjeta' : 'tarjetas'} en esta sesion.
          </p>
          {summaryNextDays !== null ? (
            <p className="text-sm text-muted-foreground">
              Tu proxima revision sera en aproximadamente{' '}
              <span className="font-semibold text-brand-400">
                <AnimatedCounter value={summaryNextDays} />{' '}
                {summaryNextDays === 1 ? 'dia' : 'dias'}
              </span>
              .
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <MagicButton variant="outline" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4" />
              Repetir
            </MagicButton>
            <Link href={backHref}>
              <MagicButton variant="aurora">Volver al estudio</MagicButton>
            </Link>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progreso con gradient aurora animado */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Tarjeta {Math.min(currentIndex + 1, total)} de {total}
          </span>
          <span className="font-mono font-semibold tabular-nums text-aurora">
            {progressPercent}%
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-bg-raised">
          <motion.div
            className="absolute inset-y-0 left-0 h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--aurora-1)),hsl(var(--aurora-2))_50%,hsl(var(--aurora-3)))]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Card */}
      {currentCard ? (
        <FlashcardCard
          front={currentCard.front}
          back={currentCard.back}
          flipped={flipped}
          onFlip={handleFlip}
          areaId={currentCard.areaId}
        />
      ) : null}

      {/* Botones de calidad (solo cuando esta flipped) - grid 6 colores */}
      {flipped ? (
        <div
          className="grid grid-cols-2 gap-2 md:grid-cols-6"
          data-testid="quality-buttons"
        >
          {QUALITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={pending}
              onClick={() => handleQuality(opt.value)}
              className={cn(
                'group relative flex flex-col items-start gap-0.5 overflow-hidden rounded-lg px-3 py-3 text-left font-semibold transition-all duration-normal',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'hover:-translate-y-0.5 active:translate-y-0',
                opt.bgClass,
              )}
              data-testid={`quality-btn-${opt.value}`}
            >
              <span className="text-[10px] font-mono opacity-80">{opt.value}</span>
              <span className="text-sm font-bold">{opt.label}</span>
              <span className="text-[10px] font-normal opacity-75">{opt.description}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground">
          Lee la pregunta, intenta responder mentalmente y toca la tarjeta para revelar la
          respuesta.
        </div>
      )}
    </div>
  )
}
