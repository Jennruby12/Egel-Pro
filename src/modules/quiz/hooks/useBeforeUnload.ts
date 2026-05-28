'use client'

import { useEffect } from 'react'

/**
 * Activa la advertencia nativa del navegador al intentar cerrar o recargar la
 * pestana mientras esta condicion sea true.
 *
 * El texto del mensaje lo decide el navegador (no se puede personalizar por
 * razones de seguridad). Solo controlamos si se muestra o no.
 *
 * Util en el simulacro: el progreso se guarda automaticamente, pero queremos
 * que el usuario confirme antes de cerrar y perder el contexto activo.
 */
export function useBeforeUnload(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    function handler(event: BeforeUnloadEvent) {
      // Algunas versiones de Chrome requieren returnValue para mostrar el dialogo.
      event.preventDefault()
      event.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [enabled])
}
