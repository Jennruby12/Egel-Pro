# Gestion de tiempos, costos, recursos humanos y de riesgo

La gestion de proyectos de software es una disciplina que integra conocimientos, habilidades, herramientas y tecnicas para cumplir requisitos del proyecto dentro de restricciones de alcance, tiempo, costo y calidad. En el contexto del EGEL ISOFT, el Area 4 evalua tu capacidad para planificar, ejecutar, monitorear y cerrar proyectos de software aplicando estandares reconocidos como PMBOK, tecnicas de estimacion formal y metricas cuantitativas para control. Esta guia cubre los fundamentos esenciales: el marco PMBOK, tecnicas de estimacion (COCOMO, puntos de funcion, PERT), construccion de cronogramas con CPM, Earned Value Management para control financiero, gestion sistematica de riesgos y manejo de recursos humanos. Dominar estos temas implica no solo memorizar definiciones sino aplicar formulas y entender cuando usar cada tecnica segun el contexto del proyecto.

## Tema 1: PMBOK y los grupos de procesos

El PMBOK (Project Management Body of Knowledge) publicado por PMI es el estandar de facto en gestion de proyectos. Organiza el conocimiento en dos dimensiones complementarias: grupos de procesos (que describen el ciclo de vida) y areas de conocimiento (que describen disciplinas tecnicas).

### Los cinco grupos de procesos

**Inicio (Initiating):** procesos para definir un nuevo proyecto o fase. Producen el Acta de Constitucion (Project Charter) que autoriza formalmente el proyecto y nombra al gerente. Tambien se identifican los stakeholders iniciales. Es la fase mas corta pero la mas critica porque establece autoridad y alcance preliminar.

**Planificacion (Planning):** procesos para establecer el alcance total, refinar objetivos y definir el curso de accion. Genera el Plan de Direccion del Proyecto que integra todos los planes subsidiarios (alcance, cronograma, costos, calidad, recursos, comunicaciones, riesgos, adquisiciones, interesados). Es la fase mas extensa en cuanto a procesos.

**Ejecucion (Executing):** procesos para completar el trabajo definido en el plan. Aqui se consume la mayor parte del presupuesto y recursos. El gerente coordina equipos, gestiona la calidad y maneja comunicaciones.

**Monitoreo y Control (Monitoring and Controlling):** procesos para rastrear, revisar y regular el progreso. Identifica areas que requieren cambios al plan e implementa acciones correctivas. Opera en paralelo a Ejecucion durante toda la vida del proyecto.

**Cierre (Closing):** procesos para finalizar formalmente actividades del proyecto o fase. Incluye aceptacion del entregable, liberacion de recursos, lecciones aprendidas y archivado de documentacion.

### Las diez areas de conocimiento

1. Integracion (coordinacion entre procesos)
2. Alcance (definicion del trabajo)
3. Cronograma (tiempos)
4. Costos (presupuesto)
5. Calidad (cumplimiento de requisitos)
6. Recursos (humanos y materiales)
7. Comunicaciones (informacion entre stakeholders)
8. Riesgos (incertidumbres)
9. Adquisiciones (compras y contratos)
10. Interesados (stakeholders)

### Ejemplo

En un proyecto para construir un ERP, durante Inicio se firma el charter con presupuesto inicial de 2 millones y plazo de 12 meses. En Planificacion se construye el WBS, cronograma detallado y plan de riesgos. En Ejecucion el equipo desarrolla modulos. En M&C se compara avance real vs planificado semanalmente. En Cierre se entrega el sistema, se documentan lecciones aprendidas y se libera al equipo.

### Tip CENEVAL

Recuerda que los grupos de procesos NO son fases del ciclo de vida. Un proyecto puede tener varias fases (ej. analisis, diseno, construccion) y cada fase aplica los cinco grupos de procesos. Tampoco confundas grupos de procesos con areas de conocimiento: los primeros son temporales (cuando), las segundas son tematicas (que).

