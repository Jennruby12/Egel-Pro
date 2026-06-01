# Calidad de software

La calidad del software es un atributo critico que determina el exito o fracaso de un sistema en produccion. No basta con que el software funcione: debe ser confiable, mantenible, eficiente, seguro y satisfactorio para el usuario. La gestion de calidad se aborda desde multiples angulos: aseguramiento (SQA) que protege el proceso, control (QC) que valida el producto, verificacion y validacion (V&V) que confirman correctitud, modelos de madurez como CMMI que evaluan capacidades organizacionales y estandares como ISO/IEC 25010 que definen caracteristicas medibles. Para el EGEL ISOFT debes dominar las distinciones conceptuales (frecuentes en preguntas), conocer las metricas de fiabilidad (MTBF, MTTR, disponibilidad) y entender los tipos y niveles de pruebas. Esta guia te prepara para identificar correctamente que tecnica usar, calcular metricas y aplicar los estandares mas relevantes.

## Tema 1: SQA vs QC

Aunque suelen confundirse, son enfoques complementarios pero diferentes.

### Software Quality Assurance (SQA)

Es un conjunto de actividades sistematicas orientadas al **PROCESO** de desarrollo. Su objetivo es prevenir defectos asegurando que el proceso este bien definido y se ejecute correctamente. Se enfoca en:

- Definicion de estandares y procedimientos
- Auditorias de procesos
- Capacitacion del equipo
- Revisiones de metodologia
- Mejora continua

SQA es proactivo, preventivo y orientado a procesos. Tipicamente es responsabilidad de un grupo independiente del equipo de desarrollo.

### Quality Control (QC)

Es un conjunto de actividades orientadas al **PRODUCTO** terminado o en construccion. Su objetivo es detectar defectos en el software entregado. Incluye:

- Pruebas funcionales y no funcionales
- Inspecciones de codigo
- Revisiones de entregables
- Medicion de defectos

QC es reactivo, detectivo y orientado a productos. Lo ejecutan testers o el mismo equipo de desarrollo.

### Ejemplo

En una empresa que desarrolla apps moviles, SQA define que TODO codigo debe pasar revision por pares y pruebas unitarias antes de merge (proceso). QC ejecuta los casos de prueba sobre el binario compilado para detectar bugs antes de release (producto).

### Tip CENEVAL

Memoriza la frase: "SQA es al PROCESO lo que QC es al PRODUCTO". SQA previene (proactivo); QC detecta (reactivo). En examen una pregunta tipica describe una actividad y pide identificar si es SQA o QC: auditar el cumplimiento de estandares = SQA; ejecutar casos de prueba = QC.

## Tema 2: Verificacion y Validacion (V&V)

V&V son dos actividades complementarias que responden preguntas diferentes.

### Verificacion

Pregunta: "Estamos construyendo el producto CORRECTAMENTE?" Es decir, el software cumple con su especificacion? Verifica que cada fase produzca artefactos consistentes con la fase anterior. Es interna al proceso de desarrollo.

Ejemplos de verificacion:
- Revisar que el codigo implementa los requisitos especificados
- Comprobar que el diseno refleja los requisitos
- Validar consistencia entre documentos

### Validacion

Pregunta: "Estamos construyendo el producto CORRECTO?" Es decir, el software satisface las necesidades reales del usuario? Es externa: confronta el software con el mundo real y los stakeholders.

Ejemplos de validacion:
- Pruebas de aceptacion con usuarios reales
- Pruebas beta
- Demostraciones a stakeholders

### Tecnicas de revision

**Walkthrough (recorrido):** el autor presenta su trabajo a un grupo para recibir comentarios informales. Es educativo y poco estructurado.

**Inspeccion Fagan:** revision formal de Michael Fagan con roles definidos (moderador, lector, autor, revisores). Sigue un proceso estricto:
1. Planificacion
2. Vision general (overview)
3. Preparacion individual
4. Reunion de inspeccion
5. Retrabajo
6. Seguimiento

Es la tecnica mas rigurosa y eficaz: detecta entre 60% y 90% de defectos. Genera estadisticas para mejorar el proceso.

**Revision tecnica:** mas formal que walkthrough, menos que inspeccion. Detecta inconsistencias y desviaciones de estandares.

### Ejemplo

