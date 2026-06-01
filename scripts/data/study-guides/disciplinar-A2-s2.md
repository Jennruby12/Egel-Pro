# Diseno de modulos, componentes y de datos

Mientras la arquitectura define el esqueleto del sistema, el diseno de modulos y componentes define como se organiza el codigo a nivel de clases, interfaces y relaciones. Una buena arquitectura puede arruinarse con clases acopladas, jerarquias rigidas y datos mal modelados. Esta subarea del EGEL evalua principios de diseno orientado a objetos (SOLID), patrones de diseno clasicos del libro de la Gang of Four (creacionales, estructurales y de comportamiento) y diseno de datos relacionales y no relacionales. Los reactivos suelen mostrar un fragmento de codigo con un mal olor (violacion de SRP, jerarquia rota, acoplamiento fuerte) y pedir que se identifique el principio violado o el patron aplicable. Domina los patrones canonicos y aprende a reconocer sus formas en codigo real.

## Tema 1: Principios SOLID

### Concepto 1.1: Single Responsibility Principle (SRP)

Una clase debe tener una sola razon para cambiar. Esto significa que sus responsabilidades deben estar focalizadas en un area unica del sistema. Una clase que persiste datos, calcula impuestos y envia emails tiene tres razones para cambiar y por lo tanto viola SRP. La consecuencia practica: cambios en una responsabilidad rompen las otras, los tests son fragiles y la reusabilidad es nula.

```typescript
// MAL: viola SRP
class Pedido {
  calcularTotal() { /* logica de calculo */ }
  guardarEnBD() { /* SQL */ }
  enviarEmailConfirmacion() { /* SMTP */ }
  generarFacturaPDF() { /* PDF */ }
}

// BIEN: cada clase tiene una sola razon para cambiar
class Pedido { calcularTotal() {} }
class PedidoRepository { guardar(p: Pedido) {} }
class EmailService { enviarConfirmacion(p: Pedido) {} }
class FacturaGenerator { generarPDF(p: Pedido) {} }
```

**Ejemplo:** un sistema de RH tiene una clase Empleado de 800 lineas que calcula nomina, valida documentos, envia notificaciones y exporta reportes. Cada cambio en uno de esos modulos rompe los otros. La solucion es extraer responsabilidades en clases focalizadas.

> 💡 **Tip CENEVAL:** Si un reactivo muestra una clase Dios con muchos metodos que hacen cosas no relacionadas, la respuesta es SRP. Pista textual: la clase contiene la palabra Manager, Helper o Util sin contexto especifico.

### Concepto 1.2: Open/Closed Principle (OCP)

Las entidades deben estar abiertas para extension pero cerradas para modificacion. Es decir, debe ser posible agregar comportamiento nuevo sin modificar el codigo existente. La tecnica clasica para lograrlo es la abstraccion (interfaces, clases abstractas) y la composicion (inyectar variaciones de comportamiento).

```java
// MAL: cada vez que se agrega un descuento, se modifica esta clase
class CalculadoraDescuento {
    public double calcular(String tipo, double monto) {
        if (tipo.equals("BLACK_FRIDAY")) return monto * 0.7;
        if (tipo.equals("NAVIDAD")) return monto * 0.8;
        if (tipo.equals("ESTUDIANTE")) return monto * 0.9;
        return monto;
    }
}

// BIEN: agregar un descuento nuevo no toca la clase existente
interface Descuento { double aplicar(double monto); }
class BlackFriday implements Descuento { public double aplicar(double m) { return m * 0.7; } }
class Navidad implements Descuento { public double aplicar(double m) { return m * 0.8; } }
class CalculadoraDescuento {
    public double calcular(Descuento d, double monto) { return d.aplicar(monto); }
}
```

**Ejemplo:** un sistema de impuestos para Mexico debe agregar IEPS a tabaco y alcohol. Si la clase de calculo de impuestos respeta OCP, se agrega una nueva implementacion ImpuestoIEPS sin tocar las demas. Si no, hay que abrir el switch y arriesgar romper IVA.

### Concepto 1.3: Liskov Substitution Principle (LSP)

Los objetos de una clase derivada deben poder sustituir a los de la clase base sin alterar la correccion del programa. Si una funcion espera un Ave y le pasamos un Pinguino que no puede volar, y la funcion llama a volar(), el programa se rompe. Esto indica que la herencia esta mal modelada.

```java
// MAL: Pinguino no puede sustituir a Ave porque rompe la postcondicion
class Ave { public void volar() { /* vuela */ } }
class Pinguino extends Ave {
    @Override
    public void volar() { throw new UnsupportedOperationException(); }
}

// BIEN: modelar con interfaces segregadas
interface Ave { void comer(); }
interface AveVoladora extends Ave { void volar(); }
class Aguila implements AveVoladora { /* ... */ }
class Pinguino implements Ave { /* no implementa volar */ }
```

