import * as React from 'react'
import { cn } from '@/lib/utils/cn'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  reverse?: boolean
  pauseOnHover?: boolean
  vertical?: boolean
  /** Cuantas veces repetir el contenido para asegurar loop sin gap. Default 4 */
  repeat?: number
  /** Duracion del loop en segundos. Default 40 */
  duration?: number
}

/**
 * Marquee con CSS-only animation. Usa @keyframes scroll directamente para
 * no necesitar JS. Performance excelente.
 */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  duration = 40,
  children,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]',
        vertical ? 'flex-col' : 'flex-row',
        className,
      )}
      style={{ ['--marquee-duration' as string]: `${duration}s` }}
      {...props}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 justify-around [gap:var(--gap)]',
            vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
            reverse && '[animation-direction:reverse]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
          )}
          style={{ animationDuration: `${duration}s` }}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
