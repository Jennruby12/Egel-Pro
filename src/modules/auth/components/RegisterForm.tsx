'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { MagicButton } from '@/components/ui/magic-button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { signUp } from '@/modules/auth/actions'
import { signUpSchema, type SignUpInput } from '@/lib/validations/auth.schema'
import { GoogleSignInButton } from './GoogleSignInButton'

export function RegisterForm() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
      university: '',
      exam_date: '',
      accept_terms: false as unknown as true,
    },
  })

  function onSubmit(values: SignUpInput) {
    startTransition(async () => {
      const result = await signUp(values)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Cuenta creada. Revisa tu email para confirmar.')
      router.push('/login')
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <GoogleSignInButton label="Registrarme con Google" />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-bg-border/60" />
        </div>
        <div className="relative flex justify-center text-[10px] font-medium uppercase tracking-widest">
          <span className="bg-card/40 px-3 text-muted-foreground backdrop-blur-sm">
            O registrate con email
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Maria Lopez"
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <FormLabel>Contrasena</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Minimo 8 caracteres</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar contrasena</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Universidad{' '}
                  <span className="text-muted-foreground">(opcional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="UNAM, IPN, ITESM..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exam_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Fecha de examen{' '}
                  <span className="text-muted-foreground">(opcional)</span>
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Usaremos esto para personalizar tu plan de estudio.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accept_terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-lg border border-bg-border/60 bg-bg-raised/40 p-3">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value as boolean}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-input bg-background accent-brand-400"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer text-sm font-normal">
                    Acepto los terminos y condiciones de EGEL
                    <span className="text-brand-400">Pro</span>
                  </FormLabel>
                  <FormMessage />
                </div>
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
            Crear cuenta gratis
          </MagicButton>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Ya tienes cuenta?{' '}
        <Link
          href="/login"
          className="font-semibold text-brand-400 transition-colors hover:text-brand-500 hover:underline"
        >
          Inicia sesion
        </Link>
      </p>
    </div>
  )
}
