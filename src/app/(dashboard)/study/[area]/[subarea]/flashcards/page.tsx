import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Layers } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { FlashcardDeck, type DeckFlashcard } from '@/modules/study/components/FlashcardDeck'
import { getAreaById, getSubareaById } from '@/lib/constants/egel'
import { getCardsDueToday } from '@/modules/quiz/lib/spaced-repetition'

export const metadata: Metadata = { title: 'Flashcards' }

type PageProps = {
  params: Promise<{ area: string; subarea: string }>
  searchParams: Promise<{ section?: string }>
}

export default async function FlashcardsPage({ params, searchParams }: PageProps) {
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

  // Fetch en paralelo: flashcards activas de la subarea + progreso del usuario.
  const [flashcardsResult, progressResult] = await Promise.all([
    supabase
      .from('flashcards')
      .select('id, front, back, area, subarea')
      .eq('area', areaId)
      .eq('subarea', subareaId)
      .eq('is_active', true)
      .order('order_index', { ascending: true }),
    supabase
      .from('user_flashcard_progress')
      .select('flashcard_id, next_review, last_seen')
      .eq('user_id', user.id),
  ])

  const flashcards = flashcardsResult.data ?? []
  const progress = progressResult.data ?? []
  const progressByCard = new Map(progress.map((p) => [p.flashcard_id, p]))

  const cardsWithProgress = flashcards.map((c) => ({
    ...c,
    next_review: progressByCard.get(c.id)?.next_review ?? null,
  }))

  const dueCards = getCardsDueToday(cardsWithProgress)
  const deckCards: DeckFlashcard[] = dueCards.map((c) => ({
    id: c.id,
    front: c.front,
    back: c.back,
    areaId: section === 'disciplinar' ? areaId : undefined,
  }))

  const areaMeta = getAreaById(areaId, section)
  const subareaMeta = getSubareaById(areaId, subareaId, section)

  const nextReviewDate = calculateNextReviewDate(
    cardsWithProgress.map((c) => c.next_review),
  )

  const backToGuideHref = `/study/${areaId}/${subareaId}?section=${section}`

  return (
    <AuroraBackground
      variant="subtle"
      className="-mx-4 -mt-4 px-4 pt-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <div className="space-y-6">
        <Link
          href={backToGuideHref}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la guia
        </Link>

        <PageHeader
          title={`Flashcards · ${subareaMeta?.name ?? `Subarea ${subareaId}`}`}
          description={
            areaMeta ? `${areaMeta.name} · Area ${areaId}` : `Area ${areaId} · Subarea ${subareaId}`
          }
          gradient
        />

        {flashcards.length === 0 ? (
          <EmptyDeck
            title="Aun no hay flashcards"
            description="Estamos preparando tarjetas para esta subarea. Mientras tanto puedes leer la guia o practicar reactivos."
          />
        ) : deckCards.length === 0 ? (
          <EmptyDeck
            title="No hay tarjetas para repasar hoy"
            description={
              nextReviewDate
                ? `Vuelve manana. Tu proxima tarjeta esta agendada para ${formatHumanDate(nextReviewDate)}.`
                : 'Vuelve manana para continuar tu repaso espaciado.'
            }
          />
        ) : (
          <FlashcardDeck cards={deckCards} userId={user.id} backHref={backToGuideHref} />
        )}
      </div>
    </AuroraBackground>
  )
}

function EmptyDeck({ title, description }: { title: string; description: string }) {
  return (
    <GlassCard variant="elevated" padding="xl" className="text-center">
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-raised">
          <Layers className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        <Link href="/study">
          <MagicButton variant="aurora">Volver al estudio</MagicButton>
        </Link>
      </div>
    </GlassCard>
  )
}

function calculateNextReviewDate(reviews: Array<string | null>): string | null {
  const todayISO = new Date().toISOString().slice(0, 10)
  const futureDates = reviews
    .filter((r): r is string => Boolean(r))
    .map((r) => r.slice(0, 10))
    .filter((r) => r > todayISO)
    .sort()
  return futureDates[0] ?? null
}

function formatHumanDate(iso: string): string {
  // Espanol sin acentos para mantener consistencia con el resto de la UI.
  const [yearStr, monthStr, dayStr] = iso.split('-')
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ]
  const m = Number(monthStr) - 1
  const monthName = months[m] ?? monthStr
  return `${Number(dayStr)} de ${monthName} de ${yearStr}`
}
