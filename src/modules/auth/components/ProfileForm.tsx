'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'

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
import { updateProfile } from '@/modules/auth/profile-actions'
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from '@/lib/validations/profile.schema'
import type { Tables } from '@/types/database'

type Props = {
  profile: Tables<'profiles'>
}

export function ProfileForm({ profile }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: profile.full_name ?? '',
      university: profile.university ?? '',
      exam_date: profile.exam_date ?? '',
      goal_level: (profile.goal_level as 'satisfactorio' | 'sobresaliente') ?? 'sobresaliente',
    },
  })

  function onSubmit(input: UpdateProfileInput) {
    startTransition(async () => {
      const result = await updateProfile(input)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Perfil actualizado')
      router.refresh()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Universidad</FormLabel>
              <FormControl><Input placeholder="UNAM, IPN, ITESM..." {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="exam_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de examen</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormDescription>Usamos esto para tu cuenta regresiva en el dashboard</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goal_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="satisfactorio">Satisfactorio (&gt;= 60%)</option>
                  <option value="sobresaliente">Sobresaliente (&gt;= 80%)</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar cambios
          </Button>
        </div>
      </form>
    </Form>
  )
}
