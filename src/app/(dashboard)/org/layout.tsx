import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Solo owner/manager (coordinador) de una organización, o admin.
export default async function OrgLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, org_role, organization_id')
    .eq('id', user.id)
    .single()

  const isOrgManager =
    Boolean(profile?.organization_id) && (profile?.org_role === 'owner' || profile?.org_role === 'manager')
  if (!isOrgManager && profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return <>{children}</>
}
