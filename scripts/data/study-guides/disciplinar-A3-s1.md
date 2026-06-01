# Lenguajes de desarrollo de software

Los lenguajes de programacion son la herramienta fundamental del ingeniero de software. Conocer sus categorias, fortalezas y debilidades permite elegir la herramienta correcta para cada problema. Esta guia cubre la clasificacion formal de lenguajes, los principales lenguajes empresariales, los lenguajes dinamicos modernos, los lenguajes de sistemas y los lenguajes para desarrollo movil. El EGEL ISOFT evalua tu capacidad para identificar caracteristicas, paradigmas y casos de uso de cada lenguaje, asi como diferenciar conceptos como tipado, compilacion y nivel de abstraccion.

## Tema 1: Clasificacion de lenguajes de programacion

Existen multiples criterios para clasificar lenguajes. Dominar estas categorias es esencial porque CENEVAL formula preguntas que mezclan dos o tres clasificaciones simultaneamente.

### Concepto 1.1: Tipado estatico vs dinamico

El **tipado estatico** verifica los tipos de datos en tiempo de compilacion. El compilador rechaza el programa si detecta una incompatibilidad de tipos antes de ejecutarlo. Ejemplos: Java, C#, C++, TypeScript, Rust, Go. El **tipado dinamico** verifica los tipos en tiempo de ejecucion. Una variable puede contener cualquier tipo y este puede cambiar durante la ejecucion. Ejemplos: Python, JavaScript, Ruby, PHP. **Ejemplo EGEL:** una pregunta tipica muestra codigo Python donde una variable cambia de entero a cadena y pregunta si esto seria valido en Java; la respuesta es no, porque Java verifica tipos estaticamente.

```java
// Java - tipado estatico
int edad = 25;
edad = "veinticinco"; // ERROR de compilacion
```

```python
# Python - tipado dinamico
edad = 25
edad = "veinticinco"  # Valido en tiempo de ejecucion
```

> Tip CENEVAL: tipado estatico no es lo mismo que tipado fuerte. Son ejes ortogonales que pueden combinarse.

### Concepto 1.2: Tipado fuerte vs debil

El **tipado fuerte** prohibe conversiones implicitas entre tipos incompatibles. Si quieres sumar un entero con una cadena debes convertir explicitamente. Ejemplos: Python, Java, Rust. El **tipado debil** permite conversiones implicitas que pueden llevar a resultados inesperados. JavaScript es el ejemplo paradigmatico: `"5" + 3` produce `"53"` (concatenacion) mientras que `"5" - 3` produce `2` (resta numerica). **Ejemplo EGEL:** la expresion `"10" == 10` en JavaScript devuelve `true` por coercion debil, pero en Python lanza error o devuelve `False` segun la version porque el tipado es fuerte.

> Tip CENEVAL: Python es tipado dinamico pero fuerte. JavaScript es tipado dinamico y debil. C es tipado estatico pero debil (permite casts implicitos peligrosos).

### Concepto 1.3: Compilado vs interpretado

Un lenguaje **compilado** traduce el codigo fuente a codigo maquina o bytecode antes de ejecutarse. El ejecutable resultante corre directamente en el procesador o en una maquina virtual. Ejemplos: C, C++, Rust, Go. Un lenguaje **interpretado** ejecuta el codigo fuente linea por linea mediante un interprete. Ejemplos clasicos: BASIC, los primeros LISP. Los lenguajes modernos suelen ser **hibridos**: Java compila a bytecode que ejecuta la JVM; Python compila internamente a bytecode `.pyc` que ejecuta la maquina virtual de Python; JavaScript usa compilacion JIT (Just-In-Time) en motores como V8. **Ejemplo EGEL:** preguntan si Java es compilado o interpretado; la respuesta correcta es "ambos": se compila a bytecode y este se interpreta o compila JIT en la JVM.

### Concepto 1.4: Bajo vs alto nivel

