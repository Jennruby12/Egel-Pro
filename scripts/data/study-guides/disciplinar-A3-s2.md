# Paradigmas de programacion

Un paradigma de programacion es una forma de pensar y estructurar el codigo. No es solo sintaxis: es una filosofia sobre como modelar problemas y organizar soluciones. Los lenguajes modernos suelen ser multiparadigma (Python, JavaScript, Scala soportan OOP y funcional), pero entender cada paradigma puro te permite usar el lenguaje correcto para cada problema. Esta guia cubre los cinco paradigmas principales: imperativo vs declarativo (la division mas amplia), orientado a objetos (dominante en empresa), funcional (en auge), reactivo (clave en UI y streams) y logico/orientado a aspectos (nichos especializados). El EGEL ISOFT evalua que identifiques caracteristicas, ventajas y casos de uso de cada paradigma.

## Tema 1: Programacion imperativa vs declarativa

La distincion fundamental entre paradigmas es como expresas la solucion: paso a paso o describiendo el resultado deseado.

### Concepto 1.1: Paradigma imperativo

El paradigma **imperativo** describe COMO resolver el problema mediante una secuencia de instrucciones que cambian el estado del programa. Variables se asignan, bucles iteran, condiciones se evaluan. Es el modelo mas cercano a como funciona el procesador. Ejemplos de lenguajes principalmente imperativos: C, Pascal, ensamblador. Subparadigmas imperativos: procedural (funciones y procedimientos como en C) y orientado a objetos (estado encapsulado en objetos, como Java). **Ejemplo EGEL:** muestran codigo C con un bucle for que suma elementos de un arreglo y preguntan que paradigma representa; la respuesta es imperativo procedural.

```c
int suma = 0;
for (int i = 0; i < n; i++) {
    suma += arr[i];
}
```

### Concepto 1.2: Paradigma declarativo

El paradigma **declarativo** describe QUE resultado quieres sin especificar el algoritmo paso a paso. El motor del lenguaje se encarga de COMO lograrlo. Ejemplos clasicos: SQL (describes que datos quieres, el motor optimiza el plan de ejecucion), HTML (describes la estructura, el navegador la renderiza), Prolog (describes hechos y reglas, el motor infiere respuestas), expresiones matematicas en lenguajes funcionales. **Ejemplo EGEL:** muestran una consulta `SELECT nombre FROM usuarios WHERE edad > 18` y preguntan que paradigma es; la respuesta es declarativo, no imperativo, porque no especificas como recorrer la tabla.

```sql
SELECT nombre, SUM(monto) AS total
FROM ventas
WHERE fecha >= '2025-01-01'
GROUP BY nombre
HAVING SUM(monto) > 10000;
```

### Concepto 1.3: Comparativa imperativo vs declarativo

| Aspecto | Imperativo | Declarativo |
|---|---|---|
| Foco | Como (algoritmo) | Que (resultado) |
| Estado | Mutable, cambia con el tiempo | Inmutable preferentemente |
| Lectura | Linea por linea | Como una descripcion |
| Ejemplos | C, Java, Python (procedural) | SQL, HTML, Prolog, Haskell |
| Control | Explicito (loops, ifs) | Implicito (delegado al motor) |

> Tip CENEVAL: el paradigma funcional es un tipo de paradigma declarativo. La programacion logica tambien. SQL es el ejemplo declarativo mas reconocido.

### Concepto 1.4: Imperativo vs declarativo en la practica

JavaScript y Python permiten ambos estilos. Comparemos sumar los pares de una lista:

```javascript
// Imperativo
let sumaPares = 0;
for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 === 0) sumaPares += nums[i];
}

// Declarativo (funcional)
const sumaPares = nums.filter(n => n % 2 === 0).reduce((a, b) => a + b, 0);
```

**Ejemplo EGEL:** preguntan cual estilo es mas mantenible y testeable; la respuesta esperada es declarativo por su composicionalidad y ausencia de efectos secundarios.

## Tema 2: Programacion orientada a objetos (OOP)

OOP modela el mundo como objetos que tienen estado (atributos) y comportamiento (metodos). Cuatro pilares la sustentan.

### Concepto 2.1: Encapsulamiento

**Encapsulamiento** significa ocultar el estado interno de un objeto y exponer solo una interfaz controlada para interactuar con el. Se logra con modificadores de acceso: `private` (solo dentro de la clase), `protected` (clase y subclases), `public` (cualquiera), `package` (solo paquete en Java). Los getters y setters median el acceso. **Ejemplo EGEL:** preguntan que principio se viola al declarar todos los atributos como public; la respuesta es encapsulamiento.

