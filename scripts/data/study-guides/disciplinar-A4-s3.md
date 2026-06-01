# Metodologias de desarrollo

La metodologia de desarrollo es el marco que organiza las actividades del ciclo de vida del software. Elegir la correcta segun el contexto del proyecto, la madurez del equipo, la volatilidad de requisitos y la cultura organizacional puede ser determinante para el exito. Existen dos grandes familias: las tradicionales (predictivas) que apuestan por planificacion detallada por adelantado y las agiles (adaptativas) que abrazan el cambio mediante iteraciones cortas. Mas alla de esta dicotomia, surgen practicas hibridas y enfoques modernos como DevOps. Para el EGEL ISOFT debes distinguir conceptualmente cada metodologia, conocer sus roles, artefactos y ceremonias, y entender cuando aplicar cada una. Esta guia cubre desde Cascada y RUP hasta Scrum, Kanban, XP, Lean y DevOps.

## Tema 1: Metodologias tradicionales

Asumen que requisitos son estables y pueden definirse al inicio. Avanzan secuencialmente con fases claramente delimitadas.

### Cascada (Waterfall)

Modelo propuesto por Winston Royce en 1970 (paradojicamente como ejemplo de lo que NO se debe hacer). Define fases lineales:

1. Analisis de requisitos
2. Diseno
3. Implementacion (codificacion)
4. Pruebas
5. Despliegue
6. Mantenimiento

Cada fase debe completarse antes de iniciar la siguiente. El retorno a fases anteriores es costoso.

**Ventajas:** simplicidad, documentacion exhaustiva, facil seguimiento, util cuando requisitos estan totalmente claros y son estables (ej. proyectos regulados, sistemas embebidos criticos).

**Desventajas:** rigido, no admite cambios, retroalimentacion del cliente tardia, alto riesgo si los requisitos cambian.

### Modelo V

Variante de cascada que enfatiza V&V emparejando cada fase de desarrollo con una fase de pruebas correspondiente:

- Requisitos <-> Pruebas de aceptacion
- Diseno de sistema <-> Pruebas de sistema
- Diseno detallado <-> Pruebas de integracion
- Implementacion <-> Pruebas unitarias

La forma de "V" representa la bajada (desarrollo) y subida (verificacion). Cada fase de desarrollo planifica pruebas correspondientes ANTES de codificar.

**Util en:** sistemas criticos, embebidos, defensa, aeroespacial.

### Espiral (Boehm 1986)

Modelo iterativo que combina desarrollo y gestion de riesgos. Cada vuelta de la espiral tiene cuatro cuadrantes:

1. Determinar objetivos, alternativas y restricciones
2. Evaluar alternativas e identificar/resolver riesgos
3. Desarrollar y verificar producto del siguiente nivel
4. Planificar siguiente fase

Cada iteracion produce un prototipo cada vez mas refinado. La gestion de riesgos es el motor: si el riesgo es alto, no se avanza hasta resolverlo (mediante prototipos, simulaciones, benchmarks).

**Util en:** proyectos grandes, complejos y con muchos riesgos tecnicos o de mercado.

### RUP (Rational Unified Process)

Proceso iterativo desarrollado por Rational Software (ahora IBM), basado en UML. Define cuatro fases:

**Inception (Inicio):** definir vision, alcance preliminar, casos de uso clave, viabilidad. Producto: documento de vision y modelo de casos de uso inicial.

**Elaboration (Elaboracion):** capturar la mayoria de requisitos, definir arquitectura ejecutable, eliminar riesgos arquitectonicos principales. Producto: arquitectura baseline y plan detallado.

**Construction (Construccion):** desarrollar la mayor parte del codigo. Iteraciones que entregan releases internas. Producto: software beta listo para usuarios.

**Transition (Transicion):** entregar el sistema al usuario final, pruebas beta, capacitacion, despliegue. Producto: release operativo en produccion.

RUP define seis disciplinas que se aplican en distinta intensidad segun la fase: modelado de negocio, requisitos, analisis y diseno, implementacion, pruebas, despliegue.

### Ejemplo

Sistema de control aereo (critico, requisitos definidos por regulacion): cascada o modelo V. Plataforma de e-commerce innovadora: RUP iterativo. Proyecto con incertidumbre tecnica (uso de IA experimental): espiral.

### Tip CENEVAL

