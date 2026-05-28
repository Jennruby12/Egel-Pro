/**
 * Datos oficiales del EGEL Plus ISOFT
 * Fuente: Guia del Sustentante CENEVAL, octubre 2025
 * NO modificar estos valores. Son los datos reales del examen.
 */

export const EXAM_CONFIG = {
  totalQuestions: 203,
  disciplinarQuestions: 143,
  transversalQuestions: 60,
  sessions: 2,
  sessionDurationSeconds: 16200, // 4.5 horas = 16,200 segundos
  pilotPercentage: 0.15,         // 15% reactivos piloto (no cuentan)
  optionsPerQuestion: 3,         // Siempre A, B, C
} as const

export const PERFORMANCE_THRESHOLDS = {
  ans:           { min: 0,  max: 59  },
  satisfactorio: { min: 60, max: 79  },
  sobresaliente: { min: 80, max: 100 },
} as const

export type PerformanceLevel = 'ans' | 'satisfactorio' | 'sobresaliente'

export function getPerformanceLevel(percent: number): PerformanceLevel {
  if (percent >= 80) return 'sobresaliente'
  if (percent >= 60) return 'satisfactorio'
  return 'ans'
}

export const DISCIPLINAR_AREAS = [
  {
    area: 1,
    section: 'disciplinar' as const,
    name: 'Analisis de Sistemas de Software',
    totalQuestions: 31,
    color: '#38bdf8',
    colorClass: 'area1',
    subareas: [
      { subarea: 1, name: 'Tipos de requerimientos', questions: 12 },
      { subarea: 2, name: 'Tecnicas y herramientas para obtencion, analisis, priorizacion y validacion de requerimientos', questions: 9 },
      { subarea: 3, name: 'Tecnicas y herramientas de documentacion de requerimientos', questions: 10 },
    ],
  },
  {
    area: 2,
    section: 'disciplinar' as const,
    name: 'Diseno de Sistemas de Software',
    totalQuestions: 33,
    color: '#a78bfa',
    colorClass: 'area2',
    subareas: [
      { subarea: 1, name: 'Diseno arquitectonico de software', questions: 10 },
      { subarea: 2, name: 'Diseno de modulos, componentes y de datos de software', questions: 16 },
      { subarea: 3, name: 'Diseno de interfaces', questions: 7 },
    ],
  },
  {
    area: 3,
    section: 'disciplinar' as const,
    name: 'Desarrollo de Sistemas de Software',
    totalQuestions: 49,
    color: '#34d399',
    colorClass: 'area3',
    subareas: [
      { subarea: 1, name: 'Lenguajes de desarrollo de software', questions: 10 },
      { subarea: 2, name: 'Paradigmas de programacion', questions: 10 },
      { subarea: 3, name: 'Entornos de desarrollo', questions: 10 },
      { subarea: 4, name: 'Gestion de datos', questions: 9 },
      { subarea: 5, name: 'Plataformas de desarrollo', questions: 10 },
    ],
  },
  {
    area: 4,
    section: 'disciplinar' as const,
    name: 'Gestion de Proyectos de Software',
    totalQuestions: 30,
    color: '#fbbf24',
    colorClass: 'area4',
    subareas: [
      { subarea: 1, name: 'Gestion de tiempos, costos, recursos humanos y de riesgo', questions: 8 },
      { subarea: 2, name: 'Calidad de software', questions: 10 },
      { subarea: 3, name: 'Metodologias de desarrollo', questions: 12 },
    ],
  },
] as const

export const TRANSVERSAL_AREAS = [
  {
    area: 1,
    section: 'transversal' as const,
    name: 'Comprension Lectora',
    totalQuestions: 30,
    subareas: [
      { subarea: 1, name: 'Ambito de estudio', questions: 12 },
      { subarea: 2, name: 'Ambito literario', questions: 12 },
      { subarea: 3, name: 'Ambito de participacion social', questions: 6 },
    ],
  },
  {
    area: 2,
    section: 'transversal' as const,
    name: 'Redaccion Indirecta',
    totalQuestions: 30,
    subareas: [
      { subarea: 1, name: 'Ambito de estudio', questions: 15 },
      { subarea: 2, name: 'Ambito de participacion social', questions: 15 },
    ],
  },
] as const

export const ALL_AREAS = [...DISCIPLINAR_AREAS, ...TRANSVERSAL_AREAS]

export type DisciplinarArea = typeof DISCIPLINAR_AREAS[number]
export type TransversalArea = typeof TRANSVERSAL_AREAS[number]

export function getAreaById(areaId: number, section: 'disciplinar' | 'transversal' = 'disciplinar') {
  if (section === 'transversal') {
    return TRANSVERSAL_AREAS.find(a => a.area === areaId)
  }
  return DISCIPLINAR_AREAS.find(a => a.area === areaId)
}

export function getSubareaById(areaId: number, subareaId: number, section: 'disciplinar' | 'transversal' = 'disciplinar') {
  const area = getAreaById(areaId, section)
  return area?.subareas.find(s => s.subarea === subareaId)
}
