# Tecnicas y herramientas de documentacion de requerimientos

Esta subarea del EGEL ISOFT evalua tu capacidad para documentar requerimientos usando los estandares y notaciones formales mas aceptados en la industria: SRS IEEE 830, UML para comportamiento, modelado de datos (ER, DFD) y BPMN para procesos de negocio. El examen te dara fragmentos de diagramas o documentos y debes identificar errores, elementos mal usados o equivalencias entre notaciones.

## Tema 1: Especificacion de requerimientos de software (SRS IEEE 830)

El estandar IEEE 830-1998 (actualizado en ISO/IEC/IEEE 29148:2018) define la estructura recomendada para el documento de Especificacion de Requerimientos de Software (Software Requirements Specification). Es la referencia mas evaluada en el EGEL.

### Concepto 1.1: Estructura general del SRS

El SRS tiene tres secciones principales mas anexos. La estructura completa es:

```
1. Introduccion
   1.1 Proposito
   1.2 Alcance
   1.3 Definiciones, acronimos y abreviaturas
   1.4 Referencias
   1.5 Vision general del documento

2. Descripcion general
   2.1 Perspectiva del producto
   2.2 Funciones del producto
   2.3 Caracteristicas del usuario
   2.4 Restricciones generales
   2.5 Suposiciones y dependencias

3. Requerimientos especificos
   3.1 Requerimientos funcionales
   3.2 Requerimientos no funcionales
   3.3 Requerimientos de interfaces externas
   3.4 Otros requerimientos

Anexos: glosario, diagramas, matriz de trazabilidad
```

**Ejemplo:** Para el SRS del sistema de cobranza de Telmex Empresarial, la seccion 1.2 "Alcance" identifica el producto (TCM-Cobranza v2.0), describe que hara (gestion de cartera B2B) y que NO hara (cobranza B2C, pagos en efectivo en oficinas). La seccion 2.1 lo posiciona como reemplazo del legacy Cobra98.

> Tip CENEVAL: La diferencia entre "Proposito" (1.1) y "Alcance" (1.2) es: proposito es por que existe el documento; alcance es que cubre el producto.

### Concepto 1.2: Caracteristicas de un buen SRS segun IEEE 830

Un SRS de calidad debe cumplir ocho atributos:
- Correcto: refleja necesidades reales.
- Inequivoco: una sola interpretacion posible.
- Completo: incluye todos los requerimientos.
- Consistente: sin contradicciones internas.
- Clasificado por importancia y/o estabilidad.
- Verificable: cada requerimiento puede probarse.
- Modificable: estructura facilita cambios.
- Trazable: cada requerimiento se puede rastrear hacia atras (origen) y adelante (diseno, prueba).

**Ejemplo:** Un requerimiento ambiguo como "el sistema debe ser rapido" viola "inequivoco" y "verificable". Reescrito como "el sistema debe responder a consultas de inventario en menos de dos segundos en el percentil 95 bajo carga de mil usuarios concurrentes" cumple ambas.

> Tip CENEVAL: Memoriza los ocho atributos. El EGEL pregunta cual viola un requerimiento mal redactado. La respuesta tipica es "no verificable" o "ambiguo".

### Concepto 1.3: Redaccion de requerimientos funcionales en SRS

Cada FR debe tener:
- Identificador unico (FR-001, FR-002).
- Titulo descriptivo.
- Descripcion en una sola oracion con verbo de accion.
- Entradas, proceso, salidas.
- Prioridad (alta, media, baja o MoSCoW).
- Origen (stakeholder o documento).
- Dependencias con otros requerimientos.

```
FR-014  Registro de pago parcial
Descripcion: El sistema debe permitir al cajero registrar
  un pago parcial sobre una factura abierta, generando
  un recibo y actualizando el saldo pendiente.
Entradas: numero de factura, monto, metodo de pago
Salidas: recibo PDF, asiento contable, saldo actualizado
Prioridad: Must (MVP)
Origen: Gerente de cobranza (entrevista 2025-03-15)
Dependencias: FR-007 (consulta de factura), FR-010 (impresion)
```

> Tip CENEVAL: Si el reactivo te muestra un requerimiento sin identificador, sin verbo de accion o sin entradas/salidas claras, esta mal documentado segun IEEE 830.

