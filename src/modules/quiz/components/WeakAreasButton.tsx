'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Target, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { startWeakAreasQuiz } from '@/modules/quiz/actions'

/**
 * CTA que arma una practica enfocada en las areas mas debiles del usuario
 * (segun user_progress) y lo lleva directo a la sesion.
 */
export function WeakAreasButton() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      const res = await startWeakAreasQuiz(20)
      if (!res.success) {
        toast.error(res.error)
        return
      }
      router.push(`/quiz/session/${res.data.sessionId}`)
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      data-testid="weak-areas-btn"
      className="flex w-full items-center gap-3 rounded-2xl border border-aurora-2/40 bg-aurora-2/10 p-4 text-left backdrop-blur-md transition-colors hover:bg-aurora-2/20 disabled:opacity-60"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aurora-2/20 text-aurora-2">
        {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Target className="h-5 w-5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">Reforzar mis areas debiles</span>
        <span className="block text-xs text-muted-foreground">
          Practica de 20 preguntas enfocada en donde tienes menor precision
        </span>
      </span>
    </button>
  )
}
