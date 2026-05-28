# /gen-types — Regenerar Tipos TypeScript de Supabase

Actualiza los tipos TypeScript despues de cambios en el schema de DB.

## Cuando usar
- Despues de ejecutar `supabase db push`
- Despues de cualquier migration nueva
- Cuando hay errores de tipo relacionados con tablas de DB

## Pasos
1. Ejecutar: `supabase gen types typescript --local > src/types/database.ts`
2. Verificar que el archivo no esta vacio (debe tener > 50 lineas)
3. Ejecutar: `npm run typecheck`
4. Si hay errores de tipos nuevos, mostrarlos y proponer fixes
5. Los imports en el codigo deben ser:
   ```typescript
   import type { Database, Tables, Enums } from '@/types/database'
   type Profile = Tables<'profiles'>
   ```

## NUNCA
- Editar manualmente src/types/database.ts (se sobreescribe)
- Commitear cambios de schema sin regenerar los tipos
