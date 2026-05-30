'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Sparkles } from 'lucide-react'

import { MagicButton } from '@/components/ui/magic-button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { signIn, sendMagicLink } from '@/modules/auth/actions'
import { signInSchema, type SignInInput } from '@/lib/validations/auth.schema'
import { GoogleSignInButton, GOOGLE_OAUTH_ENABLED } from './GoogleSignInButton'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'
  const prefilledEmail = searchParams.get('email') ?? ''
  const [pending, startTransition] = useTransition()
  const [magicLoading, setMagicLoading] = useState(false)

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: prefilledEmail, password: '' },
  })

  function onSubmit(values: SignInInput) {
    startTransition(async () => {
      const result = await signIn(values)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Bienvenido de vuelta')
      router.push(redirectTo)
      router.refresh()
    })
  }

  async function handleMagicLink() {
    const email = form.getValues('email')
    if (!email) {
      form.setError('email', { message: 'Ingresa tu email para enviar el link' })
      return
    }
    setMagicLoading(true)
    const result = await sendMagicLink({ email })
    setMagicLoading(false)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success('Te enviamos un link de acceso. Revisa tu email.')
  }

  return (
    <div className="space-y-6">
      {GOOGLE_OAUTH_ENABLED ? (
        <>
          <GoogleSignInButton />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-bg-border/60" />
            </div>
            <div className="relative flex justify-center text-[10px] font-medium uppercase tracking-widest">
              <span className="bg-card/40 px-3 text-muted-foreground backdrop-blur-sm">
                O continua con
              </span>
            </div>
          </div>
        </>
      ) : null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Contrasena</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-brand-400 transition-colors hover:text-brand-500 hover:underline"
                  >
                    Olvidaste tu contrasena?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <MagicButton
            type="submit"
            variant="aurora"
            size="lg"
            className="w-full"
            disabled={pending}
          >
            {pending && <Loader2 className="animate-spin" />}
            Iniciar sesion
          </MagicButton>

          <MagicButton
            type="button"
            variant="ghost"
            size="md"
            className="w-full"
            onClick={handleMagicLink}
            disabled={magicLoading}
          >
            {magicLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 text-aurora-2" />
            )}
            Enviarme un link magico al email
          </MagicButton>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        No tienes cuenta?{' '}
        <Link
          href="/register"
          className="font-semibold text-brand-400 transition-colors hover:text-brand-500 hover:underline"
        >
          Registrate
        </Link>
      </p>
    </div>
  )
}
