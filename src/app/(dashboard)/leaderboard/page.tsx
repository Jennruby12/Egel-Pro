import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { Trophy, Zap, Flame } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { SparklesText } from '@/components/ui/sparkles-text'
import { GlassCard } from '@/components/ui/glass-card'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = { title: 'Ranking' }

type TopRow = {
  user_id: string
  full_name: string
  avatar_url: string | null
  level: number
  xp_total: number
  streak_current: number
  streak_max: number
  rank: number
}

type Props = {
  searchParams: Promise<{ tab?: string }>
}

export default async function LeaderboardPage({ searchParams }: Props) {
  const { tab = 'xp' } = await searchParams
  const sortBy = tab === 'streak' ? 'streak' : 'xp'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [topResult, myRankResult] = await Promise.all([
    supabase.rpc('get_top_players', { p_sort_by: sortBy, p_limit: 10 }),
    supabase.rpc('get_my_rank', { p_user_id: user.id, p_sort_by: sortBy }),
  ])

  const top = (topResult.data as TopRow[] | null) ?? []
  const myRank = (myRankResult.data?.[0] as { rank: number; total_players: number } | undefined) ?? {
    rank: 0,
    total_players: 0,
  }

  return (
    <div className="relative">
      <AuroraBackground variant="subtle" className="absolute inset-0 -z-10">
        <div className="h-full w-full" />
      </AuroraBackground>

      <header className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-glass-border/40 bg-glass-bg/40 px-3 py-1 text-xs font-medium text-aurora-2 backdrop-blur-md">
          <Trophy className="h-3 w-3" />
          Ranking global
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-display-md lg:text-display-lg">
          <SparklesText className="text-aurora">Top 10</SparklesText>
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Los 10 estudiantes con mas XP y racha activa. Tu posicion se actualiza cada vez que completas un quiz.
        </p>
        {myRank.rank > 0 ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-aurora-2/40 bg-aurora-2/10 px-3 py-1 text-sm text-aurora-2 backdrop-blur-md">
            Tu posicion: <span className="font-bold">#{myRank.rank}</span> de {myRank.total_players}
          </div>
        ) : null}
      </header>

      <div className="mb-6 flex gap-2">
        <a
          href="/leaderboard?tab=xp"
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors backdrop-blur-md',
            sortBy === 'xp'
              ? 'border-xp/60 bg-xp/15 text-xp'
              : 'border-glass-border/40 bg-glass-bg/40 text-muted-foreground hover:text-foreground',
          )}
        >
          <Zap className="h-4 w-4" />
          Por XP
        </a>
        <a
          href="/leaderboard?tab=streak"
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors backdrop-blur-md',
            sortBy === 'streak'
              ? 'border-streak/60 bg-streak/15 text-streak'
              : 'border-glass-border/40 bg-glass-bg/40 text-muted-foreground hover:text-foreground',
          )}
        >
          <Flame className="h-4 w-4" />
          Por racha
        </a>
      </div>

      <GlassCard variant="elevated" padding="lg">
        {top.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            Aun no hay jugadores en el ranking. Completa quizzes para aparecer aqui.
          </div>
        ) : (
          <ol className="space-y-2">
            {top.map((row) => {
              const isMe = row.user_id === user.id
              const metric = sortBy === 'streak' ? row.streak_current : row.xp_total
              const metricIcon = sortBy === 'streak' ? <Flame className="h-4 w-4 text-streak" /> : <Zap className="h-4 w-4 text-xp" fill="currentColor" />
              const metricLabel = sortBy === 'streak' ? `${metric} dias` : `${metric.toLocaleString('es-MX')} XP`
              return (
                <li
                  key={row.user_id}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-3 backdrop-blur-md transition-colors',
                    isMe
                      ? 'border-aurora-2/60 bg-aurora-2/10 shadow-[0_0_16px_-4px_hsl(var(--aurora-2)/0.5)]'
                      : 'border-glass-border/30 bg-glass-bg/40',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                      row.rank === 1
                        ? 'bg-xp/20 text-xp ring-1 ring-xp/50'
                        : row.rank === 2
                          ? 'bg-foreground/15 text-foreground ring-1 ring-foreground/30'
                          : row.rank === 3
                            ? 'bg-streak/15 text-streak ring-1 ring-streak/40'
                            : 'bg-bg-raised/60 text-muted-foreground',
                    )}
                  >
                    {row.rank}
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-raised/80 text-sm font-semibold">
                    {row.avatar_url ? (
                      <Image
                        src={row.avatar_url}
                        alt={row.full_name}
                        width={40}
                        height={40}
                        className="h-10 w-10 object-cover"
                      />
                    ) : (
                      row.full_name.slice(0, 2).toUpperCase()
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {row.full_name}
                      {isMe ? <span className="ml-2 text-xs text-aurora-2">(tu)</span> : null}
                    </p>
                    <p className="text-xs text-muted-foreground">Nivel {row.level}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    {metricIcon}
                    <span>{metricLabel}</span>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </GlassCard>
    </div>
  )
}
