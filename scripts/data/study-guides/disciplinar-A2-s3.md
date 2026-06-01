# Diseno de interfaces

La interfaz de usuario es el unico punto donde el sistema realmente existe para el usuario final. Una arquitectura impecable y un dominio elegante no compensan una interfaz confusa, lenta o inaccesible. Esta subarea del EGEL evalua los principios de usabilidad (heuristicas de Nielsen), los estandares de accesibilidad (WCAG 2.1), las estrategias de diseno multidispositivo (responsive, adaptive, mobile-first), las tecnicas de prototipado (wireframes, mockups, prototipos) y los design systems modernos basados en atomic design. Los reactivos suelen presentar capturas de pantalla o descripciones de comportamiento y pedir identificar la heuristica violada, el nivel WCAG aplicable o la tecnica de prototipado adecuada al momento del proyecto.

## Tema 1: Las 10 heuristicas de Nielsen

Jakob Nielsen publico en 1994 un conjunto de 10 principios generales para el diseno de interfaces que siguen siendo el marco mas usado para evaluacion heuristica. No son reglas estrictas sino guias amplias para detectar problemas de usabilidad.

### Concepto 1.1: Visibilidad del estado del sistema

El sistema debe mantener informados a los usuarios sobre lo que esta ocurriendo, mediante retroalimentacion apropiada y en un tiempo razonable. Si una operacion tarda mas de 1 segundo, debe mostrar un indicador. Si tarda mas de 10 segundos, debe mostrar progreso (porcentaje, barra). Si una accion fue exitosa, debe haber confirmacion visible.

**Ejemplo:** un boton de subir archivo que no muestra nada mientras el usuario espera viola esta heuristica. El usuario duda, vuelve a hacer click, sube dos veces el archivo. La solucion es un spinner inmediato y una barra de progreso para archivos grandes.

### Concepto 1.2: Coincidencia entre el sistema y el mundo real

El sistema debe hablar el lenguaje del usuario, con palabras, frases y conceptos familiares, no jerga tecnica. Las metaforas (carpeta, papelera, escritorio) deben corresponder a conceptos del mundo real. Los iconos deben ser reconocibles sin necesidad de explicacion.

**Ejemplo:** una app bancaria que dice Error 500 al usuario en lugar de No pudimos procesar tu transferencia, intenta de nuevo. La primera version habla el lenguaje del servidor; la segunda, el del cliente.

### Concepto 1.3: Control y libertad del usuario

Los usuarios cometen errores y necesitan una salida de emergencia claramente marcada. Debe haber siempre la posibilidad de deshacer, cancelar o salir sin consecuencias. Los flujos forzados son uno de los principales motivos de abandono.

**Ejemplo:** un wizard de configuracion sin boton de atras obliga al usuario a completar todo desde cero si se equivoca en un paso intermedio. La solucion es boton atras, opcion de guardar borrador y posibilidad de cancelar en cualquier paso.

### Concepto 1.4: Consistencia y estandares

Los usuarios no deberian preguntarse si palabras, situaciones o acciones distintas significan lo mismo. Hay que seguir las convenciones de la plataforma (iOS Human Interface Guidelines, Material Design) y mantener consistencia interna: si en una pantalla el boton primario es azul, debe serlo en todas.

**Ejemplo:** una app movil donde en una pantalla Guardar esta arriba a la derecha y en otra esta abajo a la izquierda confunde al usuario. El boton de accion principal debe estar siempre en la misma posicion relativa.

### Concepto 1.5: Prevencion de errores

Mejor que mostrar un buen mensaje de error es disenar para que el error no ocurra. Validar inputs en tiempo real, deshabilitar acciones imposibles, pedir confirmacion para acciones destructivas, ofrecer autocompletado.

**Ejemplo:** un formulario que valida el formato del correo electronico solo al enviar, en lugar de hacerlo mientras el usuario escribe, frustra al usuario que tiene que regresar al campo despues de varios segundos. Validacion en blur o mientras escribe es prevencion.

### Concepto 1.6: Reconocer en lugar de recordar

Minimizar la carga de memoria del usuario haciendo visibles los objetos, acciones y opciones. El usuario no deberia tener que recordar informacion entre pantallas. Los menus son mejores que los comandos memorizados.

**Ejemplo:** un buscador que muestra busquedas recientes y sugerencias mientras se escribe aplica reconocimiento. Un terminal donde el usuario debe recordar la sintaxis exacta de cada comando depende de recuerdo.

