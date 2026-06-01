# Plataformas de desarrollo

Las plataformas de desarrollo son los entornos donde el software vive: servidores fisicos, maquinas virtuales, contenedores, funciones serverless, redes globales de edge. La decision sobre que plataforma usar afecta costo, escalabilidad, latencia y complejidad operativa. Esta guia cubre los modelos de cloud (IaaS, PaaS, SaaS, FaaS), contenedores con Docker, orquestacion con Kubernetes, serverless y edge computing. El EGEL ISOFT evalua tu capacidad para identificar el modelo correcto segun el caso de uso y comprender conceptos clave como pods, cold starts y CDN.

## Tema 1: Modelos cloud

El cloud computing transformo la infraestructura de "comprar servidores" a "alquilar capacidad bajo demanda". NIST define tres modelos clasicos (IaaS, PaaS, SaaS) y se anadio un cuarto (FaaS).

### Concepto 1.1: IaaS (Infrastructure as a Service)

**IaaS** ofrece infraestructura virtual: maquinas virtuales (VMs), almacenamiento, red. Tu administras el sistema operativo, runtime, middleware y aplicaciones. El proveedor administra el hardware fisico y la virtualizacion. Ejemplos: **AWS EC2**, Azure Virtual Machines, Google Compute Engine, DigitalOcean Droplets, Linode. **Ejemplo EGEL:** preguntan que servicio AWS corresponde a IaaS; la respuesta es EC2 (Elastic Compute Cloud).

```bash
# Lanzar una VM EC2
aws ec2 run-instances --image-id ami-0c7217cdde317cfec \
    --instance-type t2.micro --key-name mi-key
```

**Cuando usar IaaS**: cuando necesitas control total sobre el sistema operativo, instalar software especifico, o migrar aplicaciones existentes (lift-and-shift).

### Concepto 1.2: PaaS (Platform as a Service)

**PaaS** ofrece una plataforma lista para desplegar aplicaciones. El proveedor administra hardware, SO, runtime, middleware. Tu solo subes tu codigo. Escala automaticamente. Ejemplos: **AWS Elastic Beanstalk**, Google App Engine, Heroku, Render, Railway, Vercel (para frontend), Azure App Service. **Ejemplo EGEL:** preguntan que modelo cloud permite desplegar una app web sin gestionar servidores ni configurar el SO; la respuesta es PaaS.

```yaml
# Elastic Beanstalk - basta con subir el codigo, no gestionas servidores
runtime: node.js 20
type: web
```

**Cuando usar PaaS**: equipos pequenos o medianos que quieren enfocarse en codigo y no en operaciones, MVPs, startups.

### Concepto 1.3: SaaS (Software as a Service)

**SaaS** es software listo para usar, accesible via web o API. Tu no gestionas nada. Ejemplos: Gmail, Salesforce, Slack, Dropbox, Office 365, Notion, GitHub. **Ejemplo EGEL:** preguntan que modelo representa Gmail; la respuesta es SaaS.

**Cuando usar SaaS**: cuando existe una solucion off-the-shelf que cumple tus necesidades sin desarrollar nada.

### Concepto 1.4: FaaS (Function as a Service) o Serverless

**FaaS** ejecuta funciones individuales sin gestionar servidores. Pagas por invocacion y tiempo de ejecucion. Las funciones se invocan por eventos: HTTP, mensajes de cola, cambios en BD, schedule. Ejemplos: **AWS Lambda**, Azure Functions, Google Cloud Functions, Vercel Functions, Cloudflare Workers.

```javascript
// AWS Lambda handler
exports.handler = async (event) => {
    const nombre = event.queryStringParameters?.nombre || "mundo";
    return {
        statusCode: 200,
        body: JSON.stringify({ mensaje: `Hola ${nombre}` })
    };
};
```

**Cuando usar FaaS**: tareas event-driven, procesamiento batch, webhooks, APIs con trafico irregular o muy bajo.

### Concepto 1.5: Comparativa de modelos

| Modelo | Ejemplo AWS | Tu administras |
|---|---|---|
| IaaS | EC2 | SO, runtime, middleware, app |
| PaaS | Elastic Beanstalk, RDS | Solo la app (y datos en RDS) |
| FaaS | Lambda | Solo el codigo de la funcion |
| SaaS | Workmail | Nada (solo uso) |

