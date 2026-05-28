import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { GuideForm } from '@/modules/admin/components/GuideForm'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditGuidePage({ params }: PageProps) {
  const { id } = await params

  const supabase = await createClient()
  const { data: guide } = await supabase
    .from('study_guides')
    .select('*')
    .eq('id', id)
    .single()

  if (!guide) {
    notFound()
  }

  return (
    <div>
      <PageHeader
        title="Editar guia"
        description={guide.title}
      />
      <GuideForm initialData={guide} />
    </div>
  )
}
