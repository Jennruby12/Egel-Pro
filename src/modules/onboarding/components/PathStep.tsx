'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { User, Users, GraduationCap, Loader2, ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { Input } from '@/components/ui/input'
import { becomeTeacher, joinGroupByCode } from '@/modules/groups/actions'
import { markOnboardingDone } from '@/modules/onboarding/actions'

type Path = 'free' | 'code' | 'teacher'

/**
 * Paso de bifurcación del onboarding: el usuario elige cómo usará EGELPro.
 * - "free": sigue el wizard normal (onContinue).
 * - "code": se une a un grupo por código y luego continúa.
 * - "teacher": se convierte en maestro, cierra onboarding y va a /teacher.
 */
export function PathStep({ onContinue }: { onContinue: () => void }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [path, setPath] = useState<Path>('free')
  const [code, setCode] = useState('')

  function handleContinue() {
    if (path === 'free') {
      onContinue()
      return
    }
    if (path === 'code') {
      startTransition(async () => {
        const r = await joinGroupByCode({ code })
        if (!r.success) { toast.error(r.error); return }
        toast.success('Te uniste al grupo')
        onContinue()
      })
      return
    }
    // teacher
    startTransition(async () => {
      const bt = await becomeTeacher()
      if (!bt.success) { toast.error(bt.error); return }
      await markOnboardingDone()
      toast.success('Listo, crea tu primer grupo')
      router.push('/teacher')
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">¿Cómo vas a usar EGELPro?</h2>
        <p className="text-sm text-muted-foreground">
          Puedes cambiar esto despues desde tu perfil.
        </p>
      </div>

      <div className="grid gap-3">
        <PathOption
          active={path === 'free'}
          icon={<User className="h-5 w-5" />}
          title="Por mi cuenta"
          desc="Practico libre, a mi ritmo."
          onClick={() => setPath('free')}
        />
        <PathOption
          active={path === 'code'}
          icon={<Users className="h-5 w-5" />}
          title="Tengo un codigo de grupo"
          desc="Mi maestro me compartio un codigo para unirme."
          onClick={() => setPath('code')}
        />
        <PathOption
          active={path === 'teacher'}
          icon={<GraduationCap className="h-5 w-5" />}
          title="Soy maestro"
          desc="Quiero crear grupos y seguir a mis alumnos."
          onClick={() => setPath('teacher')}
        />
      </div>

      {path === 'code' ? (
        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Codigo del grupo
          </label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            className="font-mono tracking-widest"
            maxLength={12}
          />
        </div>
      ) : null}

      <div className="flex justify-end">
        <MagicButton
          variant="aurora"
          size="lg"
          onClick={handleContinue}
          disabled={pending || (path === 'code' && code.length < 4)}
        >
          {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          {path === 'teacher' ? 'Crear mi primer grupo' : 'Continuar'}
        </MagicButton>
      </div>
    </div>
  )
}

function PathOption({
  active,
  icon,
  title,
  desc,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  title: string
  desc: string
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick} className="text-left">
      <GlassCard
        variant={active ? 'elevated' : 'flat'}
        padding="md"
        className={
          active
            ? 'flex items-center gap-4 border-aurora-2/60 ring-1 ring-aurora-2/40'
            : 'flex items-center gap-4 border-glass-border/40 hover:border-glass-border/70'
        }
      >
        <span
          className={
            active
              ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-aurora-2/20 text-aurora-2'
              : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-bg-raised text-muted-foreground'
          }
        >
          {icon}
        </span>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </GlassCard>
    </button>
  )
}
