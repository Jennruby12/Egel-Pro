'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Copy, Download, AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { toast } from 'sonner'

type Props = {
  /** Fuente Mermaid (classDiagram, sequenceDiagram, flowchart, etc.). */
  chart: string
  className?: string
  /** Mostrar la barra de acciones (zoom, copiar, descargar). Default true. */
  toolbar?: boolean
}

let initialized = false

/**
 * Renderiza un diagrama Mermaid a SVG en el cliente (lazy-load de la libreria
 * para no engordar el bundle inicial). Responsivo: el SVG ocupa el ancho del
 * contenedor; con zoom (>1) aparece scroll para hacer pan en movil.
 */
export function MermaidDiagram({ chart, className, toolbar = true }: Props) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    async function render() {
      try {
        const mermaid = (await import('mermaid')).default
        if (!initialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'strict',
            fontFamily: 'inherit',
          })
          initialized = true
        }
        const { svg } = await mermaid.render(`m-${rawId}`, chart.trim())
        if (!cancelled) {
          setSvg(svg)
          setError(false)
        }
      } catch {
        if (!cancelled) setError(true)
      }
    }
    void render()
    return () => {
      cancelled = true
    }
  }, [chart, rawId])

  function downloadSvg() {
    if (!svg) return
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diagrama.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function copySource() {
    try {
      await navigator.clipboard.writeText(chart.trim())
      toast.success('Fuente del diagrama copiada')
    } catch {
      toast.error('No se pudo copiar')
    }
  }

  if (error) {
    return (
      <div className="rounded-xl border border-warning/40 bg-warning/5 p-4 text-sm">
        <p className="mb-2 flex items-center gap-2 font-semibold text-warning">
          <AlertTriangle className="h-4 w-4" /> No se pudo renderizar el diagrama
        </p>
        <pre className="overflow-x-auto rounded-lg bg-bg-raised/60 p-3 text-xs text-muted-foreground">
          {chart.trim()}
        </pre>
      </div>
    )
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border border-glass-border/40 bg-bg-raised/30', className)}>
      {toolbar ? (
        <div className="flex items-center justify-end gap-1 border-b border-glass-border/30 px-2 py-1.5">
          <IconBtn label="Alejar" onClick={() => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)))}>
            <ZoomOut className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Acercar" onClick={() => setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)))}>
            <ZoomIn className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Restablecer zoom" onClick={() => setScale(1)}>
            <Maximize2 className="h-4 w-4" />
          </IconBtn>
          <span className="mx-1 h-4 w-px bg-glass-border/40" />
          <IconBtn label="Copiar fuente" onClick={copySource}>
            <Copy className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Descargar SVG" onClick={downloadSvg}>
            <Download className="h-4 w-4" />
          </IconBtn>
        </div>
      ) : null}

      <div ref={containerRef} className="max-h-[60vh] overflow-auto p-3">
        {svg ? (
          <div
            // width segun zoom: a >100% el contenedor hace scroll => pan en movil
            style={{ width: `${scale * 100}%`, minWidth: '100%' }}
            className="[&_svg]:h-auto [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-aurora-2" /> Renderizando diagrama…
          </div>
        )}
      </div>
    </div>
  )
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-bg-raised/60 hover:text-foreground"
    >
      {children}
    </button>
  )
}
