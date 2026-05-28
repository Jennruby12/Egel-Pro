import { Skeleton } from '@/components/ui/skeleton'

/**
 * Loading skeleton para todas las rutas de auth (login, register, forgot).
 * Imita el layout del card de auth con shimmer aurora.
 */
export default function AuthLoading() {
  return (
    <div
      className="glass w-full max-w-md space-y-5 rounded-2xl p-8"
      data-testid="auth-loading"
    >
      {/* Titulo + subtitulo */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </div>

      {/* Submit */}
      <Skeleton className="h-11 w-full rounded-lg" />

      {/* Divider + alternate link */}
      <div className="space-y-3 pt-2">
        <Skeleton className="mx-auto h-3 w-24" />
        <Skeleton className="mx-auto h-4 w-40" />
      </div>
    </div>
  )
}
