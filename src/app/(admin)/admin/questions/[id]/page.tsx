import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { QuestionForm } from '@/modules/admin/components/QuestionForm'
import { getExamConfig, type ExamArea } from '@/lib/exams/exam-config'

type Params = { id: string }

function toFormAreas(areas: ExamArea[]) {
  return areas.map((a) => ({
    area: a.area,
    name: a.name,
    subareas: a.subareas.map((s) => ({ subarea: s.subarea, name: s.name })),
  }))
}

export default async function EditQuestionPage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: question, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !question) notFound()

  // La pregunta pertenece a un examen: cargamos esa estructura para autocompletar.
  const examConfig = await getExamConfig(question.exam_id ?? undefined)

  return (
    <div>
      <PageHeader
        title="Editar pregunta"
        description={`Area ${question.area}.${question.subarea} · creada ${new Date(question.created_at ?? '').toLocaleDateString('es-MX')}`}
      />
      <QuestionForm
        initialData={question}
        disciplinarAreas={toFormAreas(examConfig?.disciplinarAreas ?? [])}
        transversalAreas={toFormAreas(examConfig?.transversalAreas ?? [])}
      />
    </div>
  )
}