**Ejemplo:** un sistema de pagos tiene una clase MetodoPago y subclase Tarjeta. Despues agrega PagoEnEfectivo como subclase de Tarjeta y sobrescribe metodos para que tiren excepciones. Eso viola LSP; PagoEnEfectivo no es una Tarjeta.

> 💡 **Tip CENEVAL:** Si el reactivo muestra una subclase que lanza UnsupportedOperationException, devuelve null donde se esperaba un valor o cambia las precondiciones de los metodos heredados, la respuesta es LSP.

### Concepto 1.4: Interface Segregation Principle (ISP)

Los clientes no deben depender de interfaces que no usan. Mejor muchas interfaces pequenas y especificas que una interface gigante con metodos que algunos implementadores no necesitan. Una interface Trabajador con metodos trabajar(), comer() y dormir() obliga a un robot (que no come ni duerme) a implementar metodos vacios o lanzar excepciones.

```typescript
// MAL: interface gorda
interface Empleado {
  trabajar(): void;
  comer(): void;
  dormir(): void;
}
class Robot implements Empleado {
  trabajar() {}
  comer() { throw new Error('no come'); }
  dormir() { throw new Error('no duerme'); }
}

// BIEN: interfaces segregadas
interface Trabajador { trabajar(): void; }
interface SerVivo { comer(): void; dormir(): void; }
class Robot implements Trabajador { trabajar() {} }
class Humano implements Trabajador, SerVivo { /* ... */ }
```

### Concepto 1.5: Dependency Inversion Principle (DIP)

Los modulos de alto nivel no deben depender de modulos de bajo nivel; ambos deben depender de abstracciones. Las abstracciones no deben depender de detalles; los detalles deben depender de abstracciones. En la practica: la logica de negocio define interfaces y la infraestructura las implementa, no al reves. Esto es el motor de la arquitectura hexagonal.

```typescript
// MAL: la logica de negocio depende de un detalle concreto (MySQL)
class GeneradorReporte {
  private db = new MySQLClient();
  generar() { return this.db.query('...'); }
}

// BIEN: la logica depende de una abstraccion
interface FuenteDatos { obtener(): any; }
class GeneradorReporte {
  constructor(private fuente: FuenteDatos) {}
  generar() { return this.fuente.obtener(); }
}
class FuenteMySQL implements FuenteDatos { obtener() { /* ... */ } }
class FuenteMongo implements FuenteDatos { obtener() { /* ... */ } }
```

**Ejemplo:** un sistema de notificaciones que tiene la clase Notificador dependiendo directamente de SmtpEmailService. Para enviar tambien por SMS o WhatsApp hay que reescribir Notificador. Si Notificador depende de una interface CanalNotificacion, se agregan implementaciones sin tocar el codigo central.

> 💡 **Tip CENEVAL:** DIP suele evaluarse con escenarios donde se necesita cambiar la base de datos, el proveedor de email o el sistema de pago. La respuesta correcta es definir una interface y aplicar inyeccion de dependencias.

## Tema 2: Patrones GoF — Creacionales

### Concepto 2.1: Singleton

Garantiza que una clase tenga una sola instancia y provee un punto de acceso global a ella. Util para recursos costosos o que deben ser unicos: pool de conexiones, configuracion, logger. Tiene mala fama porque introduce estado global y dificulta los tests, por eso muchos frameworks modernos prefieren inyeccion de dependencias con scope singleton.

```java
public class Configuracion {
    private static Configuracion instancia;
    private Configuracion() {}
    public static synchronized Configuracion getInstance() {
        if (instancia == null) instancia = new Configuracion();
        return instancia;
    }
}
```

### Concepto 2.2: Factory Method

Define una interface para crear un objeto pero deja que las subclases decidan que clase concreta instanciar. Permite extender el tipo de objetos creados sin modificar el codigo cliente.

```typescript
abstract class CreadorDocumento {
  abstract crear(): Documento;
  procesar() {
    const doc = this.crear();
    doc.guardar();
  }
}
class CreadorPDF extends CreadorDocumento { crear() { return new DocumentoPDF(); } }
class CreadorWord extends CreadorDocumento { crear() { return new DocumentoWord(); } }
```

### Concepto 2.3: Abstract Factory

Provee una interface para crear familias de objetos relacionados sin especificar sus clases concretas. Util cuando un sistema debe ser independiente de como se crean sus productos o cuando se quiere imponer que varios productos sean usados juntos.

