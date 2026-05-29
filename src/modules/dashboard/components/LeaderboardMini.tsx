import Link from 'next/link'
import Image from 'next/image'
import { Trophy, Zap, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils/cn'

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

/**
 * Mini ranking para el dashboard: top 5 por XP + tu posicion.
 * Server Component que invoca las RPC publicas.
 */
export async function LeaderboardMini() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [topResult, myRankResult] = await Promise.all([
    supabase.rpc('get_top_players', { p_sort_by: 'xp', p_limit: 5 }),
    supabase.rpc('get_my_rank', { p_user_id: user.id, p_sort_by: 'xp' }),
  ])

  const top = (topResult.data as TopRow[] | null) ?? []
  const myRank =
    (myRankResult.data?.[0] as { rank: number; total_players: number } | undefined) ?? {
      rank: 0,
      total_players: 0,
    }

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-aurora-2/20 text-aurora-2">
            <Trophy className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-semibold">Ranking global</h3>
        </div>
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-aurora-2"
        >
          Ver todo <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {top.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Aun no hay jugadores. Completa quizzes para aparecer aqui.
        </p>
      ) : (
        <ol className="space-y-1.5">
          {top.map((row) => {
            const isMe = row.user_id === user.id
            return (
              <li
                key={row.user_id}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-2 py-1.5 backdrop-blur-md',
                  isMe
                    ? 'border-aurora-2/60 bg-aurora-2/10'
                    : 'border-glass-border/30 bg-glass-bg/40',
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    row.rank === 1
                      ? 'bg-xp/20 text-xp'
                      : row.rank === 2
                        ? 'bg-foreground/15 text-foreground'
                        : row.rank === 3
                          ? 'bg-streak/15 text-streak'
                          : 'bg-bg-raised/60 text-muted-foreground',
                  )}
                >
                  {row.rank}
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-raised/80 text-[10px] font-semibold">
                  {row.avatar_url ? (
                    <Image
                      src={row.avatar_url}
                      alt={row.full_name}
                      width={28}
                      height={28}
                      className="h-7 w-7 object-cover"
                    />
                  ) : (
                    row.full_name.slice(0, 2).toUpperCase()
                  )}
                </span>
                <p className="flex-1 truncate text-xs font-medium">
                  {row.full_name}
                  {isMe ? <span className="ml-1 text-aurora-2">(tu)</span> : null}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-xp">
                  <Zap className="h-3 w-3" fill="currentColor" />
                  {row.xp_total.toLocaleString('es-MX')}
                </span>
              </li>
            )
          })}
        </ol>
      )}

      {myRank.rank > 0 && myRank.rank > 5 ? (
        <div className="mt-auto rounded-lg border border-aurora-2/40 bg-aurora-2/10 p-2 text-center text-xs">
          Tu posicion: <span className="font-bold text-aurora-2">#{myRank.rank}</span> de {myRank.total_players}
        </div>
      ) : myRank.rank > 0 ? (
        <p className="mt-auto text-center text-xs text-muted-foreground">
          Estas en el top 5 ({myRank.total_players} jugadores totales)
        </p>
      ) : null}
    </div>
  )
}
