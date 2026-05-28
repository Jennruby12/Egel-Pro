'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCcw, Home } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { MagicButton } from '@/components/ui/magic-button'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error boundary global de Next.js.
 * Captura cualquier excepcion sin manejar en rendering server o client.
 *
 * Reglas:
 * - Solo mostrar `error.message` en desarrollo (evitar leak de PII en prod).
 * - El boton "Reintentar" llama `reset()` que re-renderiza el segment.
 * - Logueamos el error a consola en dev para debugging local.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[error.tsx]', error)
    }
  }, [error])

  const isDev = process.env.NODE_ENV === 'development'

  return (
    <AuroraBackground variant="normal" className="min-h-screen">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
        {/* Emoji explosion con float */}
        <div
          aria-hidden="true"
          className="mb-6 select-none text-8xl drop-shadow-[0_0_32px_hsl(var(--danger)/0.5)] animate-float sm:text-9xl"
        >
          💥
        </div>

        <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Error inesperado
        </p>
        <h1 className="mt-3 max-w-2xl text-display-lg text-aurora">Algo exploto</h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
          No te preocupes, tu progreso esta a salvo. Intenta de nuevo o vuelve al inicio.
        </p>

        {/* Detalle solo en dev */}
        {isDev && error.message ? (
          <pre
            className="glass mt-6 max-w-xl overflow-auto rounded-lg border border-danger/30 px-4 py-3 text-left font-mono text-xs text-danger/90"
            data-testid="error-message"
          >
            {error.message}
            {error.digest ? `\n\n[digest] ${error.digest}` : ''}
          </pre>
        ) : null}

        {/* Acciones */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MagicButton variant="aurora" size="lg" onClick={() => reset()}>
            <RefreshCcw className="h-4 w-4" />
            Reintentar
          </MagicButton>
          <MagicButton asChild variant="outline" size="lg">
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Ir al inicio
            </Link>
          </MagicButton>
        </div>
      </div>
    </AuroraBackground>
  )
}