**Ejemplo:** un sistema multiplataforma tiene una FabricaUI con metodos crearBoton() y crearVentana(). FabricaUIWindows crea componentes nativos de Windows, FabricaUIMac crea componentes de Mac. El cliente solo conoce la FabricaUI abstracta.

### Concepto 2.4: Builder

Separa la construccion de un objeto complejo de su representacion, de modo que el mismo proceso pueda crear distintas representaciones. Util cuando un constructor tiene muchos parametros opcionales o cuando la construccion requiere multiples pasos.

```java
Pedido pedido = new Pedido.Builder()
    .conCliente("Juan")
    .agregarProducto("Laptop", 1)
    .agregarProducto("Mouse", 2)
    .conEnvio(EnvioExpress.class)
    .build();
```

### Concepto 2.5: Prototype

Crea objetos nuevos copiando un prototipo existente. Util cuando crear un objeto es costoso (carga de DB, calculos pesados) o cuando se quiere evitar acoplarse a la clase concreta.

> 💡 **Tip CENEVAL:** Si el reactivo menciona pool de conexiones, configuracion global o cache compartido, la respuesta es Singleton. Si menciona crear familias de productos relacionados (UI multiplataforma, drivers de base de datos), es Abstract Factory. Si menciona constructores con muchos parametros, es Builder.

## Tema 3: Patrones GoF — Estructurales

### Concepto 3.1: Adapter

Convierte la interface de una clase en otra que el cliente espera. Permite que clases con interfaces incompatibles colaboren. Es el patron clasico para integrar librerias de terceros sin que el resto del codigo dependa de su API.

```typescript
// Cliente espera una interface CalculadoraImpuestos
interface CalculadoraImpuestos { calcular(monto: number): number; }

// Pero la libreria externa tiene otra firma
class LibreriaSAT {
  computeTax(amount: number, country: string): number { return amount * 0.16; }
}

// Adapter
class AdapterSAT implements CalculadoraImpuestos {
  constructor(private lib: LibreriaSAT) {}
  calcular(monto: number) { return this.lib.computeTax(monto, 'MX'); }
}
```

### Concepto 3.2: Bridge

Desacopla una abstraccion de su implementacion para que ambas puedan variar independientemente. Util cuando se tienen jerarquias paralelas (forma x color, plataforma x tipo de UI). Evita la explosion combinatoria de clases.

### Concepto 3.3: Composite

Permite tratar objetos individuales y composiciones de objetos de manera uniforme. Modela jerarquias arbol donde tanto hojas como ramas implementan la misma interface. Clasico para sistemas de archivos, menus, expresiones aritmeticas.

```typescript
interface ItemMenu { precio(): number; }
class Plato implements ItemMenu { precio() { return 100; } }
class Combo implements ItemMenu {
  constructor(private items: ItemMenu[]) {}
  precio() { return this.items.reduce((s, i) => s + i.precio(), 0); }
}
```

### Concepto 3.4: Decorator

Anade responsabilidades a un objeto dinamicamente envolviendolo en otro objeto que comparte la misma interface. Es una alternativa flexible a la herencia para extender funcionalidad.

**Ejemplo:** un Stream de Java se puede envolver con BufferedReader (anade buffer), luego con DataInputStream (anade lectura tipada), y todo sigue siendo un InputStream. Cada decorator agrega capacidades sin modificar la clase base.

### Concepto 3.5: Facade

Provee una interface unificada y simple a un conjunto de interfaces complejas de un subsistema. Reduce el acoplamiento del cliente con la complejidad interna.

**Ejemplo:** una clase ProcesadorPedido expone un solo metodo procesar(pedido) que internamente coordina InventarioService, PagoService, EnvioService y NotificacionService. El cliente no necesita conocer la coreografia.

### Concepto 3.6: Flyweight

Comparte estado comun entre muchos objetos para reducir el uso de memoria. Util cuando se tienen miles de objetos casi identicos (caracteres en un editor de texto, particulas en un juego).

### Concepto 3.7: Proxy

Provee un sustituto para otro objeto y controla el acceso a el. Variantes: proxy remoto (comunicacion entre procesos), proxy virtual (carga perezosa), proxy de proteccion (control de permisos) y proxy de cache.

> 💡 **Tip CENEVAL:** Adapter para integrar APIs externas. Facade para simplificar subsistemas complejos. Decorator para anadir funcionalidad sin herencia. Proxy para control de acceso o lazy loading. Estos cuatro son los mas frecuentes en el examen.

## Tema 4: Patrones GoF — Comportamiento

### Concepto 4.1: Observer

