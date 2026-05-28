'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { SparklesText } from '@/components/ui/sparkles-text'
import { MagicButton } from '@/components/ui/magic-button'
import { fireConfetti } from '@/components/ui/confetti'
import { cn } from '@/lib/utils/cn'

type LevelUpModalProps = {
  open: boolean
  previousLevel: number
  newLevel: number
  newLevelName: string
  onClose: () => void
  className?: string
}

/**
 * Modal full-screen con celebracion de subida de nivel.
 * Dispara confetti 'levelUp' al abrirse y soporta cerrar con ESC.
 *
 * El "flip" del numero del nivel se hace via framer-motion: el key cambia
 * cuando newLevel cambia, lo que dispara la animacion de entrada/salida.
 */
export function LevelUpModal({
  open,
  previousLevel,
  newLevel,
  newLevelName,
  onClose,
  className,
}: LevelUpModalProps) {
  // Confetti + ESC handler. Solo activo cuando el modal esta abierto.
  useEffect(() => {
    if (!open) return
    fireConfetti('levelUp')

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="level-up-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className={cn(
            'fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md',
            className,
          )}
          data-testid="level-up-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="level-up-title"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AuroraBackground variant="intense" className="rounded-3xl">
              <div className="glass-strong relative rounded-3xl border border-aurora-2/40 p-8 text-center shadow-[0_0_64px_-8px_hsl(var(--aurora-2)/0.7)] sm:p-12">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-bg-raised/60 hover:text-foreground"
                  aria-label="Cerrar"
                  data-testid="level-up-close"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Etiqueta superior */}
                <motion.p
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-xs font-bold uppercase tracking-[0.3em] text-aurora"
                >
                  <SparklesText count={8}>Subiste de nivel!</SparklesText>
                </motion.p>

                {/* Numeros: previo → nuevo con flip */}
                <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ delay: 0.25 }}
                    className="flex h-20 w-20 items-center justify-center rounded-2xl border border-bg-border bg-bg-raised/60 text-4xl font-bold text-muted-foreground sm:h-24 sm:w-24 sm:text-5xl"
                    aria-label={`Nivel anterior ${previousLevel}`}
                  >
                    {previousLevel}
                  </motion.div>

                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-bold text-aurora-2"
                    aria-hidden
                  >
                    →
                  </motion.div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={newLevel}
                      initial={{ rotateY: 90, scale: 0.6, opacity: 0 }}
                      animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{
                        delay: 0.5,
                        type: 'spring',
                        stiffness: 220,
                        damping: 18,
                      }}
                      className="flex h-24 w-24 items-center justify-center rounded-2xl text-5xl font-bold text-white shadow-glow-aurora sm:h-28 sm:w-28 sm:text-6xl"
                      style={{
                        backgroundImage:
                          'linear-gradient(135deg, hsl(var(--aurora-1)), hsl(var(--aurora-2)) 50%, hsl(var(--aurora-3)))',
                        transformStyle: 'preserve-3d',
                      }}
                      aria-label={`Nivel nuevo ${newLevel}`}
                    >
                      {newLevel}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Nombre del nivel con sparkles */}
                <motion.h2
                  id="level-up-title"
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8 text-display-md font-bold"
                >
                  <SparklesText count={12} className="text-aurora">
                    {newLevelName}
                  </SparklesText>
                </motion.h2>

                <motion.p
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.85 }}
                  className="mt-3 text-sm text-muted-foreground"
                >
                  Sigue asi. Cada quiz te acerca a la siguiente meta.
                </motion.p>

                <motion.div
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-8 flex justify-center"
                >
                  <MagicButton variant="aurora" size="xl" onClick={onClose} data-testid="level-up-continue">
                    Continuar
                  </MagicButton>
                </motion.div>
              </div>
            </AuroraBackground>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
