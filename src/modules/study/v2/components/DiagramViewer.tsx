'use client'

import { useState } from 'react'
import { ZoomIn, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type Props = {
  imageUrl: string
  caption?: string | null
  title?: string | null
}

/**
 * Renderiza un diagrama con caption y zoom modal. Soporta tanto URLs absolutas
 * como rutas relativas al bucket study-diagrams (Supabase Storage public).
 */
export function DiagramViewer({ imageUrl, caption, title }: Props) {
  const [zoomed, setZoomed] = useState(false)

  // Si la URL no es absoluta, asumir que es relativa al bucket study-diagrams.
  const resolvedUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/study-diagrams/${imageUrl.replace(/^study-diagrams\//, '')}`

  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-bg-border/40 bg-bg-raised/40">
      <button
        type="button"
        onClick={() => setZoomed(true)}
        className="group relative block w-full overflow-hidden"
        aria-label="Ampliar diagrama"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedUrl}
          alt={title ?? caption ?? 'Diagrama'}
          loading="lazy"
          className="w-full max-h-[500px] object-contain transition-transform group-hover:scale-[1.02]"
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-bg-base/70 px-2 py-1 text-xs text-foreground opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
          <ZoomIn className="h-3 w-3" />
          Ampliar
        </span>
      </button>
      {caption ? (
        <figcaption className="px-4 py-3 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}

      {zoomed ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setZoomed(false)}
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolvedUrl}
            alt={title ?? caption ?? 'Diagrama ampliado'}
            className={cn(
              'max-h-[90vh] max-w-[95vw] object-contain',
              'rounded-lg shadow-2xl',
            )}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </figure>
  )
}
