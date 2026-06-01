# Diseno arquitectonico de software

El diseno arquitectonico es la actividad mas estrategica del ciclo de vida del software. Define la estructura macro del sistema, las decisiones que son costosas de revertir y los atributos de calidad que se podran sostener (escalabilidad, mantenibilidad, disponibilidad, seguridad). En el EGEL ISOFT esta subarea se evalua con reactivos situacionales donde se presenta un escenario de negocio (un banco, una tienda en linea, un hospital) y se pide elegir el estilo arquitectonico mas adecuado, justificar trade-offs o detectar fallas en una propuesta. Esta guia recorre los estilos clasicos, la decision entre microservicios y monolito modular, las arquitecturas modernas centradas en el dominio, y los patrones de comunicacion y de datos distribuidos que aparecen una y otra vez en el examen.

## Tema 1: Estilos arquitectonicos clasicos

### Concepto 1.1: Monolito

Un monolito es un sistema desplegado como una sola unidad ejecutable. Todo el codigo (UI, logica de negocio, acceso a datos) vive en un mismo repositorio y comparte un proceso, una base de datos y un ciclo de despliegue. Es el estilo mas simple y, a pesar de la moda de los microservicios, sigue siendo la eleccion correcta para la mayoria de los productos en sus primeros anos. Sus ventajas son la simplicidad operacional (un solo deploy, una sola pipeline, una sola base de datos), la latencia minima entre modulos (llamadas en proceso, no de red) y la facilidad para refactorizar transversalmente. Sus desventajas aparecen con el tamano: tiempos de compilacion crecientes, despliegues riesgosos, acoplamiento accidental entre modulos y dificultad para escalar de manera independiente partes que tienen demandas distintas.

**Ejemplo:** una startup mexicana de gestion escolar arranca con un monolito en Java Spring Boot que sirve a 5 universidades. Un solo JAR contiene autenticacion, calificaciones, pagos y reportes. Despues de 3 anos, con 200 universidades y 1 millon de alumnos, los despliegues toman 40 minutos y un bug en el modulo de reportes tira el modulo de pagos. Es el momento clasico para considerar dividir, no antes.

> 💡 **Tip CENEVAL:** El examen suele presentar al monolito como anticuado, pero la respuesta correcta cuando el escenario describe un equipo pequeno, un dominio nuevo o un MVP es siempre el monolito. La complejidad operacional de microservicios no se justifica en sistemas con menos de 100 mil usuarios o equipos de menos de 20 personas.

### Concepto 1.2: Cliente-servidor

El estilo cliente-servidor separa responsabilidades en dos roles: el cliente solicita servicios (UI, dispositivo movil, navegador) y el servidor los provee (logica de negocio, datos). La comunicacion es sincrona y normalmente sigue un protocolo de solicitud-respuesta como HTTP. Es el estilo dominante de la web y de aplicaciones empresariales. Su variante de dos capas (cliente grueso conectado directo a la base de datos) cayo en desuso por problemas de seguridad y mantenimiento; hoy casi siempre se implementa con un servidor de aplicaciones como capa intermedia.

**Ejemplo:** un sistema de venta de boletos para conciertos donde el cliente es una aplicacion movil que consume una API REST. El servidor valida la disponibilidad, reserva el asiento y registra el pago. El cliente nunca toca la base de datos directamente.

### Concepto 1.3: N-tier o arquitectura en capas

La arquitectura en capas organiza el sistema en niveles horizontales con responsabilidades especificas. La version mas comun es de tres capas: presentacion (UI, controllers), logica de negocio (servicios, reglas de dominio) y datos (repositorios, ORM, base de datos). La regla central es que una capa solo puede depender de la capa inmediatamente inferior. Las llamadas hacia arriba estan prohibidas. Esto facilita pruebas unitarias por capa, intercambio de tecnologias (cambiar la UI sin tocar la logica) y entendimiento del flujo del codigo.

