import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  SimulacroResults,
  type SimulacroSessionSummary,
} from '@/modules/quiz/components/SimulacroResults'
import type { AreaBreakdownRow } from '@/modules/quiz/components/AreaBreakdown'
import { DISCIPLINAR_AREAS, TRANSVERSAL_AREAS } from '@/lib/constants/egel'

export const metadata: Metadata = { title: 'Resultados del simulacro' }

type Params = { groupId: string }

type AnswerRow = {
  is_correct: boolean | null
  session_id: string
  questions: { area: number; section: string } | null
}

function areaKey(section: string, area: number): string {
  return `${section}-${area}`
}

function areaShortName(section: string, area: number): string {
  if (section === 'disciplinar') {
    const meta = DISCIPLINAR_AREAS.find((a) => a.area === area)
    return meta ? `D${area}` : `Area ${area}`
  }
  const meta = TRANSVERSAL_AREAS.find((a) => a.area === area)
  return meta ? `T${area}` : `Area ${area}`
}

export default async function SimulacroResultsPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { groupId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Cargar ambas sesiones del grupo
  const { data: sessions, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('simulacro_group_id', groupId)
    .order('session_number', { ascending: true })

  if (error || !sessions || sessions.length === 0) notFound()
  if (sessions[0]?.user_id !== user.id) notFound()

  const session1 = sessions.find((s) => s.session_number === 1)
  const session2 = sessions.find((s) => s.session_number === 2)

  if (!session1 || !session2) {
    // Aun no hay resultados completos: volver al detalle del simulacro
    redirect(`/simulacro/${groupId}`)
  }

  if (session1.status !== 'completed' || session2.status !== 'completed') {
    redirect(`/simulacro/${groupId}`)
  }

  const summary1: SimulacroSessionSummary = {
    sessionNumber: 1,
    total: session1.total_questions,
    correct: session1.correct_answers ?? 0,
    wrong: session1.wrong_answers ?? 0,
    skipped: session1.skipped ?? 0,
    scorePercent: Number(session1.score_percent ?? 0),
    timeTakenSeconds: session1.time_taken_seconds,
    xpEarned: session1.xp_earned ?? 0,
  }
  const summary2: SimulacroSessionSummary = {
    sessionNumber: 2,
    total: session2.total_questions,
    correct: session2.correct_answers ?? 0,
    wrong: session2.wrong_answers ?? 0,
    skipped: session2.skipped ?? 0,
    scorePercent: Number(session2.score_percent ?? 0),
    timeTakenSeconds: session2.time_taken_seconds,
    xpEarned: session2.xp_earned ?? 0,
  }

  // Breakdown combinado (sesion 1 + sesion 2) por seccion+area
  const { data: rawAnswers } = await supabase
    .from('quiz_answers')
    .select('is_correct, session_id, questions ( area, section )')
    .in('session_id', [session1.id, session2.id])

  const answers = (rawAnswers ?? []) as unknown as AnswerRow[]

  const buckets = new Map<
    string,
    { section: string; area: number; attempted: number; correct: number }
  >()
  for (const a of answers) {
    if (!a.questions) continue
    const key = areaKey(a.questions.section, a.questions.area)
    const bucket = buckets.get(key) ?? {
      section: a.questions.section,
      area: a.questions.area,
      attempted: 0,
      correct: 0,
    }
    bucket.attempted++
    if (a.is_correct === true) bucket.correct++
    buckets.set(key, bucket)
  }

  const breakdown: AreaBreakdownRow[] = Array.from(buckets.values())
    .map((b) => ({
      // El componente AreaBreakdown usa area como key numerica unica.
      // Para no colisionar entre disciplinar/transversal multiplicamos
      // por 10 las disciplinares y por 100 las transversales — solo afecta
      // el orden de la lista visual.
      area: b.section === 'disciplinar' ? b.area : 100 + b.area,
      areaShortName: areaShortName(b.section, b.area),
      attempted: b.attempted,
      correct: b.correct,
      accuracy: b.attempted === 0 ? 0 : Math.round((b.correct / b.attempted) * 100),
    }))
    .sort((a, b) => a.area - b.area)

  return <SimulacroResults session1={summary1} session2={summary2} breakdown={breakdown} />
}
