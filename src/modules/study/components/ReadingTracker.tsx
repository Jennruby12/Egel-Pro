'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Sparkles } from 'lucide-react'
import { updateReadingProgress, completeGuide } from '@/modules/study/actions'

type Props = {
  guideId: string
  /** Si el user ya completo la guia, no dispara XP de nuevo. */
  alreadyCompleted: boolean
  children: React.ReactNode
}

const HEARTBEAT_MS = 30_000
const REQUIRED_PERCENT = 80
const REQUIRED_SECONDS = 180

/**
 * Mide scroll % de la pagina y tiempo activo. Envia heartbeat cada 30s.
 * Cuando llega a >=80% scroll y >=180s tiempo, dispara completeGuide()
 * que otorga XP y dispara achievements.
 */
export function ReadingTracker({ guideId, alreadyCompleted, children }: Props) {
  const startedAt = useRef<number>(Date.now())
  const lastHeartbeat = useRef<number>(0)
  const maxPercent = useRef<number>(0)
  const completed = useRef<boolean>(alreadyCompleted)
  const tabVisible = useRef<boolean>(true)
  const accumSeconds = useRef<number>(0)
  const lastTickAt = useRef<number>(Date.now())

  useEffect(() => {
    function computePercent(): number {
      const doc = document.documentElement
      const scrollTop = window.scrollY || doc.scrollTop
      const scrollable = doc.scrollHeight - doc.clientHeight
      if (scrollable <= 0) return 100
      return Math.min(100, Math.round((scrollTop / scrollable) * 100))
    }

    function onScroll() {
      const p = computePercent()
      if (p > maxPercent.current) maxPercent.current = p
    }

    function onVisibility() {
      tabVisible.current = !document.hidden
      lastTickAt.current = Date.now()
    }

    function tick() {
      const now = Date.now()
      const elapsed = (now - lastTickAt.current) / 1000
      if (tabVisible.current && elapsed < 60) {
        accumSeconds.current += elapsed
      }
      lastTickAt.current = now

      const p = Math.max(maxPercent.current, computePercent())
      maxPercent.current = p

      const shouldSendHeartbeat = now - lastHeartbeat.current >= HEARTBEAT_MS
      if (shouldSendHeartbeat) {
        lastHeartbeat.current = now
        const deltaSeconds = Math.floor(accumSeconds.current)
        accumSeconds.current -= deltaSeconds
        void updateReadingProgress({
          guideId,
          percent: p,
          deltaSeconds,
        })
      }

      // Disparar completeGuide cuando se cumplen los criterios.
      if (!completed.current && p >= REQUIRED_PERCENT) {
        // El tiempo lo verifica el server tambien; pero usamos local como hint.
        const totalSeconds = Math.floor((now - startedAt.current) / 1000)
        if (totalSeconds >= REQUIRED_SECONDS) {
          completed.current = true
          void completeGuide(guideId).then((res) => {
            if (res.success && res.data && res.data.xpEarned > 0) {
              toast.success(`+${res.data.xpEarned} XP por completar la guia`, {
                icon: <Sparkles className="h-4 w-4 text-aurora-2" />,
              })
            }
          })
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    const interval = setInterval(tick, 5_000)

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      clearInterval(interval)
    }
  }, [guideId])

  return <>{children}</>
}
