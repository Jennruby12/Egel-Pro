import type { Metadata } from 'next'
import Link from 'next/link'
import { WifiOff } from 'lucide-react'

export const metadata: Metadata = { title: 'Sin conexion' }

// Estatica: es el fallback que el service worker sirve cuando navegas sin red.
// No debe depender de Supabase ni de auth (si no, falla justo cuando se necesita).
export const dynamic = 'force-static'

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground">
      <span className="flex h-20 w-20 items-center justify-center rounded-full border border-glass-border/40 bg-glass-bg/40 text-aurora-2 backdrop-blur-md">
        <WifiOff className="h-9 w-9" />
      </span>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Estas sin conexion</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          No hay internet en este momento. Las paginas que ya visitaste siguen
          disponibles; cuando vuelvas a estar en linea, tu progreso y tus
          respuestas se sincronizan solos.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-xl border border-glass-border/40 bg-glass-bg/40 px-5 py-2.5 text-sm font-semibold backdrop-blur-md transition-colors hover:border-aurora-2/50"
        >
          Ir al inicio
        </Link>
      </div>
      <p className="font-mono text-[10px] text-muted-foreground/60">EGELPro · modo offline</p>
    </main>
  )
}
