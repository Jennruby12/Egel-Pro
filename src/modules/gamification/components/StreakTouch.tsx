'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Flame } from 'lucide-react'
import { touchStreakIfNeeded } from '@/modules/gamification/actions'

const LAST_TOUCH_KEY = 'egelpro-streak-last-touch-v1'

/**
 * Componente invisible que se monta UNA vez en el DashboardLayout y
 * llama a touchStreakIfNeeded() para mantener la racha viva estilo TikTok.
 *
 * - Solo dispara una vez por dia (verifica localStorage para no spamear).
 * - Si la racha crecio, muestra un toast con el numero nuevo.
 * - Si la racha alcanza un nuevo maximo, toast especial.
 * - Si la racha se rompio (previo > 0, ahora = 1), toast triste.
 */
export function StreakTouch() {
  const router = useRouter()
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    if (typeof window === 'undefined') return

    const today = new Date().toISOString().slice(0, 10)
    const lastTouch = window.localStorage.getItem(LAST_TOUCH_KEY)
    if (lastTouch === today) return // Ya tocamos hoy desde este device

    void (async () => {
      try {
        const res = await touchStreakIfNeeded()
        if (!res.success) return
        const { previousStreak, currentStreak, didGrow, isNewMax, alreadyToday } = res.data

        // Guardar marca en localStorage para no repetir hoy
        window.localStorage.setItem(LAST_TOUCH_KEY, today)

        if (alreadyToday) return

        if (didGrow) {
          if (isNewMax && currentStreak > 1) {
            toast.success(`Nuevo record: racha de ${currentStreak} dias`, {
              icon: <Flame className="h-4 w-4 text-streak" />,
              duration: 6000,
            })
          } else if (previousStreak === 0) {
            toast.success(`Bienvenido de vuelta. Empezaste racha de 1 dia`, {
              icon: <Flame className="h-4 w-4 text-streak" />,
              duration: 4000,
            })
          } else {
            toast.success(`Racha: ${currentStreak} dias seguidos`, {
              icon: <Flame className="h-4 w-4 text-streak" />,
              duration: 4000,
            })
          }
          // Refrescar Header con el nuevo numero
          router.refresh()
        } else if (previousStreak > 1 && currentStreak <= 1) {
          // La racha se rompio (estaba en >1 y al touch dio 1 porque hubo gap)
          toast.warning(
            `Tu racha de ${previousStreak} dias se rompio. Empezando de nuevo: 1 dia`,
            { icon: <Flame className="h-4 w-4 text-warning" />, duration: 6000 },
          )
          router.refresh()
        }
      } catch {
        // No bloquear UI si falla
      }
    })()
  }, [router])

  return null
}