**Ejemplo EGEL:** muestran tabla similar y preguntan que modelo te exime de gestionar el sistema operativo; la respuesta es PaaS, FaaS y SaaS, no IaaS.

> Tip CENEVAL: RDS (Relational Database Service) es PaaS porque AWS gestiona el motor de BD, backups y parches. Tu solo defines schemas y consultas.

## Tema 2: Contenedores con Docker

Los contenedores empaquetan aplicacion + dependencias + configuracion en una unidad portable que corre igual en cualquier entorno.

### Concepto 2.1: Conceptos basicos

**Imagen**: plantilla read-only que define un contenedor. Se construye desde un `Dockerfile`. **Contenedor**: instancia ejecutable de una imagen. Aislado pero comparte el kernel del host (a diferencia de VMs que tienen su propio kernel). **Registry**: repositorio de imagenes (Docker Hub, Amazon ECR, GitHub Container Registry, GitLab Container Registry).

**Ejemplo EGEL:** preguntan la diferencia entre una imagen y un contenedor; la respuesta clave es que la imagen es la plantilla inmutable y el contenedor es la instancia ejecutable mutable.

### Concepto 2.2: Dockerfile

Un `Dockerfile` define como construir una imagen. Cada instruccion crea una capa (layer) cacheada.

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

Comandos:

```bash
docker build -t mi-app:1.0 .          # construye imagen
docker run -p 3000:3000 mi-app:1.0    # ejecuta contenedor
docker ps                              # lista contenedores corriendo
docker exec -it <id> sh                # shell dentro del contenedor
docker push mi-registry/mi-app:1.0     # sube al registry
```

**Ejemplo EGEL:** preguntan que instruccion del Dockerfile define el comando que se ejecuta al iniciar el contenedor; la respuesta es `CMD` (o `ENTRYPOINT`).

### Concepto 2.3: Layers y multi-stage builds

Cada instruccion del Dockerfile crea una **layer**. Docker cachea layers: si una instruccion no cambia, no se reconstruye. Por eso conviene poner instrucciones que cambian poco (instalar dependencias) ANTES de las que cambian mucho (copiar codigo fuente).

Un **multi-stage build** usa varias imagenes base para optimizar el tamano final. Tipico para apps compiladas: una stage compila, otra solo lleva el binario final.

```dockerfile
# Stage 1: build
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Stage 2: runtime minimo
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]
```

**Ejemplo EGEL:** preguntan que tecnica reduce el tamano de la imagen final excluyendo herramientas de compilacion; la respuesta es multi-stage build.

> Tip CENEVAL: ordenar el Dockerfile poniendo `COPY package.json` y `RUN npm install` antes de `COPY . .` aprovecha la cache: si solo cambia codigo (no dependencias), no reinstala paquetes.

### Concepto 2.4: docker-compose

**docker-compose** orquesta multiples contenedores localmente. Util para desarrollar apps con varias dependencias (app + BD + cache).

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:secret@db:5432/app
    depends_on:
      - db
      - cache
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
  cache:
    image: redis:7-alpine

volumes:
  pgdata:
