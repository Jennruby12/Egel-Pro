import { z } from 'zod'
import { QUESTION_FEEDBACK_REASONS } from '@/lib/constants/question-feedback'

export const toggleQuestionFeedbackSchema = z.object({
  questionId: z.string().uuid(),
  reason: z.enum(QUESTION_FEEDBACK_REASONS),
})

export type ToggleQuestionFeedbackInput = z.infer<typeof toggleQuestionFeedbackSchema>