### Concepto 1.7: Flexibilidad y eficiencia de uso

Aceleradores invisibles para usuarios expertos (atajos de teclado, gestos, comandos rapidos) sin estorbar a los novatos. Permitir personalizar acciones frecuentes.

**Ejemplo:** Gmail permite a un novato hacer todo con el mouse pero ofrece a usuarios avanzados atajos (j, k para navegar, c para componer, e para archivar) que aceleran enormemente el trabajo. Ambos publicos coexisten.

### Concepto 1.8: Diseno estetico y minimalista

Las pantallas no deben contener informacion irrelevante o rara vez necesaria. Cada elemento adicional compite por la atencion del usuario y diluye los elementos importantes. La estetica minimalista no significa pobre; significa precisa.

**Ejemplo:** una pagina de aterrizaje con 5 carruseles, 3 popups y 7 calls-to-action distintos no logra ninguno. Una pagina con un solo titulo claro y un solo boton convierte mejor.

### Concepto 1.9: Ayudar a los usuarios a reconocer, diagnosticar y recuperarse de errores

Los mensajes de error deben expresarse en lenguaje claro (sin codigos), indicar con precision el problema y sugerir constructivamente una solucion.

**Ejemplo:** El correo o contrasena son incorrectos es vago e inseguro. Mejor: No existe una cuenta con ese correo. Verifica el correo o registrate. Esto orienta sin revelar si el correo existe (compromiso entre usabilidad y seguridad).

### Concepto 1.10: Ayuda y documentacion

Aunque lo ideal es que el sistema sea usable sin documentacion, es necesario proveer ayuda. Esta debe ser facil de buscar, enfocada en la tarea del usuario, con pasos concretos y no demasiado extensa.

**Ejemplo:** un sistema con un FAQ contextual (la ayuda relevante a la pantalla actual aparece al hacer click en el icono de pregunta) es mejor que un manual PDF de 200 paginas.

> 💡 **Tip CENEVAL:** Las heuristicas mas evaluadas son visibilidad del estado, prevencion de errores, consistencia y control del usuario. Si el reactivo muestra un mensaje de error confuso o sin solucion sugerida, la respuesta es heuristica 9 (recuperarse de errores).

## Tema 2: Accesibilidad WCAG 2.1

Las Web Content Accessibility Guidelines (WCAG) son el estandar internacional de accesibilidad publicado por el W3C. La version 2.1 (2018) anade criterios de movilidad y dispositivos moviles.

### Concepto 2.1: Niveles de conformidad

**Nivel A:** lo minimo. Incluye textos alternativos en imagenes, contraste basico, navegacion por teclado.
**Nivel AA:** el estandar legal en la mayoria de paises (Mexico incluido para sitios gubernamentales). Anade contraste minimo de 4.5:1 para texto normal y 3:1 para texto grande, redimensionamiento al 200% sin perdida, errores identificados.
**Nivel AAA:** el ideal pero raramente alcanzable en todo el sitio. Contraste 7:1, lenguaje signado, traduccion de modismos.

### Concepto 2.2: Los cuatro principios POUR

**Perceptible:** la informacion debe ser presentada de modo que los usuarios puedan percibirla. Texto alternativo en imagenes, subtitulos en videos, contraste suficiente.
**Operable:** los componentes deben ser operables. Toda funcionalidad disponible por teclado, tiempo suficiente para leer, sin contenido que provoque convulsiones (parpadeos rapidos).
**Comprensible:** la informacion y la operacion deben ser comprensibles. Lenguaje claro, comportamiento predecible, asistencia para evitar errores.
**Robusto:** el contenido debe ser robusto para ser interpretado por agentes de usuario diversos, incluidas tecnologias asistivas. HTML semantico, ARIA labels.

### Concepto 2.3: Contraste

El texto debe tener una razon de contraste con el fondo de al menos 4.5:1 para nivel AA. Texto grande (mas de 18pt o 14pt negrita) puede tener 3:1. Logos y texto decorativo estan exentos.

**Ejemplo:** texto gris claro #888 sobre fondo blanco #fff tiene contraste 3.5:1, que falla nivel AA. Cambiar a #595959 da 7:1 y cumple AA y AAA.

### Concepto 2.4: Navegacion por teclado

Toda funcionalidad debe ser accesible solo con teclado. Tab para avanzar, Shift+Tab para retroceder, Enter para activar, Space para checks, flechas para selects. El foco debe ser visible (outline). El orden de tabulacion debe seguir el orden visual.

