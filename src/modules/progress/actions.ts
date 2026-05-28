'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Tables } from '@/types/database'

export type ProgressInsights = {
  progress: Tables<'user_progress'>[]
  profile: Tables<'profiles'> | null
  streaks: Tables<'streaks'>[]
}

/**
 * Helper opcional para obtener todos los datos de analitica del usuario.
 * La pagina /progress fetch directo desde el server component;
 * esta funcion existe para reuso futuro (ej. dashboards embebidos).
 */
export async function getProgressInsights(): Promise<{ data?: ProgressInsights; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const ninetyDaysAgoISO = (() => {
    const d = new Date()
    d.setDate(d.getDate() - 89)
    return d.toISOString().slice(0, 10)
  })()

  const [profileRes, progressRes, streaksRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_progress').select('*').eq('user_id', user.id),
    supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', ninetyDaysAgoISO)
      .order('date', { ascending: true }),
  ])

  if (progressRes.error) {
    return { error: 'No se pudo cargar el progreso' }
  }

  return {
    data: {
      profile: profileRes.data ?? null,
      progress: progressRes.data ?? [],
      streaks: streaksRes.data ?? [],
    },
  }
}
