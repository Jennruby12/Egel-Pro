# Tipos de requerimientos

Esta subarea del EGEL ISOFT evalua tu capacidad para identificar, clasificar y diferenciar los distintos tipos de requerimientos de software. En el examen veras reactivos situacionales que describen una empresa, un usuario o una restriccion regulatoria, y deberas decidir si lo planteado corresponde a un requerimiento funcional, no funcional, de dominio o de proceso. Dominar estas distinciones es la base de toda la ingenieria de requerimientos.

## Tema 1: Requerimientos funcionales vs no funcionales

La separacion entre requerimientos funcionales (FR) y no funcionales (NFR) es la clasificacion mas usada en la industria y la mas evaluada en el EGEL. Confundirlas es el error tipico que el CENEVAL aprovecha en sus distractores.

### Concepto 1.1: Definicion de requerimiento funcional

Un requerimiento funcional describe **que hace el sistema**, es decir, las funciones, servicios o tareas que debe ejecutar como respuesta a una entrada o evento. Se redacta en forma de accion observable y verificable.

Caracteristicas clave:
- Describe comportamiento (entrada-proceso-salida).
- Es invocable: alguien o algo dispara la funcion.
- Tiene resultado medible: se ejecuto o no.
- Usa verbos como calcular, registrar, enviar, validar, mostrar, autenticar.

**Ejemplo:** En el sistema de banca en linea de BBVA Mexico, el modulo de transferencias debe permitir que un cliente autenticado transfiera fondos entre cuentas propias en menos de tres pasos. La accion concreta "transferir fondos entre cuentas propias" es el requerimiento funcional. Lo que el sistema HACE.

```
FR-001: El sistema debe permitir al usuario registrar
una transferencia interbancaria SPEI indicando CLABE
destino, monto y concepto.
Trigger: El usuario pulsa "Nueva transferencia"
Resultado: Transferencia agendada o ejecutada
```

> Tip CENEVAL: Si la oracion del reactivo empieza con un verbo de accion (registrar, calcular, generar, listar) casi siempre es funcional. Memoriza este patron.

### Concepto 1.2: Definicion de requerimiento no funcional

Un requerimiento no funcional describe **como debe comportarse el sistema** mientras ejecuta sus funciones. No agrega nuevas capacidades, sino restricciones de calidad, rendimiento, seguridad o entorno.

Caracteristicas clave:
- No habla de una funcion especifica, sino de propiedades transversales.
- Suele tener una metrica asociada (segundos, porcentaje, MB, usuarios concurrentes).
- Aplica a varios FR a la vez o al sistema completo.

**Ejemplo:** En la misma banca en linea, el requerimiento "toda transferencia debe procesarse en menos de cinco segundos bajo carga de diez mil usuarios concurrentes" no agrega una nueva funcion: restringe el rendimiento. Es no funcional. Otro NFR seria "la sesion debe expirar tras cinco minutos de inactividad" porque restringe la seguridad sin agregar capacidad nueva.

> Tip CENEVAL: Si ves palabras como debe ser, debe responder en, debe soportar, debe estar disponible, debe cumplir con la norma, casi siempre es no funcional. Otro indicador fuerte es la presencia de una unidad de medida.

### Concepto 1.3: Como distinguir funcionales de no funcionales en un reactivo

El EGEL usa muchos distractores que mezclan los dos tipos en una sola oracion compuesta. Aplica este test mental de tres pasos:

1. Pregunta primero: ¿describe una accion del sistema o una propiedad del sistema?
2. Si la quitas, ¿el sistema deja de hacer algo o solo lo hace peor?
3. ¿Hay una metrica o restriccion cuantitativa?

Si responde si a la accion: FR. Si responde si a la metrica o calidad: NFR.

**Ejemplo:** Reactivo tipico: "El portal de tramites del SAT debe permitir descargar la constancia de situacion fiscal en formato PDF en menos de tres segundos." Esta oracion combina ambos tipos. La parte funcional es "permitir descargar la constancia en PDF". La parte no funcional es "en menos de tres segundos". En el EGEL te pueden pedir separarlas.

> Tip CENEVAL: Cuando una oracion mezcla las dos, identifica el verbo de accion como FR y la metrica numerica como NFR.

### Concepto 1.4: Trampa comun: requerimientos de interfaz

Las interfaces graficas y de hardware se pueden confundir. Si dice "el sistema debe mostrar un boton azul en la esquina superior" suena a funcional, pero realmente es de interfaz/usabilidad y se clasifica como NFR. Si dice "el sistema debe permitir al usuario emitir una factura" es FR puro.

