import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Layers } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { EmptyStateNoGuides } from '@/components/shared/EmptyState'
import { GuideViewer } from '@/modules/study/components/GuideViewer'
import { getAreaById, getSubareaById } from '@/lib/constants/egel'

export const metadata: Metadata = { title: 'Guia de estudio' }

type PageProps = {
  params: Promise<{ area: string; subarea: string }>
  searchParams: Promise<{ section?: string }>
}

export default async function StudyGuidePage({ params, searchParams }: PageProps) {
  const { area: areaStr, subarea: subareaStr } = await params
  const { section: sectionParam } = await searchParams

  const areaId = Number(areaStr)
  const subareaId = Number(subareaStr)
  const section: 'disciplinar' | 'transversal' =
    sectionParam === 'transversal' ? 'transversal' : 'disciplinar'

  if (
    !Number.isInteger(areaId) ||
    !Number.isInteger(subareaId) ||
    areaId < 1 ||
    subareaId < 1
  ) {
    redirect('/study')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [guidesResult, flashcardsCountResult] = await Promise.all([
    supabase
      .from('study_guides')
      .select('*')
      .eq('section', section)
      .eq('area', areaId)
      .eq('subarea', subareaId)
      .eq('is_published', true)
      .eq('is_deleted', false)
      .order('order_index', { ascending: true }),
    supabase
      .from('flashcards')
      .select('id', { count: 'exact', head: true })
      .eq('area', areaId)
      .eq('subarea', subareaId)
      .eq('is_active', true),
  ])

  const guides = guidesResult.data
  const flashcardsCount = flashcardsCountResult.count ?? 0
  const flashcardsHref = `/study/${areaId}/${subareaId}/flashcards?section=${section}`

  const areaMeta = getAreaById(areaId, section)
  const subareaMeta = getSubareaById(areaId, subareaId, section)

  return (
    <AuroraBackground
      variant="subtle"
      className="-mx-4 -mt-4 px-4 pt-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <div className="space-y-6">
        <Link
          href="/study"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a guias
        </Link>

        <PageHeader
          title={subareaMeta?.name ?? `Subarea ${subareaId}`}
          description={areaMeta ? `${areaMeta.name} · Area ${areaId}` : undefined}
          gradient
          actions={
            flashcardsCount > 0 ? (
              <Link href={flashcardsHref} data-testid="link-flashcards">
                <MagicButton variant="aurora" size="md">
                  <Layers className="h-4 w-4" />
                  Estudiar flashcards ({flashcardsCount})
                </MagicButton>
              </Link>
            ) : undefined
          }
        />

        {!guides || guides.length === 0 ? (
          <GlassCard variant="elevated" padding="xl">
            <EmptyStateNoGuides />
          </GlassCard>
        ) : (
          <div className="space-y-8">
            {guides.map((guide) => (
              <GuideViewer key={guide.id} guide={guide} />
            ))}
          </div>
        )}
      </div>
    </AuroraBackground>
  )
}
