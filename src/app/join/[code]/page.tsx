import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { JoinByLink } from '@/modules/groups/components/JoinByLink'

export const metadata: Metadata = { title: 'Unirme a un grupo' }
export const dynamic = 'force-dynamic'

type Params = { code: string }

export default async function JoinPage({ params }: { params: Promise<Params> }) {
  const { code } = await params
  const supabase = await createClient()

  const [{ data: { user } }, { data: info }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc('group_public_by_code', { p_code: code }),
  ])

  const group = Array.isArray(info) ? info[0] : null

  return (
    <JoinByLink
      code={code}
      authed={Boolean(user)}
      groupName={group?.name ?? null}
      examName={group?.exam_name ?? null}
      isActive={group?.is_active ?? false}
    />
  )
}