Memoriza las 4 fases de RUP: I-E-C-T (Inception, Elaboration, Construction, Transition). NO confundirlas con grupos de procesos PMBOK. El modelo V NO es cascada pura: agrega el emparejamiento desarrollo-pruebas. Espiral se distingue por el enfasis explicito en gestion de RIESGOS por iteracion.

## Tema 2: Manifiesto Agil

Publicado en 2001 por 17 desarrolladores en Snowbird, Utah. Establece valores y principios que dieron origen a las metodologias agiles.

### Los 4 valores

Estamos descubriendo formas mejores de desarrollar software valorando:

1. **Individuos e interacciones** SOBRE procesos y herramientas
2. **Software funcionando** SOBRE documentacion exhaustiva
3. **Colaboracion con el cliente** SOBRE negociacion contractual
4. **Respuesta ante el cambio** SOBRE seguir un plan

La frase clave es "aunque hay valor en los elementos de la derecha, valoramos mas los de la izquierda". No niegan los procesos o la documentacion, solo priorizan lo de la izquierda.

### Los 12 principios (resumen)

1. Mayor prioridad: satisfacer al cliente mediante entrega temprana y continua de software valioso
2. Aceptar cambios de requisitos incluso en etapas tardias
3. Entregar software funcionando frecuentemente (semanas o meses)
4. Negocio y desarrolladores trabajan JUNTOS diariamente
5. Construir proyectos en torno a individuos motivados
6. Conversacion cara a cara es el metodo mas eficiente de comunicacion
7. Software funcionando es la principal medida de progreso
8. Desarrollo sostenible: ritmo constante indefinido
9. Atencion continua a excelencia tecnica y buen diseno
10. Simplicidad: el arte de maximizar el trabajo NO realizado
11. Las mejores arquitecturas, requisitos y disenos emergen de equipos auto-organizados
12. Reflexion regular sobre como ser mas efectivos y ajustar comportamiento

### Tip CENEVAL

CENEVAL pregunta literalmente "que valora MAS el manifiesto agil". La respuesta SIEMPRE es lo de la IZQUIERDA del "sobre". Ejemplo: "individuos e interacciones SOBRE procesos y herramientas" -> valora mas individuos. No caer en la trampa de pensar que se descartan procesos: solo se prioriza menos.

## Tema 3: Scrum

Marco de trabajo agil mas popular, definido por Ken Schwaber y Jeff Sutherland. Se basa en sprints (iteraciones de duracion fija, tipicamente 2-4 semanas) que entregan incrementos potencialmente liberables.

### Los 3 roles

**Product Owner (PO):** representa al cliente, define y prioriza el Product Backlog. Maximiza el valor del producto. Es UNA sola persona, no un comite.

**Scrum Master (SM):** facilita el proceso Scrum, elimina impedimentos, protege al equipo de interrupciones, entrena en agilidad. NO es jefe de proyecto ni jefe de equipo.

**Development Team:** profesionales auto-organizados (3-9 personas idealmente) que entregan el incremento. Son multifuncionales y no tienen subroles formales (todos son "Developers").

### Los 5 eventos

**Sprint:** contenedor de todos los demas eventos. Duracion fija (timebox) tipicamente 2-4 semanas. Nunca se extiende.

**Sprint Planning:** al inicio del sprint, el equipo define el objetivo (Sprint Goal) y selecciona items del Product Backlog. Timebox: hasta 8 horas para sprint de 4 semanas.

**Daily Scrum (Daily Standup):** reunion diaria de 15 minutos para sincronizar el dia. Tres preguntas clasicas: que hice ayer, que hare hoy, que impedimentos tengo. Solo participa el Development Team (PO y SM pueden escuchar).

**Sprint Review:** al final del sprint, se presenta el incremento a stakeholders, se recibe retroalimentacion y se actualiza el Product Backlog. Timebox: hasta 4 horas para sprint de 4 semanas.

**Sprint Retrospective:** despues del Review, el equipo Scrum reflexiona sobre el proceso. Que salio bien, que mejorar, acciones concretas. Timebox: hasta 3 horas.

### Los 3 artefactos

**Product Backlog:** lista priorizada y ordenada de TODO el trabajo del producto. Es dinamica, propiedad del Product Owner. Items: user stories, bugs, mejoras.

**Sprint Backlog:** items seleccionados para el sprint actual mas el plan para entregarlos. Propiedad del Development Team.

**Increment:** suma de items del Product Backlog completados en el sprint mas todos los increments anteriores. Debe estar en estado "Done".

### Definicion de Terminado (Definition of Done - DoD)

