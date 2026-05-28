'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'
import { SparklesText } from '@/components/ui/sparkles-text'
import {
  ACHIEVEMENTS_CATALOG,
  type AchievementType,
} from '@/lib/constants/gamification'

type Achievement = (typeof ACHIEVEMENTS_CATALOG)[number]

function findAchievement(type: AchievementType): Achievement | undefined {
  return ACHIEVEMENTS_CATALOG.find((a) => a.type === type)
}

const AURORA_COLORS = ['#5B7CFF', '#B66BFF', '#FF6B9D', '#FFD700', '#6BE5FF']

type ToastCardProps = {
  meta: Achievement
}

/**
 * Card del toast. Aparece bottom-right via sonner.
 * GlassCard con borde aurora + icon emoji grande + sparkles + descripcion.
 * Lanza un confetti pequeno desde la posicion del icon al montarse.
 */
function ToastCard({ meta }: ToastCardProps) {
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Confetti pequeno desde el icon (posicion calculada en pantalla)
    if (typeof window === 'undefined') return
    const node = iconRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight
    confetti({
      particleCount: 30,
      spread: 55,
      startVelocity: 22,
      origin: { x, y },
      colors: AURORA_COLORS,
      shapes: ['star', 'circle'],
      scalar: 0.8,
      disableForReducedMotion: true,
    })
  }, [])

  return (
    <motion.div
      initial={{ x: 40, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="glass-strong relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl border border-xp/50 p-4 shadow-[0_0_32px_-4px_hsl(var(--xp)/0.65)]"
      data-testid="achievement-toast"
      role="status"
      aria-live="polite"
    >
      {/* Borde aurora animado sutil */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-40"
        style={{
          background:
            'linear-gradient(135deg, hsl(var(--aurora-1) / 0.3), transparent 40%, hsl(var(--aurora-2) / 0.25) 70%, transparent)',
        }}
      />

      <div
        ref={iconRef}
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-xp/15 text-3xl ring-1 ring-xp/30 shadow-[0_0_20px_-4px_hsl(var(--xp)/0.7)]"
        aria-hidden="true"
      >
        <SparklesText count={5} className="text-xl">
          <span className="text-3xl">{meta.icon}</span>
        </SparklesText>
      </div>

      <div className="relative flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-xp">
          Logro desbloqueado!
        </p>
        <p className="mt-0.5 text-sm font-semibold text-foreground">{meta.title}</p>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
          {meta.description}
        </p>
      </div>
    </motion.div>
  )
}

/**
 * Dispara un toast (sonner) celebrando un logro recien desbloqueado.
 * Mejora respecto a la version anterior:
 * - Posicion bottom-right (default de sonner en la app)
 * - Confetti emanado desde la posicion del icon (no desde el centro)
 * - SparklesText alrededor del icon
 * - Auto-dismiss en 5s (antes 4.5s)
 */
export function showAchievementUnlocked(type: AchievementType): void {
  const meta = findAchievement(type)
  if (!meta) return
  toast.custom(() => <ToastCard meta={meta} />, { duration: 5000 })
}