## Tema 2: Tecnicas de estimacion

Estimar es predecir el esfuerzo, costo y duracion de un proyecto bajo incertidumbre. Existen tecnicas con distinto grado de formalidad y precision.

### Juicio experto

Consiste en consultar a personas con experiencia previa en proyectos similares. Es rapido y barato pero altamente subjetivo y dependiente del experto. Se usa frecuentemente al inicio cuando hay poca informacion documentada.

### Estimacion analoga (top-down)

Compara el proyecto actual con proyectos pasados similares. Si un sistema CRM anterior tomo 8 meses y 15,000 horas, y el nuevo es 20% mas grande, se estima 9.6 meses y 18,000 horas. Es rapida pero requiere historico confiable y los proyectos deben ser verdaderamente comparables.

### Estimacion parametrica (COCOMO)

COCOMO (Constructive Cost Model) de Barry Boehm usa formulas matematicas basadas en miles de lineas de codigo (KLOC).

**COCOMO basico:** Esfuerzo (persona-meses) = a * (KLOC)^b
- Organico (proyectos pequenos, equipos experimentados): a=2.4, b=1.05
- Semi-acoplado (intermedio): a=3.0, b=1.12
- Empotrado (sistemas complejos, restricciones rigidas): a=3.6, b=1.20

Ejemplo: proyecto organico de 30 KLOC. Esfuerzo = 2.4 * (30)^1.05 = 2.4 * 34.6 = 83 persona-meses.

**COCOMO intermedio:** anade 15 cost drivers (atributos del producto, hardware, personal, proyecto) que se multiplican como factor de ajuste (EAF).

**COCOMO detallado:** aplica los cost drivers por fase del proyecto (analisis, diseno, codificacion, pruebas), permitiendo estimaciones mas granulares.

### Puntos de funcion (IFPUG)

Mide la funcionalidad entregada al usuario, independiente del lenguaje de programacion. Cuenta cinco tipos de elementos:

1. Entradas externas (EI): formularios, archivos de entrada
2. Salidas externas (EO): reportes, mensajes
3. Consultas externas (EQ): busquedas
4. Archivos logicos internos (ILF): tablas mantenidas por el sistema
5. Archivos de interfaz externa (EIF): tablas leidas de otros sistemas

Cada elemento se clasifica como simple, medio o complejo y se asigna un peso. La suma da los puntos de funcion no ajustados (UFP). Luego se aplica un factor de ajuste (VAF) basado en 14 caracteristicas generales del sistema (comunicacion de datos, rendimiento, etc.) que va de 0.65 a 1.35.

FP = UFP * VAF

Ventaja: independiente de la tecnologia. Se puede convertir a KLOC multiplicando por un factor segun el lenguaje (ej. Java: 53 LOC por FP, COBOL: 107 LOC por FP).

### Planning Poker

Tecnica agil donde el equipo estima usando cartas con valores de Fibonacci (0, 1, 2, 3, 5, 8, 13, 20, 40, 100). Cada miembro elige una carta sin mostrar, se revelan simultaneamente, se discute la mayor diferencia y se vuelve a estimar hasta consenso. Reduce sesgo del experto dominante y aprovecha conocimiento del equipo.

### Estimacion de tres puntos (PERT)

Calcula la duracion esperada de una actividad combinando tres escenarios:
- O = optimista
- M = mas probable
- P = pesimista

**Formula PERT (distribucion beta):** TE = (O + 4M + P) / 6
**Desviacion estandar:** sigma = (P - O) / 6
**Varianza:** sigma^2 = ((P - O) / 6)^2

Ejemplo: actividad con O=4 dias, M=6 dias, P=14 dias.
TE = (4 + 24 + 14) / 6 = 42/6 = 7 dias
sigma = (14 - 4) / 6 = 1.67 dias

### Tip CENEVAL