```

```bash
docker-compose up -d           # levanta todo
docker-compose logs -f app     # ve logs
docker-compose down            # apaga y borra
```

**Ejemplo EGEL:** preguntan que herramienta usar para levantar app + BD + Redis en desarrollo local; la respuesta es docker-compose.

## Tema 3: Orquestacion con Kubernetes

Kubernetes (K8s) es la plataforma estandar para orquestar contenedores en produccion a gran escala. Creado por Google, ahora gobernado por la CNCF.

### Concepto 3.1: Arquitectura

Un **cluster** Kubernetes tiene:
- **Control plane** (master): API server, scheduler, controller manager, etcd (almacen de estado).
- **Nodes** (workers): maquinas que ejecutan contenedores via kubelet y kube-proxy.

### Concepto 3.2: Objetos basicos

- **Pod**: la unidad minima desplegable. Uno o mas contenedores que comparten red y storage. Tipicamente un pod = un contenedor de aplicacion.
- **Deployment**: define el estado deseado: cuantas replicas de un pod corren, que imagen, como actualizar (rolling update).
- **ReplicaSet**: garantiza N replicas del pod (creado por el Deployment).
- **Service**: expone pods con una IP estable y load balancing interno. Tipos: ClusterIP (interno), NodePort, LoadBalancer (externo), ExternalName.
- **Ingress**: define reglas de enrutamiento HTTP/HTTPS desde el exterior.
- **ConfigMap / Secret**: configuracion y datos sensibles inyectados a los pods.
- **Namespace**: agrupacion logica para aislar recursos.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mi-app
  template:
    metadata:
      labels:
        app: mi-app
    spec:
      containers:
        - name: app
          image: mi-registry/mi-app:1.0
          ports:
            - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: mi-app-svc
spec:
  selector:
    app: mi-app
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

**Ejemplo EGEL:** preguntan cual es la unidad minima de despliegue en Kubernetes; la respuesta es el Pod, no el contenedor.

### Concepto 3.3: kubectl

`kubectl` es el CLI de Kubernetes.

```bash
kubectl apply -f deployment.yaml          # aplica manifest
kubectl get pods                          # lista pods
kubectl get deployments                   # lista deployments
kubectl logs <pod-id>                     # ve logs
kubectl exec -it <pod-id> -- sh           # shell en el pod
kubectl describe pod <pod-id>             # detalles
kubectl scale deployment mi-app --replicas=5
kubectl rollout undo deployment mi-app    # rollback
```

**Ejemplo EGEL:** preguntan que comando obtiene logs de un pod; la respuesta es `kubectl logs`.

### Concepto 3.4: Helm

**Helm** es el gestor de paquetes de Kubernetes. Un **chart** es una plantilla parametrizable de recursos K8s. Repositorios como Artifact Hub publican charts oficiales (PostgreSQL, Redis, Nginx Ingress).

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install mi-postgres bitnami/postgresql
helm upgrade mi-postgres bitnami/postgresql --set auth.postgresPassword=nuevo
helm uninstall mi-postgres
```

**Ejemplo EGEL:** preguntan que herramienta facilita instalar y versionar aplicaciones complejas en Kubernetes; la respuesta es Helm.

### Concepto 3.5: Servicios gestionados

Operar tu propio Kubernetes es complejo. Los clouds ofrecen K8s gestionados: **AWS EKS**, Google **GKE**, Azure **AKS**, DigitalOcean Kubernetes. Te encargan del control plane y solo gestionas tus workloads.

> Tip CENEVAL: Kubernetes no es exclusivo de Docker. Soporta cualquier runtime de contenedores compatible con CRI (Container Runtime Interface): containerd, CRI-O.

## Tema 4: Serverless

Serverless va mas alla de "no hay servidores": significa que el cloud escala automaticamente, cobra por uso real (no por capacidad reservada), y abstrae completamente la infraestructura.

### Concepto 4.1: AWS Lambda

**AWS Lambda** ejecuta funciones bajo demanda. Soporta Node.js, Python, Java, Go, Ruby, .NET, custom runtimes. Triggers: API Gateway (HTTP), S3 (eventos de archivos), DynamoDB Streams, SQS, EventBridge (schedule), Cognito.

```python
import json

def lambda_handler(event, context):
    body = json.loads(event.get("body", "{}"))
    nombre = body.get("nombre", "mundo")
    return {
        "statusCode": 200,
        "body": json.dumps({"mensaje": f"Hola {nombre}"})
    }
```

Modelo de precios: por numero de invocaciones + GB-segundos consumidos. Limites: 15 minutos max por invocacion, 10GB memoria max, 512MB storage `/tmp`.

### Concepto 4.2: Cold starts

Un **cold start** ocurre cuando el cloud necesita aprovisionar un nuevo contenedor para ejecutar tu funcion porque no hay instancias "calientes" disponibles. Latencia adicional: 100ms-3s segun runtime (Java es de los peores, Python y Node.js de los mejores) y tamano del paquete.

Estrategias de mitigacion:
- **Provisioned concurrency**: pagas por mantener N instancias siempre listas.
- **Warming**: pings periodicos que mantienen funciones calientes.
- **Runtime ligero**: usar Go, Python o Node sobre Java.
- **Reducir tamano**: menos dependencias, menos memoria.