Los lenguajes de **bajo nivel** ofrecen control directo sobre el hardware: registros, memoria, instrucciones del procesador. Ejemplos: ensamblador, C (semi-bajo). Los lenguajes de **alto nivel** abstraen el hardware ofreciendo estructuras como objetos, listas, diccionarios y gestion automatica de memoria. Ejemplos: Python, Java, JavaScript. La frontera no es absoluta: Rust ofrece control de memoria como C pero con abstracciones de alto nivel. **Ejemplo EGEL:** preguntan que lenguaje permite acceder a registros del procesador; la respuesta es ensamblador o C con `inline asm`, no Java ni Python.

> Tip CENEVAL: memoriza la regla: cuanto mas bajo el nivel, mas control y mas riesgo de errores; cuanto mas alto, mas productividad y menos control fino.

## Tema 2: Lenguajes empresariales

Los entornos corporativos demandan lenguajes robustos, con tipado estatico, ecosistemas maduros y rendimiento estable. Java, C# y Kotlin dominan este segmento.

### Concepto 2.1: Java y la JVM

Java fue creado en 1995 por Sun Microsystems (hoy Oracle). Su lema "write once, run anywhere" se materializa en la **Java Virtual Machine (JVM)**: el codigo fuente `.java` se compila a bytecode `.class` que cualquier JVM puede ejecutar sin recompilar. La JVM incluye un compilador JIT (HotSpot) que optimiza el bytecode mas usado a codigo nativo. Java es tipado estatico fuerte, orientado a objetos, con recoleccion automatica de basura (Garbage Collector). **Ejemplo EGEL:** muestran un fragmento Java con `public static void main(String[] args)` y preguntan cual es el punto de entrada; la respuesta es siempre `main` con esa firma exacta.

```java
public class Hola {
    public static void main(String[] args) {
        System.out.println("Hola EGEL");
    }
}
```

Caracteristicas clave: herencia simple (extends), implementacion multiple de interfaces (implements), excepciones checked y unchecked, generics con type erasure, modulos desde Java 9. Frameworks dominantes: Spring (backend), Hibernate (ORM), Maven y Gradle (build).

### Concepto 2.2: C# y .NET CLR

C# fue creado por Microsoft en 2000 como respuesta a Java. Corre sobre el **Common Language Runtime (CLR)**, equivalente a la JVM. Comparte con Java sintaxis curly-brace, tipado estatico fuerte, OOP y garbage collection, pero agrega caracteristicas mas modernas: `properties` con get/set, LINQ (consultas integradas), `async/await` nativo, `var` para inferencia de tipos, struct con value semantics. Desde .NET Core (hoy .NET 5+) es multiplataforma y open source. **Ejemplo EGEL:** preguntan cual lenguaje introdujo LINQ nativamente; la respuesta es C#, no Java.

```csharp
var numeros = new List<int> { 1, 2, 3, 4, 5 };
var pares = numeros.Where(n => n % 2 == 0).ToList();
```

### Concepto 2.3: Kotlin

Kotlin fue creado por JetBrains en 2011 y adoptado oficialmente por Google como lenguaje preferido para Android en 2017. Es 100% interoperable con Java: puede llamar codigo Java y viceversa, y compila a bytecode JVM. Sus ventajas sobre Java: null safety en el sistema de tipos (`String?` vs `String`), data classes que generan equals/hashCode/toString automaticamente, extension functions, coroutines para concurrencia, sintaxis mas concisa. **Ejemplo EGEL:** muestran codigo Kotlin con `val nombre: String? = null` y preguntan que diferencia tiene con `val nombre: String`; la respuesta es que el primero permite null y el segundo no, gracias al sistema de nullable types.

```kotlin
data class Usuario(val nombre: String, val edad: Int)
val u = Usuario("Ana", 25)
println(u) // Usuario(nombre=Ana, edad=25)
```

### Concepto 2.4: Comparativa empresarial

