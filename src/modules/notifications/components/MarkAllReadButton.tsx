'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCheck } from 'lucide-react'
import { markAllNotificationsAsRead } from '@/modules/notifications/actions'

export function MarkAllReadButton() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      const res = await markAllNotificationsAsRead()
      if (!res.success) {
        toast.error(res.error)
        return
      }
      toast.success('Todas marcadas como leidas')
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-full border border-glass-border/40 bg-glass-bg/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md transition-colors hover:text-aurora-2 disabled:opacity-50"
    >
      <CheckCheck className="h-3.5 w-3.5" />
      Marcar todas como leidas
    </button>
  )
}