Memoriza la formula PERT exacta: (O + 4M + P) / 6, no confundas con promedio simple (O+M+P)/3. El factor 4 al "mas probable" refleja la asimetria de la distribucion beta. CENEVAL suele pedir el calculo directo con tres valores dados.

## Tema 3: Cronograma del proyecto

El cronograma traduce el alcance en una secuencia temporal de actividades con duraciones, dependencias y recursos asignados.

### WBS (Work Breakdown Structure)

Es la descomposicion jerarquica del trabajo total en componentes manejables llamados paquetes de trabajo. Se construye de arriba hacia abajo: proyecto > fases > entregables > paquetes de trabajo > actividades. Cada paquete debe cumplir la regla 8/80: requerir entre 8 y 80 horas de esfuerzo. El WBS es la base para estimar costos, asignar recursos y construir el cronograma.

### Diagrama de Gantt

Representacion grafica de barras horizontales donde el eje X es tiempo y cada barra es una actividad. Muestra duracion, fechas inicio/fin, dependencias (con flechas) y avance (porcentaje completado). Es visualmente intuitivo y ampliamente usado para comunicar el cronograma a stakeholders no tecnicos.

### CPM (Critical Path Method)

Identifica la secuencia mas larga de actividades dependientes que determina la duracion total del proyecto. Las actividades en la ruta critica tienen holgura cero (slack = 0): un retraso en cualquiera retrasa todo el proyecto.

**Calculos del CPM:**
- ES (Early Start): fecha mas temprana en que puede iniciar una actividad
- EF (Early Finish): EF = ES + Duracion
- LS (Late Start): fecha mas tardia sin retrasar el proyecto
- LF (Late Finish): fecha tardia de finalizacion
- Holgura (Slack) = LS - ES = LF - EF

Si la holgura es 0, la actividad esta en la ruta critica.

### PERT

Similar a CPM pero usa duraciones probabilisticas (tres puntos). Permite estimar la probabilidad de completar el proyecto en una fecha dada usando distribucion normal. La varianza del proyecto es la suma de las varianzas de las actividades en la ruta critica.

### Hitos (Milestones)

Eventos significativos sin duracion que marcan logros clave del proyecto (aprobacion de requisitos, fin de fase, entrega de prototipo). Se representan como diamantes en Gantt y sirven como puntos de control para stakeholders.

### Ejemplo

Proyecto con actividades A(5d) -> B(3d) -> D(4d) y A(5d) -> C(7d) -> D(4d).
Ruta 1: A-B-D = 5+3+4 = 12 dias
Ruta 2: A-C-D = 5+7+4 = 16 dias (CRITICA)
Holgura de B = 16 - 12 = 4 dias (puede retrasarse 4 dias sin afectar el proyecto)
Duracion total = 16 dias.

### Tip CENEVAL

La ruta critica es la ruta mas LARGA en duracion, no la mas corta (error frecuente). Si una actividad NO esta en la ruta critica, tiene holgura positiva y puede retrasarse sin afectar la fecha final.

## Tema 4: Earned Value Management (EVM)

EVM integra alcance, cronograma y costo para medir el desempeno del proyecto de forma objetiva.

### Variables base

- **BAC (Budget at Completion):** presupuesto total aprobado del proyecto
- **PV (Planned Value):** valor planificado del trabajo a una fecha dada (lo que deberia estar hecho)
- **EV (Earned Value):** valor ganado, costo presupuestado del trabajo realmente realizado
- **AC (Actual Cost):** costo real incurrido para el trabajo realizado

### Indicadores de desempeno

**Variaciones (valores absolutos):**
- CV (Cost Variance) = EV - AC; positivo = bajo presupuesto, negativo = sobrecosto
- SV (Schedule Variance) = EV - PV; positivo = adelantado, negativo = atrasado

**Indices (valores relativos):**
- CPI (Cost Performance Index) = EV / AC; >1 eficiente en costo, <1 ineficiente
- SPI (Schedule Performance Index) = EV / PV; >1 adelantado, <1 atrasado

### Proyecciones

