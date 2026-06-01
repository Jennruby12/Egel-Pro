# Tecnicas y herramientas para obtencion, analisis, priorizacion y validacion

Esta subarea del EGEL ISOFT evalua tu dominio del proceso de ingenieria de requerimientos: como sacar la informacion de los stakeholders (elicitacion), como trabajarla en grupo, como prototipar, como narrarla en forma de historias y como validarla antes de pasar al diseno. El examen presenta casos donde un equipo enfrenta un cliente dificil o ambiguo y debes elegir la tecnica adecuada.

## Tema 1: Tecnicas de elicitacion individual

La elicitacion es la actividad de obtener requerimientos de stakeholders. No se "recolectan" como objetos preexistentes: se descubren y se construyen en conversacion. Las tecnicas individuales son las primeras en usarse.

### Concepto 1.1: Entrevistas estructuradas

Tienen un guion fijo con preguntas predefinidas y orden establecido. Todas las personas reciben las mismas preguntas en el mismo orden. Son utiles cuando se necesita comparar respuestas entre stakeholders o cuando el entrevistador tiene poca experiencia.

Ventajas:
- Resultados comparables y cuantificables.
- Faciles de replicar.
- Reducen sesgo del entrevistador.

Desventajas:
- Pocas oportunidades de explorar temas nuevos.
- Rigidez que puede perder informacion valiosa.

**Ejemplo:** En el proyecto de digitalizacion del IMSS para citas medicas, el analista entrevista a treinta enfermeras de distintas clinicas con el mismo cuestionario de quince preguntas. Como necesita comparar volumen de tareas entre clinicas, la estructura rigida es ideal.

> Tip CENEVAL: Cuando el reactivo dice "comparar entre varios stakeholders" o "estandarizar respuestas", la opcion correcta es entrevista estructurada.

### Concepto 1.2: Entrevistas semi-estructuradas

Combinan un guion base con preguntas obligatorias y libertad para profundizar en temas emergentes. Es la tecnica mas usada en la industria por su balance.

Ventajas:
- Flexibilidad para explorar.
- Sigue cubriendo temas clave.
- Permite seguir hilos inesperados.

Desventajas:
- Requiere entrevistador con mas experiencia.
- Resultados menos comparables.

**Ejemplo:** En el rediseno del sistema de cobranza de Telcel, el analista entrevista al gerente de cartera con cinco preguntas core: estado actual, dolores, expectativas, prioridades y restricciones. A medida que el gerente menciona "tenemos problemas con clientes corporativos", el analista profundiza con preguntas no previstas.

> Tip CENEVAL: Si el reactivo describe "explorar sin perder de vista temas clave", es semi-estructurada.

### Concepto 1.3: Entrevistas abiertas (no estructuradas)

No tienen guion, solo un tema general. Son conversaciones libres. Se usan en etapas muy tempranas, cuando ni siquiera se sabe que preguntar, o con stakeholders expertos que tienen mas para contar que para responder.

**Ejemplo:** Antes de comenzar el levantamiento formal de un nuevo SaaS de logistica para DHL Mexico, el analista invita al COO a una platica de una hora sin agenda para entender el negocio. La conversacion va saltando entre rutas, conductores, clientes y competencia. De aqui salen las hipotesis para entrevistas estructuradas posteriores.

### Concepto 1.4: Cuestionarios y encuestas

Permiten cubrir muchos stakeholders en poco tiempo. Se usan preguntas cerradas (Likert, opcion multiple) para cuantificar y abiertas para detectar temas. Funcionan mejor cuando ya hay hipotesis claras a validar.

Ventajas:
- Alcance masivo y bajo costo.
- Cuantificacion estadistica.

Desventajas:
- No permiten clarificar respuestas.
- Tasas de respuesta tipicamente bajas (10 a 30 por ciento).
- Sesgo de auto-seleccion.

**Ejemplo:** Antes de rediseñar la app de Banco Azteca, el equipo lanza una encuesta a 5,000 usuarios con catorce preguntas Likert sobre satisfaccion del onboarding actual. El resultado les indica que el 68 por ciento abandona en el paso de captura de INE.