Equipo desarrolla modulo de pagos. Verificacion: revisar que el codigo implementa el algoritmo de calculo de impuestos segun la especificacion. Validacion: el contador del cliente confirma que los calculos coinciden con la ley fiscal vigente y sus expectativas operativas. Sin validacion podriamos tener un sistema correcto segun especificacion pero inutil en la practica.

### Tip CENEVAL

Memoriza con esta regla: VErificacion = Estamos haciendo BIEN (mnemonico VE = vision interna). VAlidacion = el producto VAle para el usuario (vision externa). Inspeccion Fagan es siempre la respuesta cuando preguntan por la revision mas formal y eficaz.

## Tema 3: ISO/IEC 25010

Estandar internacional que define el modelo de calidad de productos de software, sucesor de ISO/IEC 9126. Establece ocho caracteristicas de calidad del producto.

### Las 8 caracteristicas

1. **Adecuacion funcional (Functional Suitability):** grado en que el software cumple sus funciones declaradas. Subcaracteristicas: completitud, correctitud, pertinencia.

2. **Eficiencia de desempeno (Performance Efficiency):** desempeno relativo a recursos consumidos. Subcaracteristicas: comportamiento temporal (tiempos de respuesta), utilizacion de recursos (memoria, CPU), capacidad (cargas maximas).

3. **Compatibilidad (Compatibility):** capacidad de coexistir e interoperar con otros sistemas. Subcaracteristicas: coexistencia, interoperabilidad.

4. **Usabilidad (Usability):** facilidad de uso para usuarios. Subcaracteristicas: reconocimiento de adecuacion, aprendizaje, operabilidad, proteccion contra errores, estetica, accesibilidad.

5. **Fiabilidad (Reliability):** capacidad de mantener desempeno bajo condiciones especificadas. Subcaracteristicas: madurez, disponibilidad, tolerancia a fallos, recuperabilidad.

6. **Seguridad (Security):** proteccion de informacion y datos. Subcaracteristicas: confidencialidad, integridad, no repudio, autenticidad, responsabilidad (accountability).

7. **Mantenibilidad (Maintainability):** facilidad de modificacion. Subcaracteristicas: modularidad, reusabilidad, analizabilidad, modificabilidad, testabilidad.

8. **Portabilidad (Portability):** facilidad de transferir entre entornos. Subcaracteristicas: adaptabilidad, instalabilidad, intercambiabilidad.

### Calidad en uso

Ademas de las 8 caracteristicas del producto, ISO/IEC 25010 define calidad EN USO con 5 caracteristicas: eficacia, eficiencia, satisfaccion, libertad de riesgo, cobertura de contexto.

### Ejemplo

Aplicacion bancaria movil. Adecuacion funcional: permite transferir entre cuentas. Eficiencia: tiempo de respuesta menor a 2 segundos con 10,000 usuarios concurrentes. Seguridad: cifrado TLS 1.3 y autenticacion biometrica. Usabilidad: tareas comunes completables en menos de 3 toques. Portabilidad: corre en iOS y Android sin cambios significativos.

### Tip CENEVAL

Memoriza el numero 8: ocho caracteristicas. CENEVAL puede preguntar a que caracteristica pertenece una subcaracteristica especifica. Recuerda: tolerancia a fallos pertenece a Fiabilidad; cifrado pertenece a Seguridad; instalabilidad pertenece a Portabilidad. La diferencia con ISO/IEC 9126 (anterior) es que 25010 agrego Seguridad y Compatibilidad como caracteristicas independientes.

## Tema 4: CMMI

Capability Maturity Model Integration es un modelo desarrollado por el SEI (Software Engineering Institute) que evalua y mejora procesos organizacionales. Define cinco niveles de madurez.

### Los 5 niveles

**Nivel 1 - Inicial (Initial):** procesos ad-hoc, caoticos, dependientes de heroes individuales. Exitos impredecibles y no replicables.

**Nivel 2 - Gestionado (Managed):** procesos planificados y ejecutados segun politica. Se gestionan requisitos, planificacion, monitoreo, gestion de acuerdos con proveedores, medicion y analisis, aseguramiento de calidad de procesos y productos, y gestion de configuracion.

**Nivel 3 - Definido (Defined):** procesos caracterizados y comprendidos. Existen procesos estandar de la organizacion que se adaptan (tailoring) a cada proyecto. Areas: desarrollo de requisitos, solucion tecnica, integracion del producto, verificacion, validacion, enfoque organizacional en procesos, definicion de procesos organizacionales, entrenamiento, gestion integrada del proyecto, gestion de riesgos, analisis de decisiones.

