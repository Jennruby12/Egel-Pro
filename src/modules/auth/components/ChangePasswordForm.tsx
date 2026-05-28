'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, KeyRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
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
import { changePassword } from '@/modules/auth/profile-actions'
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from '@/lib/validations/profile.schema'

export function ChangePasswordForm() {
  const [pending, startTransition] = useTransition()

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { new_password: '', confirm_password: '' },
  })

  function onSubmit(input: ChangePasswordInput) {
    startTransition(async () => {
      const result = await changePassword(input)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Contrasena actualizada')
      form.reset()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contrasena</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
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
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <KeyRound className="h-4 w-4" />}
            Cambiar contrasena
          </Button>
        </div>
      </form>
    </Form>
  )
}