> Tip CENEVAL: Las encuestas son ideales para muestras grandes y datos cuantitativos. NO sirven para descubrir requerimientos nuevos en etapas tempranas.

### Concepto 1.5: Observacion etnografica

El analista observa al usuario en su entorno natural realizando sus tareas, sin intervenir. Se usa cuando los usuarios no saben articular bien lo que hacen, o cuando hay conocimiento tacito que solo se ve en la practica.

Modalidades:
- Observacion pasiva: no se interactua.
- Observacion participante: el analista hace la tarea junto al usuario.
- Shadowing: seguir a un trabajador toda su jornada.

**Ejemplo:** En el proyecto de digitalizacion del proceso de admision del Hospital ABC, el analista pasa dos jornadas observando a las recepcionistas. Descubre que usan tres pantallas simultaneamente, anotan datos en hojas sueltas y tienen un truco oculto para imprimir comprobantes sin entrar al modulo principal. Nada de esto salio en entrevistas.

> Tip CENEVAL: La observacion etnografica es la tecnica mas usada para descubrir conocimiento tacito o procesos no documentados. Si el reactivo dice "los usuarios no logran explicar como trabajan", es observacion.

## Tema 2: Tecnicas grupales

Las tecnicas grupales aprovechan la interaccion entre stakeholders para descubrir requerimientos y construir consensos. El EGEL pregunta especialmente JAD y Delphi.

### Concepto 2.1: JAD (Joint Application Design / Development)

Sesion intensiva (de uno a cinco dias) donde se reunen usuarios, analistas, disenadores y patrocinadores para definir requerimientos en conjunto. Tiene roles formales:
- Facilitador (lider neutral)
- Patrocinador ejecutivo
- Usuarios clave
- Analistas
- Escriba (documentador)
- Observadores

Proceso:
1. Preparacion: el facilitador define agenda y materiales.
2. Sesion en sala dedicada, sin interrupciones, con reglas de participacion.
3. Documentacion en tiempo real.
4. Cierre con acuerdos firmados.

Ventajas:
- Acorta el tiempo de elicitacion drasticamente.
- Construye consenso desde el inicio.
- Reduce ambiguedades por contacto directo.

**Ejemplo:** En el proyecto SAP del corporativo Femsa, en lugar de tres meses de entrevistas separadas, se realiza un JAD de cuatro dias en Cuernavaca con quince stakeholders clave. Al cierre se tienen cien historias de usuario priorizadas y firmadas por el patrocinador.

> Tip CENEVAL: Si el reactivo menciona "facilitador, sesion intensiva, todos los stakeholders en una sala", es JAD.

### Concepto 2.2: Tecnica Delphi

Tecnica iterativa anonima para obtener consenso de expertos sin presencia fisica. Se realiza en rondas (tipicamente dos o tres):

1. Ronda 1: cada experto responde un cuestionario de forma anonima.
2. El facilitador consolida y comparte los resultados anonimizados.
3. Ronda 2: cada experto vuelve a responder con la informacion del grupo.
4. Las rondas continuan hasta alcanzar consenso o estabilizacion de respuestas.

Ventajas:
- Anonimato evita influencia de jerarquias.
- Permite expertos en geografias distintas.
- Construye consenso por convergencia.

Desventajas:
- Lenta (semanas).
- Requiere disciplina de los participantes.

**Ejemplo:** Para definir requerimientos de seguridad de un nuevo banco digital, se realiza un Delphi con ocho expertos en ciberseguridad distribuidos en Mexico, Espana y Argentina. En tres rondas convergen en doce controles minimos basados en PCI-DSS y CNBV.

> Tip CENEVAL: Las palabras clave de Delphi son "anonimo", "rondas", "expertos", "consenso iterativo". Si las ves, la respuesta es Delphi.

### Concepto 2.3: Focus groups

Grupo pequeno (seis a doce participantes) facilitado para explorar opiniones, actitudes y percepciones. Se usan en etapas tempranas para validar conceptos o explorar reaccion a propuestas.

Diferencia con JAD: focus group es para entender el QUE quieren los usuarios; JAD es para definir el COMO sera el sistema.

