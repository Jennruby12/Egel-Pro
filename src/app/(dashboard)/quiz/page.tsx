import type { Metadata } from 'next'
import { Sparkles } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { SparklesText } from '@/components/ui/sparkles-text'
import { StartQuizForm } from '@/modules/quiz/components/StartQuizForm'

export const metadata: Metadata = { title: 'Practicar' }

export default function QuizPage() {
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
      </header>

      <StartQuizForm />
    </div>
  )
}