### Concepto 1.4: Documentacion de NFR en SRS

Los NFR se documentan con plantilla similar pero enfatizando metricas y condiciones:

```
NFR-003  Tiempo de respuesta de consulta
Atributo de calidad: Rendimiento (comportamiento temporal)
Descripcion: Toda consulta de estado de cuenta debe
  responder en menos de 1.5 segundos en percentil 95
Condiciones: Carga de 5,000 usuarios concurrentes
Metodo de verificacion: Pruebas de carga con JMeter
Prioridad: Must
```

> Tip CENEVAL: Sin metrica ni metodo de verificacion, un NFR no cumple IEEE 830. Es uno de los errores mas castigados.

## Tema 2: Casos de uso UML

Los casos de uso son la tecnica mas usada para documentar requerimientos funcionales en forma narrativa y visual. UML 2.5 define su notacion.

### Concepto 2.1: Elementos basicos del diagrama de casos de uso

Componentes:
- Actor: rol externo que interactua con el sistema (persona, sistema externo, dispositivo).
- Caso de uso: una secuencia de acciones que produce un resultado observable.
- Frontera del sistema: rectangulo que separa lo interno (casos) de lo externo (actores).
- Relaciones: asociacion, include, extend, generalizacion.

Notacion visual:
- Actor: figura de palitos (stick figure).
- Caso de uso: elipse con nombre interno.
- Frontera: rectangulo que contiene los casos.

**Ejemplo:** En el sistema de pago de servicios de CFE en linea, los actores son: Cliente residencial, Cliente industrial, Operador de banco (sistema externo), Administrador. Los casos de uso clave: Consultar recibo, Pagar con tarjeta, Solicitar prorroga, Generar reporte mensual.

### Concepto 2.2: Actor primario vs actor secundario

- Actor primario: inicia el caso de uso, busca el objetivo. Tipicamente esta a la izquierda del diagrama.
- Actor secundario: proporciona un servicio al sistema durante el caso. Tipicamente a la derecha.

**Ejemplo:** En el caso "Pagar con tarjeta": el Cliente es actor primario (inicia el pago, persigue el objetivo). El procesador OpenPay es actor secundario (el sistema lo invoca para validar la tarjeta).

> Tip CENEVAL: Pregunta tipica: "quien es el actor primario en este caso?" La respuesta es siempre quien INICIA y se BENEFICIA. Distractor frecuente es elegir un actor secundario invocado durante el flujo.

### Concepto 2.3: Relacion include

Un caso de uso A "include" a B cuando B es un comportamiento OBLIGATORIO que se ejecuta siempre como parte de A. Sin B, A no se completa.

Notacion: flecha discontinua con estereotipo «include» desde el caso incluyente al incluido.

**Ejemplo:** En el sistema bancario:
- "Transferir fondos" «include» "Autenticar usuario"
- "Pagar servicio" «include» "Autenticar usuario"
- "Consultar saldo" «include» "Autenticar usuario"

El caso "Autenticar usuario" se factoriza para reutilizarse. Siempre se ejecuta.

> Tip CENEVAL: Include = obligatorio y reutilizable. Si el reactivo dice "siempre que se ejecuta A, tambien se ejecuta B", es include.

### Concepto 2.4: Relacion extend

Un caso de uso B "extiende" a A cuando B es un comportamiento OPCIONAL que se ejecuta solo bajo cierta condicion en un punto de extension de A.

Notacion: flecha discontinua con «extend» desde el caso extensor al caso base. El caso base debe declarar puntos de extension.

**Ejemplo:** En "Pagar con tarjeta":
- Caso base: Pagar con tarjeta. Punto de extension: "validacion fallida".
- Caso extensor: "Solicitar autenticacion 3D Secure" extends "Pagar con tarjeta" en el punto "validacion fallida".

3D Secure solo se invoca si el banco emisor lo requiere; no siempre se ejecuta.

> Tip CENEVAL: Extend = opcional. Include = obligatorio. Es la confusion mas frecuente en el EGEL. Memoriza: ExTend = condicion exTra.

### Concepto 2.5: Generalizacion entre actores y entre casos

Generalizacion entre actores: un actor hereda comportamientos de otro. Notacion: flecha continua con punta triangular vacia.