Acuerdo formal del equipo sobre que significa que un item este "terminado". Ejemplo de criterios: codigo revisado por pares, pruebas unitarias pasando con cobertura > 80%, documentado, desplegado en staging, aprobado por PO. Garantiza calidad uniforme.

### Ejemplo

Equipo Scrum desarrolla app movil con sprints de 2 semanas. PO prioriza backlog con "login social" en top. En Sprint Planning, equipo se compromete a 8 historias incluyendo login. Daily Standup detecta que SDK de Google requiere actualizacion (impedimento que SM resuelve). En Review se demuestra login funcionando; stakeholders piden agregar Apple Login (nuevo item en backlog). En Retrospective acuerdan automatizar mas pruebas para evitar bugs en regresion.

### Tip CENEVAL

3 roles, 5 eventos, 3 artefactos (3-5-3). El PO es UNA persona, no varios. El SM NO es jefe ni gestor. El Daily NO es para reportar al jefe; es para SINCRONIZAR al equipo. La Retrospective es sobre el PROCESO; la Review es sobre el PRODUCTO. El sprint NUNCA se extiende.

## Tema 4: Kanban

Metodo originario de Toyota (Sistema de Produccion Toyota) adaptado a software por David Anderson. Se basa en flujo continuo en lugar de iteraciones.

### Principios

1. Comenzar con lo que se hace ahora (no requiere transformacion radical)
2. Acordar cambios evolutivos e incrementales
3. Respetar roles y responsabilidades actuales
4. Liderazgo en todos los niveles

### Practicas

**Visualizar el flujo:** tablero Kanban con columnas que representan estados (Backlog, To Do, In Progress, Review, Done). Cada tarjeta es un item de trabajo.

**Limitar el WIP (Work In Progress):** cada columna tiene un limite maximo de items simultaneos. Por ejemplo, "In Progress" limitado a 3 items. Evita multitasking y revela cuellos de botella.

**Gestionar el flujo:** medir y optimizar el movimiento de items por el tablero.

**Hacer politicas explicitas:** criterios claros de cuando un item puede moverse a la siguiente columna.

**Implementar ciclos de retroalimentacion:** revisiones regulares para mejorar.

**Mejorar colaborativamente, evolucionar experimentalmente:** mejora continua con pequenos experimentos.

### Metricas clave

**Lead Time:** tiempo desde que un item ingresa al sistema hasta que se entrega. Es la metrica que importa al cliente.

**Cycle Time:** tiempo desde que se empieza a trabajar en un item (entra a "In Progress") hasta que termina (sale a "Done"). Mide eficiencia del equipo.

**Throughput:** numero de items completados por unidad de tiempo (ej. 10 items por semana).

### Ley de Little

Relacion fundamental entre las tres metricas:

**WIP = Throughput * Lead Time**

O equivalentemente: Lead Time = WIP / Throughput.

Ejemplo: si el equipo tiene WIP de 10 items y throughput de 2 items/semana, lead time = 10/2 = 5 semanas. Reducir WIP a 5 (manteniendo throughput) reduce lead time a 2.5 semanas. Por eso limitar WIP es tan poderoso.

### Cumulative Flow Diagram (CFD)

Grafica que muestra cantidad de items en cada estado a lo largo del tiempo. Permite identificar cuellos de botella visualmente (cuando una banda se ensancha indica acumulacion).

### Diferencias Kanban vs Scrum

| Aspecto | Scrum | Kanban |
|---|---|---|
| Iteraciones | Sprints fijos | Flujo continuo |
| Roles | PO, SM, Dev | No define roles |
| Cambios | Solo entre sprints | En cualquier momento |
| Metricas | Velocity | Lead/Cycle Time |
| Reuniones | 5 eventos | Opcionales |

### Tip CENEVAL

WIP = Work In Progress (trabajo en curso). Limitar WIP es la practica MAS distintiva de Kanban. Ley de Little: WIP = Throughput x Lead Time. Kanban NO tiene iteraciones fijas (diferencia clave con Scrum). Lead Time es del cliente; Cycle Time es del equipo.

## Tema 5: XP (Extreme Programming)

Kent Beck propuso XP en 1999 enfocado en excelencia tecnica y calidad de codigo.

### Practicas clave

**Pair Programming:** dos desarrolladores trabajan juntos en una misma estacion. Uno escribe (driver), otro revisa y piensa estrategicamente (navigator). Roles rotan. Aumenta calidad, comparte conocimiento y reduce bugs.

