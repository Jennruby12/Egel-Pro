'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { joinGroupByCode } from '@/modules/groups/actions'

export function JoinGroupCard() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [code, setCode] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const r = await joinGroupByCode({ code })
      if (!r.success) { toast.error(r.error); return }
      toast.success('Te uniste al grupo')
      setCode('')
      router.refresh()
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
      <div className="min-w-40 flex-1">
        <label className="text-[10px] uppercase text-muted-foreground">Codigo del grupo</label>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ABC123"
          className="font-mono tracking-widest"
          maxLength={12}
        />
      </div>
      <Button type="submit" disabled={pending || code.length < 4}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        Unirme
      </Button>
    </form>
  )
}
