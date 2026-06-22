'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createOrg, updateOrg } from '@/modules/admin/org-actions'
import type { OrgMetaInput } from '@/lib/validations/org.schema'

type OrgRow = {
  id: string
  name: string
  slug: string
  plan: string | null
  max_students: number | null
  is_active: boolean | null
}

const EMPTY: OrgMetaInput = { name: '', slug: '', plan: 'free', max_students: 0, is_active: true }

export function OrgForm({ initialData }: { initialData?: OrgRow | null }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const isEdit = Boolean(initialData)
  const [form, setForm] = useState<OrgMetaInput>(
    initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          plan: (initialData.plan as OrgMetaInput['plan']) ?? 'free',
          max_students: initialData.max_students ?? 0,
          is_active: initialData.is_active ?? true,
        }
      : EMPTY,
  )

  function set<K extends keyof OrgMetaInput>(k: K, v: OrgMetaInput[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const r = isEdit && initialData ? await updateOrg(initialData.id, form) : await createOrg(form)
      if (!r.success) { toast.error(r.error); return }
      toast.success(isEdit ? 'Organizacion actualizada' : 'Organizacion creada')
      router.push(isEdit ? `/admin/orgs/${initialData!.id}` : `/admin/orgs/${r.data.id}`)
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      <Field label="Nombre">
        <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Universidad X" />
      </Field>
      <Field label="Slug">
        <Input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="universidad-x" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Plan">
          <select
            value={form.plan}
            onChange={(e) => set('plan', e.target.value as OrgMetaInput['plan'])}
            className="h-10 w-full rounded-md border border-bg-border bg-bg-base px-3 text-sm"
          >
            <option value="free">free</option>
            <option value="pro">pro</option>
            <option value="pro_lifetime">pro_lifetime</option>
          </select>
        </Field>
        <Field label="Max. alumnos (0 = ilimitado)">
          <Input type="number" min={0} value={form.max_students} onChange={(e) => set('max_students', Number(e.target.value))} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} className="h-4 w-4 accent-brand-400" />
        Organizacion activa
      </label>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isEdit ? 'Guardar' : 'Crear organizacion'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/orgs')}>Cancelar</Button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}