- **EAC (Estimate at Completion):** costo total estimado al final
  - Formula tipica: EAC = BAC / CPI (asume que las desviaciones continuaran)
- **ETC (Estimate to Complete):** costo restante = EAC - AC
- **VAC (Variance at Completion):** BAC - EAC

### Ejemplo numerico

Proyecto con BAC = 100,000. A los 6 meses (50% del cronograma):
- PV = 50,000 (deberia haber gastado y avanzado la mitad)
- EV = 40,000 (solo se ha completado 40% del trabajo)
- AC = 55,000 (se ha gastado mucho)

Calculos:
- CV = 40,000 - 55,000 = -15,000 (sobrecosto)
- SV = 40,000 - 50,000 = -10,000 (atrasado)
- CPI = 40,000 / 55,000 = 0.73 (por cada peso gastado se obtienen 73 centavos de valor)
- SPI = 40,000 / 50,000 = 0.80 (avanza al 80% del ritmo planeado)
- EAC = 100,000 / 0.73 = 136,986 (proyeccion: costara 37% mas de lo presupuestado)

### Tip CENEVAL

Memoriza: CPI = EV/AC y SPI = EV/PV. EV siempre va en el numerador. Si CPI o SPI son MENORES a 1, hay PROBLEMAS. Las variaciones (CV, SV) usan resta (EV menos AC o PV), los indices (CPI, SPI) usan division.

## Tema 5: Gestion de riesgos

Un riesgo es un evento incierto que de ocurrir tendria impacto (positivo u negativo) en los objetivos del proyecto.

### Procesos de gestion de riesgos

1. **Planificacion:** definir como abordar y planificar las actividades de riesgo
2. **Identificacion:** determinar que riesgos pueden afectar (brainstorming, checklist, Delphi, FODA)
3. **Analisis cualitativo:** priorizar segun probabilidad e impacto
4. **Analisis cuantitativo:** numerizar los riesgos
5. **Planificacion de respuestas:** estrategias para cada riesgo
6. **Monitoreo y control:** seguimiento durante el proyecto

### Analisis cualitativo (matriz P x I)

Cada riesgo recibe puntajes de probabilidad (1=muy baja a 5=muy alta) e impacto (1 a 5). La multiplicacion P x I clasifica el riesgo en categorias (bajo: 1-6, medio: 7-15, alto: 16-25). Se prioriza atender los altos primero.

### Analisis cuantitativo

**Valor Monetario Esperado (EMV):** EMV = Probabilidad * Impacto (en pesos)
- Riesgo de retraso del 30% que costaria 50,000: EMV = 0.30 * 50,000 = 15,000 (provision recomendada)

**Analisis de Monte Carlo:** simulacion estocastica que ejecuta miles de iteraciones del proyecto con duraciones y costos aleatorios siguiendo distribuciones probabilisticas. Permite estimar probabilidad de cumplir fecha o presupuesto.

**Arboles de decision:** representan decisiones bajo incertidumbre, calculando EMV de cada rama.

### Estrategias de respuesta a riesgos negativos

- **Evitar:** eliminar la causa (cambiar tecnologia, ampliar plazo)
- **Transferir:** pasar el impacto a terceros (seguros, outsourcing, contratos fijos)
- **Mitigar:** reducir probabilidad o impacto (capacitacion, prototipos, redundancia)
- **Aceptar:** asumir el riesgo (activa: provision de contingencia; pasiva: no hacer nada)

### Estrategias para riesgos positivos (oportunidades)

- **Explotar:** asegurar que ocurra
- **Compartir:** asociarse con quien puede capturarla
- **Mejorar:** aumentar probabilidad
- **Aceptar:** aprovechar si ocurre

### Tip CENEVAL

Distingue: transferir es pagar a alguien externo para que asuma el riesgo (seguro). Mitigar es actuar para reducir la probabilidad o impacto. Evitar elimina la causa del riesgo (cambiar el plan). Aceptar es no actuar (a veces con reserva de contingencia).

