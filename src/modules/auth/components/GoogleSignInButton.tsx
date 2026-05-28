'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { MagicButton } from '@/components/ui/magic-button'
import { signInWithGoogle } from '@/modules/auth/actions'

export function GoogleSignInButton({
  label = 'Continuar con Google',
}: {
  label?: string
}) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    const result = await signInWithGoogle()
    if (!result.success) {
      toast.error(result.error)
      setLoading(false)
      return
    }
    // Redirigir a la URL de Google
    window.location.href = result.data!.url
  }

  return (
    <MagicButton
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
      {loading ? 'Redirigiendo...' : label}
    </MagicButton>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.6L19 3.8C17.1 2 14.7 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.4 2.6C5.9 7 8.7 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h6.2c-.3 1.4-1.1 2.6-2.3 3.4l3.5 2.7c2-1.9 3.2-4.7 3.2-8.1z"
      />
      <path
        fill="#FBBC05"
        d="M5 14.1c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2L1.6 7.4C.6 9.1 0 10.9 0 13s.6 3.9 1.6 5.6L5 14.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.7 0 5.1-.9 6.8-2.5l-3.5-2.7c-1 .7-2.2 1.1-3.7 1.1-3.3 0-6.1-2.2-7.1-5.2L1 16.3C2.9 20.1 7.1 23 12 23z"
      />
    </svg>
  )
}
