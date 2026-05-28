import { AuroraBackground } from '@/components/ui/aurora-background'

/**
 * Loading state global — se muestra mientras Next.js carga cualquier ruta
 * sin loading.tsx propio.
 *
 * Diseño: spinner aurora rotativo con gradient stroke + fondo aurora subtle.
 * El texto "Cargando..." usa animate-pulse para feedback continuo.
 */
export default function Loading() {
  return (
    <AuroraBackground variant="subtle" className="min-h-screen">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-4">
        {/* Spinner aurora gradient */}
        <div
          className="relative h-12 w-12"
          role="status"
          aria-label="Cargando"
          data-testid="global-loading"
        >
          {/* SVG con stroke gradient aurora rotando */}
          <svg
            className="h-12 w-12 animate-spin-slow"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="aurora-spinner" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--aurora-1))" />
                <stop offset="50%" stopColor="hsl(var(--aurora-2))" />
                <stop offset="100%" stopColor="hsl(var(--aurora-3))" />
              </linearGradient>
            </defs>
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="hsl(var(--bg-border) / 0.4)"
              strokeWidth="4"
            />
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="url(#aurora-spinner)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="90 60"
            />
          </svg>
        </div>
        <p className="animate-pulse text-sm text-muted-foreground">Cargando...</p>
      </div>
    </AuroraBackground>
  )
}
