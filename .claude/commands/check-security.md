# /check-security — Auditoria de Seguridad

Revisa un archivo o modulo por vulnerabilidades especificas de EGELPro.

## Input
- Ruta del archivo o modulo a revisar

## Checklist completo

### Server Actions (actions.ts)
- [ ] 'use server' en la primera linea
- [ ] Validacion Zod ANTES de cualquier operacion
- [ ] auth.getUser() para verificar sesion activa
- [ ] NO usa SUPABASE_SERVICE_ROLE_KEY (solo server utils)
- [ ] Verifica ownership antes de mutar recursos ajenos
- [ ] Retorna { error: string } en fallos — NUNCA throws
- [ ] NO expone stack traces en mensajes de error al cliente
- [ ] Los inputs vienen validados, no confiados del cliente

### Componentes cliente
- [ ] NO importa SUPABASE_SERVICE_ROLE_KEY
- [ ] NO hace mutaciones directas a DB (usa Server Actions)
- [ ] NO guarda datos sensibles en localStorage
- [ ] NO tiene fetch() directo a API routes propias (usar Server Actions)

### Queries de DB
- [ ] Usa el cliente correcto: server.ts para server, client.ts para browser
- [ ] NO usa .select('*') sin necesidad — solo campos necesarios
- [ ] Las mutaciones tienen .eq('user_id', user.id) o equivalente
- [ ] NO hay queries que bypass RLS (sin service_role en cliente)

### Variables de entorno
- [ ] NEXT_PUBLIC_ solo en vars que el browser NECESITA
- [ ] SUPABASE_SERVICE_ROLE_KEY — solo en server-side
- [ ] NO hay keys hardcodeadas en el codigo

## Output esperado
Lista de issues con severidad:
- CRITICO: vulnerabilidad explotable
- ALTO: riesgo de data leak o privilege escalation
- MEDIO: mala practica de seguridad
- BAJO: mejora recomendada