```html
<!-- Mal: div sin tabindex no es navegable -->
<div onclick="enviar()">Enviar</div>

<!-- Bien: usar elementos semanticos -->
<button onclick="enviar()">Enviar</button>
```

### Concepto 2.5: Lectores de pantalla y ARIA

Los lectores de pantalla (JAWS, NVDA, VoiceOver, TalkBack) leen en voz alta el contenido y los atributos. ARIA (Accessible Rich Internet Applications) provee atributos para describir componentes dinamicos a los lectores. Reglas clave: HTML semantico primero (button, nav, main, article), ARIA solo cuando no hay equivalente semantico.

```html
<!-- ARIA para indicar estado de un componente dinamico -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<ul id="menu" hidden>
  <li>Inicio</li>
</ul>

<!-- aria-label para iconos sin texto -->
<button aria-label="Cerrar dialogo">
  <svg>...</svg>
</button>
```

**Ejemplo:** un boton de cerrar que solo tiene el icono de X sin aria-label es leido por el lector de pantalla como solo boton, sin contexto. Anadir aria-label="Cerrar" lo vuelve usable para personas ciegas.

> 💡 **Tip CENEVAL:** Si el reactivo menciona contraste, navegacion por teclado, texto alternativo o lectores de pantalla, es WCAG. El nivel AA es el legalmente exigido para sitios publicos en la mayoria de jurisdicciones, incluido el portal del gobierno mexicano.

## Tema 3: Responsive vs adaptive vs mobile-first

### Concepto 3.1: Diseno responsive

El diseno responsive usa CSS flexible (porcentajes, em/rem, flexbox, grid) y media queries para adaptarse fluidamente a cualquier tamano de pantalla. No hay versiones separadas; una sola hoja de estilos se ajusta. Es el enfoque dominante hoy.

```css
.contenedor {
  display: grid;
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .contenedor { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  .contenedor { grid-template-columns: 1fr 1fr 1fr; }
}
```

### Concepto 3.2: Diseno adaptive

El diseno adaptive sirve versiones distintas segun el dispositivo detectado. El servidor o el cliente decide cargar la version movil, tablet o desktop. Permite optimizar pesadas (movil mas ligero) pero requiere mantener varias versiones. Es menos comun hoy; la mayoria de equipos prefiere responsive.

### Concepto 3.3: Mobile-first

Mobile-first es una estrategia de diseno donde se empieza por la pantalla mas pequena y se agregan capacidades para pantallas mas grandes. Obliga a priorizar el contenido esencial y a tomar decisiones de jerarquia. En CSS se traduce a media queries con min-width en lugar de max-width.

**Ejemplo:** una app de noticias mobile-first define primero el layout para 360px (una columna, navegacion oculta tras un menu hamburguesa), luego anade en 768px una segunda columna y en 1280px la barra lateral persistente.

### Concepto 3.4: Breakpoints comunes

No hay un estandar absoluto, pero los breakpoints mas usados son:

- 320px: movil pequeno
- 480px: movil grande
- 768px: tablet
- 1024px: laptop pequena
- 1280px: laptop / desktop
- 1920px: desktop grande

Bootstrap, Tailwind y Material UI usan sets propios; la decision suele depender del proyecto y del analisis de analytics reales (que dispositivos usan los usuarios).

### Concepto 3.5: Touch targets

En pantallas tactiles, los elementos interactivos deben tener un tamano minimo. Apple recomienda 44x44 puntos; Google recomienda 48x48 dp. Espacios menores generan errores de toque, frustracion y fatiga.

### Concepto 3.6: Layouts fluidos

Usar unidades relativas (%, em, rem, vw, vh) en lugar de pixels fijos permite que el contenido se adapte. Las imagenes deben tener max-width: 100% para no desbordar. El texto debe usar tamano base con escalado tipografico fluido (clamp en CSS moderno).

```css
.titulo {
  /* tamano fluido entre 1.5rem y 3rem segun el viewport */
  font-size: clamp(1.5rem, 4vw, 3rem);
}
```

> 💡 **Tip CENEVAL:** Si el reactivo menciona una sola hoja de estilos que se adapta a cualquier pantalla, es responsive. Si menciona versiones distintas por dispositivo, es adaptive. Si menciona disenar primero para movil, es mobile-first. Los touch targets minimos son 44x44 (Apple) o 48x48 (Google).