| Caracteristica | Java | C# | Kotlin |
|---|---|---|---|
| Runtime | JVM | CLR (.NET) | JVM |
| Null safety | No (Optional manual) | Limitado | Si, en tipos |
| Verbosidad | Alta | Media | Baja |
| Plataforma principal | Backend, Android (legacy) | Backend Windows, multiplataforma | Android, multiplataforma |
| Sintaxis async | CompletableFuture | async/await | coroutines |

> Tip CENEVAL: si la pregunta menciona "Android moderno" la respuesta esperada es Kotlin; si menciona "Windows backend" es C#; si menciona "Banca o gobierno" suele ser Java.

## Tema 3: Lenguajes dinamicos

Los lenguajes dinamicos priorizan productividad, flexibilidad y rapidez de desarrollo sobre rendimiento bruto. Son dominantes en scripting, automatizacion, ciencia de datos, web y prototipado.

### Concepto 3.1: Python

Python fue creado por Guido van Rossum en 1991. Su filosofia se resume en el Zen de Python: "explicito mejor que implicito, simple mejor que complejo". Tipado dinamico fuerte, sintaxis basada en indentacion (no llaves), multi-paradigma (OOP, funcional, imperativo). Uso dominante: ciencia de datos (NumPy, pandas, scikit-learn), machine learning (PyTorch, TensorFlow), automatizacion, scripting, web (Django, Flask, FastAPI), educacion. **Ejemplo EGEL:** preguntan cual lenguaje es estandar en ML; la respuesta es Python por su ecosistema cientifico.

```python
def fibonacci(n: int) -> list[int]:
    a, b = 0, 1
    resultado = []
    for _ in range(n):
        resultado.append(a)
        a, b = b, a + b
    return resultado
```

### Concepto 3.2: JavaScript y TypeScript

JavaScript nacio en 1995 (Brendan Eich, 10 dias) como lenguaje del navegador. Hoy domina frontend (React, Vue, Angular), backend (Node.js), mobile (React Native), desktop (Electron) y embebido. Es tipado dinamico debil, multi-paradigma, basado en prototipos (no clases clasicas, aunque ES6 anadio syntactic sugar). **TypeScript** es un superconjunto creado por Microsoft en 2012 que anade tipado estatico opcional; compila a JavaScript. **Ejemplo EGEL:** preguntan que ventaja aporta TypeScript sobre JavaScript; la respuesta es deteccion de errores de tipo en tiempo de compilacion, mejor autocompletado en IDE y refactoring seguro.

```typescript
interface Usuario {
    id: number;
    nombre: string;
    email?: string; // opcional
}

function saludar(u: Usuario): string {
    return `Hola ${u.nombre}`;
}
```

> Tip CENEVAL: TypeScript no se ejecuta directamente; siempre se transpila a JavaScript antes de correr en el navegador o Node.

### Concepto 3.3: Ruby

Ruby fue creado por Yukihiro Matsumoto en 1995 con la mision de "hacer feliz al programador". Tipado dinamico fuerte, OOP puro (todo es objeto, incluso los numeros), bloques y mixins. Su killer app es **Ruby on Rails** (2004), framework web que popularizo el patron MVC y la convencion sobre configuracion. **Ejemplo EGEL:** muestran sintaxis `5.times { puts "Hola" }` y preguntan que paradigma demuestra; la respuesta es que todo es objeto, incluso el literal numerico 5 tiene metodos.

### Concepto 3.4: Casos de uso

| Tarea | Lenguaje preferido |
|---|---|
| Machine learning | Python |
| Scripting de sistema | Python, Bash |
| Web frontend | JavaScript/TypeScript |
| API REST rapida | Node.js, Python (FastAPI), Ruby on Rails |
| Prototipado | Python, Ruby |
| Automatizacion DevOps | Python, Bash |

## Tema 4: Lenguajes de sistemas y modernos

Los lenguajes de sistemas se usan para construir sistemas operativos, drivers, bases de datos, compiladores y aplicaciones donde el rendimiento es critico.

### Concepto 4.1: C

