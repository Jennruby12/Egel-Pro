'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { MagicButton } from '@/components/ui/magic-button'

/**
 * Descarga el banco completo de preguntas como XLSX (3 hojas: Preguntas,
 * Por subarea, Estimulos). Disparado desde /profile.
 */
export function ExportQuestionsButton() {
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    if (downloading) return
    setDownloading(true)
    try {
      const res = await fetch('/api/export-questions', { method: 'GET' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Error desconocido' }))
        toast.error(body.error ?? 'No se pudo descargar el archivo')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const today = new Date().toISOString().slice(0, 10)
      const a = document.createElement('a')
      a.href = url
      a.download = `egelpro-banco-preguntas-${today}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Banco descargado')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al descargar')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium">Banco completo en Excel</p>
        <p className="text-xs text-muted-foreground">
          Descarga las 916+ preguntas con opciones, respuestas, explicaciones y metadatos. Tres hojas: Preguntas, Por subarea, Estimulos.
        </p>
      </div>
      <MagicButton
        variant="outline"
        size="md"
        onClick={handleDownload}
        disabled={downloading}
      >
        {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {downloading ? 'Generando...' : 'Descargar XLSX'}
      </MagicButton>
    </div>
  )
}
