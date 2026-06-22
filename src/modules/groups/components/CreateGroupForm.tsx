'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createGroup } from '@/modules/groups/actions'

type ExamOption = { id: string; name: string }

export function CreateGroupForm({ exams }: { exams: ExamOption[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [name, setName] = useState('')
  const [examId, setExamId] = useState(exams[0]?.id ?? '')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const r = await createGroup({ name, examId })
      if (!r.success) {
        toast.error(r.error)
        return
      }
      toast.success('Grupo creado')
      setName('')
      router.push(`/teacher/${r.data.id}`)
      router.refresh()
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-bg-border p-4">
      <div className="min-w-48 flex-1">
        <label className="text-[10px] uppercase text-muted-foreground">Nombre del grupo</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Grupo 2026-A" />
      </div>
      <div className="min-w-48">
        <label className="text-[10px] uppercase text-muted-foreground">Examen</label>
        <select
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          className="h-10 w-full rounded-md border border-bg-border bg-bg-base px-3 text-sm"
        >
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={pending || !name || !examId}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Crear grupo
      </Button>
    </form>
  )
}
