'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Share2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  code: string
  groupName: string
  examName?: string | null
}

/**
 * Comparte la invitación de un grupo por WhatsApp o copiando el enlace.
 * Usa window.location.origin → no depende de env vars del dominio.
 */
export function ShareInviteButton({ code, groupName, examName }: Props) {
  const [copied, setCopied] = useState(false)

  function buildLink() {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return `${origin}/join/${code}`
  }

  function message() {
    const link = buildLink()
    const examPart = examName ? ` (${examName})` : ''
    return `Te invito a mi grupo "${groupName}"${examPart} en EGELPro. Únete aquí: ${link} — o usa el código ${code}.`
  }

  function shareWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(message())}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(message())
      setCopied(true)
      toast.success('Invitación copiada')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('No se pudo copiar')
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" size="sm" onClick={shareWhatsApp} className="bg-[#25D366] text-white hover:bg-[#1eb858]">
        <Share2 className="h-4 w-4" /> Compartir por WhatsApp
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={copyInvite}>
        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
        Copiar invitación
      </Button>
    </div>
  )
}
