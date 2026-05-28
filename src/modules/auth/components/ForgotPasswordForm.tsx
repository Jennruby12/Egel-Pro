'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'

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
import { forgotPassword } from '@/modules/auth/actions'
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/lib/validations/auth.schema'

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  function onSubmit(values: ForgotPasswordInput) {
    startTransition(async () => {
      const result = await forgotPassword(values)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      setSent(true)
    })
  }

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <p className="text-base font-semibold">Email enviado</p>
          <p className="text-sm text-muted-foreground">
            Te enviamos instrucciones para restablecer tu contrasena. Revisa tu
            bandeja (y la carpeta de spam por si acaso).
          </p>
        </div>
        <MagicButton variant="outline" size="lg" className="w-full" asChild>
          <Link href="/login">
            <ArrowLeft className="h-4 w-4" />
            Volver a iniciar sesion
          </Link>
        </MagicButton>
      </div>
    )
  }

  return (
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

        <MagicButton
          type="submit"
          variant="aurora"
          size="lg"
          className="w-full"
          disabled={pending}
        >
          {pending && <Loader2 className="animate-spin" />}
          Enviar link de recuperacion
        </MagicButton>

        <p className="text-center text-sm text-muted-foreground">
          Te acordaste?{' '}
          <Link
            href="/login"
            className="font-semibold text-brand-400 transition-colors hover:text-brand-500 hover:underline"
          >
            Iniciar sesion
          </Link>
        </p>
      </form>
    </Form>
  )
}
