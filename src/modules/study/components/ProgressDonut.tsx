'use client'

type Props = {
  percent: number
  size?: number
  strokeWidth?: number
  label?: string
}

/**
 * Dona SVG con porcentaje al centro. Gradient aurora para fill.
 */
export function ProgressDonut({ percent, size = 120, strokeWidth = 10, label }: Props) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.max(0, Math.min(100, percent)) / 100)
  const gradId = `donut-grad-${Math.round(percent * 100)}`

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--aurora-1))" />
            <stop offset="50%" stopColor="hsl(var(--aurora-2))" />
            <stop offset="100%" stopColor="hsl(var(--aurora-3))" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--bg-border))"
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-foreground">{Math.round(percent)}%</span>
        {label ? <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span> : null}
      </div>
    </div>
  )
}
