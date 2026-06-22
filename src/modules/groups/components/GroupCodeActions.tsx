'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Copy, RefreshCw, Power, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { regenerateJoinCode, setGroupActive, deleteGroup } from '@/modules/groups/actions'

type Props = {
  groupId: string
  joinCode: string
  isActive: boolean
}

export function GroupCodeActions({ groupId, joinCode, isActive }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [code, setCode] = useState(joinCode)

  function copy() {
    navigator.clipboard?.writeText(code)
    toast.success('Codigo copiado')
  }

  function regen() {
    startTransition(async () => {
      const r = await regenerateJoinCode(groupId)
      if (!r.success) { toast.error(r.error); return }
      toast.success('Codigo regenerado')
      router.refresh()
    })
  }

  function toggle() {
    startTransition(async () => {
      const r = await setGroupActive(groupId, !isActive)
      if (!r.success) { toast.error(r.error); return }
      toast.success(isActive ? 'Grupo desactivado' : 'Grupo activado')
      router.refresh()
    })
  }

  function remove() {
    if (!confirm('Borrar este grupo? Los alumnos perderan el acceso.')) return
    startTransition(async () => {
      const r = await deleteGroup(groupId)
      if (!r.success) { toast.error(r.error); return }
      toast.success('Grupo borrado')
      router.push('/teacher')
      router.refresh()
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="rounded-md bg-bg-base px-3 py-1.5 font-mono text-lg font-bold tracking-widest text-brand-400">
        {code}
      </code>
      <Button type="button" variant="outline" size="sm" onClick={copy}>
        <Copy className="h-4 w-4" /> Copiar
      </Button>
      <Button type="button" variant="outline" size="sm" disabled={pending} onClick={regen}>
        <RefreshCw className="h-4 w-4" /> Regenerar
      </Button>
      <Button type="button" variant="outline" size="sm" disabled={pending} onClick={toggle}>
        <Power className="h-4 w-4" /> {isActive ? 'Desactivar' : 'Activar'}
      </Button>
      <Button type="button" variant="outline" size="sm" disabled={pending} onClick={remove}>
        <Trash2 className="h-4 w-4 text-danger" /> Borrar
      </Button>
    </div>
  )
}
