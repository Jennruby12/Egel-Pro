# Entornos de desarrollo

Un entorno de desarrollo no es solo el editor de codigo: incluye control de versiones, pruebas automatizadas, integracion y despliegue continuos, observabilidad y cultura DevOps. Dominar estas herramientas distingue a un programador junior de uno senior. El EGEL ISOFT evalua tu capacidad para identificar herramientas, flujos de trabajo (Git flows), estrategias de testing (TDD, BDD), y patrones de CI/CD. Esta guia cubre IDEs, control de versiones, testing, CI/CD y DevOps con observabilidad.

## Tema 1: IDEs y editores

Un IDE (Integrated Development Environment) combina editor, compilador, debugger y herramientas en un solo programa. Un editor de codigo es mas ligero pero extensible con plugins.

### Concepto 1.1: IDEs principales

**IntelliJ IDEA** (JetBrains) es el IDE de referencia para Java y JVM (Kotlin, Scala, Groovy). Variantes: PyCharm (Python), WebStorm (JavaScript/TypeScript), GoLand (Go), RubyMine (Ruby), CLion (C/C++), Rider (.NET), DataGrip (SQL), Android Studio (basado en IntelliJ, para Android). Ofrece refactorizaciones inteligentes, deteccion de codigo duplicado, debugger avanzado, integracion con build tools (Maven, Gradle). **Visual Studio** (Microsoft) es el IDE estandar de .NET en Windows. **Xcode** (Apple) es el IDE oficial para desarrollo iOS, macOS, watchOS y tvOS. **Eclipse** es un IDE open-source historicamente popular en Java enterprise. **NetBeans** es otra alternativa Java.

**Ejemplo EGEL:** preguntan cual IDE es estandar para desarrollo iOS; la respuesta es Xcode.

### Concepto 1.2: Editores ligeros

**Visual Studio Code** (VS Code, Microsoft) es el editor mas popular hoy. Open source, multiplataforma, con miles de extensiones (Prettier, ESLint, GitLens, Docker, Remote Containers, GitHub Copilot). Soporta debugging integrado, terminal embebida, Git integrado. **Sublime Text** es un editor de pago muy rapido. **Atom** (descontinuado por GitHub en 2022) fue popular en su momento. **Vim** y **Emacs** son editores con decadas de historia, completamente personalizables, con curva de aprendizaje pronunciada pero adoradosen entornos servidor y por desarrolladores avanzados. **Neovim** es la version moderna de Vim con soporte para LSP y plugins en Lua.

**Ejemplo EGEL:** preguntan cual editor es open source, multiplataforma y ha desplazado a editores tradicionales como Sublime; la respuesta esperada es VS Code.

### Concepto 1.3: Plugins y productividad

Los plugins amplifican el editor. Categorias clave:

- **Linters**: ESLint, Pylint, RuboCop. Detectan errores y problemas de estilo.
- **Formatters**: Prettier, Black, gofmt. Formatean codigo automaticamente.
- **Language Servers (LSP)**: Language Server Protocol estandariza features como autocompletado, go-to-definition, find-references. Permiten que el mismo soporte de lenguaje funcione en cualquier editor compatible.
- **AI assistants**: GitHub Copilot, Cursor, Codeium. Sugieren codigo basado en contexto.
- **Debuggers**: Debug Adapter Protocol (DAP) similar a LSP pero para debugging.

> Tip CENEVAL: LSP fue creado por Microsoft para VS Code pero hoy es estandar abierto. Permite que Vim, Emacs, Sublime y otros tengan features de IDE.

### Concepto 1.4: Eleccion de herramienta

| Necesidad | Herramienta recomendada |
|---|---|
| Backend Java/Kotlin | IntelliJ IDEA |
| .NET en Windows | Visual Studio |
| iOS / Swift | Xcode |
| Web fullstack | VS Code |
| Android | Android Studio |
| Servidor remoto sin GUI | Vim, Neovim, Emacs |
| Edicion rapida ad-hoc | Sublime Text, VS Code |

## Tema 2: Control de versiones con Git

Git, creado por Linus Torvalds en 2005, es el sistema de control de versiones distribuido (DVCS) dominante.

### Concepto 2.1: Conceptos basicos

**Repositorio** (repo): directorio rastreado por Git. **Commit**: snapshot inmutable del estado del repo con autor, fecha, mensaje y hash SHA-1. **Branch** (rama): puntero movil a un commit. **HEAD**: puntero al commit actualmente checkout. **Working directory**: archivos en tu disco. **Staging area** (index): area intermedia donde preparas cambios antes del commit. **Remote**: copia del repo en otro servidor (GitHub, GitLab, Bitbucket).

Flujo basico:

