'use client'

import { useEffect, useRef } from 'react'
import { animate } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

type Props = {
  value: number
  /** Duracion en segundos. Default 1.2 */
  duration?: number
  /** Decimales. Default 0 */
  decimals?: number
  /** Prefix (ej. '+', '$') */
  prefix?: string
  /** Suffix (ej. '%', ' XP') */
  suffix?: string
  /** Formato es-MX (separador miles) */
  locale?: string
  className?: string
}

export function AnimatedCounter({
  value,
  duration = 1.2,
  decimals = 0,
  prefix = '',
  suffix = '',
  locale = 'es-MX',
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const prevValueRef = useRef(0)

  useEffect(() => {
    if (!ref.current) return
    const node = ref.current
    const from = prevValueRef.current
    const to = value
    prevValueRef.current = to

    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        node.textContent =
          prefix +
          latest.toLocaleString(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }) +
          suffix
      },
    })
    return () => controls.stop()
  }, [value, duration, decimals, prefix, suffix, locale])

  return (
    <span
      ref={ref}
      className={cn('tabular-nums font-mono', className)}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {prefix}
      {value.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}
