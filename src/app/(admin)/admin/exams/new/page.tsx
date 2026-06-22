import { PageHeader } from '@/components/layout/PageHeader'
import { ExamForm } from '@/modules/admin/components/ExamForm'

export default function NewExamPage() {
  return (
    <div>
      <PageHeader
        title="Nuevo examen"
        description="Define los metadatos. Despues podras agregar areas y subareas."
      />
      <ExamForm />
    </div>
  )
}