**Nivel 4 - Gestionado cuantitativamente (Quantitatively Managed):** se controlan procesos usando estadistica y datos cuantitativos. Areas: desempeno del proceso organizacional, gestion cuantitativa del proyecto.

**Nivel 5 - Optimizando (Optimizing):** mejora continua basada en analisis cuantitativo. Areas: gestion del desempeno organizacional, analisis causal y resolucion.

### Representaciones

- **Continua:** evalua nivel de capacidad (0 a 5) por area de proceso individual
- **Por etapas:** evalua nivel de madurez (1 a 5) de toda la organizacion

### Ejemplo

Empresa nivel 1: cada desarrollador usa sus propias practicas; entregas se retrasan impredeciblemente. Tras adoptar Scrum y plantillas de requisitos llega a nivel 2. Define procesos estandar con tailoring por proyecto: nivel 3. Mide KPIs (defectos por KLOC, productividad) y los controla estadisticamente: nivel 4. Implementa programa de mejora continua basado en analisis causal: nivel 5.

### Tip CENEVAL

Memoriza el orden: Initial - Managed - Defined - Quantitatively Managed - Optimizing (IMDQO). El nivel 1 es el INICIAL (no hay nivel 0 en representacion por etapas). En representacion continua si existe nivel 0 (incompleto). La mayoria de organizaciones esta en nivel 2 o 3; alcanzar 4 o 5 es raro.

## Tema 5: Metricas de fiabilidad

Cuantifican la capacidad de un sistema para operar sin fallos.

### MTBF (Mean Time Between Failures)

Tiempo promedio entre fallos consecutivos del sistema. Se aplica a sistemas REPARABLES. Mientras mayor sea, mas confiable es el sistema.

MTBF = Tiempo total de operacion / Numero de fallos

### MTTR (Mean Time To Repair)

Tiempo promedio que toma reparar el sistema despues de un fallo. Mientras MENOR sea, mejor.

MTTR = Tiempo total de reparacion / Numero de reparaciones

### MTTF (Mean Time To Failure)

Tiempo promedio hasta el PRIMER fallo. Se aplica a sistemas NO reparables (componentes que se reemplazan, no se reparan). No incluye tiempo de reparacion porque el componente se descarta.

### Disponibilidad (Availability)

Fraccion del tiempo que el sistema esta operativo. Es la metrica clave de SLAs.

**Formula:** Availability = MTBF / (MTBF + MTTR)

Se expresa en porcentaje o en "nueves":
- 99% = "dos nueves" (3.65 dias de downtime al ano)
- 99.9% = "tres nueves" (8.76 horas al ano)
- 99.99% = "cuatro nueves" (52.6 minutos al ano)
- 99.999% = "cinco nueves" (5.26 minutos al ano)

### Ejemplo numerico

Sistema con MTBF = 200 horas y MTTR = 4 horas.
Availability = 200 / (200 + 4) = 200/204 = 0.9804 = 98.04%

En un mes (720 horas), el sistema estara caido aproximadamente 720 * (1 - 0.9804) = 14.1 horas.

Si mejoramos MTTR a 1 hora:
Availability = 200 / 201 = 99.50%
Downtime mensual: 3.6 horas (mejora de 10 horas)

### Tip CENEVAL

Distingue claramente:
- MTBF: tiempo entre fallos (sistemas reparables)
- MTTF: tiempo hasta primer fallo (sistemas NO reparables)
- MTTR: tiempo de reparacion

La formula de disponibilidad SIEMPRE es MTBF / (MTBF + MTTR). CENEVAL ama pedir el calculo directo con dos numeros dados. Tambien suele incluir distractores con MTTF en el denominador.

## Tema 6: Pruebas de software

Categorizadas por enfoque y por nivel.

### Por enfoque

**Caja blanca (estructural):** se conoce el codigo interno. Tecnicas: cobertura de sentencias, decisiones, condiciones, caminos, complejidad ciclomatica. Util en pruebas unitarias.

**Caja negra (funcional):** se desconoce el codigo, solo importan entradas y salidas. Tecnicas: particiones equivalentes, valores limite, tablas de decision, transicion de estados, casos de uso. Util en pruebas de aceptacion.

**Caja gris:** combina ambas. Conocimiento parcial de la estructura interna.

