'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

type PageTransitionProps = {
  children: React.ReactNode
}

/**
 * Wrapper global de transiciones de pagina.
 * Detecta cambios de ruta via `usePathname()` y aplica un fade + slide sutil
 * cada vez que el contenido se reemplaza.
 *
 * Curva: out-expo (cubic-bezier 0.16, 1, 0.3, 1) para sensacion premium.
 * Duracion corta (0.25s) para no estorbar al usuario en navegacion frecuente.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
