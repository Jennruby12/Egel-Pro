# /create-migration — Crear Migration de Supabase

Crea una nueva migration SQL para EGELPro siguiendo los estandares del proyecto.

## Input esperado del usuario
- Nombre descriptivo (snake_case ingles)
- Descripcion de lo que hace o SQL directo

## Pasos a ejecutar

1. Verificar el ultimo numero de migration en supabase/migrations/
2. Crear archivo: `supabase/migrations/NNN_nombre.sql`
3. Escribir SQL con:
   - Comentario inicial explicando el proposito
   - `IF NOT EXISTS` donde aplique
   - `CHECK constraints` para enums
   - `DEFAULT` values apropiados
   - `TIMESTAMPTZ DEFAULT NOW()` para audit fields
   - RLS policies si es tabla nueva
   - Indexes para foreign keys y campos de busqueda frecuente
4. Ejecutar: `supabase db push`
5. Ejecutar: `supabase gen types typescript --local > src/types/database.ts`
6. Verificar con una query de prueba via MCP de Supabase

## Template para tabla nueva
```sql
-- NNN_create_X_table.sql
-- Descripcion: [para que sirve esta tabla]

CREATE TABLE IF NOT EXISTS nombre_tabla (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- campos especificos --
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE nombre_tabla ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_nombre_tabla" ON nombre_tabla
  FOR ALL USING (auth.uid() = user_id);

-- Index en foreign key
CREATE INDEX idx_nombre_tabla_user_id ON nombre_tabla(user_id);
```

## NUNCA
- Modificar migrations ya existentes
- Olvidar regenerar los tipos TypeScript despues
