'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { Upload, Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PreviewTable } from './PreviewTable'
import { importRowSchema, type ImportRowResult, type ImportRowOutput } from '@/lib/validations/import-questions.schema'
import { importQuestions } from '@/modules/admin/actions/import-questions'

type Step = 'upload' | 'preview' | 'done'

const TEMPLATE_HEADERS = [
  'section',
  'area',
  'area_name',
  'subarea',
  'subarea_name',
  'type',
  'question_text',
  'option_a',
  'option_b',
  'option_c',
  'correct_answer',
  'explanation',
  'difficulty',
  'is_pilot',
]

const TEMPLATE_EXAMPLE = [
  {
    section: 'disciplinar',
    area: 1,
    area_name: 'Analisis de Sistemas de Software',
    subarea: 1,
    subarea_name: 'Tipos de requerimientos',
    type: 'single',
    question_text: 'Cual es la capital de Francia?',
    option_a: 'Madrid',
    option_b: 'Paris',
    option_c: 'Roma',
    correct_answer: 'b',
    explanation: 'Paris es la capital de Francia desde el siglo X.',
    difficulty: 'easy',
    is_pilot: false,
  },
]

export function ImportWizard() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('upload')
  const [results, setResults] = useState<ImportRowResult[]>([])
  const [pending, startTransition] = useTransition()

  function downloadTemplate() {
    const ws = XLSX.utils.json_to_sheet(TEMPLATE_EXAMPLE, { header: TEMPLATE_HEADERS })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'preguntas')
    XLSX.writeFile(wb, 'plantilla-preguntas-egelpro.xlsx')
  }

  async function handleFile(file: File) {
    try {
      const buffer = await file.arrayBuffer()
      const wb = XLSX.read(buffer, { type: 'array' })
      const firstSheet = wb.SheetNames[0]
      if (!firstSheet) {
        toast.error('El archivo no tiene hojas')
        return
      }
      const ws = wb.Sheets[firstSheet]!
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' })

      if (rows.length === 0) {
        toast.error('La hoja esta vacia')
        return
      }
      if (rows.length > 500) {
        toast.error(`Maximo 500 filas. Tu archivo tiene ${rows.length}.`)
        return
      }

      const parsed: ImportRowResult[] = rows.map((row, i) => {
        const r = importRowSchema.safeParse(row)
        if (r.success) {
          return { rowIndex: i, ok: true, data: r.data }
        }
        return {
          rowIndex: i,
          ok: false,
          errors: r.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
          raw: row,
        }
      })

      setResults(parsed)
      setStep('preview')
    } catch (err) {
      toast.error(`Error leyendo el archivo: ${err instanceof Error ? err.message : 'desconocido'}`)
    }
  }

  function handleConfirm() {
    const validRows: ImportRowOutput[] = results
      .filter((r): r is Extract<ImportRowResult, { ok: true }> => r.ok)
      .map((r) => r.data)

    if (validRows.length === 0) {
      toast.error('No hay filas validas para importar')
      return
    }

    startTransition(async () => {
      const result = await importQuestions(validRows)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(`${result.data.inserted} preguntas importadas`)
      setStep('done')
      router.refresh()
    })
  }

  function reset() {
    setStep('upload')
    setResults([])
  }

  if (step === 'upload') {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Descarga la plantilla</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              Usa la plantilla XLSX como base. Tiene una fila de ejemplo que puedes borrar.
            </p>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4" />
              Descargar plantilla
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Sube tu archivo</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-bg-border bg-bg-base p-10 transition-colors hover:border-brand-400">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">Click para seleccionar archivo</p>
                <p className="text-xs text-muted-foreground">XLSX hasta 500 filas</p>
              </div>
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void handleFile(f)
                }}
              />
            </label>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'preview') {
    const validCount = results.filter((r) => r.ok).length
    const invalidCount = results.length - validCount

    return (
      <div className="space-y-4">
        <Alert variant={invalidCount > 0 ? 'destructive' : 'default'}>
          <AlertDescription>
            <strong>{validCount}</strong> filas validas
            {invalidCount > 0 ? (
              <>
                {' · '}
                <strong className="text-danger">{invalidCount}</strong> con errores (no se importaran)
              </>
            ) : null}
          </AlertDescription>
        </Alert>

        <PreviewTable results={results} />

        <div className="flex justify-between">
          <Button variant="ghost" onClick={reset} disabled={pending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={pending || validCount === 0}>
            {pending && <Loader2 className="animate-spin" />}
            Importar {validCount} preguntas
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-8 text-center">
        <div className="text-5xl">🎉</div>
        <p className="text-lg font-semibold">Importacion completa</p>
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={reset}>
            Importar mas
          </Button>
          <Button onClick={() => router.push('/admin/questions')}>
            Ver preguntas
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
