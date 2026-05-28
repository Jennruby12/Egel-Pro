'use client'

import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

/**
 * Banner fijo que aparece cuando el navegador pierde conexion.
 * Se posiciona por encima del MobileNav (que usa bottom-0 z-50)
 * para no taparlo en pantallas pequenas.
 */
export function OfflineIndicator() {
  // Inicia en true para evitar parpadeo del banner durante la hidratacion;
  // el efecto sincroniza el estado real apenas monta el componente.
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="offline-indicator"
      className="fixed inset-x-0 bottom-16 z-50 mx-auto flex w-fit max-w-[calc(100%-1rem)] items-center gap-2 rounded-full border border-warning/30 bg-warning/20 px-4 py-2 text-sm font-medium text-warning shadow-lg backdrop-blur md:bottom-4"
    >
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>Sin conexion. Tus quizzes se sincronizan al volver online.</span>
    </div>
  )
}
