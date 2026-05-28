# /run-tests — Ejecutar y Verificar Tests

Corre los tests del proyecto y reporta el estado.

## Pasos
1. Ejecutar unit tests: `npm run test`
2. Si fallan, mostrar los errores y diagnosticar
3. Proponer fix para cada test fallido
4. Re-ejecutar hasta que todos pasen
5. Ejecutar typecheck: `npm run typecheck`
6. Ejecutar lint: `npm run lint`
7. Resumen final: X/Y tests pasando

## Tests obligatorios (deben existir para estos archivos)
- `tests/unit/quiz/scoring.test.ts` → scoring.ts
- `tests/unit/quiz/shuffle.test.ts` → shuffle.ts
- `tests/unit/gamification/xp.test.ts` → xp.ts
- `tests/unit/gamification/streaks.test.ts` → streaks.ts
- `tests/unit/constants/egel.test.ts` → verificar totales

## Si un archivo de logica no tiene test
Crear el test automaticamente con casos:
- Happy path (input valido → output esperado)
- Edge cases (0, null, maximo)
- Error cases (input invalido)
