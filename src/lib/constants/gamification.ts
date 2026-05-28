/**
 * Constantes del sistema de gamificacion de EGELPro
 */

export const XP_VALUES = {
  practice:       10, // por respuesta correcta en modo practica
  quick_exam:     15, // por respuesta correcta en examen rapido
  full_simulacro: 20, // por respuesta correcta en simulacro completo
  review:         12, // por respuesta correcta en repaso de errores
  flashcards:      8, // por flashcard completada
  read_guide:      5, // por guia de estudio marcada como leida
  daily_challenge: 5, // bonus por completar el reto diario
} as const

export const XP_MULTIPLIERS = {
  streak_active: 1.2, // +20% si tiene racha activa
  perfect_score: 1.5, // +50% si score es 100% (solo aplica si correctas === total)
} as const

export const LEVELS = [
  { level: 1, name: 'Aspirante',      minXP: 0,      maxXP: 199,   color: '#64748b' },
  { level: 2, name: 'Estudiante',     minXP: 200,    maxXP: 599,   color: '#38bdf8' },
  { level: 3, name: 'Practicante',    minXP: 600,    maxXP: 1499,  color: '#34d399' },
  { level: 4, name: 'Avanzado',       minXP: 1500,   maxXP: 3499,  color: '#a78bfa' },
  { level: 5, name: 'Experto',        minXP: 3500,   maxXP: 6999,  color: '#fbbf24' },
  { level: 6, name: 'Maestro',        minXP: 7000,   maxXP: 14999, color: '#f97316' },
  { level: 7, name: 'Sobresaliente',  minXP: 15000,  maxXP: Infinity, color: '#10b981' },
] as const

export type LevelName = typeof LEVELS[number]['name']

export function getLevelFromXP(xp: number) {
  const level = [...LEVELS].reverse().find(l => xp >= l.minXP)
  return level ?? LEVELS[0]
}

export function getLevelProgress(xp: number) {
  const current = getLevelFromXP(xp)
  const nextLevel = LEVELS.find(l => l.level === current.level + 1)
  if (!nextLevel) return { current, next: null, percent: 100, xpInLevel: 0, xpNeeded: 0 }
  const xpInLevel = xp - current.minXP
  const xpNeeded = nextLevel.minXP - current.minXP
  return {
    current,
    next: nextLevel,
    percent: Math.round((xpInLevel / xpNeeded) * 100),
    xpInLevel,
    xpNeeded,
  }
}

export function calculateXP({
  mode,
  correct,
  total,
  streakActive = false,
}: {
  mode: keyof typeof XP_VALUES
  correct: number
  total: number
  streakActive?: boolean
}): number {
  const base = XP_VALUES[mode] * correct
  let multiplier = 1
  if (streakActive) multiplier *= XP_MULTIPLIERS.streak_active
  if (correct === total && total > 0) multiplier *= XP_MULTIPLIERS.perfect_score
  return Math.round(base * multiplier)
}

export const ACHIEVEMENTS_CATALOG = [
  { type: 'first_quiz',         title: 'Primer Paso',          description: 'Completa tu primer quiz',                    icon: '🎯', phase: 'mvp' },
  { type: 'streak_3',           title: 'Empezando Bien',        description: '3 dias seguidos estudiando',                 icon: '🔥', phase: 'mvp' },
  { type: 'streak_7',           title: 'Racha Encendida',       description: '7 dias seguidos estudiando',                 icon: '🔥', phase: 'mvp' },
  { type: 'streak_14',          title: 'Consistente',           description: '14 dias seguidos',                           icon: '💪', phase: 'mvp' },
  { type: 'streak_30',          title: 'Imparable',             description: '30 dias seguidos',                           icon: '💎', phase: 'mvp' },
  { type: 'streak_100',         title: 'Volcan',                description: '100 dias seguidos',                          icon: '🌋', phase: 'v2'  },
  { type: 'area1_mastered',     title: 'Analista Pro',          description: '90%+ precision en Area 1 (Analisis)',        icon: '⭐', phase: 'mvp' },
  { type: 'area2_mastered',     title: 'Arquitecto',            description: '90%+ precision en Area 2 (Diseno)',          icon: '⭐', phase: 'mvp' },
  { type: 'area3_mastered',     title: 'Desarrollador',         description: '90%+ precision en Area 3 (Desarrollo)',      icon: '⭐', phase: 'mvp' },
  { type: 'area4_mastered',     title: 'Project Manager',       description: '90%+ precision en Area 4 (Gestion)',         icon: '⭐', phase: 'mvp' },
  { type: 'all_areas_mastered', title: 'Maestro EGEL',          description: '90%+ precision en las 4 areas',              icon: '🌟', phase: 'mvp' },
  { type: 'simulacro_complete', title: 'Simulacro Completo',    description: 'Termina un simulacro de 203 reactivos',      icon: '🎓', phase: 'mvp' },
  { type: 'speed_quiz',         title: 'Velocista',             description: 'Termina un quick quiz en menos de 10 min',   icon: '⚡', phase: 'mvp' },
  { type: 'perfect_score',      title: 'Perfecto',              description: 'Score 100% en un quiz de 20+ preguntas',     icon: '💯', phase: 'mvp' },
  { type: 'questions_100',      title: 'Cien Reactivos',        description: '100 preguntas respondidas en total',         icon: '📊', phase: 'mvp' },
  { type: 'questions_500',      title: 'Quinientos',            description: '500 preguntas respondidas en total',         icon: '📈', phase: 'mvp' },
  { type: 'questions_1000',     title: 'Cerebro de Hierro',     description: '1,000 preguntas respondidas en total',       icon: '🧠', phase: 'mvp' },
  { type: 'sobresaliente_sim',  title: 'Sobresaliente',         description: 'Nivel Sobresaliente estimado en simulacro',  icon: '🚀', phase: 'mvp' },
  { type: 'all_guides_read',    title: 'Lector Voraz',          description: 'Lee todas las guias de estudio',             icon: '📚', phase: 'v2'  },
  { type: 'night_owl',          title: 'Estudioso Nocturno',    description: '10 quizzes entre 10pm y 2am',                icon: '🌙', phase: 'v2'  },
  { type: 'perseverant',        title: 'Perseverante',          description: 'Repite el mismo quiz hasta sacar 100%',      icon: '🔄', phase: 'mvp' },
  { type: 'secret_1',           title: '???',                   description: 'Condicion oculta — descubrela',              icon: '🤫', phase: 'v2'  },
] as const

export type AchievementType = typeof ACHIEVEMENTS_CATALOG[number]['type']
