import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { QuestionForm } from '@/modules/admin/components/QuestionForm'

type Params = { id: string }

export default async function EditQuestionPage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: question, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !question) notFound()

  return (
    <div>
      <PageHeader
        title="Editar pregunta"
        description={`Area ${question.area}.${question.subarea} · creada ${new Date(question.created_at ?? '').toLocaleDateString('es-MX')}`}
      />
      <QuestionForm initialData={question} />
    </div>
  )
}
