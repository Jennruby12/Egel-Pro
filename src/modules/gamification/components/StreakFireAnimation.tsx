'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

type Intensity = 'dim' | 'medium' | 'intense'
type Size = 'sm' | 'md' | 'lg'

type StreakFireAnimationProps = {
  intensity: Intensity
  size?: Size
  className?: string
}

const SIZE_TO_TEXT: Record<Size, string> = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
}

const SIZE_TO_BOX: Record<Size, string> = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-20 w-20',
}

// Configuracion de la animacion segun intensidad. Mientras mas intensa la
// racha, mas rapida y agresiva es la oscilacion + un glow mas saturado.
const INTENSITY_CONFIG: Record<
  Intensity,
  {
    scale: number[]
    rotate: number[]
    duration: number
    glow: string
    opacity: number
  }
> = {
  dim: {
    scale: [1, 1.05, 1],
    rotate: [-2, 2, -2],
    duration: 2.8,
    glow: 'drop-shadow-[0_0_8px_hsl(var(--streak)/0.5)]',
    opacity: 0.85,
  },
  medium: {
    scale: [1, 1.12, 1],
    rotate: [-4, 4, -4],
    duration: 2,
    glow: 'drop-shadow-[0_0_14px_hsl(var(--streak)/0.75)]',
    opacity: 1,
  },
  intense: {
    scale: [1, 1.2, 0.95, 1.15, 1],
    rotate: [-6, 6, -3, 6, -6],
    duration: 1.4,
    glow: 'drop-shadow-[0_0_22px_hsl(var(--streak)/0.95)]',
    opacity: 1,
  },
}

/**
 * Llama animada para la racha. PLACEHOLDER por ahora — usa un emoji con
 * framer-motion (scale + rotate loop). Cuando este disponible el asset Lottie
 * real, reemplazar el contenido por <LottiePlayer src={...} /> manteniendo la
 * misma API publica (props intensity + size).
 *
 * Reglas de intensidad sugeridas (calcular fuera):
 *   1-6   dias -> dim
 *   7-29  dias -> medium
 *   30+   dias -> intense
 *
 * Hover: scale 1.2 (encima del loop base — usar whileHover compone con animate).
 */
export function StreakFireAnimation({
  intensity,
  size = 'md',
  className,
}: StreakFireAnimationProps) {
  const cfg = INTENSITY_CONFIG[intensity]

  return (
    <motion.span
      className={cn(
        'inline-flex items-center justify-center leading-none',
        SIZE_TO_BOX[size],
        SIZE_TO_TEXT[size],
        cfg.glow,
        className,
      )}
      style={{ opacity: cfg.opacity }}
      animate={{ scale: cfg.scale, rotate: cfg.rotate }}
      transition={{
        duration: cfg.duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{ scale: 1.2 }}
      data-testid="streak-fire"
      data-intensity={intensity}
      aria-hidden
      role="img"
    >
      {/* TODO: reemplazar por <LottiePlayer src="/lottie/streak-fire.json" />
          cuando el asset Lottie real este disponible. La API publica se
          mantiene (intensity + size) para no romper consumers. */}
      <span>🔥</span>
    </motion.span>
  )
}

/**
 * Helper para mapear streak (dias) -> intensity. Centraliza el threshold
 * para que todos los consumers usen los mismos cortes.
 */
export function streakToIntensity(streakDays: number): Intensity {
  if (streakDays >= 30) return 'intense'
  if (streakDays >= 7) return 'medium'
  return 'dim'
}
