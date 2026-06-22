import type { OfflineQuestion } from '@/modules/quiz/offline-content-actions'
import type { CorrectAnswer } from '@/types/global'
import { shuffle } from './shuffle'

export type OfflineQuizConfig = {
  total: number
  /** Areas disciplinares a incluir (vacio = todo el banco). */
  areas?: number[]
}

/** Arma un quiz offline desde el banco local (IndexedDB). */
export function buildOfflineQuiz(
  bank: OfflineQuestion[],
  cfg: OfflineQuizConfig,
): OfflineQuestion[] {
  let pool = bank
  if (cfg.areas && cfg.areas.length > 0) {
    const filtered = bank.filter(
      (q) => q.section === 'disciplinar' && cfg.areas!.includes(q.area),
    )
    if (filtered.length > 0) pool = filtered
  }
  const n = Math.max(1, Math.min(cfg.total, pool.length))
  return shuffle(pool).slice(0, n)
}

export type OfflineResult = {
  total: number
  correct: number
  wrong: number
  skipped: number
  scorePercent: number
}

export function scoreOfflineQuiz(
  questions: OfflineQuestion[],
  answers: Record<string, CorrectAnswer | null>,
): OfflineResult {
  let correct = 0
  let wrong = 0
  let skipped = 0
  for (const q of questions) {
    const a = answers[q.id] ?? null
    if (a === null) skipped++
    else if (a === q.correct_answer) correct++
    else wrong++
  }
  const answered = correct + wrong
  const scorePercent = answered > 0 ? Math.round((correct / answered) * 100) : 0
  return { total: questions.length, correct, wrong, skipped, scorePercent }
}
