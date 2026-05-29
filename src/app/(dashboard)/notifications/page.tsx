import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Bell, Trophy, Flame, TrendingUp, Mail, AlertTriangle, Check } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { GlassCard } from '@/components/ui/glass-card'
import { SparklesText } from '@/components/ui/sparkles-text'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils/cn'
import { MarkAllReadButton } from '@/modules/notifications/components/MarkAllReadButton'
import { NotificationItem } from '@/modules/notifications/components/NotificationItem'

export const metadata: Metadata = { title: 'Notificaciones' }

export type NotificationType =
  | 'achievement_unlocked'
  | 'streak_warning'
  | 'streak_milestone'
  | 'level_up'
  | 'weekly_report'
  | 'exam_reminder'
  | 'system'

export type NotificationRow = {
  id: string
  type: NotificationType
  title: string
  body: string | null
  read_at: string | null
  action_link: string | null
  icon: string | null
  created_at: string | null
}

type Props = { searchParams: Promise<{ filter?: string }> }

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'unread', label: 'No leidas' },
  { key: 'achievement_unlocked', label: 'Logros' },
  { key: 'streak_milestone', label: 'Racha' },
  { key: 'level_up', label: 'Nivel' },
] as const

export default async function NotificationsPage({ searchParams }: Props) {
  const { filter = 'all' } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (filter === 'unread') {
    query = query.is('read_at', null)
  } else if (filter !== 'all' && FILTERS.some((f) => f.key === filter)) {
    query = query.eq('type', filter)
  }

  const { data } = await query
  const items = (data ?? []) as NotificationRow[]
  const unreadCount = items.filter((n) => !n.read_at).length

  return (
    <div className="relative">
      <AuroraBackground variant="subtle" className="absolute inset-0 -z-10">
        <div className="h-full w-full" />
      </AuroraBackground>

      <header className="mb-6 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-glass-border/40 bg-glass-bg/40 px-3 py-1 text-xs font-medium text-aurora-2 backdrop-blur-md">
          <Bell className="h-3 w-3" />
          Centro de notificaciones
        </div>
        <h1 className="text-display-md md:text-display-lg">
          <SparklesText className="text-aurora">Notificaciones</SparklesText>
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Historial de eventos importantes: logros desbloqueados, hitos de racha, subidas de nivel y mas.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f.key}
              href={`/notifications?filter=${f.key}`}
              className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors backdrop-blur-md',
                filter === f.key
                  ? 'border-aurora-2/60 bg-aurora-2/15 text-aurora-2'
                  : 'border-glass-border/40 bg-glass-bg/40 text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
            </Link>
          ))}
        </div>
        {unreadCount > 0 ? <MarkAllReadButton /> : null}
      </div>

      <GlassCard variant="elevated" padding="lg">
        {items.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <Bell className="mx-auto mb-3 h-8 w-8 opacity-40" />
            <p className="text-sm">
              {filter === 'unread'
                ? 'No tienes notificaciones sin leer.'
                : 'Aun no tienes notificaciones.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  )
}

export function iconForType(type: NotificationType) {
  switch (type) {
    case 'achievement_unlocked':
      return Trophy
    case 'streak_warning':
      return AlertTriangle
    case 'streak_milestone':
      return Flame
    case 'level_up':
      return TrendingUp
    case 'weekly_report':
      return Mail
    case 'exam_reminder':
      return Bell
    default:
      return Check
  }
}