```bash
git init                    # crea repo
git status                  # estado actual
git add archivo.txt         # mueve a staging
git commit -m "mensaje"     # crea commit
git push origin main        # sube al remoto
git pull origin main        # baja cambios del remoto
git clone url               # clona repo remoto
```

**Ejemplo EGEL:** preguntan que comando crea un nuevo commit; la respuesta es `git commit`, no `git add` (que solo prepara).

### Concepto 2.2: Branches y operaciones

Crear y cambiar rama:

```bash
git branch feature/login        # crea rama
git checkout feature/login      # cambia
# o en una sola linea:
git checkout -b feature/login
git switch feature/login        # comando moderno equivalente
```

**Ejemplo EGEL:** muestran un escenario donde dos desarrolladores trabajan en features distintos y preguntan que estrategia evita conflictos; la respuesta es trabajar en ramas separadas y mergear al final.

### Concepto 2.3: Merge vs rebase

**Merge** combina ramas creando un nuevo commit de merge que tiene dos padres. Preserva el historial real de las ramas.

```bash
git checkout main
git merge feature/login
```

**Rebase** reescribe el historial moviendo los commits de la rama feature a partir de la punta de main. Produce un historial lineal mas limpio pero altera los hashes de los commits.

```bash
git checkout feature/login
git rebase main
```

**Ejemplo EGEL:** preguntan que comando produce un historial lineal sin commits de merge; la respuesta es `git rebase`. Preguntan que comando preserva la historia exacta; la respuesta es `git merge`.

> Tip CENEVAL: regla de oro: **nunca rebases ramas publicas/compartidas**. El rebase reescribe historia y rompe los repos de otros desarrolladores que ya pulsaron esos commits.

### Concepto 2.4: GitFlow vs trunk-based

**GitFlow** (Vincent Driessen, 2010) define ramas con roles:
- `main` (o `master`): version en produccion.
- `develop`: integracion de features pendientes de release.
- `feature/*`: cada feature en su rama, parten de develop.
- `release/*`: estabilizacion antes de release.
- `hotfix/*`: arreglos urgentes en main.

Ventajas: estructura clara, soporta multiples versiones. Desventajas: complejo, lento para entregar.

**Trunk-based development** mantiene una sola rama larga (`main`) y ramas feature de muy corta duracion (horas o dias) que se integran rapidamente. Requiere feature flags para esconder features incompletas. Es el estilo que practican Google, Facebook y la mayoria de empresas con CI/CD moderno.

**Ejemplo EGEL:** preguntan cual flujo favorece despliegues frecuentes a produccion (CI/CD); la respuesta es trunk-based development.

| Aspecto | GitFlow | Trunk-based |
|---|---|---|
| Ramas largas | develop, release | Solo main |
| Vida de feature branch | Dias a semanas | Horas a 1-2 dias |
| Releases | Programadas | Continuas |
| Complejidad | Alta | Baja |
| CI/CD friendly | Menos | Mucho |

## Tema 3: Testing

El testing automatizado garantiza que el codigo funciona y permite refactorizar sin miedo.

### Concepto 3.1: Niveles de testing

