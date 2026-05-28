'use client'

import { motion } from 'framer-motion'
import { AchievementBadge } from './AchievementBadge'
import { ACHIEVEMENTS_CATALOG, type AchievementType } from '@/lib/constants/gamification'

type EarnedMap = Record<string, string | null>

type Props = {
  earnedMap: EarnedMap // achievement.type -> earned_at ISO date
}

const CATEGORIES: Array<{ title: string; subtitle: string; types: AchievementType[] }> = [
  {
    title: 'Primeros pasos',
    subtitle: 'Logros iniciales de practica',
    types: ['first_quiz', 'questions_100', 'questions_500', 'questions_1000'],
  },
  {
    title: 'Rachas',
    subtitle: 'Constancia diaria de estudio',
    types: ['streak_3', 'streak_7', 'streak_14', 'streak_30', 'streak_100'],
  },
  {
    title: 'Maestria por area',
    subtitle: '90% o mas de precision en areas EGEL',
    types: [
      'area1_mastered',
      'area2_mastered',
      'area3_mastered',
      'area4_mastered',
      'all_areas_mastered',
    ],
  },
  {
    title: 'Reto',
    subtitle: 'Hitos especiales del simulador',
    types: ['perfect_score', 'speed_quiz', 'simulacro_complete', 'sobresaliente_sim', 'perseverant'],
  },
  {
    title: 'Especiales',
    subtitle: 'Logros ocultos y de contenido',
    types: ['all_guides_read', 'night_owl', 'secret_1'],
  },
]

export function AchievementsGrid({ earnedMap }: Props) {
  return (
    <div className="space-y-10">
      {CATEGORIES.map((cat, catIdx) => {
        const earnedInCat = cat.types.filter((t) => Boolean(earnedMap[t])).length
        return (
          <motion.section
            key={cat.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: catIdx * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wide text-foreground">
                  {cat.title}
                </h3>
                <p className="text-xs text-muted-foreground">{cat.subtitle}</p>
              </div>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {earnedInCat} / {cat.types.length}
              </span>
            </header>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {cat.types.map((type, idx) => {
                const meta = ACHIEVEMENTS_CATALOG.find((a) => a.type === type)
                if (!meta) return null
                const earnedAt = earnedMap[type] ?? null
                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.45,
                      delay: catIdx * 0.08 + idx * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <AchievementBadge
                      type={type}
                      earned={Boolean(earnedAt)}
                      earnedAt={earnedAt}
                    />
                  </motion.div>
                )
              })}
            </div>
          </motion.section>
        )
      })}
    </div>
  )
}