## Tema 4: Wireframes, mockups, prototipos

Las tres tecnicas son etapas progresivas del diseno de interfaces. Confundirlas es uno de los errores mas frecuentes.

### Concepto 4.1: Wireframes (low-fi)

Los wireframes son esquemas de baja fidelidad que muestran la estructura, jerarquia y disposicion de elementos sin colores, tipografias ni detalles visuales. Pueden hacerse con lapiz y papel, con pizarra blanca o con herramientas digitales (Balsamiq, Whimsical). El objetivo es validar arquitectura de informacion y flujos, no estetica.

**Ejemplo:** un wireframe de una pantalla de pedidos muestra un encabezado, una lista con tres columnas (id, fecha, total) y un boton agregar. Todos en blanco y negro con cajas grises. Aun no se decide el color ni la fuente.

### Concepto 4.2: Mockups (high-fi)

Los mockups son representaciones de alta fidelidad que ya incluyen colores, tipografias, iconos, imagenes y espaciado real. Son estaticos: no se puede interactuar. Sirven para validar el diseno visual con stakeholders y para entregar a desarrollo como referencia.

**Ejemplo:** el mismo wireframe de pedidos ahora muestra los colores reales de la marca, la tipografia Inter, iconos de Lucide, fotos reales de productos y los estados del boton (normal, hover, deshabilitado).

### Concepto 4.3: Prototipos

Los prototipos son simulaciones interactivas. Permiten hacer click, navegar entre pantallas, escribir en campos y experimentar el flujo. Pueden hacerse en Figma (con prototipado integrado), en InVision o como prototipos en codigo (HTML, React).

**Ejemplo:** un prototipo de checkout permite al usuario probar agregar productos al carrito, ir a pago, llenar datos y ver la confirmacion. Es como usar la app, pero sin backend real. Sirve para pruebas de usabilidad con usuarios reales antes de codificar.

### Concepto 4.4: Cuando usar cada uno

**Wireframes:** etapa muy temprana, exploracion rapida, validacion de estructura. Bajo costo, alta velocidad de iteracion.
**Mockups:** despues de aprobar la estructura, para definir la apariencia visual. Util para presentar a clientes.
**Prototipos:** antes de empezar a desarrollar, para validar la experiencia completa con usuarios reales.

Saltarse el wireframe y empezar con mockup es el error mas comun: se pierden semanas iterando colores y tipografias antes de descubrir que la estructura misma esta mal.

### Concepto 4.5: Herramientas

**Figma:** estandar de la industria. Colaborativo en tiempo real, multiplataforma, con prototipado y dev mode integrado. Es gratuito para uso personal.
**Sketch:** popular en equipos macOS, fue lider antes de Figma. Solo para Mac.
**Adobe XD:** parte de Creative Cloud, integracion fuerte con Photoshop e Illustrator.
**Balsamiq:** especializado en wireframes con estetica deliberadamente baja-fi para evitar discusiones prematuras de visual.

> 💡 **Tip CENEVAL:** Wireframe es estructura sin estetica. Mockup es estatico con estetica final. Prototipo es interactivo. Si el reactivo menciona validar arquitectura de informacion, es wireframe. Si menciona pruebas de usabilidad con usuarios, es prototipo.

## Tema 5: Design systems y atomic design

### Concepto 5.1: Que es un design system

Un design system es un conjunto coherente de componentes reutilizables, guias de diseno, tokens y reglas que permiten a un equipo construir productos digitales consistentes a escala. No es solo una libreria de UI; incluye principios, voz y tono, accesibilidad y procesos de contribucion. Ejemplos famosos: Material Design (Google), Polaris (Shopify), Carbon (IBM), Lightning (Salesforce).

### Concepto 5.2: Design tokens

Los tokens son valores atomicos de diseno (colores, espacios, tipografias, sombras, radios) representados como variables. Se definen una vez y se reutilizan en todos los componentes. Permiten cambios globales (rebranding, modo oscuro) modificando solo el archivo de tokens.

```json
{
  "color": {
    "brand": { "primary": "#38bdf8", "secondary": "#a78bfa" },
    "feedback": { "success": "#10b981", "danger": "#ef4444" }
  },
  "spacing": { "xs": "4px", "sm": "8px", "md": "16px", "lg": "24px" },
  "typography": { "fontFamily": "Inter, sans-serif" }
}
```

### Concepto 5.3: Atomic Design

Propuesta por Brad Frost en 2013, atomic design organiza los componentes en cinco niveles inspirados en la quimica:

