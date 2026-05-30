'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Trophy, Flame, TrendingUp, Mail, Bell, AlertTriangle } from 'lucide-react'
import { updateNotificationPrefs } from '@/modules/auth/profile-actions'
import { cn } from '@/lib/utils/cn'

type PrefKey =
  | 'achievement_unlocked'
  | 'streak_warning'
  | 'streak_milestone'
  | 'level_up'
  | 'weekly_report'
  | 'exam_reminder'

type Props = {
  initial: Partial<Record<PrefKey, boolean>>
}

const ITEMS: Array<{ key: PrefKey; label: string; description: string; icon: typeof Trophy; color: string }> = [
  { key: 'achievement_unlocked', label: 'Logros desbloqueados', description: 'Cuando ganes un nuevo logro', icon: Trophy, color: 'text-xp' },
  { key: 'streak_milestone', label: 'Hitos de racha', description: 'Al llegar a 7, 14, 30, 60, 100 dias', icon: Flame, color: 'text-streak' },
  { key: 'streak_warning', label: 'Aviso de racha', description: 'Cuando tu racha esta por romperse', icon: AlertTriangle, color: 'text-warning' },
  { key: 'level_up', label: 'Subida de nivel', description: 'Al avanzar de nivel', icon: TrendingUp, color: 'text-aurora-2' },
  { key: 'weekly_report', label: 'Reporte semanal', description: 'Resumen de tu progreso cada lunes', icon: Mail, color: 'text-muted-foreground' },
  { key: 'exam_reminder', label: 'Recordatorio examen', description: 'Cuenta regresiva al EGEL', icon: Bell, color: 'text-aurora-3' },
]

export function NotificationPrefsForm({ initial }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [prefs, setPrefs] = useState<Record<PrefKey, boolean>>(() => {
    const base: Record<PrefKey, boolean> = {
      achievement_unlocked: true,
      streak_warning: true,
      streak_milestone: true,
      level_up: true,
      weekly_report: true,
      exam_reminder: true,
    }
    for (const k of Object.keys(initial) as PrefKey[]) {
      if (typeof initial[k] === 'boolean') base[k] = initial[k] as boolean
    }
    return base
  })

  function toggle(key: PrefKey) {
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    startTransition(async () => {
      const res = await updateNotificationPrefs({ [key]: next[key] })
      if (!res.success) {
        toast.error(res.error)
        setPrefs(prefs) // revert
        return
      }
      router.refresh()
    })
  }

  return (
    <ul className="space-y-2">
      {ITEMS.map((it) => {
        const on = prefs[it.key]
        const Icon = it.icon
        return (
          <li key={it.key}>
            <button
              type="button"
              onClick={() => toggle(it.key)}
              disabled={pending}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                on
                  ? 'border-aurora-2/40 bg-aurora-2/5 hover:bg-aurora-2/10'
                  : 'border-glass-border/30 bg-glass-bg/40 opacity-60 hover:opacity-80',
              )}
            >
              <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-raised/60', it.color)}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{it.label}</p>
                <p className="text-xs text-muted-foreground">{it.description}</p>
              </div>
              <span
                className={cn(
                  'relative h-6 w-11 shrink-0 rounded-full border transition-colors',
                  on ? 'border-aurora-2 bg-aurora-2/30' : 'border-bg-border bg-bg-raised',
                )}
                aria-hidden
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-foreground shadow-sm transition-transform',
                    on ? 'left-5' : 'left-0.5',
                  )}
                />
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
