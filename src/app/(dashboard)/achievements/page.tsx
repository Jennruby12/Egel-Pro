import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { AchievementStats } from '@/modules/gamification/components/AchievementStats'
import { AchievementsGrid } from '@/modules/gamification/components/AchievementsGrid'
import { ACHIEVEMENTS_CATALOG } from '@/lib/constants/gamification'

export const metadata = { title: 'Logros' }

export default async function AchievementsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rows } = await supabase
    .from('achievements')
    .select('type, earned_at')
    .eq('user_id', user.id)

  const earnedMap: Record<string, string | null> = {}
  for (const r of rows ?? []) {
    earnedMap[r.type] = r.earned_at
  }

  const earnedCount = Object.keys(earnedMap).length
  const totalCount = ACHIEVEMENTS_CATALOG.length

  return (
    <AuroraBackground
      variant="subtle"
      className="-mx-4 -mt-4 px-4 pt-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <div className="space-y-6">
        <PageHeader
          title="Logros"
          description="Desbloquea recompensas mientras avanzas en tu preparacion."
          gradient
        />
        <AchievementStats earned={earnedCount} total={totalCount} />
        <AchievementsGrid earnedMap={earnedMap} />
      </div>
    </AuroraBackground>
  )
}