- **Unit tests**: prueban una unidad pequena (funcion, metodo, clase) en aislamiento. Rapidos (milisegundos), abundantes. Frameworks: JUnit (Java), pytest (Python), Jest/Vitest (JS), xUnit (C#).
- **Integration tests**: prueban como interactuan varios componentes (codigo + DB, codigo + API externa). Mas lentos. Frameworks: Spring Test, Supertest.
- **End-to-end (E2E) tests**: simulan al usuario real en el sistema completo (UI + backend + DB). Los mas lentos y fragiles, pero los mas confiables sobre el comportamiento del sistema. Frameworks: Selenium, Cypress, Playwright, TestCafe.

**Ejemplo EGEL:** muestran la **piramide de pruebas** (muchos unit, pocos integration, muy pocos e2e) y preguntan que principio ilustra; la respuesta es que debe haber mas pruebas en niveles bajos por velocidad y costo de mantenimiento.

### Concepto 3.2: TDD (Test-Driven Development)

**TDD** invierte el orden: escribes el test ANTES del codigo. Ciclo **red-green-refactor**:
1. **Red**: escribe un test que falla (la feature no existe).
2. **Green**: escribe el codigo minimo para que pase.
3. **Refactor**: limpia el codigo sin romper el test.

**Ejemplo EGEL:** preguntan en que orden se hacen las cosas en TDD; la respuesta es test primero, codigo despues. No al reves.

```javascript
// 1. RED: test fallido
test('suma dos numeros', () => {
    expect(sumar(2, 3)).toBe(5); // sumar no existe aun
});

// 2. GREEN: implementacion minima
function sumar(a, b) { return a + b; }

// 3. REFACTOR: si hace falta limpieza
```

### Concepto 3.3: BDD (Behavior-Driven Development)

**BDD** extiende TDD orientandose al comportamiento del usuario, no a la implementacion tecnica. Usa lenguaje natural en formato **Given-When-Then**: dado un contexto, cuando ocurre un evento, entonces espero un resultado. Frameworks: Cucumber (Gherkin), SpecFlow, Behave.

```gherkin
Feature: Login de usuario
  Scenario: Login exitoso
    Given un usuario registrado con email "ana@test.com"
    When envia sus credenciales correctas
    Then recibe un token de sesion
    And es redirigido al dashboard
```

**Ejemplo EGEL:** preguntan que sintaxis usa Cucumber para escribir escenarios; la respuesta es Gherkin con la estructura Given-When-Then.

### Concepto 3.4: Patron AAA y mocking

El patron **AAA (Arrange-Act-Assert)** estructura cada test:
- **Arrange**: prepara datos, mocks, dependencias.
- **Act**: ejecuta la accion a probar.
- **Assert**: verifica el resultado.

```javascript
test('depositar suma al saldo', () => {
    // Arrange
    const cuenta = new Cuenta(100);
    // Act
    cuenta.depositar(50);
    // Assert
    expect(cuenta.saldo).toBe(150);
});
```

**Mocking** consiste en reemplazar dependencias reales (base de datos, APIs externas) por objetos falsos que controlas. Tipos: **mock** (verifica que se llamo con ciertos parametros), **stub** (devuelve valores predefinidos), **spy** (registra llamadas sin alterar comportamiento), **fake** (implementacion simplificada, como una BD en memoria). Frameworks: Mockito (Java), Moq (.NET), unittest.mock (Python), jest.mock (JS).

**Ejemplo EGEL:** preguntan que objeto usar para verificar que se llamo a un metodo con ciertos argumentos; la respuesta es mock.

> Tip CENEVAL: la diferencia clave entre stub y mock es que el stub solo devuelve datos; el mock ademas verifica interacciones.

## Tema 4: CI/CD

**Continuous Integration (CI)** automatiza la integracion frecuente de cambios al repositorio principal con build y tests automaticos. **Continuous Delivery (CD)** automatiza el despliegue a staging tras pasar los tests. **Continuous Deployment** lleva CD a produccion automaticamente sin intervencion humana.

### Concepto 4.1: Pipelines

Un **pipeline** define los pasos automatizados que se ejecutan ante un evento (push, pull request, tag). Tipicamente se divide en **stages**:
1. **Build**: compilar, instalar dependencias.
2. **Test**: ejecutar unit, integration y opcionalmente e2e tests.
3. **Quality**: linters, scanners de seguridad (SonarQube, Snyk), cobertura.
4. **Package**: construir artefacto (jar, imagen Docker).
5. **Deploy**: subir a staging, despues a produccion.

**Ejemplo EGEL:** preguntan que stage tipicamente sigue al build; la respuesta es test.

### Concepto 4.2: GitHub Actions

GitHub Actions es la plataforma de CI/CD de GitHub. Pipelines se definen en archivos YAML dentro de `.github/workflows/`.

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

**Ejemplo EGEL:** preguntan donde se almacenan los workflows de GitHub Actions; la respuesta es `.github/workflows/`.

### Concepto 4.3: GitLab CI y Jenkins

**GitLab CI** define pipelines en `.gitlab-ci.yml`. Concepto de runners (agentes que ejecutan jobs). Pipelines con stages secuenciales y jobs paralelos.

```yaml
stages:
  - build
  - test
  - deploy

unit-tests:
  stage: test
  script:
    - npm test
```

**Jenkins** es el servidor CI/CD open source mas veterano. Pipelines en Groovy (`Jenkinsfile`). Plugins para casi cualquier integracion. Auto-hosted (versus SaaS como GitHub Actions/GitLab CI).

```groovy
pipeline {
    agent any
    stages {
        stage('Build') { steps { sh 'mvn package' } }
        stage('Test')  { steps { sh 'mvn test' } }
        stage('Deploy'){ steps { sh './deploy.sh' } }
    }
}
```

### Concepto 4.4: Estrategias de despliegue

- **Blue-green**: dos entornos identicos (blue y green), uno produccion uno espera. Cambias el router de blue a green tras desplegar. Rollback instantaneo.
- **Canary**: despliegas a un porcentaje pequeno de usuarios (5%), monitoreas, escalas si todo va bien.
- **Rolling**: actualizas instancia por instancia, sin downtime.
- **Feature flags**: el codigo se despliega siempre, pero la feature se enciende/apaga por configuracion sin redeploy.

**Ejemplo EGEL:** preguntan que estrategia permite rollback instantaneo cambiando solo el router de trafico; la respuesta es blue-green.

> Tip CENEVAL: feature flags habilitan trunk-based development porque permiten mergear codigo incompleto sin afectar usuarios.

## Tema 5: DevOps y observabilidad

DevOps es la cultura y conjunto de practicas que une desarrollo (Dev) y operaciones (Ops). La observabilidad permite entender el estado del sistema en produccion.

### Concepto 5.1: Pilares de observabilidad

Los tres pilares de observabilidad: **logs, metricas y traces**.

- **Logs**: registros textuales de eventos. "Usuario X hizo login a las 10:23". Formatos: texto plano, JSON estructurado. Herramientas: ELK Stack (Elasticsearch + Logstash + Kibana), Loki + Grafana, Splunk.
- **Metricas**: numeros agregados en el tiempo. "Latencia p95 de /api/users: 230ms". Series temporales. Herramientas: Prometheus + Grafana, Datadog, CloudWatch.
- **Traces**: seguimiento de una request a traves de multiples servicios (distributed tracing). "La request X paso por gateway, auth, users y db, tomando 450ms total". Herramientas: Jaeger, Zipkin, OpenTelemetry.

**Ejemplo EGEL:** preguntan que pilar usarias para entender la latencia agregada de un endpoint a lo largo del tiempo; la respuesta es metricas.

### Concepto 5.2: Prometheus y Grafana

**Prometheus** es un sistema de monitoreo basado en pull: scrapea metricas de endpoints `/metrics` que exponen las aplicaciones en formato texto especifico. Usa PromQL para consultas. **Grafana** es la herramienta de visualizacion: dashboards con graficas, alertas. Pareja dominante en cloud-native.

```promql
rate(http_requests_total{status="500"}[5m])
```

**Ejemplo EGEL:** preguntan que herramienta es estandar de facto para metricas en Kubernetes; la respuesta es Prometheus.

### Concepto 5.3: ELK / EFK

**Elastic Stack (ELK)**: Elasticsearch (motor de busqueda y almacenamiento), Logstash (procesamiento e ingestion de logs), Kibana (visualizacion). Variante **EFK** reemplaza Logstash por Fluentd (mas ligero). Usado para centralizar logs de muchos servicios.

### Concepto 5.4: OpenTelemetry y SLO/SLI

**OpenTelemetry (OTel)** es el estandar CNCF para instrumentacion (logs, metricas, traces). Reemplaza a OpenTracing y OpenCensus. Permite cambiar el backend (Jaeger, Datadog, etc.) sin recodificar.

**SLI (Service Level Indicator)**: metrica concreta. Ejemplo: latencia p95 de respuestas exitosas.
**SLO (Service Level Objective)**: objetivo sobre el SLI. Ejemplo: latencia p95 menor a 200ms el 99.9% del tiempo.
**SLA (Service Level Agreement)**: contrato con el cliente. Ejemplo: si incumplimos el SLO te damos un descuento.

**Ejemplo EGEL:** preguntan que es un SLO; la respuesta es objetivo medible interno de calidad del servicio.

> Tip CENEVAL: error budget = 1 - SLO. Si tu SLO es 99.9%, tienes 0.1% de error budget (43 minutos al mes de downtime permitido).

## Resumen

Un entorno de desarrollo moderno integra IDE/editor (IntelliJ, VS Code, Xcode), control de versiones (Git con merge o rebase, flujos GitFlow vs trunk-based), pruebas automatizadas en niveles (unit, integration, e2e con TDD red-green-refactor y BDD Given-When-Then), CI/CD con pipelines en stages (GitHub Actions, GitLab CI, Jenkins) y estrategias de despliegue (blue-green, canary, rolling, feature flags), y cultura DevOps con observabilidad sobre logs (ELK), metricas (Prometheus + Grafana) y traces (Jaeger, OpenTelemetry). Dominar estas herramientas no es opcional: es el diferencial entre escribir codigo y entregar software.

## Errores comunes EGEL

- Confundir merge y rebase. Merge preserva historia; rebase la reescribe.
- Rebasear una rama publica compartida. Rompe los repos de otros.
- Pensar que TDD significa "escribir tests despues". El test va PRIMERO.
- Confundir CI con CD. CI integra y prueba; CD despliega.
- Olvidar que GitFlow es mas pesado y trunk-based es preferido para CI/CD frecuente.
- Pensar que Jenkins esta obsoleto. Sigue siendo dominante en grandes empresas.
- Confundir mock con stub. Stub devuelve datos; mock verifica interacciones.
- Decir que pruebas e2e deben ser muchas. La piramide pide pocas e2e, muchas unit.
- Confundir SLI, SLO y SLA. SLI es la metrica, SLO el objetivo interno, SLA el contrato externo.
- Pensar que logs y metricas son lo mismo. Logs son eventos discretos; metricas son numeros agregados.
- Olvidar que Prometheus usa pull, no push, para recoger metricas.