**Ejemplo:** "Cliente premium" generaliza de "Cliente". Cliente premium puede hacer todo lo de Cliente, mas casos exclusivos como "Atencion VIP 24/7".

Generalizacion entre casos: caso especifico hereda de uno general. Util cuando varios casos comparten estructura.

**Ejemplo:** "Pagar con tarjeta", "Pagar con SPEI" y "Pagar con OXXO" generalizan de "Pagar".

> Tip CENEVAL: La flecha de generalizacion es siempre con punta triangular vacia, igual que herencia en clases.

### Concepto 2.6: Especificacion textual del caso de uso

El diagrama es solo el resumen. La especificacion textual contiene el detalle:

```
ID: CU-005
Nombre: Pagar con tarjeta
Actor primario: Cliente
Actor secundario: OpenPay
Precondiciones:
  - Cliente autenticado
  - Carrito tiene al menos un item

Flujo principal:
  1. Cliente confirma compra del carrito
  2. Sistema muestra formulario de pago
  3. Cliente ingresa datos de tarjeta
  4. Sistema valida formato y envia a OpenPay
  5. OpenPay aprueba el cargo
  6. Sistema registra la venta y emite CFDI 4.0
  7. Sistema envia comprobante por correo
  8. Sistema muestra confirmacion al cliente

Flujos alternativos:
  4a. Formato invalido: sistema marca campos con error
  5a. OpenPay rechaza: sistema sugiere otro metodo
  5b. OpenPay solicita 3D Secure: incluir CU-009

Postcondiciones:
  - Venta registrada
  - Inventario decrementado
  - Cliente recibe correo de confirmacion
```

> Tip CENEVAL: Las precondiciones se verifican ANTES del caso; las postcondiciones se garantizan DESPUES. Si el reactivo dice "el cliente debe estar autenticado", es precondicion. Si dice "la venta queda registrada", es postcondicion.

## Tema 3: Diagramas UML complementarios

UML define trece tipos de diagramas. Para requerimientos, los cuatro mas usados despues de casos de uso son: actividad, secuencia, estado y comunicacion.

### Concepto 3.1: Diagrama de actividad

Modela el flujo de control de un proceso. Es como un diagrama de flujo enriquecido con paralelismo. Elementos:
- Nodo inicial (circulo solido).
- Nodo final (circulo con anillo).
- Actividad (rectangulo redondeado).
- Decision/merge (diamante).
- Fork/join (barra horizontal para paralelismo).
- Carriles (swimlanes) para asignar actividades a actores.

**Ejemplo:** El proceso de devolucion en Liverpool tiene swimlanes Cliente, Almacen, Finanzas. El cliente solicita la devolucion; en paralelo Almacen valida producto y Finanzas valida factura (fork). Al cumplir ambos (join), Finanzas emite reembolso.

> Tip CENEVAL: El paralelismo (fork/join) es lo unico que diferencia diagrama de actividad de un flowchart clasico. Si el reactivo enfatiza ejecuciones simultaneas, es actividad.

### Concepto 3.2: Diagrama de secuencia

Muestra interacciones entre objetos o sistemas a lo largo del tiempo. Elementos:
- Actores y objetos arriba como rectangulos.
- Lifelines verticales descendentes.
- Mensajes horizontales (flechas) entre lifelines.
- Activaciones (barras delgadas verticales).
- Retornos (flechas discontinuas).

Tipos de mensajes:
- Sincronos (flecha solida).
- Asincronos (flecha abierta).
- Retorno (flecha discontinua).
- Auto-mensaje (flecha que regresa al mismo lifeline).

**Ejemplo:** En el caso "Pagar con tarjeta", el diagrama de secuencia muestra: Cliente -> WebApp: confirmarPago(carrito); WebApp -> OpenPay: charge(tarjeta, monto); OpenPay -> WebApp: success(txId); WebApp -> SAT: timbrar(factura); SAT -> WebApp: cfdi(uuid); WebApp -> Cliente: mostrarConfirmacion().

> Tip CENEVAL: El diagrama de secuencia muestra el ORDEN TEMPORAL de mensajes. Si el reactivo pregunta "que pasa primero", es secuencia.

### Concepto 3.3: Diagrama de estado

