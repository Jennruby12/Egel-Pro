'use client'

import { MermaidDiagram } from '@/components/ui/MermaidDiagram'
import { cn } from '@/lib/utils/cn'

type OptionMediaProps = {
  image?: string | null
  diagram?: string | null
  className?: string
}

/**
 * Renderiza la media de una opcion de respuesta (preguntas tipo "elige la
 * imagen/diagrama"): un diagrama Mermaid y/o una imagen por URL. Reutilizado
 * en el quiz, la revision de respuestas y el preview del admin.
 */
export function OptionMedia({ image, diagram, className }: OptionMediaProps) {
  if (!image && !diagram) return null
  return (
    <div className={cn('mt-2 space-y-2', className)}>
      {diagram ? <MermaidDiagram chart={diagram} /> : null}
      {image ? (
        <div className="overflow-hidden rounded-lg border border-bg-border/40 bg-bg-raised/30">
          {/* Imagen de la opcion. img normal para no depender de remotePatterns. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="max-h-[220px] w-full object-contain"
            loading="lazy"
          />
        </div>
      ) : null}
    </div>
  )
}