```java
// Capa de presentacion
@RestController
public class PedidoController {
    private final PedidoService pedidoService;

    @PostMapping("/pedidos")
    public ResponseEntity<PedidoDTO> crear(@RequestBody CrearPedidoRequest req) {
        return ResponseEntity.ok(pedidoService.crear(req));
    }
}

// Capa de logica de negocio
@Service
public class PedidoService {
    private final PedidoRepository pedidoRepo;

    public PedidoDTO crear(CrearPedidoRequest req) {
        validarStock(req);
        return pedidoRepo.save(...);
    }
}

// Capa de datos
public interface PedidoRepository extends JpaRepository<Pedido, Long> { }
```

**Ejemplo:** un sistema de nomina de una dependencia gubernamental usa tres capas en .NET. Si el gobierno decide migrar de SQL Server a PostgreSQL, solo se toca la capa de datos. La logica de calculo de impuestos y la UI quedan intactas.

> 💡 **Tip CENEVAL:** Cuando el reactivo pregunta por separacion de responsabilidades en un sistema empresarial tradicional sin requerimientos distribuidos, la respuesta es casi siempre arquitectura en capas. No confundir con hexagonal ni con MVC; MVC es un patron de UI, no un estilo arquitectonico.

### Concepto 1.4: Pipe and filter

Este estilo modela el sistema como una cadena de filtros conectados por pipes. Cada filtro toma un flujo de datos, lo transforma y lo pasa al siguiente. Los filtros son independientes, sin estado compartido, y se pueden recombinar libremente. Es la filosofia detras de Unix (cat archivo.txt | grep ERROR | sort | uniq -c) y de los pipelines de datos modernos (Apache Beam, Spark, ETLs).

**Ejemplo:** un sistema de procesamiento de imagenes medicas en un hospital aplica filtros en cadena: lectura del DICOM, normalizacion de contraste, deteccion de bordes, segmentacion, anotacion y guardado. Cada filtro puede ejecutarse en paralelo en distintos servidores.

> 💡 **Tip CENEVAL:** Pipe and filter aparece en reactivos sobre compiladores (analisis lexico, sintactico, semantico, generacion de codigo), procesamiento de senales y ETLs. Si el escenario menciona transformacion secuencial de datos, es pipe and filter.

## Tema 2: Microservicios vs monolito modular

### Concepto 2.1: Que es un microservicio

Un microservicio es un servicio pequeno, autonomo, desplegable de forma independiente, propietario de sus datos y comunicado con otros servicios a traves de la red. La frontera de un microservicio suele coincidir con un bounded context del Domain-Driven Design. Cada servicio tiene su propio ciclo de vida, su propio repositorio (o monorepo bien aislado) y su propia base de datos.

### Concepto 2.2: Monolito modular como alternativa

Un monolito modular es un monolito con disciplina: el codigo se organiza en modulos con fronteras explicitas (paquetes, namespaces) y la comunicacion entre modulos solo ocurre a traves de interfaces publicas. Cada modulo posee sus propias tablas en la base de datos y no se permiten joins cruzados. Es el paso intermedio recomendado antes de fragmentar en microservicios.

**Ejemplo:** Shopify y Stack Overflow operan a escala global con monolitos modulares (en Ruby y .NET respectivamente). Demuestran que la decision de microservicios no es obligatoria para escalar.

### Concepto 2.3: Ley de Conway y trade-offs organizacionales

La ley de Conway dice que las organizaciones disenan sistemas que reflejan sus estructuras de comunicacion. Si tienes cuatro equipos, terminaras con cuatro modulos o servicios. Microservicios funcionan bien cuando hay varios equipos autonomos que necesitan desplegar independientemente. Con un solo equipo, microservicios introducen mas problemas (consistencia eventual, latencia de red, observabilidad distribuida) que beneficios.

### Concepto 2.4: Netflix vs Etsy, dos caminos distintos

Netflix migro a microservicios temprano (alrededor de 2009) para soportar escala global y la frecuencia de despliegues de cientos de equipos. Tiene mas de mil microservicios. Etsy, en cambio, mantuvo durante anos un monolito en PHP y solo extrajo servicios cuando la necesidad era clara (busqueda, recomendaciones). Ambas son arquitecturas exitosas; la diferencia es contexto organizacional, no superioridad tecnica.