Define una dependencia uno-a-muchos de modo que cuando un objeto cambia de estado, todos sus dependientes son notificados automaticamente. Es la base de los patrones publish-subscribe, listeners de eventos y reactivos (RxJS, ReactiveX).

```typescript
interface Observer { update(data: any): void; }
class Sujeto {
  private observers: Observer[] = [];
  suscribir(o: Observer) { this.observers.push(o); }
  notificar(data: any) { this.observers.forEach(o => o.update(data)); }
}
```

### Concepto 4.2: Strategy

Define una familia de algoritmos, los encapsula y los hace intercambiables. Permite que el algoritmo varie independientemente de los clientes que lo usan. Es la solucion canonica para evitar cadenas de if/else o switches grandes.

```typescript
interface EstrategiaPago { pagar(monto: number): void; }
class PagoTarjeta implements EstrategiaPago { pagar(m: number) { /* ... */ } }
class PagoPaypal implements EstrategiaPago { pagar(m: number) { /* ... */ } }
class Carrito {
  constructor(private estrategia: EstrategiaPago) {}
  procesar(monto: number) { this.estrategia.pagar(monto); }
}
```

### Concepto 4.3: Command

Encapsula una solicitud como un objeto, permitiendo parametrizar clientes con diferentes solicitudes, encolar o registrar solicitudes y soportar operaciones reversibles (undo/redo). Es la base de las arquitecturas de tareas, jobs y CQRS.

### Concepto 4.4: Iterator

Provee una forma de acceder secuencialmente a los elementos de una coleccion sin exponer su representacion interna. Casi todos los lenguajes modernos lo tienen integrado en el for-each.

### Concepto 4.5: State

Permite a un objeto alterar su comportamiento cuando su estado interno cambia. El objeto parece cambiar de clase. Util para maquinas de estado complejas: ordenes (pendiente, pagado, enviado, entregado), conexiones de red, flujos de trabajo.

### Concepto 4.6: Template Method

Define el esqueleto de un algoritmo en una clase base y deja que las subclases redefinan ciertos pasos. La clase base controla el flujo; las subclases personalizan los detalles.

```java
abstract class GeneradorReporte {
    public final void generar() {
        cargarDatos();
        procesar();
        formatear();
        exportar();
    }
    protected abstract void formatear();
    protected abstract void exportar();
    private void cargarDatos() { /* comun */ }
    private void procesar() { /* comun */ }
}
```

### Concepto 4.7: Chain of Responsibility

Pasa una solicitud a lo largo de una cadena de manejadores. Cada manejador decide si procesa la solicitud o la pasa al siguiente. Util para middleware (Express, ASP.NET), pipelines de validacion y sistemas de aprobacion jerarquica.

> 💡 **Tip CENEVAL:** Observer para sistemas de eventos y notificaciones. Strategy para reemplazar cadenas de if/else por algoritmos intercambiables. Command para deshacer/rehacer y job queues. State para flujos de trabajo complejos. Template Method para algoritmos con pasos comunes y variables.

## Tema 5: Diseno de datos

### Concepto 5.1: ACID vs BASE

ACID (Atomicity, Consistency, Isolation, Durability) son las garantias clasicas de las bases de datos relacionales. Aseguran que las transacciones sean confiables, incluso ante fallas. BASE (Basically Available, Soft state, Eventual consistency) es el modelo opuesto, comun en bases NoSQL distribuidas: se sacrifica consistencia inmediata por disponibilidad y escalabilidad. El teorema CAP dice que en un sistema distribuido se pueden garantizar como mucho dos de tres: consistencia, disponibilidad y tolerancia a particiones.

**Ejemplo:** un banco usa Postgres con ACID porque no puede tolerar que dos transferencias dejen una cuenta con saldo negativo. Una red social usa Cassandra con BASE porque puede tolerar que un like aparezca con 2 segundos de retraso en otros nodos.

### Concepto 5.2: Normalizacion

La normalizacion es el proceso de organizar las tablas para minimizar la redundancia y evitar anomalias de actualizacion.

**Primera Forma Normal (1FN):** todos los atributos son atomicos (no listas, no JSON anidado) y cada fila es unica. Una tabla con columna telefonos que guarda comas separadas viola 1FN.

**Segunda Forma Normal (2FN):** esta en 1FN y todos los atributos no clave dependen completamente de toda la clave primaria. Aplica solo a claves compuestas. Si una columna depende solo de parte de la clave, hay que separarla.