Modela el comportamiento de un objeto a lo largo de su vida. Elementos:
- Estado inicial (circulo solido).
- Estado final (circulo con anillo).
- Estado (rectangulo redondeado con nombre).
- Transicion (flecha con etiqueta evento[condicion]/accion).
- Estados compuestos (anidan subestados).
- Estados concurrentes (separados por linea discontinua).

**Ejemplo:** El estado de un pedido en Mercado Libre: Creado -> Pagado -> Enviado -> EnTransito -> Entregado. Transiciones: pago_aprobado, paqueteria_recoge, conductor_entrega. Estado alternativo: Cancelado (desde Creado o Pagado).

```
Estado: PEDIDO
  Inicial -> Creado
  Creado -- pago_aprobado --> Pagado
  Creado -- cancelar --> Cancelado
  Pagado -- enviar --> Enviado
  Enviado -- en_camino --> EnTransito
  EnTransito -- entregar --> Entregado
  Entregado -> Final
```

> Tip CENEVAL: El diagrama de estado se centra en UN solo objeto y sus estados. Si el reactivo habla de "el ciclo de vida del pedido", es diagrama de estado.

### Concepto 3.4: Diagrama de comunicacion (antes colaboracion)

Muestra interacciones entre objetos enfatizando la estructura, no el tiempo. Los mensajes se numeran para indicar el orden.

Diferencia con secuencia: secuencia enfatiza el tiempo (lectura vertical); comunicacion enfatiza la estructura (lectura espacial con numeros).

**Ejemplo:** Mismo escenario del pago, en diagrama de comunicacion: los objetos Cliente, WebApp, OpenPay, SAT aparecen como cajas conectadas con flechas numeradas: 1: confirmarPago, 2: charge, 3: success, 4: timbrar, 5: cfdi, 6: mostrarConfirmacion.

> Tip CENEVAL: Secuencia = temporal (eje vertical). Comunicacion = estructural (numeros). Ambos modelan lo mismo, distinta enfasis.

## Tema 4: Modelado de datos

El modelado de datos documenta la estructura de informacion del sistema. El EGEL pregunta entidad-relacion, cardinalidades, normalizacion y diagramas de flujo de datos.

### Concepto 4.1: Diagrama Entidad-Relacion (Chen vs Crow's Foot)

El modelo entidad-relacion (ER) representa entidades del dominio y como se relacionan. Dos notaciones principales:

Notacion Chen (1976, original):
- Entidades: rectangulos.
- Atributos: elipses.
- Relaciones: diamantes.
- Cardinalidades: numeros en las lineas.

Notacion Crow's Foot (mas usada hoy):
- Entidades: rectangulos con atributos listados.
- Relaciones: lineas con simbolos en los extremos.
- Cardinalidad: pata de gallo (varios), barra (uno), circulo (cero opcional).

**Ejemplo:** Para el sistema de matricula del Tecnologico de Monterrey:

```
ALUMNO (1, N) <--inscrito_en--> (1, N) CURSO
ALUMNO atributos: matricula, nombre, carrera
CURSO atributos: clave, nombre, creditos
Relacion atributos: semestre, calificacion
```

Lectura: un alumno se inscribe en al menos un curso (hasta N); un curso tiene al menos un alumno (hasta N). Cardinalidad N a N.

### Concepto 4.2: Cardinalidades

Cardinalidad expresa cuantas instancias de una entidad pueden relacionarse con otra. Notacion (min, max):
- (0,1): cero o una.
- (1,1): exactamente una.
- (0,N): cero o muchas.
- (1,N): al menos una, sin limite.

Combinaciones tipicas:
- Uno a uno (1:1): persona y su INE.
- Uno a muchos (1:N): cliente y sus pedidos.
- Muchos a muchos (N:M): alumno y curso.

**Ejemplo:** En el sistema del SAT:
- Contribuyente (1) tiene (1,N) Facturas: un contribuyente puede tener muchas facturas, una factura pertenece a UN contribuyente. 1:N.
- Factura (1,N) contiene (1,N) Productos: muchos a muchos a traves de una tabla intermedia Detalle_Factura.

> Tip CENEVAL: Recuerda que las relaciones N:M se implementan SIEMPRE con una tabla intermedia (asociativa) en bases relacionales.

### Concepto 4.3: Normalizacion (1FN, 2FN, 3FN)

La normalizacion reduce redundancia y anomalias de actualizacion en bases relacionales.