**Ejemplo:** una empresa mexicana de e-commerce con 30 desarrolladores quiere migrar de monolito a microservicios para imitar a Netflix. La respuesta correcta tras analisis: primero consolidar como monolito modular, identificar bounded contexts reales, y extraer servicios solo cuando un modulo tenga demandas de escalado o despliegue claramente distintas.

> 💡 **Tip CENEVAL:** Si el reactivo plantea un equipo de menos de 50 personas o un dominio joven, la respuesta correcta nunca es microservicios desde el dia uno. La frase clave es complejidad operacional: microservicios solo se justifican cuando los beneficios de despliegue independiente superan el costo de operar un sistema distribuido.

## Tema 3: Arquitecturas modernas

### Concepto 3.1: Arquitectura hexagonal (ports and adapters)

Propuesta por Alistair Cockburn en 2005, la arquitectura hexagonal coloca al dominio (logica de negocio pura) en el centro y todo lo demas (UI, base de datos, APIs externas) en la periferia. La comunicacion entre centro y periferia ocurre a traves de ports (interfaces definidas por el dominio) y adapters (implementaciones concretas). El dominio nunca importa frameworks ni librerias de infraestructura; son los adapters los que implementan los ports.

```typescript
// Port (definido por el dominio)
interface PedidoRepository {
  guardar(pedido: Pedido): Promise<void>;
  buscarPorId(id: string): Promise<Pedido | null>;
}

// Adapter (implementacion concreta, en la periferia)
class PedidoRepositoryPostgres implements PedidoRepository {
  constructor(private db: PostgresClient) {}
  async guardar(pedido: Pedido) {
    await this.db.query('INSERT INTO pedidos ...', [...]);
  }
}

// Caso de uso (en el centro, no conoce a Postgres)
class CrearPedidoUseCase {
  constructor(private repo: PedidoRepository) {}
  async ejecutar(input: CrearPedidoInput) {
    const pedido = Pedido.crear(input);
    await this.repo.guardar(pedido);
  }
}
```

**Ejemplo:** un sistema de reservas hoteleras quiere migrar de MySQL a MongoDB. Con arquitectura hexagonal, se crea un nuevo adapter PedidoRepositoryMongo y se inyecta en lugar del de Postgres. La logica de reservas no cambia ni una linea.

### Concepto 3.2: Clean Architecture

Propuesta por Robert C. Martin (Uncle Bob), Clean Architecture es una sintesis de hexagonal, onion y otras. Define cuatro capas concentricas: entities (reglas de negocio empresariales), use cases (reglas de aplicacion), interface adapters (controllers, presenters, gateways) y frameworks and drivers (web, DB, dispositivos). La regla de dependencia es estricta: las dependencias siempre apuntan hacia adentro. Las capas externas conocen a las internas, nunca al reves.

**Ejemplo:** una app movil en React Native y una API REST en Node.js comparten exactamente el mismo nucleo de logica (entities y use cases). Solo cambian los adapters externos. Esta es la promesa de Clean Architecture: independencia de UI, de framework, de base de datos.

### Concepto 3.3: Onion Architecture

Propuesta por Jeffrey Palermo en 2008, Onion organiza el sistema en capas concentricas similares a Clean: domain model (entities y agregados), domain services, application services e infrastructure. Es esencialmente Clean Architecture con menor enfasis en use cases explicitos. En el examen, hexagonal, clean y onion suelen tratarse como variaciones del mismo principio: aislar la logica de negocio de la infraestructura.

> 💡 **Tip CENEVAL:** Si el reactivo menciona testabilidad, independencia del framework o capacidad de cambiar la base de datos sin tocar reglas de negocio, la respuesta es hexagonal, clean u onion. La palabra clave es inversion de dependencias: el dominio define interfaces, la infraestructura las implementa.

## Tema 4: Patrones de comunicacion distribuida

### Concepto 4.1: REST (Representational State Transfer)

REST es un estilo arquitectonico para servicios web basado en HTTP. Sus principios: recursos identificados por URIs, verbos HTTP semanticos (GET, POST, PUT, DELETE, PATCH), comunicacion sin estado y representaciones intercambiables (JSON, XML). Es el estandar de facto para APIs publicas por su simplicidad, cacheabilidad y compatibilidad universal con clientes HTTP.