**Atomos:** los componentes basicos indivisibles. Boton, input, label, icono, etiqueta. No tienen sentido por si solos en una interfaz pero son los bloques de construccion.

**Moleculas:** combinaciones simples de atomos que funcionan como una unidad. Un campo de busqueda (input + boton + icono), un item de menu (icono + texto + indicador).

**Organismos:** grupos relativamente complejos de moleculas y atomos que forman secciones distintas de la interfaz. Una barra de navegacion (logo + menu + buscador + perfil de usuario), un formulario de registro, una tarjeta de producto.

**Templates:** layouts a nivel de pagina con organismos colocados en estructura. Definen el esqueleto sin contenido real. Es un esqueleto reutilizable: pagina con header, sidebar, contenido principal y footer.

**Pages:** instancias especificas de templates con contenido real. La pagina de inicio, la pagina de checkout. Aqui es donde se prueba si los componentes funcionan en escenarios reales.

**Ejemplo:** en EGELPro, un atomo es el Button. Una molecula es el QuestionOption (boton + texto + indicador correcto/incorrecto). Un organismo es la pantalla completa de una pregunta del quiz. Un template es el layout de seccion de quiz. Una pagina es /quiz/[id] con datos reales.

### Concepto 5.4: Componentes y variantes

Cada componente del design system debe documentar sus variantes (primario, secundario, ghost), tamanos (sm, md, lg), estados (default, hover, focus, disabled, loading) y props. Herramientas como Storybook permiten visualizar todas las variantes en aislamiento.

### Concepto 5.5: Documentacion y gobernanza

Un design system sin documentacion muere. Debe tener guias de uso (cuando usar este componente vs otro), ejemplos de codigo, criterios de accesibilidad y un proceso claro para proponer cambios o agregar componentes nuevos.

> 💡 **Tip CENEVAL:** Atomic design tiene cinco niveles: atomos, moleculas, organismos, templates, paginas. Si el reactivo describe un boton, es atomo. Si describe un campo de busqueda con boton, es molecula. Si describe una barra de navegacion completa, es organismo. Los tokens son los valores atomicos (colores, espacios, tipografias) que se reutilizan en todos los componentes.

## Resumen de la subarea

El diseno de interfaces no es decoracion: es la disciplina de hacer que un sistema sea comprensible, eficiente y accesible. Las heuristicas de Nielsen son el lenguaje comun para detectar problemas de usabilidad. WCAG 2.1 nivel AA es el estandar legal de accesibilidad. Responsive con enfoque mobile-first es la estrategia dominante para soportar todos los dispositivos con un solo codigo base. Wireframes, mockups y prototipos son etapas progresivas del proceso de diseno, cada una con su proposito. Los design systems con atomic design permiten escalar diseno y desarrollo de manera consistente en equipos grandes. El examen evalua estos conceptos con escenarios y descripciones; aprende a reconocer los sintomas tipicos de cada problema.

## Errores comunes en el EGEL

1. **Confundir wireframe con mockup.** Wireframe es estructura sin estetica; mockup es estatico con estetica final.
2. **Pensar que responsive y adaptive son lo mismo.** Responsive es una sola hoja que se adapta; adaptive son versiones distintas por dispositivo.
3. **Olvidar que WCAG AA es el minimo legal en la mayoria de paises.** Nivel A no es suficiente para sitios publicos.
4. **Confundir aria-label con title o alt.** alt es para imagenes; aria-label es para elementos interactivos sin texto visible.
5. **Citar las heuristicas de Nielsen incorrectamente.** Hay exactamente 10 heuristicas; revisar bien los enunciados antes del examen.
6. **Pensar que un design system es solo una libreria de componentes.** Tambien incluye tokens, principios, documentacion y procesos.
7. **Atomic design no es estricto.** A veces no hay clara distincion entre molecula y organismo; lo importante es la idea de composicion por niveles.
8. **Touch targets demasiado pequenos.** Minimo 44x44 puntos (Apple) o 48x48 dp (Google) para evitar errores de toque.
9. **Confundir mobile-first con responsive.** Mobile-first es una estrategia de diseno; responsive es la tecnica CSS. Se pueden combinar pero no son lo mismo.
10. **Pensar que la accesibilidad solo beneficia a personas con discapacidad.** Beneficia a todos: subtitulos en lugares ruidosos, alto contraste bajo el sol, navegacion por teclado para usuarios avanzados.
