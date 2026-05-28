import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { QuizCard } from '@/modules/quiz/components/QuizCard'
import type { QuizQuestionForClient } from '@/modules/quiz/types'

export const metadata: Metadata = { title: 'Quiz en progreso' }

type Params = { id: string }

export default async function QuizSessionPage({ params }: { params: Promise<Params> }) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Cargar sesion
  const { data: session, error: sessionError } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('id', id)
    .single()

  if (sessionError || !session) notFound()
  if (session.user_id !== user.id) notFound()

  if (session.status === 'completed') {
    redirect(`/quiz/results/${id}`)
  }

  // Cargar las preguntas seleccionadas (sin correct_answer/explanation)
  // Estrategia: usar las preguntas asociadas a quiz_answers ya existentes,
  // y si no hay, traer las primeras N que matchean los filtros de la sesion.
  const { data: existingAnswers } = await supabase
    .from('quiz_answers')
    .select('question_id, order_in_quiz')
    .eq('session_id', id)
    .order('order_in_quiz', { ascending: true })

  let questions: QuizQuestionForClient[] = []

  if (existingAnswers && existingAnswers.length >= session.total_questions) {
    // Usuario ya tiene las preguntas asignadas (sesion en progreso reanudada)
    const ids = existingAnswers.map((a) => a.question_id)
    const { data: qs } = await supabase
      .from('questions')
      .select('id, section, area, area_name, subarea, subarea_name, type, stimulus_id, question_text, option_a, option_b, option_c, image_url, difficulty, tags, times_seen, times_correct, is_active, is_pilot, is_deleted, created_by, created_at, updated_at')
      .in('id', ids)
    // Ordenar segun el order_in_quiz original
    const byId = new Map((qs ?? []).map((q) => [q.id, q]))
    questions = ids
      .map((qid) => byId.get(qid))
      .filter((q): q is NonNullable<typeof q> => Boolean(q)) as QuizQuestionForClient[]
  } else {
    // Primera carga de esta sesion: tomar preguntas segun los filtros guardados
    const areas = (session.areas ?? []) as number[]
    let query = supabase
      .from('questions')
      .select('id, section, area, area_name, subarea, subarea_name, type, stimulus_id, question_text, option_a, option_b, option_c, image_url, difficulty, tags, times_seen, times_correct, is_active, is_pilot, is_deleted, created_by, created_at, updated_at')
      .eq('is_active', true)
      .eq('is_deleted', false)
    if (areas.length > 0) query = query.in('area', areas)
    const { data: qs } = await query.limit(session.total_questions * 2)
    // Shuffle + take N
    const arr = [...(qs ?? [])]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
    }
    questions = arr.slice(0, session.total_questions) as QuizQuestionForClient[]
  }

  if (questions.length === 0) {
    return (
      <GlassCard variant="elevated" padding="lg" className="mx-auto max-w-xl space-y-4 text-center">
        <p className="text-lg font-semibold">
          No se encontraron preguntas para esta sesion
        </p>
        <p className="text-sm text-muted-foreground">
          Probablemente no hay suficientes preguntas activas en las areas seleccionadas.
        </p>
        <MagicButton asChild variant="aurora">
          <Link href="/quiz">Volver al selector</Link>
        </MagicButton>
      </GlassCard>
    )
  }

  return (
    <div className="relative">
      <AuroraBackground variant="subtle" className="absolute inset-0 -z-10">
        <div className="h-full w-full" />
      </AuroraBackground>

      <div className="mx-auto max-w-3xl">
        <QuizCard
          sessionId={id}
          questions={questions}
          timeLimitSeconds={session.time_limit_seconds}
        />
      </div>
    </div>
  )
}