**Ejemplo:** una API REST para una libreria expone GET /libros (lista), POST /libros (crear), GET /libros/123 (detalle), PUT /libros/123 (actualizar) y DELETE /libros/123 (eliminar). Cualquier cliente con HTTP puede consumirla.

### Concepto 4.2: gRPC

gRPC es un framework de RPC creado por Google que usa HTTP/2 como transporte y Protocol Buffers como formato binario de serializacion. Define contratos en archivos .proto y genera codigo cliente y servidor en multiples lenguajes. Es notablemente mas rapido que REST en JSON (menor payload, multiplexacion, streaming bidireccional) pero mas opaco (binario, no se debuggea con curl facilmente).

```proto
service PedidoService {
  rpc CrearPedido (CrearPedidoRequest) returns (PedidoResponse);
  rpc ListarPedidos (ListarRequest) returns (stream PedidoResponse);
}
```

**Ejemplo:** un sistema de pagos interno usa gRPC entre servicios de cobros y antifraude porque necesita latencias menores a 10ms y manejar 50 mil peticiones por segundo. Para clientes externos, expone REST.

### Concepto 4.3: GraphQL

GraphQL es un lenguaje de consulta para APIs creado por Facebook. El cliente especifica exactamente que campos necesita y el servidor responde con esa estructura. Soluciona los problemas de over-fetching (REST devuelve mas campos de los necesarios) y under-fetching (REST requiere multiples llamadas para componer una vista). Usa un endpoint unico y resolvers que conocen como obtener cada campo.

**Ejemplo:** una app movil consulta GraphQL para obtener nombre y avatar de un usuario y los titulos de sus ultimos 5 pedidos en una sola peticion. Con REST necesitaria al menos tres llamadas.

### Concepto 4.4: Colas de mensajes (RabbitMQ, ActiveMQ, SQS)

Las colas desacoplan productores de consumidores. El productor publica un mensaje en una cola y se olvida; el consumidor lo procesa cuando puede. Garantizan entrega (al menos una vez, exactamente una vez segun configuracion) y permiten manejar picos de carga sin colapsar al consumidor. El patron clasico es work queue: multiples consumidores procesan tareas en paralelo.

**Ejemplo:** una tienda en linea publica eventos de pedido_creado en RabbitMQ. Consumen ese evento el servicio de inventario (descontar stock), el de envio (generar guia) y el de notificaciones (mandar email). Los tres son independientes y pueden fallar y reintentarse.

### Concepto 4.5: Event-driven y streaming (Kafka)

Kafka es una plataforma de streaming distribuido que persiste eventos en topics ordenados. A diferencia de RabbitMQ, los eventos no se borran al consumirse: quedan retenidos por dias o semanas. Permite tener multiples consumidores reproduciendo el mismo flujo, hacer replays para depurar y arquitecturas event-sourced.

> 💡 **Tip CENEVAL:** Distinguir cuando usar REST (APIs publicas, simple), gRPC (latencia critica entre servicios internos), GraphQL (clientes con necesidades de datos heterogeneas) y mensajeria (desacoplamiento, picos de carga, procesamiento asincrono). El examen suele dar el escenario y pedir el patron correcto.

## Tema 5: Patrones de datos distribuidos

### Concepto 5.1: Database per service

En microservicios, cada servicio es dueno de su base de datos. No se permite que otro servicio acceda directamente a sus tablas; toda interaccion ocurre por API. Esto preserva la autonomia (cada equipo elige su tecnologia: Postgres, Mongo, Redis) y evita el acoplamiento por esquema compartido, que es uno de los peores enemigos de la evolucion del sistema.

**Ejemplo:** el servicio de catalogo usa Elasticsearch para busquedas, el de carrito usa Redis para baja latencia, el de pedidos usa Postgres para ACID. Cada uno es independiente.

### Concepto 5.2: CQRS (Command Query Responsibility Segregation)

CQRS separa el modelo de escritura del modelo de lectura. Los comandos (write) usan un modelo optimizado para validar reglas de negocio y persistir cambios; las consultas (read) usan un modelo optimizado para las pantallas (denormalizado, precomputado). Suelen vivir en bases de datos distintas, sincronizadas por eventos.

