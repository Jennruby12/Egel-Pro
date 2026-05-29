'use client'

import { useEffect, useState } from 'react'
import { WifiOff, RefreshCw } from 'lucide-react'
import { queueSize } from '@/modules/quiz/lib/offline-queue'

/**
 * Banner fijo que aparece cuando el navegador pierde conexion o cuando
 * hay respuestas offline pendientes de sincronizar.
 */
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [pending, setPending] = useState(0)

  useEffect(() => {
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true)
    setPending(queueSize())

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Re-leemos la cola cuando cambian eventos relevantes (storage cross-tab, foco)
    const handleStorage = () => setPending(queueSize())
    const interval = setInterval(() => setPending(queueSize()), 4000)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('storage', handleStorage)
    window.addEventListener('focus', handleStorage)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('focus', handleStorage)
      clearInterval(interval)
    }
  }, [])

  // Mostrar el banner si esta offline o si hay respuestas pendientes por sincronizar
  if (isOnline && pending === 0) return null

  if (!isOnline) {
    return (
      <div
        role="status"
        aria-live="polite"
        data-testid="offline-indicator"
        className="fixed inset-x-0 bottom-16 z-50 mx-auto flex w-fit max-w-[calc(100%-1rem)] items-center gap-2 rounded-full border border-warning/30 bg-warning/20 px-4 py-2 text-sm font-medium text-warning shadow-lg backdrop-blur md:bottom-4"
      >
        <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          Sin conexion
          {pending > 0 ? ` · ${pending} respuesta${pending === 1 ? '' : 's'} en cola` : '. Puedes seguir respondiendo.'}
        </span>
      </div>
    )
  }

  // Online pero con cola pendiente — toast informativo sutil
  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="offline-indicator-syncing"
      className="fixed inset-x-0 bottom-16 z-50 mx-auto flex w-fit max-w-[calc(100%-1rem)] items-center gap-2 rounded-full border border-aurora-2/30 bg-aurora-2/15 px-4 py-2 text-sm font-medium text-aurora-2 shadow-lg backdrop-blur md:bottom-4"
    >
      <RefreshCw className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
      <span>Sincronizando {pending} respuesta{pending === 1 ? '' : 's'}...</span>
    </div>
  )
}
