'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { GraduationCap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { setActiveExam } from '@/modules/admin/exam-actions'

type ExamOption = { id: string; name: string; code: string }

type Props = {
  exams: ExamOption[]
  activeExamId: string | null
}

export function ExamSwitcher({ exams, activeExamId }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [selected, setSelected] = useState(activeExamId ?? exams[0]?.id ?? '')

  const changed = selected !== activeExamId

  function save() {
    startTransition(async () => {
      const r = await setActiveExam({ examId: selected })
      if (!r.success) { toast.error(r.error); return }
      toast.success('Examen activo actualizado')
      router.refresh()
    })
  }

  // Con un solo examen disponible no hay nada que elegir.
  if (exams.length <= 1) {
    return (
      <p className="text-sm text-muted-foreground">
        Examen activo: <span className="font-medium text-foreground">{exams[0]?.name ?? '—'}</span>
      </p>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <GraduationCap className="h-5 w-5 text-brand-400" />
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="h-10 flex-1 rounded-md border border-bg-border bg-bg-base px-3 text-sm"
      >
        {exams.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name} ({e.code})
          </option>
        ))}
      </select>
      <Button type="button" onClick={save} disabled={pending || !changed}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Cambiar
      </Button>
    </div>
  )
}
