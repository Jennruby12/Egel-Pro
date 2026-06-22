import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { ExamForm } from '@/modules/admin/components/ExamForm'
import {
  ExamAreasManager,
  type AreaWithSubs,
} from '@/modules/admin/components/ExamAreasManager'
import { DeleteExamButton } from '@/modules/admin/components/DeleteExamButton'

export const dynamic = 'force-dynamic'

type Params = { id: string }

export default async function EditExamPage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: exam, error }, { data: areas }, { data: subareas }, { count: questionCount }] =
    await Promise.all([
      supabase.from('exams').select('*').eq('id', id).single(),
      supabase.from('exam_areas').select('*').eq('exam_id', id).order('area_num', { ascending: true }),
      supabase.from('exam_subareas').select('*, exam_areas!inner(exam_id)').eq('exam_areas.exam_id', id),
      supabase.from('questions').select('id', { count: 'exact', head: true }).eq('exam_id', id),
    ])

  if (error || !exam) notFound()

  // Ensamblar areas con sus subareas para el manager.
  const subsByArea = new Map<string, AreaWithSubs['subareas']>()
  for (const s of subareas ?? []) {
    const list = subsByArea.get(s.exam_area_id) ?? []
    list.push({ id: s.id, subarea_num: s.subarea_num, name: s.name, questions: s.questions })
    subsByArea.set(s.exam_area_id, list)
  }
  const areasWithSubs: AreaWithSubs[] = (areas ?? []).map((a) => ({
    id: a.id,
    section: a.section as 'disciplinar' | 'transversal',
    area_num: a.area_num,
    name: a.name,
    total_questions: a.total_questions,
    color: a.color,
    color_class: a.color_class,
    subareas: subsByArea.get(a.id) ?? [],
  }))

  return (
    <div className="space-y-10">
      <PageHeader
        title={`Editar: ${exam.name}`}
        description={`${questionCount ?? 0} preguntas asociadas a este examen.`}
      />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Metadatos</h2>
        <ExamForm initialData={exam} />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Areas y subareas
        </h2>
        <ExamAreasManager examId={exam.id} areas={areasWithSubs} />
      </section>

      <section className="space-y-3 border-t border-bg-border pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-danger">Zona peligrosa</h2>
        <p className="text-sm text-muted-foreground">
          Solo se puede borrar un examen sin preguntas asociadas.
        </p>
        <DeleteExamButton examId={exam.id} questionCount={questionCount ?? 0} />
      </section>
    </div>
  )
}
