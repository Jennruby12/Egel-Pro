'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'
import { MagicButton } from '@/components/ui/magic-button'

const DISMISS_KEY = 'egelpro-pwa-banner-dismissed'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Banner discreto que aparece en mobile cuando el navegador soporta PWA install.
 * Se oculta tras dismiss (sessionStorage) o si el user ya instalo la app.
 */
export function InstallPWABanner() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(DISMISS_KEY) === '1') return

    // Detectar si ya esta corriendo como PWA standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true
    if (isStandalone) return

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      setEvent(e as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  }, [])

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
  }

  async function install() {
    if (!event) return
    await event.prompt()
    const result = await event.userChoice
    if (result.outcome === 'accepted') {
      setVisible(false)
    }
    setEvent(null)
  }

  return (
    <AnimatePresence>
      {visible && event ? (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-2 bottom-20 z-40 md:hidden"
        >
          <div className="glass-strong flex items-center gap-3 rounded-2xl p-3 pr-2 shadow-elev-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-400/15 text-brand-400">
              <Download className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Instala EGELPro</p>
              <p className="text-xs text-muted-foreground">
                Accede mas rapido y estudia offline
              </p>
            </div>
            <MagicButton variant="aurora" size="sm" onClick={install}>
              Instalar
            </MagicButton>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Cerrar"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-bg-raised hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
