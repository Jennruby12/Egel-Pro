'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { GraduationCap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { becomeTeacher } from '@/modules/groups/actions'

export function BecomeTeacherButton() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function onClick() {
    startTransition(async () => {
      const r = await becomeTeacher()
      if (!r.success) { toast.error(r.error); return }
      toast.success('Ahora eres maestro: crea tu primer grupo')
      router.push('/teacher')
      router.refresh()
    })
  }

  return (
    <Button type="button" variant="outline" disabled={pending} onClick={onClick}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <GraduationCap className="h-4 w-4" />}
      Convertirme en maestro
    </Button>
  )
}
