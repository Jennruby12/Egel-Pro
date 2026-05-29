'use server'

import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import WelcomeEmail from '../../../emails/welcome'
import StreakWarningEmail from '../../../emails/streak-warning'
import WeeklyReportEmail from '../../../emails/weekly-report'
import ExamReminderEmail from '../../../emails/exam-reminder'

const FROM = 'EGELPro <noreply@egelpro.app>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://egelpro.app'

type ActionResult = { success: true } | { success: false; error: string }

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

async function logEmail(userId: string | null, type: string, status: 'sent' | 'failed' | 'bounced') {
  // Usamos el admin client porque el envio puede dispararse desde cron o webhooks
  // donde no hay sesion del usuario
  const supabase = createAdminClient()
  await supabase.from('email_logs').insert({ user_id: userId, type, status })
}

// =====================================================
// WELCOME EMAIL
// =====================================================
export async function sendWelcomeEmail(input: {
  userId: string
  email: string
  fullName: string
}): Promise<ActionResult> {
  const resend = getResend()
  if (!resend) {
    // Soft-fail en dev sin Resend key configurada
    return { success: false, error: 'RESEND_API_KEY no configurada' }
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: input.email,
      subject: 'Bienvenido a EGELPro!',
      react: WelcomeEmail({ fullName: input.fullName, appUrl: APP_URL }),
    })
    await logEmail(input.userId, 'welcome', 'sent')
    return { success: true }
  } catch (e) {
    await logEmail(input.userId, 'welcome', 'failed')
    return { success: false, error: e instanceof Error ? e.message : 'Error enviando email' }
  }
}

// =====================================================
// STREAK WARNING
// =====================================================
export async function sendStreakWarning(input: {
  userId: string
  email: string
  fullName: string
  streakDays: number
}): Promise<ActionResult> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'RESEND_API_KEY no configurada' }

  try {
    await resend.emails.send({
      from: FROM,
      to: input.email,
      subject: `🔥 Tu racha de ${input.streakDays} dias esta en riesgo`,
      react: StreakWarningEmail({ fullName: input.fullName, streakDays: input.streakDays, appUrl: APP_URL }),
    })
    await logEmail(input.userId, 'streak_warning', 'sent')
    return { success: true }
  } catch (e) {
    await logEmail(input.userId, 'streak_warning', 'failed')
    return { success: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

// =====================================================
// WEEKLY REPORT
// =====================================================
export async function sendWeeklyReport(input: {
  userId: string
  email: string
  fullName: string
  xpEarned: number
  questionsAnswered: number
  averageAccuracy: number
  currentStreak: number
}): Promise<ActionResult> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'RESEND_API_KEY no configurada' }

  try {
    await resend.emails.send({
      from: FROM,
      to: input.email,
      subject: '📊 Tu resumen semanal de EGELPro',
      react: WeeklyReportEmail({
        fullName: input.fullName,
        xpEarned: input.xpEarned,
        questionsAnswered: input.questionsAnswered,
        averageAccuracy: input.averageAccuracy,
        currentStreak: input.currentStreak,
        appUrl: APP_URL,
      }),
    })
    await logEmail(input.userId, 'weekly_report', 'sent')
    return { success: true }
  } catch (e) {
    await logEmail(input.userId, 'weekly_report', 'failed')
    return { success: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

// =====================================================
// EXAM REMINDER
// =====================================================
export async function sendExamReminder(input: {
  userId: string
  email: string
  fullName: string
  daysToExam: number
  estimatedLevel: 'ans' | 'satisfactorio' | 'sobresaliente'
}): Promise<ActionResult> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'RESEND_API_KEY no configurada' }

  try {
    await resend.emails.send({
      from: FROM,
      to: input.email,
      subject: `⏰ Faltan ${input.daysToExam} dias para tu EGEL`,
      react: ExamReminderEmail({
        fullName: input.fullName,
        daysToExam: input.daysToExam,
        estimatedLevel: input.estimatedLevel,
        appUrl: APP_URL,
      }),
    })
    await logEmail(input.userId, 'exam_reminder', 'sent')
    return { success: true }
  } catch (e) {
    await logEmail(input.userId, 'exam_reminder', 'failed')
    return { success: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

// =====================================================
// IN-APP NOTIFICATIONS
// =====================================================

export async function markNotificationAsRead(
  notificationId: string,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('user_id', user.id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/notifications')
  return { success: true }
}

export async function markAllNotificationsAsRead(): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .is('read_at', null)
  if (error) return { success: false, error: error.message }
  revalidatePath('/notifications')
  return { success: true }
}

export async function deleteNotification(
  notificationId: string,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)
    .eq('user_id', user.id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/notifications')
  return { success: true }
}

export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .is('read_at', null)
  return count ?? 0
}
