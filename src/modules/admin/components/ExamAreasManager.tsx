'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  upsertExamArea,
  deleteExamArea,
  upsertExamSubarea,
  deleteExamSubarea,
} from '@/modules/admin/exam-actions'

export type SubareaRow = { id: string; subarea_num: number; name: string; questions: number }
export type AreaWithSubs = {
  id: string
  section: 'disciplinar' | 'transversal'
  area_num: number
  name: string
  total_questions: number
  color: string | null
  color_class: string | null
  subareas: SubareaRow[]
}

type Props = {
  examId: string
  areas: AreaWithSubs[]
}

export function ExamAreasManager({ examId, areas }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const disciplinar = areas.filter((a) => a.section === 'disciplinar')
  const transversal = areas.filter((a) => a.section === 'transversal')

  function refresh() {
    router.refresh()
  }

  function removeArea(id: string) {
    if (!confirm('Borrar esta area y sus subareas?')) return
    startTransition(async () => {
      const r = await deleteExamArea(id, examId)
      if (!r.success) { toast.error(r.error); return }
      toast.success('Area borrada')
      refresh()
    })
  }

  function removeSubarea(id: string) {
    startTransition(async () => {
      const r = await deleteExamSubarea(id, examId)
      if (!r.success) { toast.error(r.error); return }
      toast.success('Subarea borrada')
      refresh()
    })
  }

  return (
    <div className="space-y-8">
      {(['disciplinar', 'transversal'] as const).map((section) => {
        const list = section === 'disciplinar' ? disciplinar : transversal
        return (
          <section key={section} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {section === 'disciplinar' ? 'Areas disciplinares' : 'Areas transversales'}
            </h3>

            {list.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin areas todavia.</p>
            ) : null}

            {list.map((area) => (
              <div key={area.id} className="rounded-lg border border-bg-border bg-bg-surface p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      Area {area.area_num}: {area.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {area.total_questions} reactivos · {area.subareas.length} subareas
                      {area.color_class ? ` · ${area.color_class}` : ''}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={pending}
                    onClick={() => removeArea(area.id)}
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>

                {/* Subareas */}
                <ul className="mt-3 space-y-1.5">
                  {area.subareas
                    .slice()
                    .sort((a, b) => a.subarea_num - b.subarea_num)
                    .map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center justify-between rounded-md bg-bg-base px-3 py-1.5 text-sm"
                      >
                        <span>
                          {area.area_num}.{s.subarea_num} {s.name}{' '}
                          <span className="text-muted-foreground">· {s.questions} reactivos</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSubarea(s.id)}
                          disabled={pending}
                          className="text-muted-foreground hover:text-danger"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                </ul>

                <AddSubareaForm examId={examId} examAreaId={area.id} onDone={refresh} />
              </div>
            ))}

            <AddAreaForm examId={examId} section={section} onDone={refresh} />
          </section>
        )
      })}
    </div>
  )
}

function AddAreaForm({
  examId,
  section,
  onDone,
}: {
  examId: string
  section: 'disciplinar' | 'transversal'
  onDone: () => void
}) {
  const [pending, startTransition] = useTransition()
  const [areaNum, setAreaNum] = useState('')
  const [name, setName] = useState('')
  const [total, setTotal] = useState('')
  const [colorClass, setColorClass] = useState('')

  function submit() {
    startTransition(async () => {
      const r = await upsertExamArea({
        exam_id: examId,
        section,
        area_num: Number(areaNum),
        name,
        total_questions: Number(total || 0),
        color_class: colorClass || null,
      })
      if (!r.success) { toast.error(r.error); return }
      toast.success('Area agregada')
      setAreaNum('')
      setName('')
      setTotal('')
      setColorClass('')
      onDone()
    })
  }

  return (
    <div className="flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-bg-border p-3">
      <div className="w-20">
        <label className="text-[10px] uppercase text-muted-foreground">N°</label>
        <Input value={areaNum} onChange={(e) => setAreaNum(e.target.value)} type="number" min={1} />
      </div>
      <div className="min-w-48 flex-1">
        <label className="text-[10px] uppercase text-muted-foreground">Nombre del area</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="w-24">
        <label className="text-[10px] uppercase text-muted-foreground">Reactivos</label>
        <Input value={total} onChange={(e) => setTotal(e.target.value)} type="number" min={0} />
      </div>
      <div className="w-28">
        <label className="text-[10px] uppercase text-muted-foreground">colorClass</label>
        <Input value={colorClass} onChange={(e) => setColorClass(e.target.value)} placeholder="area1" />
      </div>
      <Button type="button" size="sm" disabled={pending || !areaNum || !name} onClick={submit}>
        <Plus className="h-4 w-4" /> Area
      </Button>
    </div>
  )
}

function AddSubareaForm({
  examId,
  examAreaId,
  onDone,
}: {
  examId: string
  examAreaId: string
  onDone: () => void
}) {
  const [pending, startTransition] = useTransition()
  const [num, setNum] = useState('')
  const [name, setName] = useState('')
  const [questions, setQuestions] = useState('')

  function submit() {
    startTransition(async () => {
      const r = await upsertExamSubarea({
        examId,
        exam_area_id: examAreaId,
        subarea_num: Number(num),
        name,
        questions: Number(questions || 0),
      })
      if (!r.success) { toast.error(r.error); return }
      toast.success('Subarea agregada')
      setNum('')
      setName('')
      setQuestions('')
      onDone()
    })
  }

  return (
    <div className="mt-2 flex flex-wrap items-end gap-2">
      <div className="w-16">
        <label className="text-[10px] uppercase text-muted-foreground">N°</label>
        <Input value={num} onChange={(e) => setNum(e.target.value)} type="number" min={1} />
      </div>
      <div className="min-w-40 flex-1">
        <label className="text-[10px] uppercase text-muted-foreground">Nombre subarea</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="w-24">
        <label className="text-[10px] uppercase text-muted-foreground">Reactivos</label>
        <Input value={questions} onChange={(e) => setQuestions(e.target.value)} type="number" min={0} />
      </div>
      <Button type="button" size="sm" variant="outline" disabled={pending || !num || !name} onClick={submit}>
        <Plus className="h-4 w-4" /> Subarea
      </Button>
    </div>
  )
}
