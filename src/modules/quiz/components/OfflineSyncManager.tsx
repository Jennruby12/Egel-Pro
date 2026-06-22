'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { readOfflineSessions, removeOfflineSession } from '@/lib/offline/offline-sessions'
import { getOfflineMeta, saveOfflineBundle } from '@/lib/offline/content-db'
import { syncOfflineSession } from '@/modules/quiz/offline-sync-actions'
import {
  getOfflineBankVersion,
  getOfflineQuestionBundle,
} from '@/modules/quiz/offline-content-actions'

/**
 * Corre al cargar la app y cada vez que vuelve la conexion:
 *  1. Sube las sesiones de quiz hechas offline (XP/progreso/racha autoritativos).
 *  2. Si hay banco descargado y cambio en el servidor (agregamos preguntas),
 *     lo re-descarga en segundo plano (auto-update).
 * No renderiza nada.
 */
export function OfflineSyncManager() {
  const running = useRef(false)

  useEffect(() => {
    async function sync() {
      if (running.current) return
      if (typeof navigator !== 'undefined' && !navigator.onLine) return
      running.current = true
      try {
        // 1. Subir sesiones offline pendientes
        const pending = readOfflineSessions()
        let synced = 0
        for (const s of pending) {
          const res = await syncOfflineSession({
            areas: s.areas,
            startedAt: s.startedAt,
            answers: s.answers.map((a) => ({
              questionId: a.questionId,
              userAnswer: a.userAnswer,
              timeSpentSeconds: a.timeSpentSeconds,
            })),
          })
          if (res.success) {
            removeOfflineSession(s.id)
            synced++
          }
        }
        if (synced > 0) {
          toast.success(`Sincronizado: ${synced} ${synced === 1 ? 'quiz' : 'quizzes'} que hiciste sin internet`)
        }

        // 2. Auto-update del banco si hay contenido descargado y cambio la version
        const meta = await getOfflineMeta()
        if (meta) {
          const ver = await getOfflineBankVersion()
          if (ver.success && ver.data.version !== meta.version) {
            const bundle = await getOfflineQuestionBundle()
            if (bundle.success) {
              await saveOfflineBundle(bundle.data)
              toast.success('Banco de preguntas actualizado para usar sin internet')
            }
          }
        }
      } catch {
        // Silencioso: la sincronizacion reintenta en el proximo evento online.
      } finally {
        running.current = false
      }
    }

    void sync()
    window.addEventListener('online', sync)
    return () => window.removeEventListener('online', sync)
  }, [])

  return null
}
