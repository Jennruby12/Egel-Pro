'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Inbox,
  Sparkles,
  Trophy,
  BookOpen,
  Activity,
  TrendingDown,
} from 'lucide-react'
import { MagicButton } from '@/components/ui/magic-button'
import { cn } from '@/lib/utils/cn'

type EmptyStateAction =
  | { label: string; href: string; onClick?: never }
  | { label: string; onClick: () => void; href?: never }

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description?: string
  action?: EmptyStateAction
  /** Tamano del bloque. Default 'md' */
  size?: 'sm' | 'md' | 'lg'
  className?: string
  testId?: string
}

const SIZE_CLASSES: Record<NonNullable<EmptyStateProps['size']>, {
  padding: string
  iconWrap: string
  icon: string
  title: string
  description: string
  buttonSize: 'sm' | 'md' | 'lg'
}> = {
  sm: {
    padding: 'py-6',
    iconWrap: 'h-12 w-12',
    icon: 'h-5 w-5',
    title: 'text-base font-semibold',
    description: 'text-xs',
    buttonSize: 'sm',
  },
  md: {
    padding: 'py-8',
    iconWrap: 'h-16 w-16',
    icon: 'h-7 w-7',
    title: 'text-lg font-semibold',
    description: 'text-sm',
    buttonSize: 'md',
  },
  lg: {
    padding: 'py-12',
    iconWrap: 'h-20 w-20',
    icon: 'h-9 w-9',
    title: 'text-display-sm',
    description: 'text-base',
    buttonSize: 'lg',
  },
}

/**
 * Empty state reusable con personalidad Aurora.
 * - Icon con `animate-float` para vida visual.
 * - Glow sutil detras del icon.
 * - Optional CTA con MagicButton aurora.
 *
 * Uso: pasar `icon`, `title`, `description` y opcionalmente `action`.
 * Si necesitas un layout especifico, usar la variante mas chica (`size="sm"`)
 * para que encaje dentro de Cards existentes.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
  testId,
}: EmptyStateProps) {
  const s = SIZE_CLASSES[size]
  const fallbackIcon = <Inbox className={s.icon} aria-hidden="true" />

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-center',
        s.padding,
        className,
      )}
      data-testid={testId}
    >
      {/* Icono con glow aurora detras + animate-float */}
      <div className="relative">
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 rounded-full blur-2xl opacity-60',
            'bg-[radial-gradient(circle,hsl(var(--aurora-2)/0.4),transparent_70%)]',
          )}
        />
        <div
          className={cn(
            'flex items-center justify-center rounded-full border border-glass-border/40 bg-glass-bg/60 text-brand-400 backdrop-blur-md animate-float',
            s.iconWrap,
          )}
        >
          {icon ?? fallbackIcon}
        </div>
      </div>

      <h3 className={cn('mt-2', s.title)}>{title}</h3>

      {description ? (
        <p className={cn('max-w-md text-muted-foreground', s.description)}>{description}</p>
      ) : null}

      {action ? (
        <div className="mt-2">
          {'href' in action && action.href ? (
            <MagicButton asChild variant="aurora" size={s.buttonSize}>
              <Link href={action.href}>{action.label}</Link>
            </MagicButton>
          ) : (
            <MagicButton variant="aurora" size={s.buttonSize} onClick={action.onClick}>
              {action.label}
            </MagicButton>
          )}
        </div>
      ) : null}
    </motion.div>
  )
}

// ============================================================
// Variantes preset — empty states recurrentes en la app
// ============================================================

/** "Aun no hay preguntas en esta area" + CTA admin */
export function EmptyStateNoQuestions({
  isAdmin = false,
  className,
}: {
  isAdmin?: boolean
  className?: string
}) {
  return (
    <EmptyState
      icon={<BookOpen className="h-7 w-7" aria-hidden="true" />}
      title="Aun no hay preguntas en esta area"
      description="Estamos preparando reactivos para esta seccion. Vuelve pronto."
      action={
        isAdmin
          ? { label: 'Agregar pregunta', href: '/admin/questions/new' }
          : undefined
      }
      testId="empty-state-no-questions"
      className={className}
    />
  )
}

/** "Sin actividad todavia" + CTA "Hacer mi primer quiz" */
export function EmptyStateNoActivity({ className }: { className?: string }) {
  return (
    <EmptyState
      icon={<Activity className="h-7 w-7" aria-hidden="true" />}
      title="Sin actividad todavia"
      description="Empieza un quiz para comenzar a registrar tu progreso."
      action={{ label: 'Hacer mi primer quiz', href: '/quiz' }}
      testId="empty-state-no-activity"
      className={className}
    />
  )
}

/** "Sin logros aun" — para pagina de logros */
export function EmptyStateNoAchievements({ className }: { className?: string }) {
  return (
    <EmptyState
      icon={<Trophy className="h-7 w-7" aria-hidden="true" />}
      title="Sin logros aun"
      description="Completa un quiz para empezar a desbloquear recompensas."
      action={{ label: 'Empezar un quiz', href: '/quiz' }}
      testId="empty-state-no-achievements"
      className={className}
    />
  )
}

/** "Aun no hay guias publicadas para esta subarea" */
export function EmptyStateNoGuides({ className }: { className?: string }) {
  return (
    <EmptyState
      icon={<BookOpen className="h-7 w-7" aria-hidden="true" />}
      title="Aun no hay guias publicadas"
      description="Estamos preparando contenido para esta subarea. Mientras tanto puedes practicar reactivos."
      action={{ label: 'Ir a practicar', href: '/quiz' }}
      testId="empty-state-no-guides"
      className={className}
    />
  )
}

/** "Aun no hay puntos debiles" — para WeakAreasCard */
export function EmptyStateNoWeakAreas({ className }: { className?: string }) {
  return (
    <EmptyState
      icon={<TrendingDown className="h-7 w-7" aria-hidden="true" />}
      title="Aun no hay datos"
      description="Completa tu primer quiz para ver tus puntos debiles."
      size="sm"
      testId="empty-state-no-weak-areas"
      className={className}
    />
  )
}

/** "Sin ganancias de XP recientes" — para RecentXPGains */
export function EmptyStateNoXP({ className }: { className?: string }) {
  return (
    <EmptyState
      icon={<Sparkles className="h-7 w-7" aria-hidden="true" />}
      title="Sin ganancias recientes"
      description="Empieza un quiz para sumar XP y verlas aqui."
      size="sm"
      testId="empty-state-no-xp"
      className={className}
    />
  )
}
