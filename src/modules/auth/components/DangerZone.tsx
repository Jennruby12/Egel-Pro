'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { deleteAccount } from '@/modules/auth/profile-actions'

export function DangerZone() {
  const [confirmation, setConfirmation] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    if (confirmation !== 'ELIMINAR') {
      toast.error('Escribe ELIMINAR exactamente para confirmar')
      return
    }
    startTransition(async () => {
      // deleteAccount hace redirect al login con ?deleted=1
      const result = await deleteAccount({ confirmation: 'ELIMINAR' })
      if (!result.success) {
        toast.error(result.error)
      }
    })
  }

  if (!showForm) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between gap-4">
          <span>Eliminar tu cuenta borra todos tus datos permanentemente.</span>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setShowForm(true)}
          >
            Eliminar cuenta
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="space-y-3">
        <p className="font-semibold">Esta accion no se puede deshacer.</p>
        <p className="text-sm">
          Se eliminaran tu profile, XP, racha, todos tus quizzes, respuestas y logros.
          Para confirmar, escribe <code className="rounded bg-danger/20 px-1.5 py-0.5 font-mono text-xs">ELIMINAR</code> abajo.
        </p>
        <div>
          <Label htmlFor="delete_confirm" className="sr-only">Confirmar</Label>
          <Input
            id="delete_confirm"
            placeholder="ELIMINAR"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); setConfirmation('') }}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={pending || confirmation !== 'ELIMINAR'}
          >
            {pending ? <Loader2 className="animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Eliminar cuenta para siempre
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
