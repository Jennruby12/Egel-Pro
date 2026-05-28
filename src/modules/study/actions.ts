'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  createGuideSchema,
  updateGuideSchema,
  deleteGuideSchema,
  togglePublishGuideSchema,
  submitFlashcardReviewSchema,
  type CreateGuideInput,
  type UpdateGuideInput,
  type DeleteGuideInput,
  type TogglePublishGuideInput,
  type SubmitFlashcardReviewInput,
} from '@/lib/validations/guide.schema'
import {
  calculateNextReview,
  DEFAULT_EASE_FACTOR,
  type ReviewQuality,
} from '@/modules/quiz/lib/spaced-repetition'
import type { Tables } from '@/types/database'

type Guide = Tables<'study_guides'>
type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

const ERROR_MESSAGES = {
  notAuth: 'Necesitas iniciar sesion',
  notAdmin: 'Solo administradores pueden gestionar guias',
  notFound: 'Guia no encontrada',
}

// Helper interno: verifica que el usuario actual sea admin
async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, error: ERROR_MESSAGES.notAuth }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return { supabase, user, error: ERROR_MESSAGES.notAdmin }
  }
  return { supabase, user, error: null as string | null }
}

// Revalida las rutas afectadas por una mutacion sobre una guia.
function revalidateGuidePaths(area?: number, subarea?: number) {
  revalidatePath('/study')
  revalidatePath('/admin/guides')
  if (area !== undefined && subarea !== undefined) {
    revalidatePath(`/study/${area}/${subarea}`)
  }
}

// =====================================================
// CREATE GUIDE
// =====================================================
export async function createGuide(input: CreateGuideInput): Promise<ActionResult<Guide>> {
  const parsed = createGuideSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  }
  const data = parsed.data

  const { supabase, user, error: authError } = await requireAdmin()
  if (authError || !user) return { success: false, error: authError ?? ERROR_MESSAGES.notAuth }

  const { data: guide, error } = await supabase
    .from('study_guides')
    .insert({
      section: data.section,
      area: data.area,
      subarea: data.subarea,
      title: data.title,
      content: data.content,
      summary: data.summary || null,
      ceneval_tips: data.ceneval_tips || null,
      reading_time_minutes: data.reading_time_minutes,
      is_published: data.is_published,
      created_by: user.id,
    })
    .select('*')
    .single()

  if (error || !guide) {
    return { success: false, error: `Error al crear guia: ${error?.message ?? 'desconocido'}` }
  }

  revalidateGuidePaths(guide.area, guide.subarea)
  return { success: true, data: guide }
}

// =====================================================
// UPDATE GUIDE
// =====================================================
export async function updateGuide(
  id: string,
  input: UpdateGuideInput,
): Promise<ActionResult<Guide>> {
  if (!id || typeof id !== 'string') {
    return { success: false, error: 'ID invalido' }
  }
  const parsed = updateGuideSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  }
  const data = parsed.data

  const { supabase, error: authError } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const { data: guide, error } = await supabase
    .from('study_guides')
    .update({
      section: data.section,
      area: data.area,
      subarea: data.subarea,
      title: data.title,
      content: data.content,
      summary: data.summary || null,
      ceneval_tips: data.ceneval_tips || null,
      reading_time_minutes: data.reading_time_minutes,
      is_published: data.is_published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error || !guide) {
    return { success: false, error: `Error al actualizar guia: ${error?.message ?? 'desconocido'}` }
  }

  revalidateGuidePaths(guide.area, guide.subarea)
  return { success: true, data: guide }
}

// =====================================================
// DELETE GUIDE (soft delete)
// =====================================================
export async function deleteGuide(
  input: DeleteGuideInput,
): Promise<ActionResult<{ id: string }>> {
  const parsed = deleteGuideSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  }

  const { supabase, error: authError } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  // Soft delete: marcar is_deleted=true para preservar historial.
  const { data: guide, error } = await supabase
    .from('study_guides')
    .update({ is_deleted: true, is_published: false, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.id)
    .select('area, subarea')
    .single()

  if (error) {
    return { success: false, error: `Error al eliminar guia: ${error.message}` }
  }

  revalidateGuidePaths(guide?.area, guide?.subarea)
  return { success: true, data: { id: parsed.data.id } }
}