**Ejemplo:** Antes de lanzar la app de pagos de Oxxo, se hacen cuatro focus groups con diez usuarios cada uno en CDMX, Monterrey, Guadalajara y Merida para entender percepciones sobre pagos sin efectivo en tiendas de conveniencia.

### Concepto 2.4: Workshops de requerimientos

Sesiones cortas (medio dia a dos dias) con dinamicas estructuradas: brainstorming, ideacion, story mapping, votacion por puntos (dot voting). Mas ligeros que JAD pero mas estructurados que reuniones normales.

**Ejemplo:** El equipo de producto de Kavak organiza un workshop de un dia con vendedores y compradores para mapear el flujo completo de compra de un auto seminuevo. Salen quince oportunidades de mejora priorizadas por valor-esfuerzo.

> Tip CENEVAL: Si el reactivo distingue intensidad: focus group es mas exploratorio; workshop es mas accional; JAD es mas formal y largo.

## Tema 3: Prototipado

El prototipo es una representacion parcial del sistema usada para clarificar requerimientos antes de construir el producto final. Es una herramienta clave de elicitacion y validacion.

### Concepto 3.1: Prototipo desechable (throwaway)

Se construye rapido, solo para aprender, y se descarta. No se reutiliza codigo. Util cuando hay alta incertidumbre y se necesita validar conceptos.

Ventajas:
- Velocidad maxima.
- No carga deuda tecnica al producto final.
- Libera al equipo de "hacerlo bien".

Desventajas:
- Trabajo "desperdiciado" (aunque el aprendizaje es la ganancia).
- Riesgo de que el cliente quiera "que se quede".

**Ejemplo:** Para validar el flujo de checkout de un nuevo marketplace artesanal, el equipo construye en dos dias un prototipo en HTML estatico sin backend. Se prueba con quince usuarios, se aprende, y se tira a la basura. El producto real se construye con Next.js y Stripe.

### Concepto 3.2: Prototipo evolutivo

Se construye desde el inicio con calidad de produccion, y se va expandiendo iterativamente hasta convertirse en el producto final. Cada iteracion agrega funcionalidad real.

Ventajas:
- No se descarta trabajo.
- Continuidad con producto final.
- El cliente ve avance real.

Desventajas:
- Mas lento de construir.
- Requiere arquitectura cuidadosa desde el inicio.

**Ejemplo:** El equipo de Konfio comienza con un prototipo evolutivo de su evaluador de credito: la primera version solo calcula score con tres campos, pero ya esta en produccion con base de datos real. Cada sprint agrega funcionalidad y, al sexto sprint, es el producto definitivo.

> Tip CENEVAL: La diferencia es: throwaway se tira; evolutivo se queda. Si el reactivo dice "el prototipo se convierte en producto", es evolutivo.

### Concepto 3.3: Low-fidelity (low-fi) vs high-fidelity (high-fi)

Low-fi: bocetos en papel, wireframes en escala de grises, sin interaccion real. Se usan en etapas tempranas para validar estructura y flujo.

High-fi: maquetas con disenos definitivos, interactivos (Figma, ProtoPie), cercanos al producto final. Se usan en validacion final antes de codificar.

**Ejemplo:** Para el nuevo dashboard de analytics de Mercado Libre, el equipo arranca con sketches a mano alzada (low-fi) que valida con tres usuarios. Una vez aprobada la estructura, construye un prototipo Figma interactivo (high-fi) que valida con quince usuarios y luego pasa a desarrollo.

> Tip CENEVAL: Cuanto mas temprano el momento del proyecto, mas low-fi conviene. Cuanto mas cerca del codigo, mas high-fi.

## Tema 4: Story mapping y user stories

Las historias de usuario son la unidad mas comun de expresion de requerimientos en metodologias agiles. El EGEL pregunta su formato exacto y como se complementan con criterios de aceptacion.

### Concepto 4.1: Formato Connextra

Formato estandar acuñado por Connextra en 2001:

```
Como <rol>,
quiero <funcionalidad>,
para <beneficio>.
```

Cada parte responde una pregunta:
- Rol: quien necesita la funcion (no decir "el sistema" ni "el usuario" generico).
- Funcionalidad: que necesita hacer.
- Beneficio: por que lo necesita (el valor de negocio).

