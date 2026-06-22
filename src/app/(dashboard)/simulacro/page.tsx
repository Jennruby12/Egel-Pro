import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { SimulacroIntro } from '@/modules/quiz/components/SimulacroIntro'
import { ROUTES } from '@/lib/constants/routes'
import { getActiveExamConfig, buildSimulacroSlots } from '@/lib/exams/exam-config'

export const metadata: Metadata = { title: 'Simulacro completo EGEL' }

export default async function SimulacroIndexPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Si ya hay un simulacro in_progress, mandarlo directo al detalle del grupo.
  const { data: existing } = await supabase
    .from('quiz_sessions')
    .select('simulacro_group_id')
    .eq('user_id', user.id)
    .eq('mode', 'full_simulacro')
    .eq('status', 'in_progress')
    .not('simulacro_group_id', 'is', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing?.simulacro_group_id) {
    redirect(ROUTES.simulacro.group(existing.simulacro_group_id))
  }

  // Estructura del examen activo: numeros y reparto por sesion para la intro.
  const examConfig = await getActiveExamConfig(user.id)
  if (!examConfig) redirect('/dashboard')
  const sessionTotals = buildSimulacroSlots(examConfig).map((slots) =>
    slots.reduce((acc, s) => acc + s.count, 0),
  )

  return (
    <AuroraBackground
      variant="intense"
      className="-mx-4 -mt-4 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <SimulacroIntro
        examName={examConfig.name}
        totalQuestions={examConfig.exam.totalQuestions}
        disciplinarQuestions={examConfig.exam.disciplinarQuestions}
        transversalQuestions={examConfig.exam.transversalQuestions}
        sessions={examConfig.exam.sessions}
        sessionDurationSeconds={examConfig.exam.sessionDurationSeconds}
        sessionTotals={sessionTotals}
      />
    </AuroraBackground>
  )
}