C fue creado por Dennis Ritchie en 1972 en los laboratorios Bell. Es la base de Unix, Linux, Windows kernel y casi todo lenguaje moderno. Tipado estatico debil, compilado a codigo maquina, sin gestion automatica de memoria (malloc/free manuales), sin OOP nativo. Su minimalismo es a la vez fortaleza y debilidad: permite control total pero exige disciplina extrema con punteros y memoria. **Ejemplo EGEL:** preguntan que problema introduce el siguiente codigo:

```c
char *p = malloc(10);
strcpy(p, "muy largo texto"); // overflow
free(p);
free(p); // double free
```

La respuesta abarca buffer overflow y double free, ambos errores tipicos de C que lenguajes modernos previenen.

### Concepto 4.2: C++

C++ fue creado por Bjarne Stroustrup en 1985 como extension OOP de C. Anade clases, herencia, polimorfismo, templates (generics), excepciones, RAII (Resource Acquisition Is Initialization), smart pointers (`unique_ptr`, `shared_ptr`). Es tipado estatico, multiparadigma. Uso dominante: motores de videojuegos (Unreal Engine), navegadores (Chromium), sistemas embebidos, trading de alta frecuencia. **Ejemplo EGEL:** preguntan que es RAII; la respuesta es un patron donde la adquisicion de recursos ocurre en el constructor y la liberacion en el destructor, garantizando limpieza automatica al salir del scope.

### Concepto 4.3: Rust

Rust nacio en Mozilla (2010) y alcanzo version 1.0 en 2015. Resuelve el problema clasico de C/C++: seguridad de memoria sin sacrificar rendimiento. Su innovacion es el **borrow checker**: un sistema de tipos que en tiempo de compilacion garantiza que no hay punteros colgantes, race conditions ni double free. Conceptos clave: ownership (cada valor tiene un dueno unico), borrowing (referencias mutables o inmutables), lifetimes (anotaciones de duracion). **Ejemplo EGEL:** preguntan que ventaja tiene Rust sobre C; la respuesta es seguridad de memoria garantizada en compilacion sin garbage collector, lo que permite usar Rust en kernels y sistemas embebidos.

```rust
fn main() {
    let s1 = String::from("hola");
    let s2 = s1; // ownership transferido
    // println!("{}", s1); // ERROR: s1 ya no es valido
    println!("{}", s2);
}
```

### Concepto 4.4: Go

Go (Golang) fue creado por Google (Robert Griesemer, Rob Pike, Ken Thompson) en 2009. Diseno minimalista, compilado, tipado estatico, con garbage collector. Su sello distintivo es la concurrencia: **goroutines** (hilos ligeros, miles posibles) y **channels** (comunicacion entre goroutines siguiendo el modelo CSP). Sintaxis simple, compilacion rapidisima, binarios estaticos sin dependencias. Uso dominante: backend de microservicios, DevOps (Docker, Kubernetes, Terraform estan escritos en Go). **Ejemplo EGEL:** preguntan que mecanismo usa Go para concurrencia; la respuesta es goroutines y channels.

```go
go func() {
    fmt.Println("Ejecutando en otra goroutine")
}()
```

> Tip CENEVAL: cuidado con confundir paralelismo y concurrencia. Goroutines ofrecen concurrencia (multitarea logica), no necesariamente paralelismo (ejecucion simultanea en multiples cores).

## Tema 5: Lenguajes para mobile

El desarrollo movil tiene tres caminos principales: nativo iOS, nativo Android y cross-platform.

### Concepto 5.1: Swift (iOS nativo)

Swift fue presentado por Apple en 2014 como reemplazo de Objective-C. Tipado estatico fuerte, multiparadigma (OOP, funcional, protocolo orientado), null safety con `Optional`, gestion de memoria con ARC (Automatic Reference Counting, no garbage collector). Compila con LLVM a codigo nativo. **Ejemplo EGEL:** preguntan que mecanismo de gestion de memoria usa Swift; la respuesta es ARC, no garbage collection.

```swift
let nombre: String? = nil
if let n = nombre {
    print("Hola \(n)")
} else {
    print("Sin nombre")
}
```

