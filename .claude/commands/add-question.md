# /add-question — Agregar Pregunta al Banco

Agrega una o varias preguntas al banco de preguntas del EGEL via Supabase MCP.

## Input del usuario
- Area (1-4 disciplinar, o T para transversal)
- Subarea (numero)
- Texto de la pregunta
- Opciones A, B, C
- Respuesta correcta (a/b/c)
- Explicacion de por que es correcta
- Dificultad (easy/medium/hard)

## Validaciones antes de insertar
1. Verificar que area/subarea existe en areas_catalog
2. correct_answer debe ser 'a', 'b' o 'c' (minuscula)
3. Las 3 opciones deben ser distintas y no vacias
4. La explicacion debe ser util para el estudiante
5. Sin "todas las anteriores" como opcion — estilo CENEVAL

## Calidad CENEVAL
- La pregunta mide COMPRENSION, no memorizar definiciones textuales
- Las 3 opciones son plausibles (no hay trampa obvia)
- Longitud similar entre opciones
- Contexto profesional real de Ingenieria de Software
- La explicacion cita el concepto del temario oficial

## Insertar via MCP
```sql
INSERT INTO questions (section, area, area_name, subarea, subarea_name, 
  question_text, option_a, option_b, option_c, correct_answer, explanation, difficulty)
VALUES ('disciplinar', 1, 'Analisis de Sistemas de Software', 1, 'Tipos de requerimientos',
  '[pregunta]', '[A]', '[B]', '[C]', 'b', '[explicacion]', 'medium')
RETURNING id;
```

Confirmar con SELECT que se inserto y mostrar el UUID.
