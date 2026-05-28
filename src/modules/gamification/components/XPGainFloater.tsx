'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

type Origin = { x: number; y: number }

type XPGainFloaterProps = {
  amount: number
  origin: Origin
  onComplete: () => void
  className?: string
}

/**
 * Pieza individual: "+X XP" que flota desde origin subiendo y desvanenciendose.
 * Ciclo: 1.5s. Llama onComplete al terminar para que la queue lo limpie.
 *
 * Color text-xp con drop-shadow glow para destacar sobre cualquier fondo.
 */
export function XPGainFloater({
  amount,
  origin,
  onComplete,
  className,
}: XPGainFloaterProps) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 1, scale: 1 }}
      animate={{ y: -60, opacity: 0, scale: 1.4 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        left: origin.x,
        top: origin.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 70,
      }}
      className={cn(
        'select-none whitespace-nowrap font-bold tabular-nums text-xp',
        'text-lg sm:text-xl',
        'drop-shadow-[0_0_12px_hsl(var(--xp)/0.8)]',
        className,
      )}
      data-testid="xp-gain-floater"
      aria-hidden
    >
      +{amount} XP
    </motion.div>
  )
}

// =====================================================
// Portal global: maneja una queue de floaters concurrentes
// =====================================================

type FloaterItem = {
  id: string
  amount: number
  origin: Origin
}

// Singleton para que cualquier parte de la app pueda triggear floaters
// sin necesidad de pasar props / context. Se inicializa al montar
// <XPGainPortal /> en el dashboard layout.
let triggerRef: ((amount: number, origin: Origin) => void) | null = null

/**
 * Invoca un XP floater desde cualquier parte de la app. Requiere que
 * <XPGainPortal /> este montado en el arbol (lo esta el dashboard layout).
 *
 * @example
 *   triggerXPGain(15, { x: e.clientX, y: e.clientY })
 */
export function triggerXPGain(amount: number, origin: Origin): void {
  if (triggerRef) {
    triggerRef(amount, origin)
  } else if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '[XPGainPortal] No esta montado. Renderiza <XPGainPortal /> en el layout primero.',
    )
  }
}

/**
 * Portal global montado en el layout. Mantiene la queue activa y renderiza
 * cada floater en un createPortal a document.body para evitar problemas de
 * z-index / overflow del contenedor padre.
 *
 * IMPORTANTE: solo debe haber UNA instancia montada a la vez.
 */
export function XPGainPortal() {
  const [items, setItems] = useState<FloaterItem[]>([])
  const baseId = useId()

  const remove = useCallback((id: string) => {
    setItems((curr) => curr.filter((i) => i.id !== id))
  }, [])

  const add = useCallback(
    (amount: number, origin: Origin) => {
      const id = `${baseId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setItems((curr) => [...curr, { id, amount, origin }])
    },
    [baseId],
  )

  // Conectar al singleton al montar / desconectar al desmontar
  useEffect(() => {
    triggerRef = add
    return () => {
      triggerRef = null
    }
  }, [add])

  // SSR-safe: solo creamos el portal en cliente
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {items.map((item) => (
        <XPGainFloater
          key={item.id}
          amount={item.amount}
          origin={item.origin}
          onComplete={() => remove(item.id)}
        />
      ))}
    </AnimatePresence>,
    document.body,
  )
}