**Test-Driven Development (TDD):** ciclo Red-Green-Refactor:
1. Red: escribir un test que falla
2. Green: escribir el codigo MINIMO para pasar el test
3. Refactor: mejorar el codigo sin cambiar comportamiento

Garantiza alta cobertura de pruebas y diseno emergente.

**Refactoring continuo:** mejorar codigo sin cambiar funcionalidad, eliminando duplicaciones y mejorando claridad. Posible gracias a la red de seguridad de tests.

**Integracion continua (CI):** integrar codigo varias veces al dia, ejecutando build y tests automaticamente. Detecta conflictos temprano.

**Simple design:** la solucion mas simple que funciona. Evitar sobre-ingenieria (YAGNI: You Ain't Gonna Need It).

**Cliente en sitio (On-site customer):** un representante del cliente disponible permanentemente para resolver dudas.

**Releases pequenos:** entregar valor rapido y frecuentemente.

**Estandar de codificacion:** estilo uniforme acordado por el equipo.

**Propiedad colectiva del codigo:** cualquier desarrollador puede modificar cualquier parte del codigo.

**Semana de 40 horas:** ritmo sostenible, no horas extra.

### Valores

XP define 5 valores: comunicacion, simplicidad, retroalimentacion, coraje, respeto.

### Ejemplo

Equipo XP construye API de pagos. Cada feature inicia con par escribiendo test (Red), implementando minimo (Green) y refactorizando (Refactor). Cada commit dispara CI con suite de tests. Sin necesidad de revisiones formales gracias a pair programming. Cliente en sitio aclara dudas inmediatamente.

### Tip CENEVAL

TDD: Red-Green-Refactor (no Refactor-Red-Green ni otro orden). YAGNI (You Ain't Gonna Need It) y KISS (Keep It Simple Stupid) son principios de XP. Pair programming significa DOS programadores en UNA computadora (no dos computadoras). XP enfatiza calidad TECNICA mas que Scrum (que enfatiza gestion).

## Tema 6: Lean Software Development

Mary y Tom Poppendieck adaptaron Lean Manufacturing (Toyota) al software en 2003.

### Los 7 principios

1. **Eliminar desperdicio (MUDA):** todo lo que no agrega valor al cliente
2. **Amplificar el aprendizaje:** iteraciones cortas con feedback
3. **Decidir lo mas tarde posible:** posponer decisiones hasta tener mas informacion
4. **Entregar lo mas rapido posible:** ciclos cortos
5. **Empoderar al equipo:** decisiones donde se hace el trabajo
6. **Construir integridad (calidad) integrada:** calidad desde el diseno, no inspeccionada al final
7. **Ver el todo:** optimizar el sistema completo, no partes aisladas

### Los 7 desperdicios (MUDA) en software

1. **Trabajo parcialmente terminado:** codigo no integrado, no testeado, no desplegado
2. **Procesos extra:** documentacion innecesaria, aprobaciones burocraticas
3. **Caracteristicas extra:** funcionalidad que el usuario no usa (sobre-ingenieria)
4. **Cambio de tarea (task switching):** interrupciones, multitasking
5. **Esperas:** bloqueos esperando aprobacion, recursos, ambiente
6. **Movimiento:** comunicacion ineficiente entre equipos distribuidos
7. **Defectos:** bugs que requieren retrabajo

### Tecnicas

**Value Stream Mapping:** visualizar el flujo de valor del cliente al producto, identificando desperdicios.

**Build-Measure-Learn:** ciclo del Lean Startup para validar hipotesis con MVPs.

### Tip CENEVAL

Lean viene de Toyota (industria automotriz). MUDA = desperdicio en japones. Los 7 desperdicios clasicos pueden aparecer en preguntas: trabajo parcial, procesos extra, features extra, cambio de tarea, esperas, movimiento, defectos. NO confundir Lean con Agile: son compatibles pero distintos.

## Tema 7: DevOps

Cultura, practicas y herramientas que integran desarrollo (Dev) y operaciones (Ops) para acelerar entregas con calidad.

### CALMS (5 pilares)

- **Culture:** colaboracion, responsabilidad compartida, sin silos
- **Automation:** automatizar todo lo repetible (pruebas, despliegues, infraestructura)
- **Lean:** flujo continuo, eliminacion de desperdicios
- **Measurement:** medir todo (deploy frequency, lead time, MTTR, change failure rate)
- **Sharing:** compartir conocimiento, herramientas, responsabilidades

### CI/CD

**Continuous Integration (CI):** desarrolladores integran codigo en repositorio compartido varias veces al dia. Cada integracion dispara build y tests automaticamente. Detecta conflictos y bugs temprano.

**Continuous Delivery (CD):** codigo siempre esta en estado liberable. Despliegues a produccion son manuales pero rapidos.

**Continuous Deployment (CD avanzado):** despliegues a produccion automaticos despues de pasar pipeline.

### Pipeline tipico

1. Commit a repositorio (Git)
2. Build automatico
3. Tests unitarios
4. Tests de integracion
5. Analisis estatico de codigo (SonarQube)
6. Tests de seguridad (SAST)
7. Despliegue a staging
8. Tests E2E
9. Aprobacion (manual o automatica)
10. Despliegue a produccion (canary, blue-green, rolling)

### Infraestructura como codigo (IaC)

Definir infraestructura (servidores, redes, configuraciones) en archivos de codigo versionables.

Herramientas: Terraform (multi-cloud), Ansible (configuracion), Kubernetes (orquestacion de contenedores), Docker (contenedores), CloudFormation (AWS).

Beneficios: reproducibilidad, versionamiento, revision por pares, automatizacion, recuperacion rapida.

### Metricas DORA (DevOps Research and Assessment)

Cuatro metricas clave para medir desempeno:

1. **Deployment Frequency:** con que frecuencia se despliega a produccion
2. **Lead Time for Changes:** tiempo desde commit hasta produccion
3. **Change Failure Rate:** porcentaje de despliegues que causan fallo
4. **Mean Time to Restore (MTTR):** tiempo para recuperarse de un fallo

Elite performers: despliegan multiples veces por dia, lead time < 1 hora, change failure rate < 15%, MTTR < 1 hora.

### Ejemplo

Equipo DevOps de SaaS: cada commit dispara pipeline en GitHub Actions. Tests pasan -> despliegue automatico a staging con Terraform creando infraestructura efimera. Tests E2E ejecutan. Si aprueban, despliegue a produccion usando blue-green (dos ambientes paralelos, swap atomico). Monitoreo con Prometheus alerta sobre latencia. Si falla, rollback automatico en menos de 5 minutos.

### Tip CENEVAL

CALMS: Culture, Automation, Lean, Measurement, Sharing. CI = integracion continua (commit -> build/test). CD puede ser Continuous Delivery (manual a prod) o Continuous Deployment (automatico a prod). IaC = Infrastructure as Code. DevOps NO es solo herramientas: es CULTURA primero, luego practicas y herramientas.

## Resumen

- Tradicionales: cascada (lineal, requisitos estables), modelo V (cascada + V&V), espiral (iterativo con riesgos), RUP (4 fases: Inception, Elaboration, Construction, Transition)
- Manifiesto Agil: 4 valores y 12 principios; prioriza individuos, software funcionando, colaboracion, cambio
- Scrum: 3 roles (PO, SM, Dev), 5 eventos (Sprint, Planning, Daily, Review, Retrospective), 3 artefactos (Product Backlog, Sprint Backlog, Increment)
- Kanban: visualizar flujo, limitar WIP, gestionar flujo; Ley de Little: WIP = Throughput x Lead Time
- XP: pair programming, TDD (Red-Green-Refactor), refactoring continuo, CI, simple design
- Lean: 7 principios; 7 desperdicios (trabajo parcial, procesos extra, features extra, task switching, esperas, movimiento, defectos)
- DevOps: CALMS (Culture, Automation, Lean, Measurement, Sharing); CI/CD pipelines; IaC

## Errores comunes

- Confundir fases de RUP con grupos de procesos de PMBOK
- Pensar que Scrum tiene mas o menos eventos (son 5: Sprint, Planning, Daily, Review, Retrospective)
- Considerar al Scrum Master como jefe de proyecto (es facilitador)
- Olvidar que el Product Owner es UNA persona (no comite)
- Invertir TDD: el orden correcto es Red-Green-Refactor
- Confundir Kanban con Scrum (Kanban no tiene iteraciones fijas)
- Pensar que limitar WIP es opcional en Kanban (es practica central)
- Considerar DevOps como solo herramientas (es cultura primero)
- Confundir CI con CD (CI integra y prueba; CD entrega)
- Pensar que metodologias agiles no requieren disciplina (al contrario, requieren mas)
- Aplicar Cascada a proyectos con requisitos volatiles (es para requisitos estables)
- Olvidar el factor cultural en DevOps (no se compra con herramientas)
