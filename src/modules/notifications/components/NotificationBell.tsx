import Link from 'next/link'
import { Bell } from 'lucide-react'
import { getUnreadNotificationCount } from '@/modules/notifications/actions'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

/**
 * Server Component: icono campana en Header con badge de unread count.
 * Click → /notifications.
 */
export async function NotificationBell() {
  const unread = await getUnreadNotificationCount()
  const display = unread > 9 ? '9+' : String(unread)
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/notifications"
          className="glass relative flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-transform hover:scale-105"
          aria-label={unread > 0 ? `${unread} notificaciones sin leer` : 'Notificaciones'}
        >
          <Bell className="h-4 w-4" />
          {unread > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-aurora-2 px-1 text-[10px] font-bold leading-none text-white">
              {display}
            </span>
          ) : null}
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        {unread > 0 ? `${unread} sin leer` : 'Notificaciones'}
      </TooltipContent>
    </Tooltip>
  )
}