**Ejemplo:** En el nuevo sistema de inventarios de OXXO:

```
Como gerente de tienda,
quiero ver el stock de cigarros en tiempo real,
para evitar quedarme sin existencias en horas pico.
```

Mal redactada: "Como usuario, quiero ver inventarios, para hacer mi trabajo." (rol vago, beneficio vacuo).

> Tip CENEVAL: Si el reactivo te da una historia mal redactada y pide identificar el error, casi siempre es rol generico o beneficio que se reduce a "para usarlo".

### Concepto 4.2: Criterios de aceptacion (Gherkin)

Cada historia debe tener criterios de aceptacion concretos, verificables. El formato Given-When-Then de Gherkin/BDD es el estandar:

```
Given <contexto inicial>
When <evento o accion>
Then <resultado esperado>
```

**Ejemplo:** Criterio para la historia anterior:

```
Given que soy gerente con sesion activa
And tengo asignada la tienda OXX-1234
When entro al modulo de inventarios
Then debo ver el stock de cigarros agrupado por marca
And cada item debe mostrar cantidad actual y minimo recomendado
And los items con stock por debajo del minimo deben aparecer en rojo
```

> Tip CENEVAL: Los criterios de aceptacion convierten una historia ambigua en algo testeable. Sin criterios, no es realmente una historia bien definida.

### Concepto 4.3: Story mapping

Tecnica visual creada por Jeff Patton para organizar historias en dos dimensiones:
- Eje horizontal: secuencia narrativa del usuario (backbone).
- Eje vertical: prioridad o nivel de detalle (releases o sprints).

Las historias se agrupan en epicas (actividades grandes), y cada epica contiene multiples historias detalladas.

**Ejemplo:** Para un nuevo e-commerce tipo Linio Mexico, el backbone horizontal es: explorar > buscar > ver producto > agregar al carrito > pagar > recibir. Bajo "pagar" se agrupan historias: pagar con tarjeta, pagar con OXXO Pay, pagar con SPEI, aplicar cupon, dividir pago. El MVP solo incluye tarjeta y OXXO Pay; el resto va a releases posteriores.

> Tip CENEVAL: El story mapping ayuda a definir el alcance de cada release de forma visual. Es una alternativa estructurada al backlog plano.

### Concepto 4.4: Criterios INVEST para historias

Una buena historia cumple los seis criterios INVEST de Bill Wake:
- Independent: independiente de otras (idealmente).
- Negotiable: se puede ajustar antes de codificar.
- Valuable: aporta valor al usuario o negocio.
- Estimable: el equipo puede estimar esfuerzo.
- Small: cabe en un sprint o menos.
- Testable: con criterios verificables.

**Ejemplo:** "Como cliente quiero un sistema rapido" falla en INVEST: no es testable (que tan rapido?), no es estimable (alcance vago), no es small (es todo el sistema).

> Tip CENEVAL: El acronimo INVEST se pregunta a veces literal. Memorizalo.

## Tema 5: Validacion de requerimientos

Una vez documentados, los requerimientos deben validarse para asegurar correctitud, completitud y consistencia antes de pasar a diseno.

### Concepto 5.1: Revision por pares

Otro analista o ingeniero revisa el SRS de forma asincrona, anotando observaciones. Es la tecnica mas ligera y barata, ideal para validacion continua.

Ventajas:
- Bajo costo.
- Detecta errores tempranos.
- Mejora calidad de redaccion.

Desventajas:
- Calidad depende del revisor.
- Puede pasar errores sutiles.

**Ejemplo:** En un equipo de cinco analistas en BBVA, cada SRS pasa por un peer review obligatorio antes de aprobarse. El revisor llena una checklist de doce puntos: ambiguedades, completitud, terminos no definidos, requerimientos contradictorios.

### Concepto 5.2: Walkthrough

Reunion informal donde el autor del documento lo lee y explica paso a paso ante un grupo (usuarios, otros analistas, desarrolladores). Los participantes hacen preguntas y senalan dudas.

A diferencia del peer review, es sincrono y participativo. A diferencia de la inspeccion Fagan, no tiene roles formales ni metricas.