**Tercera Forma Normal (3FN):** esta en 2FN y no hay dependencias transitivas. Si A determina B y B determina C, entonces C no debe estar en la tabla de A. Ejemplo: una tabla de empleados con columnas departamento_id y departamento_nombre tiene dependencia transitiva; el nombre del departamento debe vivir en la tabla departamentos.

**Forma Normal de Boyce-Codd (BCNF):** version mas estricta de 3FN. Toda dependencia funcional X -> Y debe ser tal que X es superclave.

```sql
-- Mal: viola 1FN (telefonos no atomicos)
CREATE TABLE clientes (id INT, nombre TEXT, telefonos TEXT); -- '555-1, 555-2'

-- Bien: tabla separada
CREATE TABLE clientes (id INT PRIMARY KEY, nombre TEXT);
CREATE TABLE telefonos (id INT, cliente_id INT, numero TEXT);
```

### Concepto 5.3: Indices

Los indices aceleran las consultas a costa de espacio en disco y velocidad de escritura.

**B-Tree:** estructura balanceada que soporta busquedas por igualdad y por rango. Es el indice por defecto en casi todos los DBMS. Util para columnas que aparecen en WHERE, ORDER BY y joins.

**Hash:** soporta solo busquedas por igualdad, pero con O(1) promedio. No sirve para rangos ni ordenamientos. Util para tablas de lookup muy grandes.

**Indices compuestos:** sobre varias columnas. El orden importa: un indice (apellido, nombre) sirve para busquedas por apellido o por (apellido, nombre), pero no para busquedas solo por nombre.

```sql
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_fecha_estado ON pedidos(fecha, estado);
```

### Concepto 5.4: Particionamiento

Cuando las tablas crecen a cientos de millones de filas, el particionamiento las divide en piezas mas pequenas manejadas como una sola.

**Particionamiento horizontal (sharding):** las filas se distribuyen en multiples nodos segun una clave (por rango, por hash, por geografia).

**Particionamiento vertical:** las columnas se separan en tablas distintas, agrupadas por patron de acceso (calientes vs frias).

**Ejemplo:** una tabla movimientos_bancarios con 5 anos de historia y 10 mil millones de filas se particiona por mes. Consultar el ultimo mes toca una particion de 200 millones de filas, no las 10 mil millones.

> 💡 **Tip CENEVAL:** Para reactivos sobre normalizacion, recordar el orden: 1FN (atomicos), 2FN (dependencia total de la clave), 3FN (sin transitivas). Para reactivos de indices, B-Tree es la respuesta por defecto a menos que se mencione busqueda exacta a gran escala (entonces Hash). Para reactivos de tablas enormes, la respuesta es particionamiento o sharding.

## Resumen de la subarea

Los principios SOLID son el codigo de etica del diseno orientado a objetos: si una clase los respeta, sera facil de cambiar, testear y reutilizar. Los patrones GoF son soluciones probadas a problemas recurrentes: aprende a reconocer su forma en codigo real, no solo a recitarlos. El diseno de datos exige conocer normalizacion (para evitar redundancia), indices (para acelerar consultas) y los trade-offs entre ACID y BASE en sistemas distribuidos. El EGEL evalua estos temas con codigo concreto y escenarios situacionales: practica leyendo fragmentos y detectando que principio se viola o que patron aplica.

## Errores comunes en el EGEL

1. **Confundir SRP con tener una sola funcion publica.** SRP es sobre una sola razon para cambiar, no sobre numero de metodos.
2. **Pensar que LSP solo aplica a herencia explicita.** Tambien aplica a interfaces y a contratos implicitos de comportamiento.
3. **Implementar Singleton con campos publicos estaticos.** El patron correcto requiere constructor privado y metodo getInstance().
4. **Usar herencia donde corresponde composicion (Decorator, Strategy).** Si el comportamiento debe cambiar en tiempo de ejecucion, es composicion.
5. **Confundir Adapter con Facade.** Adapter cambia una interface a otra; Facade simplifica un subsistema.
6. **Olvidar que un indice no usado es solo costo.** Cada indice ralentiza INSERT, UPDATE y DELETE.
7. **Asumir que normalizacion siempre es mejor.** Para sistemas de reportes y OLAP, la desnormalizacion controlada es preferible.
8. **Confundir 2FN con 3FN.** 2FN aplica solo cuando hay clave compuesta; 3FN aplica a cualquier clave y elimina dependencias transitivas.
9. **Creer que BASE es siempre peor que ACID.** En sistemas distribuidos de gran escala (redes sociales, IoT, analytics) BASE es a menudo la unica opcion viable.
10. **Aplicar patrones GoF por moda, no por necesidad.** Un sistema simple no necesita Strategy, Factory y Observer; introducirlos sin razon es overengineering, otro mal olor.
