# Gestion de datos

Toda aplicacion no trivial necesita persistir datos. Las decisiones sobre que base de datos usar, como modelarla, como garantizar consistencia y como escalar son criticas. Esta guia cubre bases relacionales (modelo ER, JOINs, claves), transacciones ACID y niveles de aislamiento, NoSQL (cuatro tipos y cuando usar cada uno), performance (indices, sharding, replicacion) y ORMs con migrations. El EGEL ISOFT evalua tanto teoria (normalizacion, propiedades ACID) como practica (escribir consultas SQL, identificar el problema N+1).

## Tema 1: Bases relacionales

Las bases relacionales (RDBMS) organizan datos en tablas con filas y columnas relacionadas por claves. SQL es el lenguaje estandar. Ejemplos: PostgreSQL, MySQL, MariaDB, SQL Server, Oracle, SQLite.

### Concepto 1.1: Modelo entidad-relacion (ER)

El **modelo ER** representa datos como entidades (objetos del mundo real), atributos (caracteristicas) y relaciones entre entidades. Notacion: rectangulos para entidades, ovalos para atributos, rombos para relaciones. Cardinalidad: 1:1, 1:N, N:M. **Ejemplo EGEL:** modelar una escuela donde un Estudiante puede inscribirse en muchas Materias y una Materia tiene muchos Estudiantes; la respuesta es relacion N:M que requiere una tabla intermedia (Inscripcion) con claves foraneas a Estudiante y Materia.

```
Estudiante (id, nombre, email)
Materia (id, titulo, creditos)
Inscripcion (estudiante_id FK, materia_id FK, calificacion)
```

### Concepto 1.2: Claves primarias y foraneas

**Clave primaria (PK)**: identificador unico de cada fila. No puede ser NULL ni repetirse. Tipica: id autoincremental (`SERIAL`, `IDENTITY`, `AUTO_INCREMENT`) o UUID. **Clave foranea (FK)**: campo que referencia la PK de otra tabla, estableciendo una relacion. Garantiza integridad referencial: no puedes insertar una FK que apunte a un ID inexistente. **Ejemplo EGEL:** preguntan que sucede al intentar borrar un registro de la tabla padre cuando una FK lo referencia; la respuesta depende del ON DELETE: `RESTRICT` (default) impide borrar; `CASCADE` borra las filas hijas; `SET NULL` pone null en las hijas.

```sql
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Concepto 1.3: JOIN y sus tipos

**JOIN** combina filas de dos o mas tablas relacionadas. Cinco tipos principales:

- **INNER JOIN**: solo filas que tienen coincidencia en ambas tablas.
- **LEFT JOIN (LEFT OUTER)**: todas las filas de la izquierda, con NULL en columnas derechas sin match.
- **RIGHT JOIN (RIGHT OUTER)**: todas las filas de la derecha, con NULL en columnas izquierdas sin match.
- **FULL OUTER JOIN**: todas las filas de ambas, con NULL donde no hay match.
- **CROSS JOIN**: producto cartesiano (cada fila de A con cada fila de B).

```sql
-- Clientes y sus pedidos (incluye clientes sin pedidos)
SELECT c.nombre, p.total
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id;