**Ejemplo:** En el SAP de una pyme manufacturera, "el formulario de captura debe seguir el manual de identidad corporativa con colores naranja y gris" es un NFR de usabilidad/marca, no una funcion del sistema.

## Tema 2: Categorias de requerimientos no funcionales (ISO/IEC 25010)

La norma internacional ISO/IEC 25010 sustituyo a la antigua ISO 9126 y define el modelo de calidad del producto software con ocho caracteristicas. El EGEL las pregunta tanto por nombre como por su aplicacion en casos concretos.

### Concepto 2.1: Rendimiento (Performance Efficiency)

Mide cuan eficientemente el sistema usa recursos bajo condiciones dadas. Subatributos:
- Comportamiento temporal: tiempo de respuesta, throughput.
- Utilizacion de recursos: CPU, memoria, ancho de banda.
- Capacidad: usuarios concurrentes, transacciones por segundo.

**Ejemplo:** "La plataforma de Cinepolis debe soportar diez mil compras simultaneas durante el preestreno de una pelicula con tiempo de respuesta menor a dos segundos en el percentil 95." Esto cubre comportamiento temporal y capacidad.

> Tip CENEVAL: Rendimiento siempre lleva numeros: segundos, milisegundos, peticiones por segundo, usuarios concurrentes.

### Concepto 2.2: Seguridad (Security)

Capacidad de proteger informacion y datos para que personas o sistemas no autorizados no puedan leerlos o modificarlos. Subatributos:
- Confidencialidad
- Integridad
- No repudio
- Responsabilidad (accountability)
- Autenticidad

**Ejemplo:** "Las contrasenas del CRM de Telmex deben almacenarse usando bcrypt con factor de costo doce" cubre confidencialidad. "Toda transaccion financiera debe firmarse digitalmente con certificado SAT" cubre no repudio.

> Tip CENEVAL: No confundas seguridad con autenticacion. La autenticacion es una funcion (FR) que apoya el NFR de seguridad. Pregunta tipica: "El sistema debe validar usuario y contrasena" es FR; "Las contrasenas deben cifrarse con AES-256" es NFR.

### Concepto 2.3: Usabilidad (Usability)

Facilidad con que los usuarios pueden aprender y usar el sistema. Subatributos:
- Inteligibilidad: claridad de proposito.
- Aprendizaje: curva de aprendizaje corta.
- Operabilidad: facil de controlar.
- Proteccion contra errores del usuario.
- Estetica de la interfaz.
- Accesibilidad: WCAG 2.1 AA, lectores de pantalla.

**Ejemplo:** "La app de Rappi debe cumplir WCAG 2.1 nivel AA y permitir navegacion completa con lector de pantalla TalkBack" es un NFR de accesibilidad.

> Tip CENEVAL: La accesibilidad (apoyar a usuarios con discapacidad) entra dentro de usabilidad segun ISO 25010, no es una categoria aparte.

### Concepto 2.4: Confiabilidad (Reliability)

Capacidad del sistema de mantenerse operativo bajo condiciones especificadas durante un tiempo. Subatributos:
- Madurez: pocos fallos.
- Disponibilidad: porcentaje de tiempo operativo (99.9 por ciento = tres nueves).
- Tolerancia a fallos.
- Recuperabilidad: tiempo de recuperacion tras fallo (RTO) y punto de recuperacion (RPO).

**Ejemplo:** "El sistema de monitoreo de la CFE debe garantizar 99.99 por ciento de disponibilidad anual y recuperarse en menos de cinco minutos ante caida del nodo primario." Cubre disponibilidad y recuperabilidad.

> Tip CENEVAL: Memoriza los SLA tipicos: 99 por ciento = tres dias y medio de caida al ano; 99.9 = ocho horas; 99.99 = 52 minutos; 99.999 = cinco minutos.

### Concepto 2.5: Portabilidad (Portability)

Facilidad con que el sistema puede transferirse entre entornos. Subatributos:
- Adaptabilidad
- Instalabilidad
- Reemplazabilidad

**Ejemplo:** "La aplicacion movil de Banorte debe ejecutarse en Android 8 o superior y iOS 13 o superior, sin recompilacion para nuevas versiones de SO" es un NFR de portabilidad.

### Concepto 2.6: Otros atributos ISO/IEC 25010

Para completar el modelo, recuerda:
- Adecuacion funcional: completitud, correccion, pertinencia.
- Compatibilidad: coexistencia e interoperabilidad.
- Mantenibilidad: modularidad, reusabilidad, analizabilidad, modificabilidad, testabilidad.

