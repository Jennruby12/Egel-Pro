'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
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
import { deleteQuestion, toggleQuestionActive } from '@/modules/admin/actions'
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

  const filtered = rows.filter((r) =>
    r.question_text.toLowerCase().includes(search.toLowerCase()),
  )

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