-- Solo clientes con al menos un pedido
SELECT c.nombre, p.total
FROM clientes c
INNER JOIN pedidos p ON p.cliente_id = c.id;
```

**Ejemplo EGEL:** preguntan que tipo de JOIN obtener todos los clientes incluso los que no tienen pedidos; la respuesta es LEFT JOIN (asumiendo clientes a la izquierda).

> Tip CENEVAL: si la pregunta dice "todos los X, incluyendo los que no tienen Y", la respuesta casi siempre es OUTER JOIN (LEFT o RIGHT segun el lado).

### Concepto 1.4: Subqueries y CTE

**Subquery (subconsulta)**: consulta dentro de otra. Puede aparecer en SELECT, FROM o WHERE.

```sql
-- Clientes que han gastado mas del promedio
SELECT nombre FROM clientes
WHERE id IN (
    SELECT cliente_id FROM pedidos
    GROUP BY cliente_id
    HAVING SUM(total) > (SELECT AVG(total) FROM pedidos)
);
```

**CTE (Common Table Expression)** con `WITH`: define resultados intermedios reutilizables, mejora legibilidad sobre subqueries anidadas.

```sql
WITH ventas_por_cliente AS (
    SELECT cliente_id, SUM(total) AS total
    FROM pedidos
    GROUP BY cliente_id
)
SELECT c.nombre, v.total
FROM clientes c
JOIN ventas_por_cliente v ON v.cliente_id = c.id
WHERE v.total > 5000;
```

**Ejemplo EGEL:** muestran una consulta con subquery profunda y preguntan como refactorizarla; la respuesta es usar CTE para legibilidad.

### Concepto 1.5: Normalizacion

La **normalizacion** elimina redundancia y anomalias dividiendo tablas. Formas normales principales:

- **1FN**: valores atomicos (no listas en una columna), filas unicas.
- **2FN**: 1FN + sin dependencias parciales (cada columna no clave depende de TODA la PK compuesta).
- **3FN**: 2FN + sin dependencias transitivas (columnas no clave dependen solo de la PK, no de otras no clave).
- **BCNF**: forma mas estricta de 3FN.

**Ejemplo EGEL:** muestran una tabla con `pedido_id, cliente_id, cliente_nombre, cliente_email` y preguntan que forma normal viola; la respuesta es 3FN: nombre y email dependen de cliente_id, no de pedido_id. Solucion: mover a tabla clientes.

## Tema 2: Transacciones ACID

Una **transaccion** es una secuencia de operaciones que se ejecutan como una unidad atomica.

### Concepto 2.1: Las cuatro propiedades ACID

- **Atomicidad**: todas las operaciones de la transaccion se completan, o ninguna lo hace. Si una falla, se revierte todo (rollback).
- **Consistencia**: la transaccion lleva la BD de un estado valido a otro estado valido respetando todas las restricciones (PK, FK, CHECK, UNIQUE).
- **Aislamiento**: transacciones concurrentes no se interfieren; cada una opera como si fuera la unica.
- **Durabilidad**: una vez confirmada (commit), la transaccion sobrevive a fallos del sistema (writes persisten en disco/log).

**Ejemplo EGEL:** una transferencia bancaria debe debitar de una cuenta y acreditar en otra. Si el debito tiene exito pero el credito falla, que propiedad ACID garantiza que ambas operaciones se reviertan; la respuesta es atomicidad.

```sql
BEGIN;
UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;
UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;
-- Si todo sale bien:
COMMIT;
-- Si algo falla:
ROLLBACK;
```

### Concepto 2.2: Niveles de aislamiento

El estandar SQL define cuatro niveles. De menor a mayor aislamiento (y menor a mayor costo de concurrencia):

| Nivel | Dirty read | Non-repeatable read | Phantom read |
|---|---|---|---|
| READ UNCOMMITTED | Posible | Posible | Posible |
| READ COMMITTED | No | Posible | Posible |
| REPEATABLE READ | No | No | Posible |
| SERIALIZABLE | No | No | No |

- **Dirty read**: una transaccion lee datos modificados por otra que aun no ha hecho commit.
- **Non-repeatable read**: misma consulta devuelve valores distintos dentro de la misma transaccion.
- **Phantom read**: misma consulta devuelve un numero distinto de filas (otras transacciones insertaron o eliminaron).

**Ejemplo EGEL:** preguntan que nivel evita dirty reads pero permite non-repeatable reads; la respuesta es READ COMMITTED (default en PostgreSQL y SQL Server).

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN;
-- operaciones
COMMIT;
```

### Concepto 2.3: Locking

Los DBMS implementan aislamiento con bloqueos (locks). **Lock optimista**: asume que no habra conflicto, valida al commit (usando versionado: `WHERE version = X`). **Lock pesimista**: bloquea recursos al leer/modificar (`SELECT ... FOR UPDATE`). **Deadlock**: dos transacciones se bloquean mutuamente esperando recursos del otro; el DBMS detecta y aborta una.

**Ejemplo EGEL:** preguntan que es un deadlock y como se resuelve; la respuesta es bloqueo circular que el DBMS rompe abortando una transaccion (rollback).

### Concepto 2.4: ACID vs BASE

NoSQL adopto el modelo **BASE** como alternativa a ACID:
- **Basically Available**: el sistema responde siempre.
- **Soft state**: el estado puede cambiar sin input por replicacion eventual.
- **Eventually consistent**: las replicas eventualmente convergen, pero no inmediatamente.

**Ejemplo EGEL:** preguntan que paradigma de consistencia adopta MongoDB por defecto; la respuesta es consistencia eventual (BASE), aunque puede configurarse para ser mas fuerte.

> Tip CENEVAL: teorema CAP dice que en un sistema distribuido solo puedes garantizar 2 de 3: Consistency, Availability, Partition tolerance. Como la P es inevitable, eliges entre CP (consistente) o AP (disponible).

