'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { deleteQuestion, toggleQuestionActive, activatePilotQuestions } from '@/modules/admin/actions'
import type { Tables } from '@/types/database'

type Row = Pick<
  Tables<'questions'>,
  | 'id'
  | 'section'
  | 'area'
  | 'subarea'
  | 'question_text'
  | 'difficulty'
  | 'is_active'
  | 'is_pilot'
  | 'created_at'
>

type Props = { rows: Row[] }

const DIFFICULTY_VARIANT: Record<string, 'success' | 'warning' | 'destructive'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'destructive',
}

export function QuestionsTable({ rows }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [search, setSearch] = useState('')
  const [onlyPilot, setOnlyPilot] = useState(false)

  const pilotInactiveCount = rows.filter((r) => r.is_pilot && !r.is_active).length

  const filtered = rows.filter((r) => {
    if (onlyPilot && !(r.is_pilot && !r.is_active)) return false
    return r.question_text.toLowerCase().includes(search.toLowerCase())
  })

  function handleActivatePilots() {
    if (!confirm(`Activar ${pilotInactiveCount} preguntas piloto? Entraran al quiz y contaran para score.`)) return
    startTransition(async () => {
      const result = await activatePilotQuestions()
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(`${result.data?.id ?? 0} preguntas piloto activadas`)
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Eliminar esta pregunta? Se hace soft delete (recuperable desde la DB).')) return
    startTransition(async () => {
      const result = await deleteQuestion({ id })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Pregunta eliminada')
      router.refresh()
    })
  }

  function handleToggle(id: string, isActive: boolean) {
    startTransition(async () => {
      const result = await toggleQuestionActive(id, !isActive)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar en el texto de la pregunta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <p className="text-sm text-muted-foreground">
          {filtered.length} de {rows.length} preguntas
        </p>
        <button
          type="button"
          onClick={() => setOnlyPilot((v) => !v)}
          className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
            onlyPilot
              ? 'border-aurora-2/60 bg-aurora-2/15 text-aurora-2'
              : 'border-bg-border bg-bg-raised/40 text-muted-foreground hover:text-foreground'
          }`}
        >
          Solo piloto/inactivas{pilotInactiveCount > 0 ? ` (${pilotInactiveCount})` : ''}
        </button>
        {pilotInactiveCount > 0 ? (
          <Button
            size="sm"
            onClick={handleActivatePilots}
            disabled={pending}
            className="gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            Activar {pilotInactiveCount} piloto
          </Button>
        ) : null}
      </div>

      <div className="rounded-md border border-bg-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Area</TableHead>
              <TableHead>Pregunta</TableHead>
              <TableHead className="w-24">Dificultad</TableHead>
              <TableHead className="w-20">Activa</TableHead>
              <TableHead className="w-32 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Sin preguntas
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Badge variant="outline">
                      A{r.area}.{r.subarea}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xl">
                    <p className="line-clamp-2 text-sm">{r.question_text}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={DIFFICULTY_VARIANT[r.difficulty ?? 'medium']}>
                      {r.difficulty ?? 'medium'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggle(r.id, r.is_active ?? true)}
                      disabled={pending}
                      title={r.is_active ? 'Desactivar' : 'Activar'}
                      className="rounded p-1 hover:bg-bg-raised"
                    >
                      {r.is_active ? (
                        <Eye className="h-4 w-4 text-success" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/admin/questions/${r.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(r.id)}
                        disabled={pending}
                        className="text-danger hover:bg-danger/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
