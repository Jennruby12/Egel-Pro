# /create-server-action — Crear Server Action

Crea un Server Action siguiendo el patron obligatorio de EGELPro.

## Input del usuario
- Nombre de la action (verbo + sustantivo)
- Modulo
- Campos del schema Zod
- Operacion de DB
- Ruta a revalidar

## Template OBLIGATORIO

```typescript
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// 1. Schema Zod para validacion
const [Nombre]Schema = z.object({
  campo: z.string().min(1).max(100),
  // ... mas campos
})

export async function [nombreAction](
  input: z.infer<typeof [Nombre]Schema>
): Promise<{ success: true; data: unknown } | { error: string }> {

  // 2. VALIDAR PRIMERO
  const validated = [Nombre]Schema.safeParse(input)
  if (!validated.success) {
    return { error: 'Datos invalidos: ' + JSON.stringify(validated.error.flatten()) }
  }

  // 3. AUTH
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 4. OWNERSHIP CHECK (si aplica)
  // const { data: resource } = await supabase.from('tabla').select('user_id').eq('id', validated.data.id).single()
  // if (resource?.user_id !== user.id) return { error: 'Sin permiso' }

  // 5. OPERACION DB
  const { data, error } = await supabase
    .from('tabla')
    .insert({ user_id: user.id, ...validated.data })
    .select()
    .single()

  if (error) {
    console.error('[nombreAction]:', error.message)
    return { error: 'Error al procesar la solicitud' }
  }

  // 6. REVALIDAR
  revalidatePath('/ruta')
  return { success: true, data }
}
```

## Reglas absolutas
- NUNCA `throw` — siempre `return { error: string }`
- SIEMPRE validar Zod antes de tocar DB
- SIEMPRE verificar auth
- NO exponer mensajes de error internos de Supabase al cliente
- El tipo de retorno debe ser union: `{ success: true, data } | { error: string }`