## Tema 3: Bases NoSQL

NoSQL ("Not Only SQL") agrupa BDs no relacionales que escalan horizontalmente y manejan modelos flexibles.

### Concepto 3.1: Bases de documentos

Almacenan documentos (tipicamente JSON o BSON) en colecciones. Schema flexible: cada documento puede tener campos distintos. **MongoDB** es el ejemplo dominante. Otras: CouchDB, DynamoDB (en modo documento), Firestore.

```javascript
// MongoDB
db.usuarios.insertOne({
    _id: ObjectId("..."),
    nombre: "Ana",
    email: "ana@test.com",
    direcciones: [
        { ciudad: "CDMX", cp: "01000" },
        { ciudad: "Monterrey", cp: "64000" }
    ]
});
db.usuarios.find({ "direcciones.ciudad": "CDMX" });
```

**Cuando usar**: contenido semiestructurado, schemas que cambian frecuente, necesidad de embeber datos relacionados juntos (un documento = una entidad completa). **Ejemplo EGEL:** preguntan que BD usar para un blog con posts que tienen autor, tags variables y comentarios anidados; la respuesta es BD de documentos como MongoDB.

### Concepto 3.2: Bases clave-valor

Almacenan pares (clave, valor). Acceso O(1) por clave. **Redis** es el dominante (in-memory, ultra-rapido). Otras: Memcached, DynamoDB (modo KV), Riak.

```bash
SET usuario:123 '{"nombre":"Ana","email":"ana@test.com"}'
GET usuario:123
EXPIRE usuario:123 3600  # TTL de 1 hora
```

**Cuando usar**: cache, sesiones, contadores, leaderboards, rate limiting, colas pub/sub. **Ejemplo EGEL:** preguntan que BD es ideal para cache de respuestas HTTP; la respuesta es Redis (clave-valor en memoria).

### Concepto 3.3: Bases columnares

Almacenan datos por columna en lugar de por fila. Optimizadas para escrituras masivas y consultas analiticas en columnas especificas. **Cassandra** es el ejemplo principal. Otras: HBase, ScyllaDB, ClickHouse, BigQuery.

```sql
-- Cassandra CQL
CREATE TABLE sensores (
    sensor_id UUID,
    timestamp TIMESTAMP,
    temperatura FLOAT,
    PRIMARY KEY (sensor_id, timestamp)
) WITH CLUSTERING ORDER BY (timestamp DESC);
```

**Cuando usar**: series temporales, IoT, logs masivos, analitica. **Ejemplo EGEL:** preguntan que BD usar para almacenar millones de lecturas de sensores por segundo; la respuesta es Cassandra o similar columnar.

### Concepto 3.4: Bases de grafos

Modelan datos como nodos y aristas (relaciones). Optimizadas para consultas que recorren relaciones. **Neo4j** es el dominante. Otras: ArangoDB, Amazon Neptune.

```cypher
// Cypher en Neo4j
CREATE (ana:Persona {nombre:"Ana"})-[:AMIGO]->(luis:Persona {nombre:"Luis"})
MATCH (a:Persona {nombre:"Ana"})-[:AMIGO*1..3]->(amigo)
RETURN amigo
```

**Cuando usar**: redes sociales, deteccion de fraude, recomendaciones, grafos de conocimiento. **Ejemplo EGEL:** preguntan que BD usar para "amigos de amigos hasta tercer grado"; la respuesta es BD de grafos como Neo4j.

| Tipo | Ejemplo | Caso de uso |
|---|---|---|
| Documento | MongoDB | Catalogos, blogs, perfiles |
| Clave-valor | Redis | Cache, sesiones, contadores |
| Columnar | Cassandra | Series temporales, IoT, logs |
| Grafo | Neo4j | Redes sociales, recomendaciones |

> Tip CENEVAL: NoSQL no es siempre mejor que SQL. Si tus datos son altamente relacionales y la consistencia es critica (banca, ERP), elige SQL.

## Tema 4: Performance

### Concepto 4.1: Indices

Un **indice** es una estructura de datos auxiliar que acelera busquedas a costa de espacio y velocidad de escritura.

- **B-tree** (default en la mayoria de DBs): arbol balanceado, eficiente para igualdad y rangos (`=`, `<`, `>`, `BETWEEN`, `ORDER BY`).
- **Hash**: mapeo directo clave-posicion, O(1) para igualdad, no soporta rangos.
- **GIN/GiST** (PostgreSQL): para busqueda full-text, geometrica, JSONB.
- **Bitmap**: bits por valor, eficiente para columnas de baja cardinalidad (genero, estado).