> Tip CENEVAL: El EGEL suele preguntar la diferencia entre mantenibilidad y portabilidad. Mantenibilidad es facilidad de modificar el codigo; portabilidad es facilidad de mover el sistema entre entornos.

## Tema 3: Requerimientos de dominio

Los requerimientos de dominio son aquellos impuestos por el contexto en que el sistema operara: normativas, leyes, organizacion o sistemas externos. Son criticos en sectores regulados como salud, finanzas y gobierno.

### Concepto 3.1: Requerimientos regulatorios

Provienen de leyes, normas oficiales o estandares de cumplimiento obligatorio. En Mexico son comunes:
- Ley Federal de Proteccion de Datos Personales (LFPDPPP)
- Disposiciones generales de la CNBV para bancos
- NOM-035-STPS para riesgos psicosociales en RH
- Codigo Fiscal de la Federacion (timbrado CFDI 4.0)

**Ejemplo:** "El sistema de expediente clinico del IMSS debe cumplir NOM-024-SSA3 para intercambio de informacion en salud y bitacora de accesos por mas de cinco anos."

> Tip CENEVAL: Cuando el reactivo menciona una NOM, ley, norma oficial o regulacion (Sarbanes-Oxley, GDPR, PCI-DSS, HIPAA), es un requerimiento de dominio regulatorio.

### Concepto 3.2: Requerimientos organizacionales

Surgen de politicas internas, estandares de desarrollo o procedimientos de la empresa cliente. Restringen como se construye o opera el sistema dentro de esa organizacion.

Subcategorias:
- De operacion: horarios, idiomas, perfiles de usuario.
- De desarrollo: lenguaje obligatorio, framework, repositorio.
- De ambiente: cloud privado, infraestructura on-premise.

**Ejemplo:** "El nuevo sistema de inventarios de Soriana debe desarrollarse en Java 17 con Spring Boot y desplegarse en el cluster Kubernetes corporativo bajo Red Hat OpenShift." Esto es organizacional de desarrollo.

### Concepto 3.3: Requerimientos externos

Vienen de la interaccion con otros sistemas o actores fuera del control directo del equipo. Incluyen interoperabilidad, contratos con proveedores y estandares de la industria.

**Ejemplo:** "El sistema de cobranza de Coppel debe integrarse con el web service del SAT para timbrado CFDI 4.0 y con el procesador de pagos OpenPay para tarjeta de credito." Ambas son interfaces externas.

> Tip CENEVAL: Identifica que los requerimientos externos casi siempre mencionan integracion, API, servicio web, intercambio de informacion con tercero.

## Tema 4: Priorizacion de requerimientos

Una vez levantados, los requerimientos deben priorizarse. El EGEL pregunta tecnicas formales y su uso en planeacion incremental.

### Concepto 4.1: MoSCoW

Metodo cualitativo que clasifica cada requerimiento en cuatro categorias:
- Must have: indispensable para el lanzamiento, sin esto el sistema falla.
- Should have: importante pero no critico, hay workaround temporal.
- Could have: deseable, mejora la experiencia, opcional.
- Won't have (this time): fuera de alcance para esta entrega.

**Ejemplo:** En el MVP de un nuevo banco digital tipo Nu Mexico:
- Must: abrir cuenta, depositar, transferir SPEI.
- Should: tarjeta virtual.
- Could: integracion con Plaid para agregar cuentas externas.
- Won't: criptomonedas en esta primera version.

> Tip CENEVAL: Las siglas MoSCoW representan Must, Should, Could, Won't. Las dos "o" no significan nada, son para hacerla pronunciable.

### Concepto 4.2: Modelo Kano

Clasifica funcionalidades segun como impactan la satisfaccion del usuario:
- Basicas (must-be): se esperan, su ausencia frustra; su presencia no entusiasma.
- De desempeno (one-dimensional): a mas presencia, mas satisfaccion.
- Atractivas (delighters): inesperadas, generan entusiasmo.
- Indiferentes: no afectan satisfaccion.
- Inversas: su presencia molesta.

**Ejemplo:** En Uber Mexico:
- Basico: que llegue el viaje pedido.
- Desempeno: rapidez de asignacion del conductor.
- Atractivo: notificacion del nombre y foto del conductor en tiempo real.

> Tip CENEVAL: La diferencia entre MoSCoW y Kano es que MoSCoW es para priorizacion de entrega; Kano es para entender expectativas del usuario.

### Concepto 4.3: Ponderacion numerica y matriz valor-esfuerzo