### Por nivel

**Pruebas unitarias (unit testing):** verifican un modulo o funcion aisladamente. Las realizan los desarrolladores. Tipicamente con frameworks como JUnit, NUnit, pytest, Vitest.

**Pruebas de integracion:** verifican interaccion entre modulos integrados. Estrategias: big bang (todo junto), top-down, bottom-up, sandwich.

**Pruebas de sistema:** verifican el sistema completo cumpliendo requisitos funcionales y no funcionales (rendimiento, seguridad, carga, estres).

**Pruebas de aceptacion (UAT - User Acceptance Testing):** las realiza el usuario final para aprobar el sistema. Confirma cumplimiento de necesidades de negocio.

### Por proposito

**Pruebas de regresion:** verifican que cambios no rompieron funcionalidad previa. Se automatizan por su frecuencia.

**Pruebas de humo (smoke):** verificacion rapida y superficial de que la build funciona en lo basico. Se ejecutan al inicio de cada ciclo de pruebas.

**Pruebas exploratorias:** sin scripts predefinidos, el tester explora el sistema con creatividad para encontrar defectos inesperados.

**Pruebas de carga:** verifican comportamiento bajo carga esperada (1000 usuarios concurrentes).

**Pruebas de estres:** llevan el sistema al limite para encontrar punto de quiebre.

**Pruebas alfa:** internas, en ambiente controlado.

**Pruebas beta:** con usuarios reales seleccionados, en ambiente de produccion.

### Pruebas de seguridad

Penetration testing (pentesting), analisis de vulnerabilidades, fuzzing.

### Ejemplo

Para un e-commerce: pruebas unitarias del calculo de descuentos (caja blanca, cubrir todas las condiciones); integracion del carrito con pasarela de pagos; sistema completo con flujo de compra; UAT con usuarios reales que aprueban; regresion automatizada en CI para asegurar que nuevos features no rompen el checkout; smoke test al desplegar a staging; carga simulando Black Friday (50,000 usuarios concurrentes).

### Tip CENEVAL

Mnemonico de niveles ascendentes: UNIT > INTEGRATION > SYSTEM > ACCEPTANCE. Pirámide de testing: muchas unitarias (base), menos de integracion (medio), pocas E2E (cima). Caja blanca = conozco el codigo; caja negra = ignoro el codigo (solo entrada/salida). UAT es responsabilidad del USUARIO, no del tester o developer.

## Resumen

- SQA actua sobre el PROCESO (prevenir); QC actua sobre el PRODUCTO (detectar)
- Verificacion: construir bien el producto (interno, vs especificacion); Validacion: construir el producto correcto (externo, vs usuario)
- Inspeccion Fagan es la revision mas formal y eficaz (60-90% defectos)
- ISO/IEC 25010 define 8 caracteristicas: funcional, eficiencia, compatibilidad, usabilidad, fiabilidad, seguridad, mantenibilidad, portabilidad
- CMMI tiene 5 niveles: Initial, Managed, Defined, Quantitatively Managed, Optimizing
- MTBF = tiempo entre fallos (reparables); MTTF = tiempo a primer fallo (no reparables); MTTR = tiempo de reparacion
- Disponibilidad = MTBF / (MTBF + MTTR)
- Pruebas por enfoque (caja blanca/negra) y por nivel (unit/integration/system/UAT)
- Regresion verifica que cambios no rompan lo anterior; smoke es rapida y superficial

## Errores comunes

- Confundir SQA y QC (SQA proceso, QC producto)
- Invertir verificacion y validacion (Verificacion = bien hecho; Validacion = producto correcto)
- Olvidar que ISO/IEC 25010 son 8 caracteristicas (no 6 como 9126)
- Pensar que CMMI nivel 1 es bueno (es el inicial, mas bajo)
- Confundir MTBF con MTTF (uno es entre fallos, otro hasta primer fallo)
- Invertir formula de disponibilidad (es MTBF/(MTBF+MTTR), no MTTR/(MTBF+MTTR))
- Pensar que caja blanca conoce solo el comportamiento (en realidad conoce el codigo)
- Confundir UAT con pruebas de sistema (UAT es usuario, sistema es equipo de pruebas)
- Asignar pruebas unitarias al tester (las hacen los desarrolladores)
- Pensar que pruebas de estres son iguales que pruebas de carga (estres lleva al limite, carga es uso esperado)