```sql
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha DESC);
```

**Ejemplo EGEL:** preguntan que tipo de indice usar para `WHERE estado = 'activo'` con solo 3 valores posibles; la respuesta es bitmap (en Oracle) o B-tree (en PostgreSQL/MySQL que no tienen bitmap).

> Tip CENEVAL: indices aceleran SELECT pero ralentizan INSERT/UPDATE/DELETE porque hay que mantenerlos. No indexes todo.

### Concepto 4.2: Query plans

El **query plan** o **plan de ejecucion** muestra como el motor ejecutara una consulta. Se obtiene con `EXPLAIN` (o `EXPLAIN ANALYZE` para incluir tiempos reales).

```sql
EXPLAIN ANALYZE
SELECT * FROM pedidos WHERE cliente_id = 42;
```

Operaciones a buscar:
- **Seq Scan / Full Table Scan**: lee toda la tabla. Malo en tablas grandes sin filtros indexados.
- **Index Scan**: usa indice. Bueno.
- **Index Only Scan**: el indice contiene todos los datos requeridos. Excelente.
- **Nested Loop / Hash Join / Merge Join**: estrategias de JOIN segun tamano y indices.

**Ejemplo EGEL:** preguntan que indica un "Seq Scan" en una tabla de millones de filas con un filtro; la respuesta es que falta un indice util sobre la columna del filtro.

### Concepto 4.3: Particionamiento y sharding

**Particionamiento (vertical/horizontal)** divide una tabla. **Horizontal**: filas en distintas particiones segun rango, hash o lista (ej: pedidos por mes en particion separada). **Vertical**: columnas en tablas separadas (columnas grandes y poco accedidas).

**Sharding** es particionamiento horizontal distribuido entre multiples servidores. Cada shard contiene un subconjunto de los datos. Estrategias: por rango, por hash, por geografia. **Ejemplo EGEL:** preguntan como escalar horizontalmente una BD que no cabe en un servidor; la respuesta es sharding.

### Concepto 4.4: Replicacion

**Replicacion** mantiene copias de los datos en multiples servidores. Tipos:

- **Master-slave (primary-replica)**: un master acepta escrituras, slaves replican y sirven lecturas. Mejora rendimiento de lecturas y provee failover. Slaves pueden tener replication lag (consistencia eventual).
- **Master-master (multi-master)**: multiples nodos aceptan escrituras y se replican entre si. Mayor disponibilidad pero conflictos de escritura posibles.
- **Replicacion sincrona**: el commit espera confirmacion de las replicas (mas seguro, mas lento).
- **Replicacion asincrona**: el commit confirma sin esperar replicas (mas rapido, riesgo de perdida en failover).

**Ejemplo EGEL:** preguntan como escalar lecturas en una BD relacional; la respuesta es replicacion master-slave dirigiendo lecturas a los slaves.

> Tip CENEVAL: la diferencia entre sharding y replicacion: sharding divide los datos (cada nodo tiene una parte), replicacion los duplica (cada nodo tiene todo o casi todo).

## Tema 5: ORMs y migrations

Un **ORM (Object-Relational Mapper)** mapea tablas de BD a objetos del lenguaje de programacion, evitando escribir SQL manual para operaciones comunes.

### Concepto 5.1: ORMs populares

| Lenguaje | ORM |
|---|---|
| Java | Hibernate, JPA |
| .NET | Entity Framework, Dapper |
| Python | SQLAlchemy, Django ORM |
| Node.js/TS | Prisma, TypeORM, Sequelize, Drizzle |
| Ruby | ActiveRecord (Rails) |
| Go | GORM, sqlc |

**Ejemplo EGEL:** preguntan que ORM es estandar en Ruby on Rails; la respuesta es ActiveRecord.

### Concepto 5.2: Patron Active Record vs Data Mapper

- **Active Record**: el objeto modelo contiene tanto datos como logica de persistencia (`usuario.save()`). Mas simple para CRUD basico. Ejemplo: ActiveRecord de Rails, Django ORM.
- **Data Mapper**: separa el objeto de dominio del codigo que lo persiste. Un repositorio o session se encarga (`session.save(usuario)`). Mas testeable y limpio para dominios complejos. Ejemplo: Hibernate, SQLAlchemy, Prisma.

**Ejemplo EGEL:** preguntan que patron usa Hibernate; la respuesta es Data Mapper.

### Concepto 5.3: Problema N+1