Asigna a cada requerimiento dos valores: valor de negocio (1 a 10) y esfuerzo (1 a 10 o story points). El cociente valor/esfuerzo da la prioridad ROI. Se grafica en una matriz cuadrante:
- Alto valor, bajo esfuerzo: quick wins, hacer primero.
- Alto valor, alto esfuerzo: proyectos grandes.
- Bajo valor, bajo esfuerzo: rellenos.
- Bajo valor, alto esfuerzo: descartar.

**Ejemplo:** En el rediseno de la app de Liverpool, "agregar autocompletado de direccion via Google Maps" puede tener valor 8, esfuerzo 3, ROI 2.67; mientras "reescribir todo el motor de busqueda con Elasticsearch" puede tener valor 9, esfuerzo 9, ROI 1. El primero entra al sprint actual, el segundo a roadmap.

> Tip CENEVAL: La matriz valor-esfuerzo es la herramienta cuantitativa mas comun; MoSCoW y Kano son cualitativas.

## Tema 5: Validacion vs verificacion

Estas dos palabras se confunden mucho y el EGEL las explota como distractor recurrente. La regla mnemotecnica oficial viene de Boehm.

### Concepto 5.1: Validacion

Responde a la pregunta: "estamos construyendo el producto correcto?" Es decir, lo que se esta haciendo cumple las necesidades reales del usuario o cliente. Se enfoca en el QUE.

Tecnicas de validacion:
- Revision por usuarios reales.
- Prototipado y demos.
- Pruebas de aceptacion (UAT).
- Casos de uso ejecutables.

**Ejemplo:** El equipo de Mercado Libre construye un nuevo flujo de checkout. Antes de codificar, hacen un prototipo Figma y lo prueban con veinte usuarios reales para validar que entienden el flujo. Esto es validacion: confirmar que el producto correcto se esta definiendo.

### Concepto 5.2: Verificacion

Responde a la pregunta: "estamos construyendo el producto bien?" Es decir, lo construido cumple las especificaciones tecnicas y de calidad definidas. Se enfoca en el COMO.

Tecnicas de verificacion:
- Revisiones de codigo (code review).
- Pruebas unitarias e integracion.
- Pruebas de regresion.
- Inspecciones formales.

**Ejemplo:** El mismo equipo de Mercado Libre, una vez codificado el checkout, corre 350 pruebas unitarias y revisa que cumpla el contrato de la API de pagos. Esto es verificacion: el producto se esta construyendo correctamente segun la especificacion.

### Concepto 5.3: Diferencia clave

| Aspecto | Validacion | Verificacion |
|---|---|---|
| Pregunta | ¿Es el producto correcto? | ¿Esta bien hecho? |
| Foco | Usuario/cliente | Especificacion |
| Cuando | Temprano y continuo | Durante y al final |
| Tecnicas | Demos, UAT, prototipos | Code review, tests |
| Quien | Cliente o usuario final | Equipo tecnico |

> Tip CENEVAL: Recuerda la regla VV: "Validacion = Voz del cliente" y "Verificacion = Verificar especificacion". Si el reactivo habla de cliente, usuario o necesidad real, es validacion. Si habla de cumplir el SRS, el contrato o pruebas tecnicas, es verificacion.

## Resumen de la subarea

- Los requerimientos funcionales describen QUE hace el sistema; los no funcionales describen COMO se comporta.
- ISO/IEC 25010 define ocho caracteristicas de calidad: adecuacion funcional, rendimiento, compatibilidad, usabilidad, confiabilidad, seguridad, mantenibilidad y portabilidad.
- Los requerimientos de dominio se dividen en regulatorios, organizacionales y externos.
- Las tecnicas de priorizacion mas usadas son MoSCoW (cualitativo de entrega), Kano (expectativas) y matriz valor-esfuerzo (cuantitativa).
- Validacion responde "el producto correcto?"; verificacion responde "el producto bien hecho?".
- Toda metrica numerica (segundos, porcentaje, usuarios) es senal de NFR.
- Toda mencion a ley, norma o NOM es senal de requerimiento de dominio regulatorio.

## Errores comunes en el EGEL

1. **Confundir autenticacion (FR) con seguridad (NFR):** validar usuario es una funcion; cifrar la contrasena es un atributo de calidad.
2. **Marcar accesibilidad como categoria aparte:** ISO/IEC 25010 la coloca DENTRO de usabilidad, no como caracteristica independiente.
3. **Confundir disponibilidad con rendimiento:** disponibilidad es parte de confiabilidad (porcentaje de uptime); rendimiento es velocidad bajo carga.
4. **Validacion vs verificacion al reves:** muchos eligen verificacion cuando se habla del cliente. Recuerda: Validacion = Voz del cliente.
5. **MoSCoW mal expandido:** algunos creen que la W es Wishes; es Won't have this time.