Primera forma normal (1FN):
- Cada celda tiene UN solo valor (atomico).
- No hay grupos repetitivos.

Segunda forma normal (2FN):
- Esta en 1FN.
- Todo atributo no clave depende de la clave COMPLETA (relevante en claves compuestas).

Tercera forma normal (3FN):
- Esta en 2FN.
- No hay dependencias transitivas (un atributo no clave no depende de otro atributo no clave).

**Ejemplo:** Tabla mal disenada:

```sql
PEDIDO (id_pedido, fecha, cliente_id, cliente_nombre,
        cliente_ciudad, producto1, producto2, producto3)
```

Viola 1FN (productos repetidos como columnas) y 3FN (cliente_nombre y cliente_ciudad dependen de cliente_id, no del id_pedido).

Normalizada:

```sql
CLIENTE (id_cliente, nombre, ciudad)
PEDIDO (id_pedido, fecha, id_cliente)
DETALLE_PEDIDO (id_pedido, id_producto, cantidad)
PRODUCTO (id_producto, nombre, precio)
```

> Tip CENEVAL: Si una tabla repite columnas (telefono1, telefono2), viola 1FN. Si datos del cliente (nombre, direccion) aparecen en tabla de pedidos, viola 3FN.

### Concepto 4.4: Diagrama de flujo de datos (DFD)

DFD modela como fluyen los datos entre procesos, almacenes y entidades externas. Notacion Gane/Sarson:
- Entidad externa: rectangulo (fuente o destino fuera del sistema).
- Proceso: rectangulo con esquinas redondeadas (transforma datos).
- Almacen: dos lineas paralelas (BD, archivo).
- Flujo: flecha etiquetada con el dato.

Niveles:
- Nivel 0 (diagrama de contexto): un solo proceso = el sistema; muestra interacciones con entidades externas.
- Nivel 1: descompone el proceso principal en subprocesos.
- Niveles n: detalle creciente.

**Ejemplo:** Sistema de nomina:
- Nivel 0: Empleado -> [SISTEMA NOMINA] <-> SAT, <-> Banco.
- Nivel 1: SISTEMA NOMINA se descompone en: Registrar asistencia, Calcular sueldo, Generar timbrado, Dispersar pago.

> Tip CENEVAL: DFD modela DATOS y su transformacion. NO modela control de flujo (eso es diagrama de actividad). Distractor frecuente.

## Tema 5: BPMN para procesos de negocio

Business Process Model and Notation 2.0 (estandar OMG 2011) es la notacion estandar para modelar procesos de negocio. Va mas alla de UML al incluir piscinas, mensajes entre organizaciones y eventos sofisticados.

### Concepto 5.1: Elementos basicos de BPMN

Categorias principales:

Eventos (circulos):
- Inicio: circulo delgado.
- Intermedio: doble circulo delgado.
- Fin: circulo grueso.

Actividades (rectangulos redondeados):
- Tarea: actividad atomica.
- Subproceso: actividad descomponible.

Gateways (diamantes):
- Exclusivo (XOR, diamante con X): solo una rama.
- Paralelo (AND, diamante con +): todas las ramas.
- Inclusivo (OR, diamante con circulo): una o mas ramas.

Flujos:
- Secuencia: flecha solida.
- Mensaje: flecha discontinua.

Pools y lanes:
- Pool: organizacion completa.
- Lane: rol dentro del pool.

### Concepto 5.2: Tipos de eventos

Eventos clasificados por momento y disparador:

Por momento: Inicio, Intermedio, Fin.

Por disparador (en cada momento):
- Mensaje: llega un mensaje externo.
- Temporizador: tiempo o fecha.
- Error: excepcion.
- Senal: broadcast.
- Compensacion: rollback.
- Cancelacion.
- Terminacion.

**Ejemplo:** En el proceso de devolucion de Liverpool:
- Inicio con mensaje: cliente envia solicitud por web.
- Intermedio temporizador: si pasan 48 horas sin que almacen valide, escalar a supervisor.
- Fin con mensaje: notificar cliente del reembolso.

> Tip CENEVAL: El simbolo dentro del circulo del evento indica el disparador. Memoriza al menos: sobre = mensaje, reloj = temporizador, rayo = error.

### Concepto 5.3: Gateways exclusivo, paralelo, inclusivo

