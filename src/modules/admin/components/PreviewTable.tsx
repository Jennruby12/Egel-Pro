'use client'

import { Check, X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { ImportRowResult } from '@/lib/validations/import-questions.schema'

type Props = {
  results: ImportRowResult[]
}

export function PreviewTable({ results }: Props) {
  return (
    <div className="rounded-md border border-bg-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead className="w-16">OK</TableHead>
            <TableHead className="w-20">Area</TableHead>
            <TableHead>Pregunta</TableHead>
            <TableHead className="w-20">Resp.</TableHead>
            <TableHead className="w-32">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((r) => {
            const isOk = r.ok
            return (
              <TableRow key={r.rowIndex} className={isOk ? '' : 'bg-danger/5'}>
                <TableCell className="text-muted-foreground">{r.rowIndex + 1}</TableCell>
                <TableCell>
                  {isOk ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <X className="h-4 w-4 text-danger" />
                  )}
                </TableCell>
                <TableCell>
                  {isOk ? (
                    <Badge variant="outline">
                      A{r.data.area}.{r.data.subarea}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {String(r.raw.area ?? '?')}.{String(r.raw.subarea ?? '?')}
                    </span>
                  )}
                </TableCell>
                <TableCell className="max-w-xl">
                  <p className="line-clamp-2 text-sm">
                    {isOk ? r.data.question_text : String(r.raw.question_text ?? '(vacio)')}
                  </p>
                </TableCell>
                <TableCell>
                  {isOk ? (
                    <Badge variant="success">{r.data.correct_answer.toUpperCase()}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {String(r.raw.correct_answer ?? '?')}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {isOk ? (
                    <span className="text-xs text-success">Valida</span>
                  ) : (
                    <span className="text-xs text-danger" title={r.errors.join(', ')}>
                      {r.errors.length} error{r.errors.length === 1 ? '' : 'es'}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
