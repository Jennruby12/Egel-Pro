# Banco de preguntas EGELPro — Categorización completa

> **Generado:** 2026-05-29
> **Total activo en DB:** 916 reactivos + 9 estímulos para multirreactivos
> **Distribución meta CENEVAL:** 203 oficiales (4.5× cubierto)
> **Balance global A/B/C:** 33% / 33% / 33%

---

## 1. Resumen ejecutivo

| Métrica | Valor |
|---|---|
| Total preguntas activas | **916** |
| Disciplinares | 848 |
| Transversales | 68 (incluye 18 multirreactivos) |
| Estímulos para CL | 9 |
| Subáreas cubiertas | 19 / 19 oficiales ✓ |
| Easy / Medium / Hard | 123 (13%) / 612 (67%) / 181 (20%) |
| **Estilo EGEL situacional** | ~478 (52% del banco) |
| **Estilo trivia/recordación** | ~438 (48%) — heredados de XLSX Quizizz |

> **Nota:** El "estilo situacional" se detecta heurísticamente por preguntas que arrancan con "Considere…", "Un equipo…", "Una empresa…", "Un sistema…". Es proxy, no exacto, pero captura bien las preguntas EGEL-style generadas por IA.

---

## 2. Distribución por área (vs meta oficial)

| Sección | Área | Subáreas | Banco actual | Meta CENEVAL | Cobertura |
|---|---|---|---|---|---|
| Disciplinar | A1 Análisis de SS | 3 | **212** | 31 | 6.8× |
| Disciplinar | A2 Diseño de SS | 3 | **214** | 33 | 6.5× |
| Disciplinar | A3 Desarrollo de SS | 5 | **193** | 49 | 3.9× |
| Disciplinar | A4 Gestión de SS | 3 | **229** | 30 | 7.6× |
| Transversal | T1 Comprensión Lectora | 3 | **38** | 30 | 1.3× |
| Transversal | T2 Redacción Indirecta | 2 | **30** | 30 | 1.0× ✓ |
| **Total** | | **19** | **916** | **203** | **4.5×** |

---

## 3. Detalle por subárea

### A1 — Análisis de Sistemas de Software (212)

| Sub | Tema | Total | Easy | Medium | Hard | Single | Multi | Situacional |
|---|---|---|---|---|---|---|---|---|
| 1 | Tipos de requerimientos | 63 | 10 | 37 | 16 | 63 | 0 | 37 (59%) |
| 2 | Técnicas y herramientas para obtención, análisis, priorización y validación | 62 | 6 | 44 | 12 | 62 | 0 | 37 (60%) |
| 3 | Técnicas y herramientas de documentación de requerimientos | 87 | 7 | 63 | 17 | 87 | 0 | 43 (49%) |

**Temas cubiertos:** funcionales vs no funcionales, MoSCoW, Kano, Delphi, JAD, IEEE 830 SRS, UML (casos de uso, secuencia, actividad), DFD, factibilidad, COTS vs a la medida, ER, normalización, ACID, SQL.

**Ejemplo hard situacional:**
> *"Considere el siguiente caso: el equipo aplica Método Delphi para estimar el esfuerzo de un módulo nuevo. Tras la primera ronda, las estimaciones varían entre 5 y 80 días. ¿Cuál es el siguiente paso correcto?"*

---

### A2 — Diseño de Sistemas de Software (214)

| Sub | Tema | Total | Easy | Medium | Hard | Single | Multi | Situacional |
|---|---|---|---|---|---|---|---|---|
| 1 | Diseño arquitectónico de software | 66 | 6 | 42 | 18 | 66 | 0 | 45 (68%) |
| 2 | Diseño de módulos, componentes y de datos | 87 | 8 | 65 | 14 | 87 | 0 | 45 (52%) |
| 3 | Diseño de interfaces | 61 | 7 | 42 | 12 | 61 | 0 | 44 (72%) |

**Temas cubiertos:** cliente-servidor, capas, MVC/MVP/MVVM, microservicios, SOA, pipes & filters, event-driven, hexagonal, CQRS, Event Sourcing, Saga, Circuit Breaker, API Gateway, SOLID, GoF (Singleton, Factory, Observer, Strategy, Adapter, Facade, Decorator, Command, Builder, Proxy, Composite, State, Chain of Responsibility), Nielsen 10 heurísticas, WCAG, responsive, mobile-first.

**Ejemplo hard situacional:**
> *"Un sistema legacy en .NET Framework tiene lógica de negocio acoplada a SQL Server (queries en code-behind, transacciones distribuidas vía MSDTC). El equipo quiere modernizar para que la lógica sea testable unitariamente sin BD, pero no pueden reescribir todo. ¿Cuál enfoque arquitectónico…?"*

