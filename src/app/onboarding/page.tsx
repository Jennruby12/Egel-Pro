import { createClient } from '@/lib/supabase/server'
import { OnboardingWizard } from '@/modules/onboarding/components/OnboardingWizard'
import { getDiagnosticQuestions } from '@/modules/onboarding/actions'

export const metadata = { title: 'Bienvenido' }

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    : { data: null }

  const result = await getDiagnosticQuestions()
  const questions = result.success ? result.data : []

  return <OnboardingWizard fullName={profile?.full_name ?? null} questions={questions} />
}