### Concepto 5.2: Kotlin (Android nativo)

Ya cubierto en Tema 2. Recuerda que Google lo declaro lenguaje preferido para Android en 2017. Sustituye a Java en proyectos nuevos por su sintaxis concisa y null safety. Compila a bytecode JVM compatible con la ART (Android Runtime).

### Concepto 5.3: Dart y Flutter (cross-platform)

Dart fue creado por Google en 2011. Inicialmente pensado para reemplazar JavaScript en el navegador, encontro su nicho con Flutter (2017), framework UI multiplataforma que compila a codigo nativo para iOS, Android, web y desktop desde una sola base de codigo. Caracteristicas Dart: tipado estatico fuerte con inferencia (`var`), null safety (desde Dart 2.12), hot reload para desarrollo rapido, sintaxis tipo Java/JavaScript. **Ejemplo EGEL:** preguntan que diferencia hay entre React Native y Flutter; la respuesta clave es que React Native renderiza con componentes nativos del SO mientras que Flutter pinta su propia UI con su engine Skia, garantizando consistencia visual entre plataformas.

```dart
class Persona {
  final String nombre;
  final int edad;
  Persona(this.nombre, this.edad);
}
```

### Concepto 5.4: Comparativa mobile

| Enfoque | Lenguaje | Pros | Contras |
|---|---|---|---|
| iOS nativo | Swift | Mejor performance, acceso total a APIs | Solo iOS |
| Android nativo | Kotlin | Mejor performance, acceso total a APIs | Solo Android |
| Cross-platform | Dart/Flutter | Una base codigo, UI consistente | Tamano binario mayor |
| Cross-platform | JavaScript/React Native | Reutiliza skills web | Performance menor en UI compleja |
| Cross-platform | C#/.NET MAUI | Integracion .NET | Ecosistema mas pequeno |

> Tip CENEVAL: cuando preguntan "que lenguaje permite escribir una vez y desplegar en iOS y Android con UI consistente", la respuesta esperada suele ser Dart/Flutter, no React Native.

## Resumen

Esta guia te dio el mapa completo de los lenguajes que el EGEL ISOFT evalua. Los criterios de clasificacion (estatico/dinamico, fuerte/debil, compilado/interpretado, bajo/alto nivel) son ejes independientes que se combinan. Java, C# y Kotlin dominan el segmento empresarial gracias a sus runtimes maduros (JVM, CLR). Python, JavaScript/TypeScript y Ruby reinan en scripting, web y ciencia de datos por su flexibilidad. C, C++, Rust y Go cubren sistemas y backend de alto rendimiento, con Rust ofreciendo seguridad de memoria sin GC y Go destacando en concurrencia con goroutines. En mobile, Swift es estandar iOS, Kotlin es estandar Android, y Dart/Flutter lidera cross-platform con renderizado propio.

## Errores comunes EGEL

- Confundir tipado estatico con tipado fuerte. Son ejes ortogonales: Python es dinamico y fuerte; C es estatico y debil.
- Pensar que Java es solo interpretado o solo compilado. Es ambos: compila a bytecode, ejecuta en JVM con JIT.
- Asumir que TypeScript se ejecuta directamente en el navegador. Siempre se transpila a JavaScript antes.
- Decir que Rust usa garbage collector. No lo usa; garantiza memoria segura con el borrow checker en compilacion.
- Confundir goroutines con threads del sistema operativo. Son hilos ligeros gestionados por el runtime de Go.
- Pensar que Swift usa garbage collector. Usa ARC (Automatic Reference Counting).
- Creer que Kotlin reemplaza completamente a Java. Compila a bytecode JVM y es 100% interoperable con Java.
- Confundir Flutter con React Native. Flutter pinta UI con Skia; React Native usa componentes nativos del SO.
- Asumir que C++ es lo mismo que C con clases. C++ tiene templates, RAII, excepciones y mucho mas.
- Olvidar que JavaScript es tipado debil: `"5" + 3 = "53"` pero `"5" - 3 = 2`.
