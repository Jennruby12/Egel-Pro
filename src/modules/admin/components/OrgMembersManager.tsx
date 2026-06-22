'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { assignOrgRole, removeOrgMember } from '@/modules/admin/org-actions'

export type OrgMember = {
  id: string
  name: string
  email: string
  orgRole: string | null
}

export function OrgMembersManager({ orgId, members }: { orgId: string; members: OrgMember[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [email, setEmail] = useState('')
  const [orgRole, setOrgRole] = useState<'member' | 'manager' | 'owner'>('owner')

  function add() {
    startTransition(async () => {
      const r = await assignOrgRole({ orgId, email, orgRole })
      if (!r.success) { toast.error(r.error); return }
      toast.success('Miembro asignado')
      setEmail('')
      router.refresh()
    })
  }

  function remove(userId: string) {
    if (!confirm('Quitar a este usuario de la organizacion?')) return
    startTransition(async () => {
      const r = await removeOrgMember(userId, orgId)
      if (!r.success) { toast.error(r.error); return }
      toast.success('Miembro removido')
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-bg-border p-3">
        <div className="min-w-56 flex-1">
          <label className="text-[10px] uppercase text-muted-foreground">Correo del usuario (ya registrado)</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alumno@correo.com" />
        </div>
        <div className="w-36">
          <label className="text-[10px] uppercase text-muted-foreground">Rol</label>
          <select
            value={orgRole}
            onChange={(e) => setOrgRole(e.target.value as 'member' | 'manager' | 'owner')}
            className="h-10 w-full rounded-md border border-bg-border bg-bg-base px-3 text-sm"
          >
            <option value="owner">owner</option>
            <option value="manager">manager (coordinador)</option>
            <option value="member">member</option>
          </select>
        </div>
        <Button type="button" disabled={pending || !email} onClick={add}>
          <Plus className="h-4 w-4" /> Asignar
        </Button>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin miembros todavia.</p>
      ) : (
        <ul className="divide-y divide-bg-border rounded-lg border border-bg-border">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.email} · {m.orgRole ?? 'member'}</p>
              </div>
              <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={() => remove(m.id)}>
                <UserMinus className="h-4 w-4 text-danger" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
