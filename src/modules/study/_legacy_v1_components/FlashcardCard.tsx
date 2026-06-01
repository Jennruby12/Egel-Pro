'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

type FlashcardCardProps = {
  front: string
  back: string
  flipped: boolean
  onFlip: () => void
  /** id del area para tematizar el borde (1..4 disciplinar, otros = cyan-ice). */
  areaId?: number
}

const AREA_BORDER: Record<number, string> = {
  1: 'border-area1/50 shadow-[0_0_32px_-8px_hsl(var(--area-1)/0.45)]',
  2: 'border-area2/50 shadow-[0_0_32px_-8px_hsl(var(--area-2)/0.45)]',
  3: 'border-area3/50 shadow-[0_0_32px_-8px_hsl(var(--area-3)/0.45)]',
  4: 'border-area4/50 shadow-[0_0_32px_-8px_hsl(var(--area-4)/0.45)]',
}

const AREA_ACCENT: Record<number, string> = {
  1: 'text-area1',
  2: 'text-area2',
  3: 'text-area3',
  4: 'text-area4',
}

/**
 * Tarjeta con flip 3D suave (spring) y temizada por color del area.
 * Click o tecla Enter/Space para voltear.
 */
export function FlashcardCard({ front, back, flipped, onFlip, areaId }: FlashcardCardProps) {
  const borderClass =
    (areaId && AREA_BORDER[areaId]) ??
    'border-cyan-ice/50 shadow-[0_0_32px_-8px_hsl(var(--cyan-ice)/0.45)]'
  const accentClass = (areaId && AREA_ACCENT[areaId]) ?? 'text-cyan-ice'

  return (
    <div
      className="relative h-80 w-full cursor-pointer select-none md:h-96"
      style={{ perspective: '1400px' }}
      onClick={onFlip}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onFlip()
        }
      }}
      data-testid="flashcard-card"
    >
      <motion.div
        className="relative h-full w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 0.9 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Cara frontal: pregunta */}
        <Face className={cn('glass-strong border', borderClass)}>
          <span
            className={cn(
              'rounded-full bg-bg-raised/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest',
              accentClass,
            )}
          >
            Pregunta
          </span>
          <p className="mt-6 max-w-xl text-center text-xl font-medium leading-snug md:text-2xl">
            {front}
          </p>
          <span className="mt-8 text-xs text-muted-foreground">Toca para revelar la respuesta</span>
        </Face>

        {/* Cara trasera: respuesta */}
        <Face
          className={cn('glass-strong border', borderClass)}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <span
            className={cn(
              'rounded-full bg-bg-raised/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest',
              accentClass,
            )}
          >
            Respuesta
          </span>
          <p className="mt-6 max-w-xl text-center text-lg leading-relaxed md:text-xl">{back}</p>
          <span className="mt-8 text-xs text-muted-foreground">
            Califica tu desempeno con los botones de abajo
          </span>
        </Face>
      </motion.div>
    </div>
  )
}

function Face({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-6 md:p-8',
        className,
      )}
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
