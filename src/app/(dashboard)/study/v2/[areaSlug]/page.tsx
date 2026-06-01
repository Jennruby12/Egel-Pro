import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { SparklesText } from '@/components/ui/sparkles-text'
import { createClient } from '@/lib/supabase/server'
import { GuideCard } from '@/modules/study/v2/components/GuideCard'
import { findArea } from '@/modules/study/v2/lib/area-slugs'

type Params = { areaSlug: string }
type Props = { params: Promise<Params> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { areaSlug } = await params
  const area = findArea(areaSlug)
  return { title: area ? area.name : 'Estudiar' }
}

export default async function StudyV2AreaPage({ params }: Props) {
  const { areaSlug } = await params
  const area = findArea(areaSlug)
  if (!area) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [guidesRes, progressRes] = await Promise.all([
    supabase
      .from('guides')
      .select('id, slug, title, short_description, weight_in_exam, estimated_minutes, difficulty, cover_image_url, subarea_num')
      .eq('published', true)
      .eq('section', area.section)
      .eq('area_num', area.area_num)
      .order('subarea_num'),
    supabase
      .from('user_guide_progress')
      .select('guide_id, status, percent_read')
      .eq('user_id', user.id),
  ])
  const guides = guidesRes.data ?? []
  const progressByGuide = new Map<string, { status: 'no_iniciado' | 'en_progreso' | 'completado'; percent_read: number }>()
  for (const p of progressRes.data ?? []) {
    progressByGuide.set(p.guide_id, {
      status: p.status as 'no_iniciado' | 'en_progreso' | 'completado',
      percent_read: p.percent_read ?? 0,
    })
  }

  return (
    <div className="relative">
      <AuroraBackground variant="subtle" className="absolute inset-0 -z-10">
        <div className="h-full w-full" />
      </AuroraBackground>

      <header className="mb-6 space-y-3">
        <Link href="/study/v2" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-aurora-2">
          <ChevronLeft className="h-3 w-3" />
          Material de estudio
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-display-md">
          <SparklesText className="text-aurora">{area.name}</SparklesText>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {guides.length} {guides.length === 1 ? 'guia disponible' : 'guias disponibles'} en esta area.
        </p>
      </header>

      {guides.length === 0 ? (
        <div className="rounded-xl border border-glass-border/40 bg-glass-bg/40 p-8 text-center text-sm text-muted-foreground backdrop-blur-md">
          Aun no hay guias publicadas en esta area.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <GuideCard
              key={g.id}
              areaSlug={area.slug}
              guide={{
                slug: g.slug,
                title: g.title,
                short_description: g.short_description,
                weight_in_exam: g.weight_in_exam,
                estimated_minutes: g.estimated_minutes,
                difficulty: g.difficulty,
                cover_image_url: g.cover_image_url,
              }}
              progress={progressByGuide.get(g.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
