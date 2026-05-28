# /add-module — Crear Scaffold de Nuevo Modulo

Crea la estructura completa de un nuevo feature module.

## Input
- Nombre del modulo (singular, kebab-case)
- Descripcion breve de su funcion

## Archivos a crear

```
src/modules/[nombre]/
├── actions.ts          ← Server Actions ('use server')
├── types.ts            ← TypeScript interfaces del modulo
├── components/
│   └── index.ts        ← Re-exports de todos los componentes
└── hooks/
    └── index.ts        ← Re-exports de todos los hooks
```

## Contenido base de actions.ts
```typescript
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// TODO: Implementar Server Actions del modulo [nombre]
// Cada action debe: 1) Validar Zod, 2) Auth, 3) Ownership, 4) DB, 5) Revalidate
```

## Contenido base de types.ts
```typescript
// Types del modulo [nombre]
// Importar tipos de DB desde: import type { Tables } from '@/types/database'

export interface [Nombre]State {
  // estado del modulo
}
```
