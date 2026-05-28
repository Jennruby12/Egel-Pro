import Link from 'next/link'
import { Zap } from 'lucide-react'
import { signOut } from '@/modules/auth/actions'
import { MagicButton } from '@/components/ui/magic-button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { StreakFireAnimation } from '@/modules/gamification/components/StreakFireAnimation'
import { streakToIntensity } from '@/modules/gamification/lib/streak-intensity'

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

export function Header({ fullName, email, xpTotal, level, streakCurrent }: HeaderProps) {
  const initials = getInitials(fullName, email)

  return (
    <header className="sticky top-0 z-40 border-b border-bg-border/40 bg-background/60 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo solo mobile */}
        <Link href="/dashboard" className="font-bold md:hidden">
          <span className="text-aurora">EGEL</span>
          <span>Pro</span>
        </Link>

        <TooltipProvider delayDuration={200}>
          <div className="ml-auto flex items-center gap-2 md:gap-3">
            {/* Racha */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="glass flex items-center gap-1.5 rounded-full px-2 py-1 text-sm">
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
                <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm">
                  <Zap className="h-4 w-4 text-xp" fill="currentColor" />
                  <AnimatedCounter value={xpTotal} className="font-semibold text-foreground" />
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">Nv {level}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Nivel {level} · {xpTotal.toLocaleString('es-MX')} XP totales
              </TooltipContent>
            </Tooltip>

            <ThemeToggle size="md" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/profile"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-bg-raised text-sm font-bold text-foreground transition-transform hover:scale-105"
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
              <MagicButton type="submit" variant="ghost" size="sm" className="hidden sm:inline-flex">
                Salir
              </MagicButton>
            </form>
          </div>
        </TooltipProvider>
      </div>
    </header>
  )
}