El **N+1 query problem** es el problema mas comun de performance con ORMs. Ocurre cuando obtienes una lista de N entidades y luego, para cada una, ejecutas una query adicional para sus relaciones, totalizando 1 + N queries.

```javascript
// Mal: N+1 queries
const pedidos = await prisma.pedido.findMany(); // 1 query
for (const p of pedidos) {
    const cliente = await prisma.cliente.findUnique({ where: { id: p.clienteId } }); // N queries
    console.log(cliente.nombre);
}

// Bien: eager loading con include (1 sola query con JOIN)
const pedidos = await prisma.pedido.findMany({
    include: { cliente: true }
});
```

**Ejemplo EGEL:** muestran codigo Hibernate que itera entidades y accede a una relacion en cada iteracion, ejecutando muchas queries, y preguntan que problema es; la respuesta es N+1, solucionable con eager loading (`JOIN FETCH`, `include`).

### Concepto 5.4: Lazy vs eager loading

- **Lazy loading**: las relaciones se cargan solo cuando se acceden. Reduce datos iniciales pero puede causar N+1.
- **Eager loading**: las relaciones se cargan junto con la entidad principal. Una query con JOIN. Mas datos inicialmente pero sin N+1.

Tu estrategia debe depender del caso: lista de pedidos sin acceder al cliente (lazy); listado para reporte que muestra cliente.nombre (eager).

### Concepto 5.5: Migrations

Las **migrations** son scripts versionados que evolucionan el schema de la BD. Cada migration es un cambio incremental: anadir tabla, anadir columna, modificar tipo, crear indice. Se ejecutan en orden y se registran en una tabla `_migrations` para no aplicarse dos veces. Permiten desplegar cambios coordinadamente con el codigo.

```sql
-- 20251115_001_create_users.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 20251120_002_add_phone_to_users.sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

Frameworks: Flyway, Liquibase (Java), Alembic (Python), Prisma Migrate, TypeORM migrations, Active Record migrations, Knex migrations.

**Ejemplo EGEL:** preguntan por que se usan migrations en lugar de aplicar cambios manuales en la BD; la respuesta es para garantizar reproducibilidad, versionado, despliegues coordinados con el codigo y rollback estructurado.

> Tip CENEVAL: nunca modifiques una migration ya aplicada en produccion. Crea una nueva migration que revierta o corrija.

## Resumen

La gestion de datos abarca eleccion de BD, modelado, garantia de integridad y optimizacion. Las bases relacionales (PostgreSQL, MySQL) ofrecen ACID, JOINs, integridad referencial via PK/FK, y formas normales para evitar redundancia. Las transacciones cumplen ACID con cuatro niveles de aislamiento que balancean consistencia y concurrencia. NoSQL agrupa cuatro tipos: documentos (MongoDB) para semi-estructurado, clave-valor (Redis) para cache, columnar (Cassandra) para series temporales, grafo (Neo4j) para redes. La performance depende de indices (B-tree, hash), planes de ejecucion (EXPLAIN), particionamiento, sharding y replicacion. Los ORMs (Prisma, Hibernate) aceleran desarrollo pero introducen riesgos como N+1, que se mitigan con eager loading. Las migrations versionan los cambios de schema garantizando despliegues reproducibles.

## Errores comunes EGEL

- Confundir PK y FK. PK identifica unicamente; FK referencia una PK de otra tabla.
- Olvidar que LEFT JOIN devuelve todas las filas de la izquierda aunque no haya match a la derecha.
- Pensar que ACID y BASE son lo mismo. ACID es fuerte (SQL); BASE es eventual (NoSQL).
- Confundir niveles de aislamiento. SERIALIZABLE evita todos los fenomenos; READ UNCOMMITTED no evita ninguno.
- Decir que NoSQL siempre es mejor que SQL. NoSQL escala mejor horizontalmente pero pierde consistencia inmediata y JOINs.
- Confundir sharding con replicacion. Sharding divide datos; replicacion los duplica.
- Pensar que indices siempre mejoran performance. Aceleran SELECT pero ralentizan escrituras.
- Olvidar el problema N+1 al usar ORMs. La solucion es eager loading.
- Confundir Active Record y Data Mapper. Active Record une datos y persistencia; Data Mapper los separa.
- Modificar migrations ya aplicadas en lugar de crear nuevas.
- Pensar que Redis es una BD principal. Es ideal para cache y sesiones, no como sistema de registro de datos criticos por su naturaleza in-memory.
- Olvidar que el teorema CAP impone elegir entre consistencia y disponibilidad ante particion de red.
