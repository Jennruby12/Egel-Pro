/**
 * Razones de feedback de CALIDAD de una pregunta (distinto de reportar errores).
 * El usuario marca como percibe la pregunta; el agregado nos ayuda a detectar
 * preguntas flojas o a revisar. Mantener sincronizado con el CHECK de la
 * migracion 031_question_feedback.sql y el enum de Zod.
 */
export const QUESTION_FEEDBACK_REASONS = [
  'respuestas_obvias',
  'muy_facil',
  'confusa',
  'mal_redactada',
  'desactualizada',
] as const

export type QuestionFeedbackReason = (typeof QUESTION_FEEDBACK_REASONS)[number]

export const FEEDBACK_REASON_LABELS: Record<QuestionFeedbackReason, string> = {
  respuestas_obvias: 'Respuestas muy obvias',
  muy_facil: 'Muy facil',
  confusa: 'Confusa o ambigua',
  mal_redactada: 'Mal redactada',
  desactualizada: 'Desactualizada',
}

export const FEEDBACK_REASON_DESCRIPTIONS: Record<QuestionFeedbackReason, string> = {
  respuestas_obvias: 'La correcta se nota a leguas frente a las otras opciones',
  muy_facil: 'Demasiado sencilla para el nivel del EGEL',
  confusa: 'Mas de una respuesta parece valida o el enunciado no es claro',
  mal_redactada: 'Tiene errores de redaccion, ortografia o formato',
  desactualizada: 'El contenido ya no es vigente',
}
