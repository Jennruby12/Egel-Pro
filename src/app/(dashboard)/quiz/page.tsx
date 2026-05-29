import type { Metadata } from 'next'
import { Sparkles } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { SparklesText } from '@/components/ui/sparkles-text'
import { StartQuizForm } from '@/modules/quiz/components/StartQuizForm'
import { ResumeQuizBanner } from '@/modules/quiz/components/ResumeQuizBanner'
import {
  getActiveQuizSession,
  cleanupEmptyInProgressSessions,
} from '@/modules/quiz/actions'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Practicar' }

async function getAvailableCounts(): Promise<Record<number, number>> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('questions')
    .select('area')
    .eq('section', 'disciplinar')
    .eq('is_deleted', false)
    .eq('is_active', true)
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  for (const row of data ?? []) {
    counts[row.area] = (counts[row.area] ?? 0) + 1
  }
  return counts
}

export default async function QuizPage() {
  // Cleanup silencioso de sesiones zombi antes de cargar el form
  await cleanupEmptyInProgressSessions()

  const [availableCounts, activeRes] = await Promise.all([
    getAvailableCounts(),
    getActiveQuizSession(),
  ])
  const activeSession = activeRes.success ? activeRes.data : null
  const totalBank = Object.values(availableCounts).reduce((s, n) => s + n, 0)
  return (
    <div className="relative">
      <AuroraBackground variant="subtle" className="absolute inset-0 -z-10">
        <div className="h-full w-full" />
      </AuroraBackground>

      <header className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-glass-border/40 bg-glass-bg/40 px-3 py-1 text-xs font-medium text-aurora-2 backdrop-blur-md">
          <Sparkles className="h-3 w-3" />
          Modo entrenamiento
        </div>
        <h1 className="text-display-md md:text-display-lg">
          <SparklesText className="text-aurora">Practicar</SparklesText>
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Elige un modo y comienza a entrenar para el EGEL. Cada quiz suma XP, mantiene tu racha y te acerca a tu meta.
        </p>
        <p className="text-xs text-muted-foreground/70">
          Banco disciplinar disponible: <span className="font-semibold text-aurora-2">{totalBank.toLocaleString('es-MX')}</span> reactivos
        </p>
      </header>

      {activeSession ? (
        <ResumeQuizBanner
          sessionId={activeSession.sessionId}
          mode={activeSession.mode}
          totalQuestions={activeSession.totalQuestions}
          answeredCount={activeSession.answeredCount}
          startedAt={activeSession.startedAt}
        />
      ) : null}

      <StartQuizForm availableCounts={availableCounts} />
    </div>
  )
}
