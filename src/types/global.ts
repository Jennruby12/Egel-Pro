/**
 * Types globales de EGELPro
 */

export type ServerActionResult<T = unknown> =
  | { success: true; data: T }
  | { error: string; details?: unknown }

export type Role = 'student' | 'teacher' | 'admin'
export type OrgRole = 'member' | 'manager' | 'owner'
export type Plan = 'free' | 'pro' | 'pro_lifetime'
export type Section = 'disciplinar' | 'transversal'
export type QuizMode = 'practice' | 'quick_exam' | 'full_simulacro' | 'review' | 'speed_challenge' | 'daily_challenge'
export type QuizStatus = 'in_progress' | 'completed' | 'abandoned'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type MasteryLevel = 'untouched' | 'learning' | 'familiar' | 'mastered'
export type PerformanceLevel = 'ans' | 'satisfactorio' | 'sobresaliente'
export type QuestionType = 'single' | 'multireactivo'
export type CorrectAnswer = 'a' | 'b' | 'c'