```java
public class CuentaBancaria {
    private double saldo; // encapsulado

    public double getSaldo() { return saldo; }
    public void depositar(double monto) {
        if (monto > 0) saldo += monto; // validacion en setter
    }
}
```

### Concepto 2.2: Herencia

**Herencia** permite que una clase (subclase o clase hija) reutilice atributos y metodos de otra (superclase o clase padre) y los extienda o sobreescriba. En Java se usa `extends`; en C++ se especifica con `:`. La herencia simple permite una sola clase padre directa (Java, C#, Kotlin); la herencia multiple permite varias (C++, Python). **Ejemplo EGEL:** muestran `class Perro extends Animal` y preguntan que relacion existe; la respuesta es "es-un" (un Perro es un Animal), no "tiene-un" (composicion).

```java
class Animal {
    void respirar() { System.out.println("Respira"); }
}
class Perro extends Animal {
    void ladrar() { System.out.println("Ladra"); }
}
Perro p = new Perro();
p.respirar(); // heredado
p.ladrar();
```

> Tip CENEVAL: favorece composicion sobre herencia es un principio reconocido del Gang of Four. La herencia profunda crea acoplamiento fragil.

### Concepto 2.3: Polimorfismo

**Polimorfismo** significa "muchas formas". Un mismo metodo puede comportarse diferente segun el tipo concreto del objeto. Dos formas principales: **sobrecarga** (overloading: mismo nombre, distintos parametros, resuelto en compilacion) y **sobreescritura** (overriding: subclase reimplementa metodo del padre, resuelto en runtime via dispatch dinamico). **Ejemplo EGEL:** muestran:

```java
Animal a = new Perro();
a.hacerSonido(); // imprime "Ladra"
```

Y preguntan que tipo de polimorfismo demuestra; la respuesta es polimorfismo de subtipo (sobreescritura), resuelto dinamicamente segun el tipo real del objeto, no el tipo declarado.

### Concepto 2.4: Abstraccion

**Abstraccion** consiste en exponer solo lo esencial y ocultar la complejidad. Se materializa con clases abstractas (que no se pueden instanciar y pueden tener metodos sin implementar) e interfaces (contratos puros que las clases implementan). **Ejemplo EGEL:** preguntan la diferencia entre clase abstracta e interface; la respuesta clave es que una clase abstracta puede tener estado (atributos) e implementacion parcial, mientras que una interface (antes de Java 8) solo define metodos. Java 8+ permite metodos `default` en interfaces, difuminando la frontera.

```java
abstract class Forma {
    abstract double area();
    void describir() { System.out.println("Area: " + area()); }
}
interface Dibujable {
    void dibujar();
}
class Circulo extends Forma implements Dibujable {
    double radio;
    double area() { return Math.PI * radio * radio; }
    public void dibujar() { /* ... */ }
}
```

> Tip CENEVAL: en Java una clase puede extender solo una clase abstracta pero implementar multiples interfaces.

## Tema 3: Programacion funcional

La programacion funcional trata las computaciones como evaluaciones de funciones matematicas, evitando estado mutable y efectos secundarios.

### Concepto 3.1: Funciones puras

Una **funcion pura** cumple dos condiciones: (1) dado el mismo input, siempre produce el mismo output (determinismo); (2) no tiene efectos secundarios (no modifica variables externas, no escribe a disco, no imprime). Las funciones puras son testeables, paralelizables y razonables matematicamente. **Ejemplo EGEL:** preguntan cual de las siguientes es pura:

```javascript
function sumar(a, b) { return a + b; }      // PURA
function log(msg) { console.log(msg); }     // IMPURA (efecto)
function incrementar() { return ++contador; } // IMPURA (estado externo)
```

La respuesta es la primera.

### Concepto 3.2: Inmutabilidad

**Inmutabilidad** significa que una vez creado un valor, no puede modificarse. Para "cambiar" creas un nuevo valor. Java tiene `final`, JavaScript usa `const`, Scala diferencia `val` (inmutable) de `var` (mutable). Estructuras de datos inmutables persistentes (Immutable.js, estructuras de Clojure) permiten cambios eficientes compartiendo memoria con la version anterior. **Ejemplo EGEL:** muestran:

```javascript
const arr = [1, 2, 3];
const nuevoArr = [...arr, 4]; // crea nuevo array
```

Y preguntan que tecnica ilustra; la respuesta es inmutabilidad: no se modifica `arr`, se crea un array nuevo.

### Concepto 3.3: Funciones de orden superior (HOF)

Una **funcion de orden superior** es aquella que recibe una funcion como argumento o devuelve una funcion. Ejemplos clasicos: `map`, `filter`, `reduce`. **Ejemplo EGEL:** muestran:

```javascript
const dobles = [1, 2, 3].map(x => x * 2); // [2, 4, 6]
const suma = [1, 2, 3].reduce((acc, n) => acc + n, 0); // 6
```

Y preguntan que tipo de funcion es `map`; la respuesta es funcion de orden superior porque recibe una funcion como argumento.

### Concepto 3.4: Currying y composicion

**Currying** transforma una funcion de N argumentos en N funciones de un argumento cada una. **Composicion** combina funciones pequenas en funciones mas grandes.

```javascript
// Currying
const sumar = a => b => a + b;
const sumar5 = sumar(5);
sumar5(3); // 8

// Composicion
const compose = (f, g) => x => f(g(x));
const incrementarYDoblar = compose(x => x * 2, x => x + 1);
incrementarYDoblar(3); // (3+1)*2 = 8
```

> Tip CENEVAL: currying y aplicacion parcial son conceptos relacionados pero distintos. Currying convierte `f(a,b,c)` en `f(a)(b)(c)`. Aplicacion parcial fija algunos argumentos devolviendo una funcion con menos parametros.

### Concepto 3.5: Lenguajes funcionales

Lenguajes puramente funcionales: Haskell (no permite efectos sin monadas), Elm. Lenguajes funcionales pero pragmaticos: Clojure, F#, Erlang, Elixir. Lenguajes multiparadigma con fuerte soporte funcional: Scala, Kotlin, JavaScript/TypeScript, Python.

## Tema 4: Programacion reactiva

La programacion reactiva modela el flujo de datos como secuencias asincronas (streams) a las que te suscribes y reaccionas.

### Concepto 4.1: Streams y Observables

Un **stream** es una secuencia de eventos en el tiempo: clicks de usuario, respuestas HTTP, datos de sensores, mensajes de WebSocket. Un **Observable** es la abstraccion para representarlo. Te suscribes con `subscribe(onNext, onError, onComplete)`. **Ejemplo EGEL:** preguntan que diferencia hay entre Promise y Observable; la respuesta es que una Promise emite un solo valor (o error) una sola vez, mientras que un Observable puede emitir cero, uno o muchos valores a lo largo del tiempo y permite cancelar la suscripcion.

```typescript
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

const input = document.getElementById('busqueda');
fromEvent(input, 'input')
    .pipe(
        debounceTime(300),
        map((e: any) => e.target.value)
    )
    .subscribe(query => console.log(query));
```

### Concepto 4.2: RxJS y operadores

**RxJS** es la implementacion de Reactive Extensions para JavaScript. Ofrece operadores que transforman streams: `map`, `filter`, `merge`, `combineLatest`, `switchMap`, `debounceTime`, `throttleTime`, `retry`. **Ejemplo EGEL:** preguntan que operador debes usar para evitar disparar busquedas con cada tecla y solo despues de una pausa; la respuesta es `debounceTime`.

### Concepto 4.3: Backpressure

**Backpressure** es la situacion donde un productor de eventos genera datos mas rapido que el consumidor puede procesarlos. Sin manejo, el sistema acumula buffers ilimitados o pierde eventos. Soluciones: buffer con limite, drop (descartar nuevos), latest (solo el ultimo), sample (muestreo periodico), pause/resume del productor. **Ejemplo EGEL:** preguntan que estrategia conviene cuando un sensor envia 1000 eventos/segundo y la UI solo puede mostrar 60 fps; la respuesta es sampling o throttling.

### Concepto 4.4: Programacion reactiva en frameworks

- **Angular** usa RxJS extensivamente: HttpClient devuelve Observable, formularios reactivos, router events.
- **React** tiene hooks como `useEffect` que reaccionan a cambios, y librerias como RxJS, MobX o Recoil.
- **Vue** con su sistema de reactividad basado en Proxies (Vue 3) implementa reactividad nativa.
- **Spring WebFlux** trae programacion reactiva al backend Java con Project Reactor (Mono y Flux).

> Tip CENEVAL: el patron Observer del Gang of Four es el ancestro directo de la programacion reactiva moderna.

## Tema 5: Programacion logica y orientada a aspectos

Paradigmas menos comunes pero importantes en nichos especificos.

### Concepto 5.1: Programacion logica

La **programacion logica** se basa en declarar hechos y reglas, y dejar que el motor del lenguaje infiera respuestas. **Prolog** es el lenguaje paradigmatico. Programa con clausulas: hechos (`padre(juan, ana).`) y reglas (`abuelo(X, Z) :- padre(X, Y), padre(Y, Z).`). Consultas: `?- abuelo(juan, X).` devuelve los abuelos. **Ejemplo EGEL:** preguntan en que dominio destaca Prolog; la respuesta tipica es sistemas expertos, procesamiento de lenguaje natural simbolico, y solucion de problemas de restricciones.

```prolog
padre(juan, ana).
padre(ana, luis).
abuelo(X, Z) :- padre(X, Y), padre(Y, Z).
?- abuelo(juan, X). % X = luis
```

### Concepto 5.2: Cuando usar logica

Casos: motores de reglas de negocio (drools), validacion de configuraciones, planificacion, demostradores de teoremas, prototipado de IA simbolica. Limitacion: rendimiento y dificultad de escalar para problemas grandes.

### Concepto 5.3: Programacion orientada a aspectos (AOP)

La **AOP** modulariza preocupaciones transversales (cross-cutting concerns) que de otra forma se dispersarian por toda la base de codigo: logging, autenticacion, transacciones, caching, metricas. En lugar de escribir el codigo de logging en cada metodo, defines un **aspecto** que se aplica automaticamente a los metodos que coincidan con un **pointcut**. **Ejemplo EGEL:** preguntan que paradigma usa **Spring AOP** para envolver metodos de servicio con transacciones declarativas (anotacion `@Transactional`); la respuesta es programacion orientada a aspectos.

```java
@Aspect
@Component
public class LoggingAspect {
    @Around("execution(* com.app.service.*.*(..))")
    public Object log(ProceedingJoinPoint pjp) throws Throwable {
        long inicio = System.currentTimeMillis();
        Object resultado = pjp.proceed();
        System.out.println(pjp.getSignature() + " tomo " + (System.currentTimeMillis() - inicio) + "ms");
        return resultado;
    }
}
```

### Concepto 5.4: Conceptos AOP

- **Join point**: punto de ejecucion (un metodo, una asignacion).
- **Pointcut**: expresion que selecciona joinpoints.
- **Advice**: codigo que se ejecuta en el joinpoint (before, after, around).
- **Aspect**: modulo que agrupa pointcut + advice.
- **Weaving**: proceso de combinar el aspecto con el codigo objetivo, puede ser en compilacion, carga de clases o runtime.

> Tip CENEVAL: AOP no reemplaza OOP; la complementa. Spring y muchos frameworks empresariales lo usan internamente sin que el desarrollador escriba aspectos.

## Resumen

Los paradigmas de programacion son lentes para mirar problemas. El imperativo describe el COMO; el declarativo describe el QUE. OOP modela objetos con cuatro pilares (encapsulamiento, herencia, polimorfismo, abstraccion) y sigue siendo dominante en entornos empresariales. La programacion funcional, basada en funciones puras, inmutabilidad y composicion, ha ganado terreno en JavaScript, Scala, Kotlin y backend reactivo. La programacion reactiva modela eventos como streams asincronos usando Observables y operadores como los de RxJS. La programacion logica (Prolog) brilla en sistemas expertos. La AOP modulariza preocupaciones transversales como logging y transacciones. Los lenguajes modernos son multiparadigma: tu trabajo es elegir el paradigma correcto para cada parte del sistema.

## Errores comunes EGEL

- Confundir herencia con composicion. Herencia es "es-un"; composicion es "tiene-un".
- Pensar que toda la programacion funcional es pura. JavaScript permite estilo funcional pero no es puro como Haskell.
- Olvidar que sobrecarga (overloading) y sobreescritura (overriding) son polimorfismos distintos. Sobrecarga es estatica; sobreescritura es dinamica.
- Asumir que SQL es imperativo. Es el ejemplo canonico de paradigma declarativo.
- Creer que una funcion con efectos secundarios sigue siendo pura. Si imprime, escribe a disco, o modifica estado externo, no es pura.
- Confundir Promise con Observable. Promise emite un solo valor; Observable emite multiples a lo largo del tiempo.
- Decir que herencia multiple existe en Java. No: Java permite extender solo una clase, pero implementar multiples interfaces.
- Pensar que AOP reemplaza OOP. La complementa para preocupaciones transversales.
- Confundir Prolog con un lenguaje OOP. Prolog es logico, basado en hechos y reglas.
- Olvidar que la inmutabilidad no significa que no puedas tener nuevos valores: significa que no modificas los existentes.
