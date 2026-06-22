'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createExam, updateExam } from '@/modules/admin/exam-actions'
import type { ExamMetaInput } from '@/lib/validations/exam.schema'

type ExamRow = {
  id: string
  slug: string
  code: string
  name: string
  total_questions: number
  disciplinar_questions: number
  transversal_questions: number
  sessions: number
  session_seconds: number
  pilot_pct: number
  options_per_question: number
  is_active: boolean
}

type Props = {
  initialData?: ExamRow | null
}

const EMPTY: ExamMetaInput = {
  slug: '',
  code: '',
  name: '',
  total_questions: 0,
  disciplinar_questions: 0,
  transversal_questions: 0,
  sessions: 1,
  session_seconds: 16200,
  pilot_pct: 0.15,
  options_per_question: 3,
  is_active: true,
}

export function ExamForm({ initialData }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const isEdit = Boolean(initialData)

  const [form, setForm] = useState<ExamMetaInput>(
    initialData
      ? {
          slug: initialData.slug,
          code: initialData.code,
          name: initialData.name,
          total_questions: initialData.total_questions,
          disciplinar_questions: initialData.disciplinar_questions,
          transversal_questions: initialData.transversal_questions,
          sessions: initialData.sessions,
          session_seconds: initialData.session_seconds,
          pilot_pct: initialData.pilot_pct,
          options_per_question: initialData.options_per_question,
          is_active: initialData.is_active,
        }
      : EMPTY,
  )

  function set<K extends keyof ExamMetaInput>(key: K, value: ExamMetaInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result =
        isEdit && initialData
          ? await updateExam(initialData.id, form)
          : await createExam(form)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(isEdit ? 'Examen actualizado' : 'Examen creado')
      router.push(isEdit ? `/admin/exams/${initialData!.id}` : `/admin/exams/${result.data.id}`)
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      <Field label="Nombre">
        <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="EGEL Plus ISOFT" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Slug (url)">
          <Input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="egel-isoft" />
        </Field>
        <Field label="Codigo">
          <Input value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="EGEL-ISOFT" />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Reactivos totales">
          <Input type="number" value={form.total_questions} onChange={(e) => set('total_questions', Number(e.target.value))} />
        </Field>
        <Field label="Disciplinar">
          <Input type="number" value={form.disciplinar_questions} onChange={(e) => set('disciplinar_questions', Number(e.target.value))} />
        </Field>
        <Field label="Transversal">
          <Input type="number" value={form.transversal_questions} onChange={(e) => set('transversal_questions', Number(e.target.value))} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Sesiones">
          <Input type="number" min={1} max={6} value={form.sessions} onChange={(e) => set('sessions', Number(e.target.value))} />
        </Field>
        <Field label="Duracion por sesion (segundos)">
          <Input type="number" value={form.session_seconds} onChange={(e) => set('session_seconds', Number(e.target.value))} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="% piloto (0-1)">
          <Input type="number" step="0.01" min={0} max={1} value={form.pilot_pct} onChange={(e) => set('pilot_pct', Number(e.target.value))} />
        </Field>
        <Field label="Opciones por reactivo">
          <Input type="number" min={2} max={6} value={form.options_per_question} onChange={(e) => set('options_per_question', Number(e.target.value))} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => set('is_active', e.target.checked)}
          className="h-4 w-4 accent-brand-400"
        />
        Examen activo (visible para usuarios)
      </label>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isEdit ? 'Guardar cambios' : 'Crear examen'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/exams')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}