---

### A3 — Desarrollo de Sistemas de Software (193)

| Sub | Tema | Total | Easy | Medium | Hard | Single | Multi | Situacional |
|---|---|---|---|---|---|---|---|---|
| 1 | Lenguajes de desarrollo de software | 35 | 10 | 15 | 10 | 35 | 0 | 23 (66%) |
| 2 | Paradigmas de programación | 46 | 4 | 34 | 8 | 46 | 0 | 22 (48%) |
| 3 | Entornos de desarrollo | 44 | 4 | 33 | 7 | 44 | 0 | 23 (52%) |
| 4 | Gestión de datos | 34 | 6 | 17 | 11 | 34 | 0 | 27 (79%) |
| 5 | Plataformas de desarrollo | 34 | 9 | 17 | 8 | 34 | 0 | 24 (71%) |

**Temas cubiertos:** Java/Python/C/JS/TS/Swift/Kotlin, tipado estático vs dinámico, compilado vs interpretado, OOP/funcional/imperativo, DRY/KISS, code smells, refactoring, pruebas unitarias/integración/sistema/UAT, TDD, BDD, caja blanca/negra, regresión, SQL/NoSQL, ACID, JOIN, índices, ORM, transacciones, Docker, K8s, IaaS/PaaS/serverless, Next.js, Vercel, móvil nativo vs multiplataforma, CDN, CI/CD.

**Ejemplo hard situacional:**
> *"Un equipo Java mantiene un sistema con jerarquía de clases de 7 niveles: Animal → Mamífero → Carnívoro → Felino → Gato → GatoDoméstico → GatoPersa. En una refactorización, agregan un método en Mamífero que rompe asunciones de Felino y subclases. El arquitecto cita el principio…"*

---

### A4 — Gestión de Proyectos de Software (229)

| Sub | Tema | Total | Easy | Medium | Hard | Single | Multi | Situacional |
|---|---|---|---|---|---|---|---|---|
| 1 | Gestión de tiempos, costos, recursos humanos y de riesgo | 64 | 6 | 42 | 16 | 64 | 0 | 35 (55%) |
| 2 | Calidad de software | 62 | 7 | 41 | 14 | 62 | 0 | 32 (52%) |
| 3 | Metodologías de desarrollo | 103 | 10 | 80 | 13 | 103 | 0 | 35 (34%) |

**Temas cubiertos:** PMBOK 5 fases, WBS, triángulo de restricciones, COCOMO (3 modos + cálculos), Planning Poker, PERT, Monte Carlo, EMV, EVM (CV/SV/CPI/SPI), 4 estrategias de riesgo, matriz P×I, project charter, SQA vs QC, V&V, CMMI 5 niveles, ISO/IEC 25010 (8 características), ISO 9001, MTBF/MTTR/MTTF, inspección Fagan, Cascada, Modelo V, Espiral, RUP, Scrum (3 roles + 5 eventos + 3 artefactos), Kanban, XP, Manifiesto Ágil, 4 tipos mantenimiento, SCM (IEEE 828), deuda técnica, reingeniería, DORA Elite, CI/CD (Delivery vs Deployment).

**Ejemplo hard situacional:**
> *"Un servicio de streaming debe sostener disponibilidad del 99.99%. Si su MTTR es de 30 minutos, ¿cuál debe ser aproximadamente el MTTF mínimo en horas?"*

---

### T1 — Comprensión Lectora (38)

| Sub | Ámbito | Total | Easy | Medium | Hard | Single | Multi | Estímulos |
|---|---|---|---|---|---|---|---|---|
| 1 | Estudio | 20 | 0 | 20 | 0 | 20 | 0 | 0 (preguntas sueltas) |
| 2 | Literario | 12 | 4 | 6 | 2 | 0 | 12 | 6 (cuentos + ensayos) |
| 3 | Participación social | 6 | 4 | 2 | 0 | 0 | 6 | 3 (convocatorias + notas) |

**Estímulos (textos para multirreactivos T1/s2 y T1/s3):**
| # | Título | Tipo |
|---|---|---|
| 1 | El espejo del bosque | cuento |
| 2 | Sobre la soledad del lector | ensayo_literario |
| 3 | La carta de Tomás | cuento |
| 4 | El último tren | cuento |
| 5 | La poesía como resistencia | ensayo_literario |
| 6 | El cuaderno del abuelo | cuento |
| 7 | Convocatoria a asamblea vecinal sobre pavimentación | convocatoria |
| 8 | Cierre vial por mantenimiento del drenaje | nota_informativa |
| 9 | Jornada comunitaria de reforestación | convocatoria |

