'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteExam } from '@/modules/admin/exam-actions'

export function DeleteExamButton({
  examId,
  questionCount,
}: {
  examId: string
  questionCount: number
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function onDelete() {
    if (questionCount > 0) {
      toast.error('No se puede borrar: reasigna sus preguntas primero.')
      return
    }
    if (!confirm('Borrar este examen definitivamente?')) return
    startTransition(async () => {
      const r = await deleteExam(examId)
      if (!r.success) { toast.error(r.error); return }
      toast.success('Examen borrado')
      router.push('/admin/exams')
      router.refresh()
    })
  }

  return (
    <Button type="button" variant="outline" disabled={pending || questionCount > 0} onClick={onDelete}>
      <Trash2 className="h-4 w-4 text-danger" /> Borrar examen
    </Button>
  )
}