// =====================================================
// TOGGLE PUBLISH
// =====================================================
export async function togglePublishGuide(
  input: TogglePublishGuideInput,
): Promise<ActionResult<{ id: string; isPublished: boolean }>> {
  const parsed = togglePublishGuideSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  }

  const { supabase, error: authError } = await requireAdmin()
  if (authError) return { success: false, error: authError }

  const { data: guide, error } = await supabase
    .from('study_guides')
    .update({
      is_published: parsed.data.isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.id)
    .select('area, subarea')
    .single()

  if (error) {
    return { success: false, error: `Error al actualizar publicacion: ${error.message}` }
  }

  revalidateGuidePaths(guide?.area, guide?.subarea)
  return { success: true, data: { id: parsed.data.id, isPublished: parsed.data.isPublished } }
}

// =====================================================
// FLASHCARDS — Review (spaced repetition SM-2)
// =====================================================
export async function submitFlashcardReview(
  input: SubmitFlashcardReviewInput,
): Promise<
  ActionResult<{ nextReviewISO: string; easeFactor: number; interval: number }>
> {
  const parsed = submitFlashcardReviewSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos invalidos' }
  }
  const { flashcardId, quality } = parsed.data

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: ERROR_MESSAGES.notAuth }

  // Validar que la flashcard exista y este activa para evitar progresos huerfanos.
  const { data: flashcard, error: cardError } = await supabase
    .from('flashcards')
    .select('id, area, subarea, is_active')
    .eq('id', flashcardId)
    .single()
  if (cardError || !flashcard || flashcard.is_active === false) {
    return { success: false, error: 'Flashcard no encontrada' }
  }

  // Cargar progreso previo (puede no existir si es la primera vez).
  const { data: prev } = await supabase
    .from('user_flashcard_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('flashcard_id', flashcardId)
    .maybeSingle()

  // Derivar repetitions a partir del historial. Ver nota de diseno en
  // spaced-repetition.ts. Si quality < 3 el algoritmo lo reseteara igualmente.
  const prevSeen = prev?.times_seen ?? 0
  const prevCorrect = prev?.times_correct ?? 0
  const prevWrong = Math.max(0, prevSeen - prevCorrect)
  const prevRepetitions = quality >= 3 ? Math.max(0, prevCorrect - prevWrong) : 0
  const prevEase = prev?.ease_factor ?? DEFAULT_EASE_FACTOR
  // Calcular intervalo previo aproximado a partir de las fechas almacenadas.
  const prevInterval = calculatePrevInterval(prev?.last_seen, prev?.next_review)

  const sm2 = calculateNextReview({
    quality: quality as ReviewQuality,
    easeFactor: prevEase,
    interval: prevInterval,
    repetitions: prevRepetitions,
  })

  const isCorrect = quality >= 3
  const newSeen = prevSeen + 1
  const newCorrect = prevCorrect + (isCorrect ? 1 : 0)
  const nowISO = new Date().toISOString()

  const { error: upsertError } = await supabase
    .from('user_flashcard_progress')
    .upsert(
      {
        user_id: user.id,
        flashcard_id: flashcardId,
        times_seen: newSeen,
        times_correct: newCorrect,
        ease_factor: sm2.easeFactor,
        last_seen: nowISO,
        next_review: sm2.nextReviewISO,
      },
      { onConflict: 'user_id,flashcard_id' },
    )

  if (upsertError) {
    return { success: false, error: `Error al guardar progreso: ${upsertError.message}` }
  }

  revalidatePath(`/study/${flashcard.area}/${flashcard.subarea}/flashcards`)
  return {
    success: true,
    data: {
      nextReviewISO: sm2.nextReviewISO,
      easeFactor: sm2.easeFactor,
      interval: sm2.interval,
    },
  }
}

// Estima el intervalo previo (en dias) entre last_seen y next_review.
// Si falta data, devuelve 0 (que el algoritmo trata como primera vez).
function calculatePrevInterval(
  lastSeen: string | null | undefined,
  nextReview: string | null | undefined,
): number {
  if (!lastSeen || !nextReview) return 0
  const last = Date.parse(lastSeen)
  const next = Date.parse(nextReview)
  if (Number.isNaN(last) || Number.isNaN(next)) return 0
  const diffDays = Math.round((next - last) / (24 * 60 * 60 * 1000))
  return Math.max(0, diffDays)
}