---

### T2 — Redacción Indirecta (30)

| Sub | Ámbito | Total | Easy | Medium | Hard | Single | Multi |
|---|---|---|---|---|---|---|---|
| 1 | Estudio | 15 | 7 | 6 | 2 | 15 | 0 |
| 2 | Participación social | 8 | 8 | 6 | 1 | 15 | 0 |

**Temas cubiertos:** concordancia, conectores, signos de puntuación, acentuación, gerundios, registro formal, estructura de cartas oficiales, convocatorias, peticiones ciudadanas, manifiestos, actas.

---

## 4. Calidad por origen de generación

| Origen | Cantidad aproximada | Estilo | Calidad esperada |
|---|---|---|---|
| **EGEL-PRO** (4 lotes IA, septiembre 2026) | ~200 | Caso 3-5 líneas, distractores que confunden conceptos cercanos, sin easy | **Alta** — más cercana al EGEL real |
| **EGEL-style** (4 lotes IA, mayo 2026) | ~300 | "Considere el siguiente caso", aplicación/análisis | **Media-alta** |
| **AI Phase 2** (55 preguntas) | 55 | Situacional pero más cortas | **Media** |
| **XLSX Quizizz** (16 archivos importados) | ~315 | Trivia / recordación pura | **Baja-media** — útiles para refresh inicial |
| **Multirreactivos T1** (manuales) | 18 | Estímulo + comprensión | **Alta** — formato real EGEL T1 |
| **Original seed** | 24 | Mixta | Media |

**Recomendación de uso:**
- Para simulacro: el sistema toma muestra aleatoria proporcional, mezcla automáticamente todos los orígenes.
- Para práctica enfocada en complejidad EGEL, filtra `difficulty=hard` (181 preguntas) — la mayoría son EGEL-PRO o EGEL-style.
- Para repaso ligero, filtra `difficulty=easy` (123 preguntas) — mayoría de XLSX.

---

## 5. Cobertura por dificultad

| Dificultad | Cantidad | % | Comentario |
|---|---|---|---|
| Easy | 123 | 13% | Útil para warm-up |
| Medium | 612 | 67% | Mayoría — refleja la media del EGEL real |
| Hard | 181 | 20% | Concentrado en EGEL-PRO. Estilo desafío con datos numéricos (EVM, MTBF, COCOMO) |

---

## 6. Pendientes / opciones de crecimiento

| Área | Posible mejora |
|---|---|
| T1 Comprensión Lectora | Generar +12 estímulos más con 2-3 preguntas c/u para subir a 60+ multirreactivos |
| T2 Redacción Indirecta | Subir a 60 con casos de redacción más complejos (convocatorias formales) |
| A3 sub 4 (Gestión datos) y sub 5 (Plataformas) | Las más débiles del banco (34 c/u). +30 más cada una recomendado |
| Imágenes | Schema soporta `image_url` pero no hay UI render. Si quieres preguntas con UML/diagramas requiere build de componente de visualización |
| Tags | Campo `tags[]` existe en DB pero está vacío en todas las preguntas. Útil para filtros (ej: "agile", "gof", "uml") |

---

## 7. Archivo JSON sincronizado

Si necesitas el JSON con los conteos exactos:

```json
{
  "generated_at": "2026-05-29",
  "total_active": 916,
  "by_section": { "disciplinar": 848, "transversal": 68 },
  "by_area": {
    "A1": 212, "A2": 214, "A3": 193, "A4": 229,
    "T1": 38, "T2": 30
  },
  "by_difficulty": { "easy": 123, "medium": 612, "hard": 181 },
  "by_type": { "single": 898, "multireactivo": 18 },
  "letter_balance": { "a": 306, "b": 305, "c": 305 },
  "subareas_covered": 19,
  "stimuli": 9
}
```

---

## 8. Cómo consultar en vivo

```sql
-- Distribución por subárea
SELECT section, area, subarea, count(*) AS total,
       count(*) FILTER (WHERE difficulty='easy') AS easy,
       count(*) FILTER (WHERE difficulty='medium') AS medium,
       count(*) FILTER (WHERE difficulty='hard') AS hard
FROM questions
WHERE is_deleted=false AND is_active=true
GROUP BY 1,2,3 ORDER BY 1,2,3;

-- Solo preguntas estilo EGEL-PRO (alta calidad)
SELECT count(*)
FROM questions
WHERE is_deleted=false
  AND question_text ILIKE 'Considere el siguiente caso:%';
```
