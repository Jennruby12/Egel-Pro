'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, WifiOff } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { getOfflineBundle } from '@/lib/offline/content-db'
import { buildOfflineQuiz } from '@/modules/quiz/lib/offline-quiz'
import { OfflineQuizRunner } from '@/modules/quiz/components/OfflineQuizRunner'
import type { OfflineQuestion } from '@/modules/quiz/offline-content-actions'

function OfflineQuizInner() {
  const params = useSearchParams()
  const nRaw = Number(params.get('n') ?? '20')
  const n = Number.isFinite(nRaw) && nRaw > 0 ? nRaw : 20
  const areasParam = params.get('areas')
  const areas = areasParam
    ? areasParam.split(',').map(Number).filter((x) => Number.isFinite(x) && x > 0)
    : []

  const [state, setState] = useState<'loading' | 'ready' | 'empty'>('loading')
  const [questions, setQuestions] = useState<OfflineQuestion[]>([])

  useEffect(() => {
    getOfflineBundle()
      .then((bundle) => {
        if (!bundle || bundle.questions.length === 0) {
          setState('empty')
          return
        }
        setQuestions(buildOfflineQuiz(bundle.questions, { total: n, areas }))
        setState('ready')
      })
      .catch(() => setState('empty'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state === 'loading') {
    return (
      <GlassCard variant="elevated" padding="xl" className="flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-aurora-2" />
        Cargando contenido offline…
      </GlassCard>
    )
  }

  if (state === 'empty') {
    return (
      <GlassCard variant="elevated" padding="xl" className="space-y-4 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-aurora-2/15 text-aurora-2">
            <WifiOff className="h-7 w-7" />
          </span>
          <h2 className="text-xl font-bold">No hay contenido descargado</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Para practicar sin internet primero descarga el banco: conectate y, en
            Practicar, toca <span className="font-semibold text-aurora-2">&quot;Descargar para usar sin internet&quot;</span>.
          </p>
        </div>
        <MagicButton asChild variant="aurora" size="lg">
          <Link href="/quiz">Ir a Practicar</Link>
        </MagicButton>
      </GlassCard>
    )
  }

  return <OfflineQuizRunner questions={questions} areas={areas} />
}

export default function OfflineQuizPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Suspense fallback={null}>
        <OfflineQuizInner />
      </Suspense>
    </div>
  )
}