**Ejemplo EGEL:** preguntan que es un cold start y por que afecta a serverless; la respuesta es la latencia inicial cuando se aprovisiona un nuevo contenedor para la primera invocacion, afectando especialmente aplicaciones con trafico irregular.

### Concepto 4.3: Vercel Functions y Cloudflare Workers

**Vercel Functions** son serverless functions integradas con Vercel (deploys de Next.js, etc.). Pueden ser Node.js o Edge Functions (corren en el edge global con Cloudflare-like runtime).

**Cloudflare Workers** corren en el edge global de Cloudflare (300+ ciudades) usando V8 isolates (no contenedores) lo que elimina cold starts (arranque en menos de 5ms). Limites: 10ms CPU en plan gratis (50ms en pago), runtime restringido (no Node.js completo, solo APIs web estandar).

```javascript
// Cloudflare Worker
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const nombre = url.searchParameters.get("nombre") || "mundo";
        return new Response(`Hola ${nombre}`, {
            headers: { "content-type": "text/plain" }
        });
    }
};
```

**Ejemplo EGEL:** preguntan que tecnologia elimina los cold starts ejecutando funciones en isolates V8 en lugar de contenedores; la respuesta es Cloudflare Workers.

### Concepto 4.4: Casos de uso

Bueno para serverless:
- APIs con trafico irregular o muy bajo.
- Procesamiento de eventos asincronos (S3 upload -> resize imagen).
- Webhooks.
- Tareas batch programadas.
- Backends de mobile/JAMstack.

Malo para serverless:
- Aplicaciones con latencia ultra-baja sensibles a cold starts.
- Procesos largos (mas de 15 minutos en Lambda).
- Conexiones persistentes (WebSockets necesitan API Gateway WebSocket o servicios dedicados).
- Workloads con uso constante alto (mas barato un servidor reservado).

> Tip CENEVAL: serverless no significa "sin servidores"; significa que TU no gestionas servidores. Los hay, pero los administra el cloud.

## Tema 5: Edge computing y CDN

El edge computing acerca el computo y el contenido a los usuarios geograficamente, reduciendo latencia.

### Concepto 5.1: CDN (Content Delivery Network)

Un **CDN** distribuye contenido estatico (imagenes, CSS, JS, videos) en servidores cache en multiples regiones. Cuando un usuario solicita un archivo, recibe la copia del nodo mas cercano (Point of Presence, PoP), reduciendo latencia drasticamente. Ejemplos: **Cloudflare**, AWS CloudFront, Fastly, Akamai, Vercel Edge Network.

```
Usuario CDMX -> CDN PoP Mexico (50ms) en lugar de Origen Virginia (180ms)
```

**Ejemplo EGEL:** preguntan que mecanismo reduce la latencia de descarga de imagenes para usuarios en distintas regiones; la respuesta es CDN.

### Concepto 5.2: Edge computing

Mientras CDN cachea contenido estatico, **edge computing** ejecuta codigo en el edge. Cloudflare Workers, Vercel Edge Functions, Deno Deploy, AWS Lambda@Edge corren tu logica en cientos de ubicaciones globales. Casos: A/B testing por geografia, redirecciones inteligentes, transformacion de imagenes, autenticacion, personalizacion sin volver al origen.

```javascript
// Vercel Edge Function
export const config = { runtime: 'edge' };

export default async function handler(req) {
    const pais = req.geo?.country || 'MX';
    const saludo = pais === 'US' ? 'Hello' : 'Hola';
    return new Response(`${saludo} from ${pais}`);
}
```

**Ejemplo EGEL:** preguntan en que se diferencia edge computing de serverless tradicional (Lambda en una region); la respuesta es que edge ejecuta en multiples ubicaciones simultaneamente cerca del usuario, mientras que Lambda regional ejecuta en una sola region elegida.

### Concepto 5.3: Estrategias de cache

