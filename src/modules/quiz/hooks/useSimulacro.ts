'use client'

import { useEffect, useMemo } from 'react'
import { useQuizStore } from '@/modules/quiz/store/quiz-store'

/**
 * Hook que envuelve el quiz-store existente y agrega metadata propia del
 * simulacro: el simulacro_group_id (que vincula sesion 1 y sesion 2) y el
 * numero de sesion actual (1 o 2).
 *
 * Lo usa cualquier vista que renderice una sesion del simulacro para tener
 * a mano los IDs sin tener que pasarlos por props en cada componente.
 */
export function useSimulacro({
  sessionId,
  simulacroGroupId,
  sessionNumber,
  totalQuestions,
}: {
  sessionId: string
  simulacroGroupId: string
  sessionNumber: 1 | 2
  totalQuestions: number
}) {
  const init = useQuizStore((s) => s.init)
  const storeSessionId = useQuizStore((s) => s.sessionId)
  const currentIndex = useQuizStore((s) => s.currentIndex)
  const answers = useQuizStore((s) => s.answers)

  // Inicializar el store al cambiar la sesion (mismo patron que QuizCard)
  useEffect(() => {
    if (storeSessionId !== sessionId) {
      init(sessionId, totalQuestions)
    }
  }, [sessionId, totalQuestions, storeSessionId, init])

  return useMemo(
    () => ({
      sessionId,
      simulacroGroupId,
      sessionNumber,
      totalQuestions,
      currentIndex,
      answeredCount: Object.values(answers).filter((a) => a.userAnswer !== null).length,
      markedCount: Object.values(answers).filter((a) => a.isMarked).length,
    }),
    [sessionId, simulacroGroupId, sessionNumber, totalQuestions, currentIndex, answers],
  )
}
