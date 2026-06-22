import { PageHeader } from '@/components/layout/PageHeader'
import { QuestionForm } from '@/modules/admin/components/QuestionForm'
import { getExamConfig, type ExamArea } from '@/lib/exams/exam-config'

function toFormAreas(areas: ExamArea[]) {
  return areas.map((a) => ({
    area: a.area,
    name: a.name,
    subareas: a.subareas.map((s) => ({ subarea: s.subarea, name: s.name })),
  }))
}

export default async function NewQuestionPage() {
  const examConfig = await getExamConfig()
  return (
    <div>
      <PageHeader
        title="Nueva pregunta"
        description="Completa los campos y revisa el preview a la derecha."
      />
      <QuestionForm
        disciplinarAreas={toFormAreas(examConfig?.disciplinarAreas ?? [])}
        transversalAreas={toFormAreas(examConfig?.transversalAreas ?? [])}
      />
    </div>
  )
}