- **Cache-Control headers**: HTTP define `Cache-Control: max-age=3600, public, immutable` para indicar cuanto tiempo cachear.
- **CDN cache TTL**: tiempo de vida en el CDN antes de revalidar con origen.
- **Stale-while-revalidate**: sirve contenido stale mientras revalida en background.
- **Cache invalidation**: purgar manual o por tags cuando cambia contenido.

```http
Cache-Control: public, max-age=31536000, immutable
```

**Ejemplo EGEL:** preguntan que header HTTP controla el cacheo; la respuesta es `Cache-Control` (o el mas viejo `Expires`).

> Tip CENEVAL: hay dos cosas duras en computacion: invalidar cache y nombrar variables. La invalidacion es donde se rompen muchos sistemas.

### Concepto 5.4: Latencia y geografia

La velocidad de la luz impone limites fisicos: aprox 200ms round-trip de CDMX a Tokio. CDN y edge reducen esa latencia llevando contenido y computo cerca del usuario. Para apps globales (e-commerce, SaaS) es la diferencia entre 50ms y 300ms por request.

| Tecnologia | Latencia tipica | Cold start | Caso |
|---|---|---|---|
| Servidor central (us-east-1) | 100-300ms global | No | Backend monolitico |
| Lambda regional | 100-300ms global + cold | Si (100ms-3s) | API eventual |
| Cloudflare Worker (edge) | 10-50ms global | No (V8 isolates) | API global, transformaciones |
| CDN cache (estatico) | 10-30ms global | No | Assets, imagenes |

### Concepto 5.5: Ejemplo Vercel Edge Network

Vercel despliega sitios Next.js en una red edge global. Pages se renderizan en el edge (Edge SSR), assets se sirven desde CDN, funciones se ejecutan en edge o serverless regional segun configuracion. Beneficio: tu app tiene la misma latencia para usuarios en CDMX, Berlin o Tokio.

## Resumen

Las plataformas de desarrollo evolucionaron desde servidores fisicos hasta el edge global. IaaS (EC2) da control total y maxima responsabilidad. PaaS (Beanstalk, Heroku, Render) abstrae el SO y deja a tu codigo en primer plano. SaaS (Gmail) elimina toda gestion. FaaS (Lambda) cobra por invocacion y escala automaticamente. Los contenedores (Docker) empaquetan apps de forma portable; multi-stage builds reducen tamano y docker-compose orquesta servicios locales. Kubernetes orquesta contenedores en produccion con pods, deployments, services e ingresses, manejado via kubectl y empaquetado con Helm. Serverless brilla en cargas event-driven pero sufre cold starts. Edge computing (Cloudflare Workers, Vercel Edge) ejecuta codigo cerca del usuario eliminando latencia y cold starts via V8 isolates. CDN distribuye contenido estatico globalmente reduciendo latencia drasticamente. La eleccion correcta de plataforma depende de patron de trafico, requisitos de latencia, complejidad operativa y presupuesto.

## Errores comunes EGEL

- Confundir IaaS con PaaS. IaaS te da VMs (tu gestionas SO); PaaS te da plataforma lista (tu solo subes codigo).
- Decir que serverless significa "sin servidores fisicos". Los servidores existen; el cloud los gestiona.
- Pensar que cold starts son irrelevantes. Pueden anadir 1-3 segundos a la primera invocacion despues de inactividad.
- Confundir CDN con edge computing. CDN cachea contenido; edge ejecuta codigo.
- Olvidar que la unidad minima en Kubernetes es el Pod, no el contenedor.
- Confundir Deployment con Service. Deployment gestiona replicas; Service expone red estable.
- Pensar que Docker y Kubernetes son lo mismo. Docker construye y corre contenedores; Kubernetes los orquesta a escala.
- Asumir que multi-stage builds son opcionales. Reducen drasticamente tamano y superficie de ataque.
- Olvidar que Cloudflare Workers usan V8 isolates, no contenedores; por eso no tienen cold starts perceptibles.
- Confundir AWS Lambda con Vercel Edge Functions. Lambda corre en una region; Edge Functions en cientos de ubicaciones.
- Pensar que CDN solo sirve para imagenes. Tambien acelera HTML, JSON, video y cualquier contenido cacheable.
- Decir que serverless siempre es mas barato. Para cargas constantes altas, un servidor reservado puede salir mas economico.
