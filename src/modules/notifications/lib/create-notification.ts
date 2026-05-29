import { createAdminClient } from '@/lib/supabase/server'

export type NotificationType =
  | 'achievement_unlocked'
  | 'streak_warning'
  | 'streak_milestone'
  | 'level_up'
  | 'weekly_report'
  | 'exam_reminder'
  | 'system'

type CreateNotificationInput = {
  userId: string
  type: NotificationType
  title: string
  body?: string
  actionLink?: string
  icon?: string
}

/**
 * Inserta una notificacion in-app para el usuario. Usa admin client
 * (service_role) para bypassear RLS de insert. Server-only.
 *
 * Idempotencia: si ya existe una notificacion del mismo tipo + titulo
 * en los ultimos 5 min para el mismo user, NO duplica.
 */
export async function createNotification(input: CreateNotificationInput): Promise<void> {
  const supabase = createAdminClient()

  // De-dup: evitar spam si misma notif se dispara dos veces seguidas
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const { data: existing } = await supabase
    .from('notifications')
    .select('id')
    .eq('user_id', input.userId)
    .eq('type', input.type)
    .eq('title', input.title)
    .gte('created_at', fiveMinAgo)
    .limit(1)

  if (existing && existing.length > 0) return

  await supabase.from('notifications').insert({
    user_id: input.userId,
    type: input.type,
    title: input.title,
    body: input.body ?? null,
    action_link: input.actionLink ?? null,
    icon: input.icon ?? null,
  })
}
