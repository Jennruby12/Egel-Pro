import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { StudyHub } from '@/modules/study/components/StudyHub'

export const metadata: Metadata = { title: 'Estudiar' }

export default async function StudyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Solo guias publicadas y no eliminadas (RLS adicional las restringe igualmente).
  const { data: guides } = await supabase
    .from('study_guides')
    .select('*')
    .eq('is_published', true)
    .eq('is_deleted', false)
    .order('area', { ascending: true })
    .order('subarea', { ascending: true })
    .order('order_index', { ascending: true })

  return (
    <AuroraBackground variant="subtle" className="-mx-4 -mt-4 px-4 pt-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <PageHeader
        title="Guias de estudio"
        description="Repasa los temas oficiales del EGEL Plus ISOFT organizados por area y subarea."
        gradient
      />
      <StudyHub guides={guides ?? []} />
    </AuroraBackground>
  )
}
