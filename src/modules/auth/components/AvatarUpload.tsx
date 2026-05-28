'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { Loader2, Upload, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { setAvatarUrl } from '@/modules/auth/profile-actions'

type Props = {
  userId: string
  currentAvatarUrl: string | null
  email: string
}

function getInitials(email: string): string {
  return email.slice(0, 2).toUpperCase()
}

export function AvatarUpload({ userId, currentAvatarUrl, email }: Props) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [pending, startTransition] = useTransition()

  async function handleUpload(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Imagen muy grande. Maximo 2 MB.')
      return
    }
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen')
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${userId}/avatar-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      const result = await setAvatarUrl({ avatarUrl: publicUrl })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Avatar actualizado')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al subir')
    } finally {
      setUploading(false)
    }
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await setAvatarUrl({ avatarUrl: null })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Avatar eliminado')
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-bg-border bg-bg-raised text-2xl font-semibold">
        {currentAvatarUrl ? (
          <Image
            src={currentAvatarUrl}
            alt="Avatar"
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        ) : (
          getInitials(email)
        )}
      </div>
      <div className="space-y-2">
        <label className="inline-flex">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleUpload(file)
            }}
          />
          <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
            <span className="cursor-pointer">
              {uploading ? <Loader2 className="animate-spin" /> : <Upload className="h-4 w-4" />}
              Cambiar avatar
            </span>
          </Button>
        </label>
        {currentAvatarUrl ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={pending}
            className="text-danger hover:bg-danger/10"
          >
            <Trash2 className="h-4 w-4" />
            Quitar
          </Button>
        ) : null}
        <p className="text-xs text-muted-foreground">PNG o JPG, max 2 MB</p>
      </div>
    </div>
  )
}
