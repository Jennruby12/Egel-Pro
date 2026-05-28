'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

type Props = {
  containerRef: React.RefObject<HTMLElement>
  fromRef: React.RefObject<HTMLElement>
  toRef: React.RefObject<HTMLElement>
  className?: string
  /** Duracion del flujo del gradient. Default 3s */
  duration?: number
  /** Curvatura del beam (0 = recta). Default 60 */
  curvature?: number
  /** Reverse direction */
  reverse?: boolean
}

/**
 * Linea SVG curva conectando 2 elementos con un beam de gradient animado.
 * Auto-recalcula posicion en resize y en intervalos.
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  className,
  duration = 3,
  curvature = 60,
  reverse = false,
}: Props) {
  const id = useId()
  const [path, setPath] = useState('')
  const [size, setSize] = useState({ width: 0, height: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const update = () => {
      const container = containerRef.current
      const from = fromRef.current
      const to = toRef.current
      if (!container || !from || !to) return

      const cRect = container.getBoundingClientRect()
      const fRect = from.getBoundingClientRect()
      const tRect = to.getBoundingClientRect()

      const x1 = fRect.left + fRect.width / 2 - cRect.left
      const y1 = fRect.top + fRect.height / 2 - cRect.top
      const x2 = tRect.left + tRect.width / 2 - cRect.left
      const y2 = tRect.top + tRect.height / 2 - cRect.top

      const midX = (x1 + x2) / 2
      const midY = (y1 + y2) / 2 - curvature

      setPath(`M ${x1},${y1} Q ${midX},${midY} ${x2},${y2}`)
      setSize({ width: cRect.width, height: cRect.height })
    }

    const tick = () => {
      update()
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    window.addEventListener('resize', update)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', update)
    }
  }, [containerRef, fromRef, toRef, curvature])

  return (
    <svg
      width={size.width}
      height={size.height}
      className={cn('pointer-events-none absolute left-0 top-0', className)}
      style={{ transform: reverse ? 'scaleX(-1)' : undefined }}
    >
      <defs>
        <linearGradient id={`${id}-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--aurora-1))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--aurora-2))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--aurora-3))" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Path base sutil */}
      <path d={path} stroke="hsl(var(--bg-border))" strokeWidth="1" fill="none" strokeOpacity="0.4" />
      {/* Beam animado */}
      <motion.path
        d={path}
        stroke={`url(#${id}-gradient)`}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, pathOffset: 0 }}
        animate={{ pathLength: 1, pathOffset: 1 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  )
}
