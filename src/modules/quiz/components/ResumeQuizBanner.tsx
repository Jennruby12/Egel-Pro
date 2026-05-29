'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Play, X, Clock } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { abandonSession } from '@/modules/quiz/actions'

type Props = {
  sessionId: string
  mode: string
  totalQuestions: number
  answeredCount: number
  startedAt: string | null
}

const MODE_LABELS: Record<string, string> = {
  practice: 'Practica',
  quick_exam: 'Examen rapido',
  review: 'Repaso de errores',
  speed_challenge: 'Reto rapido',
  daily_challenge: 'Reto diario',
}

export function ResumeQuizBanner({
  sessionId,
  mode,
  totalQuestions,
  answeredCount,
  startedAt,
}: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleDiscard() {
    if (!window.confirm('¿Descartar el quiz en progreso? Las respuestas dadas se perderan.')) return
    startTransition(async () => {
      const res = await abandonSession({ sessionId })
      if (!res.success) {
        toast.error(res.error)
        return
      }
      toast.success('Quiz descartado')
      router.refresh()
    })
  }

  const startedAgo = startedAt
    ? formatRelativeTime(new Date(startedAt))
    : null
  const progress = Math.round((answeredCount / totalQuestions) * 100)

  return (
    <GlassCard variant="elevated" padding="lg" className="border-aurora-2/40 bg-aurora-2/10 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-aurora-2/20 text-aurora-2">
          <Play className="h-5 w-5" fill="currentColor" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            Tienes un quiz en progreso
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {MODE_LABELS[mode] ?? mode} · <span className="font-semibold text-aurora-2">{answeredCount}</span> de {totalQuestions} respondidas ({progress}%)
            {startedAgo ? (
              <span className="ml-2 inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Iniciado {startedAgo}
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex gap-2">
          <MagicButton
            variant="ghost"
            size="md"
            onClick={handleDiscard}
            disabled={pending}
            className="text-muted-foreground hover:text-danger"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Descartar</span>
          </MagicButton>
          <Link href={`/quiz/session/${sessionId}`}>
            <MagicButton variant="aurora" size="md">
              <Play className="h-4 w-4" />
              Continuar
            </MagicButton>
          </Link>
        </div>
      </div>
    </GlassCard>
  )
}

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'hace unos segundos'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days} d`
}
