'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { Trophy, AlertTriangle, Flame, TrendingUp, Mail, Bell, Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  markNotificationAsRead,
  deleteNotification,
} from '@/modules/notifications/actions'
import { cn } from '@/lib/utils/cn'

type NotificationType =
  | 'achievement_unlocked'
  | 'streak_warning'
  | 'streak_milestone'
  | 'level_up'
  | 'weekly_report'
  | 'exam_reminder'
  | 'system'

type Props = {
  notification: {
    id: string
    type: string
    title: string
    body: string | null
    read_at: string | null
    action_link: string | null
    created_at: string | null
  }
}

const TYPE_META: Record<NotificationType, { icon: typeof Trophy; color: string; bg: string }> = {
  achievement_unlocked: { icon: Trophy, color: 'text-xp', bg: 'bg-xp/15' },
  streak_warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/15' },
  streak_milestone: { icon: Flame, color: 'text-streak', bg: 'bg-streak/15' },
  level_up: { icon: TrendingUp, color: 'text-aurora-2', bg: 'bg-aurora-2/15' },
  weekly_report: { icon: Mail, color: 'text-muted-foreground', bg: 'bg-bg-raised/60' },
  exam_reminder: { icon: Bell, color: 'text-aurora-3', bg: 'bg-aurora-3/15' },
  system: { icon: Check, color: 'text-muted-foreground', bg: 'bg-bg-raised/60' },
}

export function NotificationItem({ notification: n }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const isUnread = !n.read_at
  const meta = TYPE_META[n.type as NotificationType] ?? TYPE_META.system
  const Icon = meta.icon

  function handleClick() {
    if (isUnread) {
      startTransition(async () => {
        await markNotificationAsRead(n.id)
        router.refresh()
      })
    }
  }

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    startTransition(async () => {
      const res = await deleteNotification(n.id)
      if (!res.success) {
        toast.error(res.error)
        return
      }
      router.refresh()
    })
  }

  const content = (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-3 backdrop-blur-md transition-colors',
        isUnread
          ? 'border-aurora-2/40 bg-aurora-2/5 hover:bg-aurora-2/10'
          : 'border-glass-border/30 bg-glass-bg/40 hover:bg-glass-bg/60',
      )}
    >
      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', meta.bg)}>
        <Icon className={cn('h-4 w-4', meta.color)} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm', isUnread ? 'font-semibold' : 'font-medium')}>{n.title}</p>
          {isUnread ? (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-aurora-2" aria-label="No leida" />
          ) : null}
        </div>
        {n.body ? (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.body}</p>
        ) : null}
        {n.created_at ? (
          <p className="mt-1 text-[10px] text-muted-foreground/70">
            {formatRelative(new Date(n.created_at))}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        aria-label="Eliminar"
        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )

  return (
    <li>
      {n.action_link ? (
        <Link href={n.action_link} onClick={handleClick} className="block">
          {content}
        </Link>
      ) : (
        <button type="button" onClick={handleClick} className="block w-full text-left">
          {content}
        </button>
      )}
    </li>
  )
}

function formatRelative(d: Date): string {
  const diff = Date.now() - d.getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'hace un momento'
  if (min < 60) return `hace ${min} min`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `hace ${hr}h`
  const days = Math.floor(hr / 24)
  if (days < 7) return `hace ${days}d`
  return d.toLocaleDateString('es-MX')
}