**Ejemplo:** El analista lider del proyecto del SAT presenta el SRS en un walkthrough de dos horas con ocho stakeholders. Se anotan cuarenta observaciones que se resuelven en una version posterior.

> Tip CENEVAL: Walkthrough es informal, conducido por el autor. Si el reactivo dice "el autor explica el documento al grupo", es walkthrough.

### Concepto 5.3: Inspeccion Fagan

Tecnica formal creada por Michael Fagan en IBM (1976). Tiene roles especificos y metricas:

Roles:
- Moderador (facilita y mide).
- Lector (lee el documento).
- Autor (presente pero pasivo).
- Inspectores (uno o mas).
- Escriba (documenta defectos).

Fases:
1. Planificacion.
2. Vision general (overview).
3. Preparacion individual.
4. Reunion de inspeccion.
5. Retrabajo (rework).
6. Seguimiento.

Se mide tasa de defectos por hora, gravedad, tipo. Es la tecnica de revision mas rigurosa.

**Ejemplo:** Para el SRS critico de un sistema de control de turbinas de CFE, se aplica inspeccion Fagan formal: cinco inspectores dedican cuatro horas a preparacion y luego dos horas a reunion. Se detectan treinta y siete defectos clasificados por gravedad.

> Tip CENEVAL: Inspeccion Fagan es la mas formal, rigurosa y costosa. Si el reactivo menciona "roles formales", "metricas de defectos por hora" o "moderador y lector", es Fagan.

### Concepto 5.4: Prototipado como tecnica de validacion

El prototipo no solo sirve para elicitar; tambien valida que los requerimientos documentados reflejen lo que el cliente realmente quiere. Es especialmente util para validar interaccion y flujos complejos.

**Ejemplo:** Despues de redactar el SRS del nuevo wallet digital de Banco del Bajio, el equipo construye un prototipo Figma interactivo y lo prueba con doce usuarios. Tres requerimientos del SRS resultan no entenderse bien y se reescriben.

### Concepto 5.5: Matriz de trazabilidad

Herramienta complementaria de validacion. Mapea cada requerimiento con:
- Origen (que stakeholder lo solicito).
- Componente de diseno que lo implementa.
- Caso de prueba que lo verifica.

Permite detectar requerimientos huerfanos (sin diseno ni prueba) o componentes injustificados (sin requerimiento que los origine).

> Tip CENEVAL: La matriz de trazabilidad es la herramienta clave para auditar completitud. Pregunta tipica: "como aseguras que todos los requerimientos esten implementados y probados".

## Resumen de la subarea

- Las entrevistas estructuradas son comparables; semi-estructuradas balanceadas; abiertas exploratorias.
- Los cuestionarios escalan a muchos usuarios pero no descubren temas nuevos; la observacion etnografica captura conocimiento tacito.
- JAD reune a todos los stakeholders en sesion intensiva facilitada; Delphi obtiene consenso anonimo en rondas.
- El prototipo throwaway se descarta; el evolutivo se convierte en producto final.
- Low-fi para etapas tempranas; high-fi para validacion final.
- Las historias siguen formato Connextra (rol, funcionalidad, beneficio) con criterios Given-When-Then.
- Story mapping organiza historias en backbone narrativo horizontal y prioridades verticales.
- Walkthrough es informal con autor presentando; inspeccion Fagan es formal con roles y metricas.
- La matriz de trazabilidad asegura que cada requerimiento tenga diseno y prueba.

## Errores comunes en el EGEL

1. **Confundir JAD con focus group:** JAD es para definir el sistema con todos los stakeholders; focus group es solo para explorar opiniones de usuarios.
2. **Delphi sin anonimato:** algunos lo confunden con una serie de reuniones. El anonimato es esencial; sin el no es Delphi.
3. **Walkthrough vs inspeccion Fagan:** walkthrough es informal y el autor presenta; Fagan es formal con moderador, lector y metricas.
4. **Historia mal redactada:** rol generico ("como usuario") o beneficio vacuo ("para usar el sistema") son patrones tipicos de distractor.
5. **Prototipo evolutivo confundido con throwaway:** si el prototipo se descarta es throwaway; si se mantiene y evoluciona, es evolutivo.
