'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { SparklesText } from '@/components/ui/sparkles-text'
import { MagicButton } from '@/components/ui/magic-button'
import { fireConfetti } from '@/components/ui/confetti'
import {
  ACHIEVEMENTS_CATALOG,
  type AchievementType,
} from '@/lib/constants/gamification'
import { cn } from '@/lib/utils/cn'

// Re-export para mantener back-compat: showAchievementUnlocked vive ahora
// en AchievementUnlockToast.tsx (Fase D.2). Cualquier import existente sigue
// funcionando sin cambios.
export { showAchievementUnlocked } from './AchievementUnlockToast'

type Achievement = (typeof ACHIEVEMENTS_CATALOG)[number]

function findAchievement(type: AchievementType): Achievement | undefined {
  return ACHIEVEMENTS_CATALOG.find((a) => a.type === type)
}

type AchievementPopupProps = {
  type: AchievementType
  onClose?: () => void
  className?: string
}

/**
 * Overlay full-screen que muestra el logro desbloqueado.
 * Pensado para pantallas de resultados (no como toast).
 */
export function AchievementPopup({
  type,
  onClose,
  className,
}: AchievementPopupProps) {
  const meta = findAchievement(type)

  useEffect(() => {
    if (!meta) return
    fireConfetti('achievement')
  }, [meta])

  if (!meta) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md',
          className,
        )}
        onClick={onClose}
        data-testid="achievement-popup"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <AuroraBackground variant="intense" className="rounded-2xl">
            <div className="glass-strong relative rounded-2xl border border-xp/40 p-8 text-center shadow-[0_0_48px_-4px_hsl(var(--xp)/0.6)]">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-bg-raised/60 hover:text-foreground"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-xs font-bold uppercase tracking-widest text-xp"
              >
                <SparklesText count={6}>Logro desbloqueado!</SparklesText>
              </motion.p>

              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.2,
                  type: 'spring',
                  stiffness: 240,
                  damping: 14,
                }}
                className="mx-auto mt-6 flex h-28 w-28 items-center justify-center rounded-full bg-xp/15 text-7xl shadow-[0_0_40px_-4px_hsl(var(--xp)/0.7)]"
                aria-hidden="true"
              >
                {meta.icon}
              </motion.div>

              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-6 text-display-sm font-bold text-aurora"
              >
                {meta.title}
              </motion.h2>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-2 text-sm text-muted-foreground"
              >
                {meta.description}
              </motion.p>

              {onClose && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="mt-6 flex justify-center"
                >
                  <MagicButton variant="aurora" onClick={onClose}>
                    Continuar
                  </MagicButton>
                </motion.div>
              )}
            </div>
          </AuroraBackground>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