**Ejemplo:** en un sistema de banca, escribir una transferencia toca tablas normalizadas (cuentas, movimientos) con transacciones ACID. Pero el estado de cuenta del cliente se sirve desde una vista materializada actualizada por eventos, sin joins en tiempo de lectura.

### Concepto 5.3: Event Sourcing

En lugar de guardar el estado actual, se guarda la secuencia inmutable de eventos que llevaron a el. El estado se reconstruye reproduciendo eventos. Permite auditoria completa, time-travel debugging y proyecciones distintas (varias vistas del mismo flujo). Es complejo y solo se justifica en dominios donde el historial es valioso (banca, salud, e-commerce con devoluciones).

**Ejemplo:** un sistema bancario nunca borra movimientos. Para saber el saldo de la cuenta 123, suma todos los eventos: deposito_500, retiro_200, deposito_100, etc. El saldo es una proyeccion.

### Concepto 5.4: Saga

Una saga gestiona transacciones de negocio distribuidas que cruzan varios servicios sin usar transacciones distribuidas (que son lentas e impracticas a escala). Cada paso es una transaccion local con su accion de compensacion. Si un paso falla, se ejecutan las compensaciones de los pasos anteriores. Hay dos variantes: orquestada (un coordinador central) y coreografiada (cada servicio reacciona a eventos).

**Ejemplo:** un viaje en una agencia de turismo reserva vuelo, hotel y auto en servicios distintos. Si la reserva de auto falla, la saga cancela la reserva de hotel y la del vuelo, dejando el sistema en estado consistente.

> 💡 **Tip CENEVAL:** Si el reactivo menciona transacciones que cruzan multiples servicios, la respuesta no es transaccion distribuida (2PC) sino saga. Si menciona auditoria total e historial inmutable, es event sourcing. Si menciona separar lectura de escritura por desempeno, es CQRS.

## Resumen de la subarea

El diseno arquitectonico no se trata de elegir la tecnologia mas moderna sino de equilibrar los atributos de calidad que el negocio necesita con la complejidad operacional que el equipo puede sostener. Empieza con el estilo mas simple que pueda funcionar (monolito o monolito modular), aplica separacion de responsabilidades (capas o hexagonal), y solo introduce distribucion (microservicios, mensajeria, CQRS) cuando el dolor justifica el costo. Los patrones presentados (REST, gRPC, GraphQL, sagas, event sourcing) son herramientas; el arte esta en saber cuando aplicar cada una. Conoce las diferencias conceptuales, los trade-offs y los escenarios canonicos: eso es exactamente lo que el EGEL evalua.

## Errores comunes en el EGEL

1. **Elegir microservicios por defecto.** El examen suele plantear escenarios donde un monolito modular es la respuesta correcta. Microservicios solo si hay multiples equipos y necesidad real de despliegue independiente.
2. **Confundir patrones con estilos arquitectonicos.** MVC es un patron de UI, no un estilo arquitectonico. Singleton no es arquitectura; es un patron GoF de creacion.
3. **Pensar que REST siempre es mejor que SOAP o que gRPC es siempre mejor que REST.** Cada uno tiene su nicho: REST para APIs publicas, gRPC para baja latencia interna, GraphQL para clientes heterogeneos.
4. **Mezclar transacciones ACID con microservicios.** No se hacen transacciones distribuidas entre microservicios; se usan sagas o consistencia eventual.
5. **Olvidar la ley de Conway.** La estructura del equipo determina la estructura del sistema. Si el equipo es uno solo, no hay razon de fragmentar en servicios.
6. **Confundir arquitectura hexagonal con clean o con onion.** Las tres comparten el principio de inversion de dependencias hacia el dominio. En el examen suelen tratarse como equivalentes a menos que se pida una distincion fina.
7. **Asumir que event sourcing es siempre mejor.** Es complejo y solo se justifica cuando el historial es parte del negocio (banca, contabilidad, healthcare). Para un CRUD tipico es overkill.
8. **No considerar la observabilidad.** Microservicios sin tracing distribuido (OpenTelemetry, Jaeger) y sin logs centralizados son ingobernables. El reactivo a veces menciona dificultad para depurar; la respuesta es tracing distribuido.
