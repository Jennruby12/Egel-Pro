'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

/**
 * Mascota oficial de EGELPro: Nebu, el buho cosmico.
 * SVG inline con animaciones framer-motion para evitar dependencia de Lottie assets.
 *
 * Estados:
 * - idle: respiracion sutil + parpadeo cada 4s
 * - celebrating: bounce + alas arriba + estrellas
 * - thinking: bola flotando + cabeza levemente inclinada
 * - sad: hombros caidos + ojos cerrados
 * - sleeping: zZz flotando + ojos cerrados
 */

export type MascotState = 'idle' | 'celebrating' | 'thinking' | 'sad' | 'sleeping'

type Props = {
  state?: MascotState
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const SIZE = {
  sm: 64,
  md: 96,
  lg: 144,
  xl: 200,
} as const

export function Mascot({ state = 'idle', size = 'md', className }: Props) {
  const px = SIZE[size]

  return (
    <div className={cn('relative inline-block', className)} style={{ width: px, height: px }}>
      <motion.svg
        viewBox="0 0 200 200"
        width={px}
        height={px}
        animate={getBodyAnimation(state)}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          {/* Body gradient: aurora */}
          <linearGradient id="nebu-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--aurora-1))" />
            <stop offset="50%" stopColor="hsl(var(--aurora-2))" />
            <stop offset="100%" stopColor="hsl(var(--aurora-3))" />
          </linearGradient>
          <radialGradient id="nebu-belly" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--cyan-ice) / 0.3)" />
            <stop offset="100%" stopColor="hsl(var(--cyan-ice) / 0)" />
          </radialGradient>
          {/* Aurora glow filter */}
          <filter id="nebu-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Estrellas decorativas (mas si celebrating) */}
        <Stars state={state} />

        {/* Cuerpo (forma de buho redondeado) */}
        <g filter="url(#nebu-glow)">
          <path
            d="M100 30 C 60 30, 35 60, 35 100 C 35 150, 60 180, 100 180 C 140 180, 165 150, 165 100 C 165 60, 140 30, 100 30 Z"
            fill="url(#nebu-body)"
            opacity="0.95"
          />
          {/* Belly highlight */}
          <ellipse cx="100" cy="120" rx="40" ry="50" fill="url(#nebu-belly)" />
        </g>

        {/* Cuernos/orejas */}
        <path d="M55 50 L 70 25 L 75 50 Z" fill="hsl(var(--aurora-2))" opacity="0.9" />
        <path d="M145 50 L 130 25 L 125 50 Z" fill="hsl(var(--aurora-2))" opacity="0.9" />

        {/* Alas (solo en celebrating) */}
        {state === 'celebrating' && (
          <>
            <motion.path
              d="M30 100 Q 10 70, 25 50"
              stroke="hsl(var(--aurora-1))"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.path
              d="M170 100 Q 190 70, 175 50"
              stroke="hsl(var(--aurora-3))"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </>
        )}

        {/* Ojos */}
        <Eyes state={state} />

        {/* Pico */}
        <path d="M95 110 L 100 122 L 105 110 Z" fill="hsl(var(--xp))" />

        {/* Patas */}
        <line x1="85" y1="180" x2="85" y2="190" stroke="hsl(var(--xp))" strokeWidth="3" strokeLinecap="round" />
        <line x1="115" y1="180" x2="115" y2="190" stroke="hsl(var(--xp))" strokeWidth="3" strokeLinecap="round" />
      </motion.svg>

      {/* ZZZ flotante (sleeping) */}
      {state === 'sleeping' && (
        <motion.div
          className="absolute -top-2 right-2 select-none text-2xl font-bold text-cyan-ice"
          animate={{ y: [-2, -8, -2], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          z
          <span className="text-base">z</span>
          <span className="text-xs">z</span>
        </motion.div>
      )}

      {/* Globo de pensamiento (thinking) */}
      {state === 'thinking' && (
        <motion.div
          className="absolute -right-1 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-glass-bg/80 backdrop-blur-md text-xs"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          💭
        </motion.div>
      )}
    </div>
  )
}

// ============== Sub-components ==============

function getBodyAnimation(state: MascotState) {
  switch (state) {
    case 'celebrating':
      return { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }
    case 'idle':
      return { scale: [1, 1.02, 1] }
    case 'thinking':
      return { rotate: [-2, 2, -2] }
    case 'sad':
      return { y: [0, 2, 0] }
    case 'sleeping':
      return { scale: [1, 1.015, 1] }
    default:
      return {}
  }
}

function Stars({ state }: { state: MascotState }) {
  const count = state === 'celebrating' ? 6 : 3
  const positions = [
    { x: 25, y: 35, size: 4, delay: 0 },
    { x: 175, y: 40, size: 3, delay: 0.5 },
    { x: 180, y: 130, size: 5, delay: 1 },
    { x: 20, y: 140, size: 3, delay: 1.5 },
    { x: 100, y: 15, size: 4, delay: 2 },
    { x: 40, y: 90, size: 3, delay: 2.5 },
  ]

  return (
    <>
      {positions.slice(0, count).map((s, i) => (
        <motion.path
          key={i}
          d={`M${s.x} ${s.y - s.size} L${s.x + s.size * 0.4} ${s.y - s.size * 0.4} L${s.x + s.size} ${s.y} L${s.x + s.size * 0.4} ${s.y + s.size * 0.4} L${s.x} ${s.y + s.size} L${s.x - s.size * 0.4} ${s.y + s.size * 0.4} L${s.x - s.size} ${s.y} L${s.x - s.size * 0.4} ${s.y - s.size * 0.4} Z`}
          fill="hsl(var(--xp))"
          animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: `${s.x}px ${s.y}px` }}
        />
      ))}
    </>
  )
}

function Eyes({ state }: { state: MascotState }) {
  if (state === 'sleeping' || state === 'sad') {
    // Ojos cerrados: arco hacia abajo
    return (
      <>
        <path d="M75 95 Q 82 100, 90 95" stroke="hsl(var(--background))" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M110 95 Q 117 100, 125 95" stroke="hsl(var(--background))" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    )
  }

  if (state === 'celebrating') {
    // Ojos contentos: arco hacia arriba (^_^)
    return (
      <>
        <path d="M75 100 Q 82 92, 90 100" stroke="hsl(var(--background))" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M110 100 Q 117 92, 125 100" stroke="hsl(var(--background))" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    )
  }

  // idle / thinking: circulos con parpadeo
  return (
    <>
      <motion.circle
        cx="82" cy="95" r="6"
        fill="hsl(var(--background))"
        animate={{ scaleY: [1, 1, 1, 0.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', times: [0, 0.4, 0.85, 0.9, 1] }}
        style={{ transformOrigin: '82px 95px' }}
      />
      <motion.circle
        cx="118" cy="95" r="6"
        fill="hsl(var(--background))"
        animate={{ scaleY: [1, 1, 1, 0.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', times: [0, 0.4, 0.85, 0.9, 1] }}
        style={{ transformOrigin: '118px 95px' }}
      />
      {/* Brillo en los ojos */}
      <circle cx="84" cy="93" r="1.5" fill="hsl(var(--foreground))" />
      <circle cx="120" cy="93" r="1.5" fill="hsl(var(--foreground))" />
    </>
  )
}
