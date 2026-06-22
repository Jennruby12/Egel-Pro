'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { leaveGroup } from '@/modules/groups/actions'

export function LeaveGroupButton({ groupId }: { groupId: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function onClick() {
    if (!confirm('Salir de este grupo?')) return
    startTransition(async () => {
      const r = await leaveGroup(groupId)
      if (!r.success) { toast.error(r.error); return }
      toast.success('Saliste del grupo')
      router.refresh()
    })
  }

  return (
    <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={onClick}>
      <LogOut className="h-4 w-4" /> Salir
    </Button>
  )
}