Gateway exclusivo (XOR):
- Solo una salida es elegida segun condicion.
- Las condiciones deben ser mutuamente excluyentes.

Gateway paralelo (AND):
- Todas las salidas se ejecutan simultaneamente.
- En el join, espera a que todas terminen.

Gateway inclusivo (OR):
- Una o varias salidas se ejecutan segun condiciones.
- En el join, espera solo a las que fueron activadas.

**Ejemplo:** En el proceso de credito de Konfio:
- XOR: si score > 700 -> aprobar; sino -> rechazar.
- AND: en paralelo enviar contrato al cliente y al area legal.
- OR: notificar por SMS y/o email segun preferencias del cliente.

> Tip CENEVAL: Confusion tipica entre XOR e OR. XOR = exactamente UNA rama (excluyente). OR = una o varias (inclusivo).

### Concepto 5.4: Pools, lanes y mensajes entre pools

Pool: representa un participante (organizacion o sistema independiente). El flujo dentro de un pool es flujo de secuencia. Entre pools solo van flujos de mensaje.

Lane: subdivision dentro de un pool, generalmente un rol o departamento.

**Ejemplo:** En el proceso de pago de un proveedor de Soriana:
- Pool 1: Soriana (lanes: Compras, Tesoreria, Auditoria).
- Pool 2: Proveedor (lanes: Ventas, Cobranza).
- Pool 3: SAT (validador externo).

Mensajes: factura electronica (Proveedor -> Soriana), confirmacion de pago (Soriana -> Proveedor), validacion CFDI (Soriana -> SAT, SAT -> Soriana).

> Tip CENEVAL: Recuerda: dentro del pool flujo de secuencia (flecha solida); entre pools flujo de mensaje (flecha discontinua).

### Concepto 5.5: Casos de uso de BPMN vs UML

| Aspecto | UML actividad | BPMN |
|---|---|---|
| Audiencia | Tecnica | Negocio + tecnica |
| Enfasis | Comportamiento de sistema | Procesos organizacionales |
| Pools entre organizaciones | Limitado | Nativo |
| Eventos complejos | No | Si |
| Estandar | OMG | OMG |

**Ejemplo:** Para documentar el flujo interno del modulo de inventarios de un ERP, UML actividad es suficiente. Para documentar el proceso end-to-end de compra a proveedor (con tres organizaciones involucradas, SLAs, eventos de timeout), BPMN es la herramienta correcta.

> Tip CENEVAL: BPMN es para PROCESOS DE NEGOCIO multi-organizacionales con eventos sofisticados. UML actividad es para flujos dentro de UN sistema.

## Resumen de la subarea

- IEEE 830 estructura el SRS en introduccion, descripcion general y requerimientos especificos.
- Un buen requerimiento es correcto, inequivoco, completo, consistente, clasificado, verificable, modificable y trazable.
- En casos de uso UML: include es obligatorio y reutilizable; extend es opcional bajo condicion.
- Actor primario inicia y se beneficia; secundario provee servicio al sistema.
- Diagrama de actividad modela control y paralelismo; secuencia modela tiempo; estado modela ciclo de vida; comunicacion modela estructura con numeros.
- En ER, cardinalidades N:M se implementan con tabla intermedia.
- Normalizacion: 1FN atomicidad, 2FN dependencia de clave completa, 3FN sin dependencias transitivas.
- DFD modela datos y transformaciones, no control de flujo.
- BPMN: XOR exclusivo, AND paralelo, OR inclusivo; pools para organizaciones, lanes para roles; entre pools solo mensajes.

## Errores comunes en el EGEL

1. **Include vs extend invertidos:** include es OBLIGATORIO; extend es OPCIONAL bajo condicion. Es el error mas frecuente.
2. **Confundir DFD con diagrama de actividad:** DFD modela datos; actividad modela control de flujo y paralelismo.
3. **Olvidar tabla intermedia en N:M:** muchas respuestas erroneas dejan una relacion muchos a muchos directa sin tabla asociativa.
4. **XOR vs OR en BPMN:** XOR elige exactamente UNA rama; OR puede elegir varias. Distractor tipico.
5. **Actor primario confundido con secundario:** el primario INICIA y BUSCA EL OBJETIVO; el secundario es invocado por el sistema durante el caso.
