import Link from 'next/link'
import { Zap, LogOut } from 'lucide-react'
import { signOut } from '@/modules/auth/actions'
import { MagicButton } from '@/components/ui/magic-button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { StreakFireAnimation } from '@/modules/gamification/components/StreakFireAnimation'
import { streakToIntensity } from '@/modules/gamification/lib/streak-intensity'
import { NotificationBell } from '@/modules/notifications/components/NotificationBell'

type HeaderProps = {
  fullName: string | null
  email: string
  xpTotal: number
  level: number
  streakCurrent: number
}

function getInitials(name: string | null, fallback: string): string {
  const source = (name?.trim() || fallback).toUpperCase()
  const parts = source.split(/\s+/)
  if (parts.length === 1) return parts[0]!.slice(0, 2)
  return (parts[0]![0] ?? '') + (parts[1]![0] ?? '')
}

export async function Header({ fullName, email, xpTotal, level, streakCurrent }: HeaderProps) {
  const initials = getInitials(fullName, email)

  return (
    <header className="sticky top-0 z-40 border-b border-bg-border/40 bg-background/60 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-3 md:px-6">
        {/* Logo solo mobile */}
        <Link href="/dashboard" className="font-bold md:hidden">
          <span className="text-aurora">EGEL</span>
          <span>Pro</span>
        </Link>

        <TooltipProvider delayDuration={200}>
          <div className="ml-auto flex items-center gap-1 md:gap-3">
            {/* Racha */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="glass flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs md:gap-1.5 md:px-2 md:py-1 md:text-sm">
                  <StreakFireAnimation
                    intensity={streakToIntensity(streakCurrent)}
                    size="sm"
                  />
                  <AnimatedCounter value={streakCurrent} className="font-semibold text-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Racha actual: {streakCurrent} dia{streakCurrent === 1 ? '' : 's'}
              </TooltipContent>
            </Tooltip>

            {/* XP + Nivel */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="glass flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs md:gap-1.5 md:px-3 md:py-1.5 md:text-sm">
                  <Zap className="h-3.5 w-3.5 text-xp md:h-4 md:w-4" fill="currentColor" />
                  <AnimatedCounter value={xpTotal} className="font-semibold text-foreground" />
                  <span className="hidden text-xs text-muted-foreground md:inline">·</span>
                  <span className="hidden text-xs text-muted-foreground md:inline">Nv {level}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Nivel {level} · {xpTotal.toLocaleString('es-MX')} XP totales
              </TooltipContent>
            </Tooltip>

            <NotificationBell />

            <ThemeToggle size="md" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/profile"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-bg-raised text-xs font-bold text-foreground transition-transform hover:scale-105 md:h-10 md:w-10 md:text-sm"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, hsl(var(--aurora-1) / 0.2), hsl(var(--aurora-2) / 0.2), hsl(var(--aurora-3) / 0.2))',
                  }}
                >
                  {/* Borde aurora gradient */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full p-[1px]"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--aurora-1)), hsl(var(--aurora-2)) 50%, hsl(var(--aurora-3)))',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                  />
                  <span className="relative">{initials}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>{fullName || email}</TooltipContent>
            </Tooltip>

            <form action={signOut}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MagicButton
                    type="submit"
                    variant="ghost"
                    size="sm"
                    aria-label="Cerrar sesion"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Salir</span>
                  </MagicButton>
                </TooltipTrigger>
                <TooltipContent>Cerrar sesion</TooltipContent>
              </Tooltip>
            </form>
          </div>
        </TooltipProvider>
      </div>
    </header>
  )
}