## Tema 6: Recursos humanos del proyecto

La gestion eficaz del equipo es decisiva para el exito.

### Matriz RACI

Asigna responsabilidades por actividad:
- **R (Responsible):** ejecuta el trabajo
- **A (Accountable):** rinde cuentas, aprueba (debe haber UNO solo por actividad)
- **C (Consulted):** se consulta antes de decidir
- **I (Informed):** se informa despues de la decision

Ejemplo: en "diseno de arquitectura", el arquitecto es R, el gerente A, el cliente C, el equipo dev I.

### Equipos auto-organizados

Concepto agil donde el equipo decide como ejecutar el trabajo sin imposicion externa. Requiere madurez, confianza y autonomia. Scrum los promueve explicitamente.

### Teorias de motivacion

**Piramide de Maslow:** jerarquia de necesidades (fisiologicas, seguridad, social, estima, autorrealizacion). Las inferiores deben satisfacerse antes de las superiores.

**Herzberg (teoria bifactorial):**
- Factores higienicos (salario, condiciones, supervision): su ausencia genera insatisfaccion, pero su presencia NO motiva
- Factores motivadores (logro, reconocimiento, crecimiento): generan satisfaccion real

**McGregor (X e Y):**
- Teoria X: las personas son flojas, requieren control
- Teoria Y: las personas son responsables y buscan superarse

### Desarrollo del equipo (modelo Tuckman)

Forming (formacion) > Storming (conflicto) > Norming (normalizacion) > Performing (desempeno) > Adjourning (disolucion). El gerente debe facilitar transiciones entre etapas.

### Ejemplo

En un proyecto con equipo nuevo, durante Storming surgen desacuerdos sobre arquitectura. El gerente aplica Herzberg ofreciendo reconocimiento publico al esfuerzo (motivador) ademas de asegurar buenas condiciones (higienico). Usa RACI para clarificar quien decide arquitectura final (el arquitecto senior como A).

### Tip CENEVAL

En RACI: solo puede haber UN responsable de rendir cuentas (A) por actividad. Puede haber multiples R, C e I. Confundir R y A es error frecuente: R hace el trabajo, A responde por el resultado.

## Resumen

- PMBOK organiza la gestion en 5 grupos de procesos (Inicio, Planificacion, Ejecucion, M&C, Cierre) y 10 areas de conocimiento
- Estimar con COCOMO (parametrica basada en KLOC), puntos de funcion (independiente del lenguaje), juicio experto, analoga, Planning Poker (agil) o PERT 3 puntos
- Formula PERT: TE = (O + 4M + P)/6; varianza = ((P-O)/6)^2
- WBS descompone el alcance; Gantt visualiza; CPM identifica la ruta critica (la mas LARGA)
- EVM mide desempeno: CV/SV (variaciones), CPI/SPI (indices), EAC (proyeccion)
- CPI < 1 = sobrecosto; SPI < 1 = atraso
- Riesgos: identificar, analizar P x I, cuantificar (EMV, Monte Carlo), responder (evitar/transferir/mitigar/aceptar)
- RACI clarifica responsabilidades; Maslow y Herzberg explican motivacion

## Errores comunes

- Confundir grupos de procesos (cuando) con areas de conocimiento (que)
- Pensar que la ruta critica es la mas corta (es la mas LARGA)
- Olvidar el factor 4 en la formula PERT (no es promedio simple)
- Invertir formulas EVM: CPI = EV/AC, no AC/EV
- Considerar que CPI > 1 es malo (es bueno: significa eficiencia)
- Asignar multiples A en RACI (debe haber uno solo)
- Confundir transferir (pasar a terceros) con mitigar (reducir)
- Aplicar COCOMO sin distinguir modo (organico, semi-acoplado, empotrado)
- Olvidar el factor de ajuste VAF en puntos de funcion
- Pensar que aceptar un riesgo significa ignorarlo (puede ser activa con reserva)
