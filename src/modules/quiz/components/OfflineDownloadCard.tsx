'use client'

import { useEffect, useState } from 'react'
import { Download, Check, RefreshCw, WifiOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { getOfflineQuestionBundle } from '@/modules/quiz/offline-content-actions'
import { saveOfflineBundle, getOfflineMeta } from '@/lib/offline/content-db'

type Meta = { version: string; downloadedAt: number; count: number } | null

function fmtDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  } catch {
    return '—'
  }
}

/**
 * Tarjeta para descargar el banco de preguntas y usarlo sin internet.
 * Guarda el bundle en IndexedDB. Muestra el estado (descargado / fecha / conteo)
 * y permite re-sincronizar para traer preguntas nuevas.
 */
export function OfflineDownloadCard() {
  const [meta, setMeta] = useState<Meta>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    getOfflineMeta()
      .then(setMeta)
      .finally(() => setLoading(false))
  }, [])

  async function handleDownload() {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      toast.error('Necesitas conexion para descargar el contenido')
      return
    }
    setDownloading(true)
    try {
      const res = await getOfflineQuestionBundle()
      if (!res.success) {
        toast.error(res.error)
        return
      }
      await saveOfflineBundle(res.data)
      setMeta({ version: res.data.version, downloadedAt: res.data.downloadedAt, count: res.data.questions.length })
      toast.success(`Descargado: ${res.data.questions.length.toLocaleString('es-MX')} preguntas para usar sin internet`)
    } catch {
      toast.error('No se pudo guardar el contenido offline')
    } finally {
      setDownloading(false)
    }
  }

  const downloaded = !!meta

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-2xl border p-4 backdrop-blur-md',
        downloaded ? 'border-success/30 bg-success/5' : 'border-glass-border/40 bg-glass-bg/40',
      )}
    >
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          downloaded ? 'bg-success/15 text-success' : 'bg-aurora-2/15 text-aurora-2',
        )}
      >
        {downloaded ? <Check className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {downloaded ? 'Contenido disponible sin internet' : 'Usar sin internet'}
        </p>
        <p className="text-xs text-muted-foreground">
          {loading
            ? 'Revisando...'
            : downloaded && meta
              ? `${meta.count.toLocaleString('es-MX')} preguntas · descargado ${fmtDate(meta.downloadedAt)}`
              : 'Descarga el banco para practicar aunque te quedes sin conexion'}
        </p>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        data-testid="offline-download-btn"
        className={cn(
          'inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60',
          downloaded
            ? 'border-glass-border/40 bg-glass-bg/40 text-muted-foreground hover:text-foreground'
            : 'border-aurora-2/50 bg-aurora-2/15 text-aurora-2 hover:bg-aurora-2/25',
        )}
      >
        {downloading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Descargando…
          </>
        ) : downloaded ? (
          <>
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Descargar
          </>
        )}
      </button>
    </div>
  )
}
