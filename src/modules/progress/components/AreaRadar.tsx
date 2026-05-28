'use client'

import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from 'recharts'

export type AreaRadarDatum = {
  /** Etiqueta corta del area, ej. "A1" o "Area 1" */
  area: string
  /** Precision actual del usuario (0-100) */
  accuracy: number
  /** Meta del usuario (0-100), ej. 80 = satisfactorio, 90 = sobresaliente */
  goal: number
}

type AreaRadarProps = {
  data: AreaRadarDatum[]
}

export function AreaRadar({ data }: AreaRadarProps) {
  return (
    <div className="relative h-full">
      {/* Aura sutil en la esquina */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-aurora-2/15 blur-3xl"
      />
      <div className="relative space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Mapa de desempeno por area</h3>
          <p className="text-xs text-muted-foreground">
            Compara tu precision actual con tu meta
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="h-80 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <defs>
                <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--aurora-1))" stopOpacity={0.55} />
                  <stop offset="50%" stopColor="hsl(var(--aurora-2))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--aurora-3))" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <PolarGrid stroke="hsl(var(--bg-border))" strokeOpacity={0.6} />
              <PolarAngleAxis
                dataKey="area"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Radar
                name="Actual"
                dataKey="accuracy"
                stroke="hsl(var(--aurora-2))"
                strokeWidth={2}
                fill="url(#radarFill)"
                fillOpacity={1}
              />
              <Radar
                name="Meta"
                dataKey="goal"
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="4 4"
                fill="hsl(var(--muted-foreground))"
                fillOpacity={0.05}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: 'hsl(var(--foreground))' }}
                iconType="line"
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--glass-bg) / 0.95)',
                  border: '1px solid hsl(var(--glass-border) / 0.6)',
                  borderRadius: 10,
                  color: 'hsl(var(--foreground))',
                  backdropFilter: 'blur(12px)',
                }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                formatter={(value: number, name: string) => [`${value}%`, name]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
