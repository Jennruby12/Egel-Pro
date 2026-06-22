'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Users, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MagicButton } from '@/components/ui/magic-button'
import { GoogleSignInButton } from '@/modules/auth/components/GoogleSignInButton'
import { joinGroupByCode } from '@/modules/groups/actions'

type Props = {
  code: string
  authed: boolean
  groupName: string | null
  examName: string | null
  isActive: boolean
}

export function JoinByLink({ code, authed, groupName, examName, isActive }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'joining' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const ran = useRef(false)

  // Si ya hay sesión, unir automáticamente al abrir el enlace.
  useEffect(() => {
    if (!authed || !isActive || ran.current) return
    ran.current = true
    setStatus('joining')
    joinGroupByCode({ code }).then((r) => {
      if (!r.success) {
        setStatus('error')
        setErrorMsg(r.error)
        return
      }
      setStatus('done')
      toast.success(`Te uniste a ${groupName ?? 'tu grupo'}`)
      // El layout del dashboard manda a /onboarding si falta completarlo.
      router.replace('/dashboard')
    })
  }, [authed, isActive, code, groupName, router])

  const invalid = !groupName || !isActive

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4">
      <GlassCard variant="elevated" padding="xl" className="w-full space-y-5 text-center">
        <div className="flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-aurora-2/15 text-aurora-2">
            <Users className="h-7 w-7" />
          </span>
        </div>

        {invalid ? (
          <>
            <h1 className="text-xl font-bold">Invitación no válida</h1>
            <p className="text-sm text-muted-foreground">
              Este código no corresponde a un grupo activo. Pídele a tu maestro un enlace nuevo.
            </p>
            <MagicButton asChild variant="outline" size="lg">
              <Link href="/dashboard">Ir al inicio</Link>
            </MagicButton>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Te invitan al grupo</p>
              <h1 className="mt-1 text-2xl font-bold text-aurora">{groupName}</h1>
              {examName ? <p className="mt-1 text-sm text-muted-foreground">Examen: {examName}</p> : null}
            </div>

            {authed ? (
              <div className="flex flex-col items-center gap-2">
                {status === 'done' ? (
                  <p className="inline-flex items-center gap-2 text-success">
                    <CheckCircle2 className="h-5 w-5" /> ¡Listo! Entrando…
                  </p>
                ) : status === 'error' ? (
                  <>
                    <p className="text-sm text-danger">{errorMsg}</p>
                    <MagicButton asChild variant="outline" size="lg">
                      <Link href="/dashboard">Ir al inicio</Link>
                    </MagicButton>
                  </>
                ) : (
                  <p className="inline-flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" /> Uniéndote al grupo…
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Inicia sesión para unirte. Es gratis y entras en segundos.
                </p>
                <GoogleSignInButton label="Continuar con Google" next={`/join/${code}`} />
                <Link
                  href={`/login?redirectTo=${encodeURIComponent(`/join/${code}`)}`}
                  className="block text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  o usar correo y contraseña
                </Link>
              </div>
            )}
          </>
        )}
      </GlassCard>
    </div>
  )
}
