import Link from 'next/link'
import { Home, Bug } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { MagicButton } from '@/components/ui/magic-button'
import { SparklesText } from '@/components/ui/sparkles-text'

export const metadata = { title: 'Pagina no encontrada' }

/**
 * 404 global — se muestra para cualquier ruta inexistente fuera de un
 * not-found.tsx propio por route group.
 *
 * Decision UX: tono espacial alineado con el branding "Nebulosa Profunda".
 * Astronauta flotante (emoji con animate-float) para no depender de SVG
 * pesado y mantener el bundle ligero.
 */
export default function NotFound() {
  return (
    <AuroraBackground variant="normal" className="min-h-screen">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
        {/* Astronauta perdido (emoji con animacion float) */}
        <div
          aria-hidden="true"
          className="mb-6 select-none text-8xl drop-shadow-[0_0_32px_hsl(var(--aurora-2)/0.5)] animate-float sm:text-9xl"
        >
          🚀
        </div>

        {/* Codigo grande con gradient aurora */}
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Error 404
        </p>
        <h1 className="mt-3 max-w-2xl text-display-lg text-aurora">
          <SparklesText count={6}>Esta pagina no existe en este universo</SparklesText>
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
          Quizas viajaste demasiado lejos. Revisa la URL o vuelve al centro de mando para seguir
          preparandote para el EGEL.
        </p>

        {/* Botones CTA */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MagicButton asChild variant="aurora" size="lg">
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Volver al inicio
            </Link>
          </MagicButton>
          <MagicButton asChild variant="outline" size="lg">
            <Link
              href="mailto:soporte@egelpro.app?subject=Reporte%20de%20bug%20-%20Pagina%20no%20encontrada"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Bug className="h-4 w-4" />
              Reportar bug
            </Link>
          </MagicButton>
        </div>
      </div>
    </AuroraBackground>
  )
}
