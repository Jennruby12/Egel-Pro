import { Skeleton } from '@/components/ui/skeleton'

/**
 * Loading skeleton para todas las rutas del dashboard.
 * Se muestra mientras Next.js carga un Server Component child del
 * (dashboard)/layout.tsx. El layout ya esta montado, asi que solo cubrimos
 * el area del main content.
 *
 * Estructura imita las pantallas comunes:
 * - Header del pagina (titulo + descripcion)
 * - Bloque de stats / hero
 * - Grid de cards
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-6" data-testid="dashboard-loading">
      {/* PageHeader skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Hero / stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-72 w-full rounded-xl lg:col-span-2" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>

      {/* Secondary row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  )
}
