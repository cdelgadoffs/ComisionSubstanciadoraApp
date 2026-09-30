# Arquitectura de ComisionSubstanciadoraApp

Este documento es el estándar obligatorio de arquitectura para este proyecto. Cualquier trabajo futuro (en este chat o en uno nuevo) debe seguirlo al pie de la letra. Si una instrucción del usuario parece contradecirlo, pregunta antes de romperlo — el patrón se ha defendido activamente a lo largo de muchas sesiones y las excepciones son siempre deliberadas y documentadas, nunca accidentales.

Este proyecto usó antes un esquema de tres capas (`L1`/`L2`/`L3`, con metáfora de restaurante Michelín). Se reemplazó por el esquema de dos capas descrito abajo (`base`/`widgets`) por ser más directo y con una regla de pertenencia mecánica y verificable, en vez de depender de juicio caso por caso.

## Referencia visual: PlenoLOCAL

`C:\Users\jcdelgadomo\Desktop\PlenoLOCAL` es el proyecto original del que esta app deriva. Se usa **únicamente como referencia de solo lectura** para observar diseños visuales y comportamientos ya resueltos (CSS, estructura de componentes, flujos de interacción).

**Regla de oro: nunca se escribe en PlenoLOCAL.** Solo se lee para inspirarse.

Al traer algo de PlenoLOCAL, nunca se copia tal cual su estructura de archivos ni su forma de organizar componentes — siempre se **traduce** a este patrón: se identifica qué parte es átomo/molde puro (`base`), qué parte combina piezas o negocio (`widget`), y qué parte es dato/acción (`context`). PlenoLOCAL no tiene esta separación de capas; esta app sí, y eso no se sacrifica por fidelidad visual.

## Las capas

| Capa | Qué es |
|---|---|
| `Skeleton` | Instancia única y global, siempre presente, el fondo visual. |
| `components/base/` | Átomos y moldes de layout puros. Ver regla mecánica abajo. |
| `components/widgets/` | Todo lo que compone piezas de `base` y/o toca contexto directamente. |
| `context/` | Almacén central de datos y acciones de negocio. |
| `services/` | I/O externo real (IndexedDB, futuro backend). Solo los llama `context/`. |
| `pages/` | Ensambla una vista completa: monta sus propias instancias de `base`/`widgets` + contenido estático trivial. |
| `App.jsx` | Decide qué page se sirve (routing vía `vistaActual`) y monta solo piezas verdaderamente globales que no pertenecen a ninguna page (hoy: `Sidebar4`). |

## La regla mecánica: `base` vs `widgets`

**Si un archivo importa algo más que su propio CSS, es `widget`. Si solo importa su propio CSS (y, como mucho, hooks nativos de React para estado de UI local: `useState`, `useEffect`, `useRef`), es `base`.**

Esto reemplaza cualquier juicio caso por caso. En concreto:

- Importar **otro componente del proyecto** (sea de `base` o de `widgets`) → widget. Ej.: `Topbar` importa `BuscadorGlobal` y `FechaDia` → widget. `SubMenuDD` importa `BotonAgregar` → widget.
- Importar **un hook de contexto** (`useUI`, `useProyecto`, `useAuth`) → widget. Ej.: `BotonSalirSesion` llama `useAuth()` → widget, aunque solo envuelva un único `BotonS`.
- Un componente puede disparar ambas condiciones a la vez (compone Y toca contexto) — sigue siendo widget de todas formas, la regla no se acumula ni se pondera, con que dispare una basta.
- Hooks nativos de React (`useState`, `useEffect`, `useRef`) para estado puramente local de UI **no** cuentan — ej. `FechaDia` usa `useState`/`useEffect` para el reloj y sigue siendo `base`.

### `components/base/`
- Recibe todo por props, incluyendo posicionamiento (`izquierda`, `arriba`, `ancho`, `abierto`) y slots genéricos (`children`, `accionesHeader` en `Sidebar5`, `botonCerrar` en `Sidebar2-5`) sin saber qué se le va a meter ahí.
- **Nunca importa otro componente ni un hook de contexto** — eso es justo lo que lo mantiene `base` (ver regla mecánica).
- Cada componente de `base` tiene su propio archivo CSS en `styles/base/`, que él mismo importa. No existen archivos CSS "compartidos" cargados globalmente desde `App.jsx` — cada uno es autosuficiente y se puede diferenciar de los demás sin tocar nada ajeno. Precedente: `Sidebar1.css` … `Sidebar5.css` son independientes entre sí, aunque visualmente compartan proporciones parecidas (duplicar esas ~10 líneas es preferible a una dependencia cruzada).
- Un símbolo/ícono se vuelve **intrínseco** al componente (hardcodeado dentro de él, ej. un `<button>✕</button>` nativo escrito directamente en el JSX) cuando ese componente/variante tiene un único uso con un único significado en todo el proyecto. Precedente: el botón ✕ de cada Sidebar está escrito directamente en su propio JSX (no se importa un átomo compartido para eso), porque así el Sidebar no deja de ser `base`.
- **"Cada mesa su propio mantel":** un componente de `base` se define una sola vez, pero cada page que lo necesita monta su **propia instancia** — nunca una instancia compartida entre pages. Esto es intencional: si una page no monta cierto componente, solo el fondo (`Skeleton`) debe quedar visible ahí — eso es comportamiento correcto del patrón, no un bug a parchear. La única excepción es `Sidebar4`, que no pertenece a ninguna page y por eso lo monta `App.jsx` (ver más abajo).
- Una capacidad nueva (ej. un modo "expandible" con etiqueta en hover) se agrega a un componente de `base` **solo si es genuinamente reutilizable** por cualquier futuro consumidor — nunca para resolver la necesidad puntual de un solo lugar. Se implementa **opt-in vía prop**, sin cambiar el comportamiento por defecto de los consumidores existentes.

### `components/widgets/`
- Combina piezas de `base` y/o llama a los hooks de contexto directamente — nunca recibe esos datos por props desde una page.
- No es obligatorio que un widget use átomos de `base` para calificar como tal — puede llamar contexto directamente sin componer nada más y ya calificar (ver regla mecánica arriba). Lo que **no** lo hace widget es tener varias piezas internas o estado propio de React si nada de eso importa otro componente ni contexto — eso sigue siendo `base` (precedente: `ListaExpandible` tiene toggle + menú flotante + lógica de posición/cierre, todo autocontenido con `useState`/`useRef`/`useEffect`, y es `base` porque no importa ningún componente ni contexto).
- Cuando un widget necesita iterar una lista de sub-ítems (ej. un menú con N opciones), **la iteración vive en el mismo widget**, sin envolver cada ítem individual en su propio widget — eso sería sobre-abstracción. Precedente: `MenuPrincipalSesion` itera `VISTAS_MENU_PRINCIPAL` y pinta múltiples `BotonSeleccionableMenu` sin un wrapper por ítem; `MenuPanelControl` hace lo mismo con `ITEMS_PANEL_CONTROL`.
- Cuando dos partes de un mismo widget necesitan aparecer en dos regiones visuales distintas del layout (ej. un botón en el header de Sidebar5 y su contenido en el body), y ambas piezas son instancias de componente separadas, el estado que las coordina **se levanta a `UIContext`** (nunca se intenta compartir estado local de React entre instancias distintas).
- Un widget puede **controlar directamente una relación de comportamiento con un componente de `base`** sin necesitar que una page se la pase por props, siempre que la relación sea intrínseca a ese widget. Precedente: `Topbar` llama `useUI()` para obtener `toggleSidebar5` y dispara la apertura de `Sidebar5` él mismo (antes se pasaba `onToggleSidebar` desde cada page — era wiring redundante repetido 4 veces sin razón, porque `Topbar` ya es un widget con acceso legítimo a contexto).
- Si una pieza que antes era un componente separado **solo se usa en un único lugar, con un único significado, y ese lugar ya es un widget con acceso legítimo a context**, se embebe directamente ahí en vez de mantenerla como componente aparte — construida a partir de átomos de `base` + el hook de contexto que necesite. Precedentes: el ☰ de `Topbar` (antes `BotonMenuLateral`) y el botón "Salir" de `Topbar` (antes `BotonSalirSesion`, un `BotonS` + `useAuth().cerrarSesion` envuelto en un componente propio) se eliminaron como componentes independientes y quedaron escritos directamente dentro de `Topbar.jsx`. Esto no aplica si la pieza se reutiliza en más de un lugar o si su consumidor no es ya un widget con esa relación de contexto.
- Cada widget que necesita ajustes de estilo propios tiene su CSS en `styles/widgets/`, que él mismo importa.

### Excepción documentada: `pages/panelcontrol/`
Los archivos en `pages/panelcontrol/*.jsx` (ej. `CalendarizacionMensual.jsx`) **son, por rol, widgets** — llaman al contexto directamente y combinan piezas de `base` + comportamiento — pero viven en esa carpeta (no en `components/widgets/`) porque `MenuPanelControl` (el switcher genérico de Sidebar5) necesita referenciarlos con una forma específica: `export default` = contenido del body, `export function BotonX` = acción del header, ambos desde el mismo archivo.

Esto es una excepción **acotada a esa carpeta**, no una redefinición general de qué es una "page". Las 4 pages reales (`Inicio`, `ProyectoOrdenDia`, `SesionPrevia`, `Historial`) siguen siendo ensambladoras puras — nunca llaman a contexto para construir contenido de negocio, solo montan `base`/`widgets` ya armados. Si en el futuro se agrega otro ítem al panel de control, va en `pages/panelcontrol/OtroItem.jsx` siguiendo el mismo patrón.

Estos archivos "de excepción" **solo son visibles/montables dentro de `Sidebar5`** (300–420px de ancho) — nunca se diseñan pensando en ancho completo de pantalla, y no se les monta contenido pensado para ese contexto (ej. `CintaSesiones`, que es de ancho completo, no pertenece ahí).

### `pages/` — el ensamblador
- Monta instancias de `base`/`widgets` + contenido estático trivial de la vista.
- **No llama a contexto para construir contenido de negocio** — eso es trabajo de un widget. Sí puede leer contexto para pasar valores simples como props a `base` (ej. `sesionActual.titulo` a `Sidebar1`).
- Contenido estático, trivial y único de una sola page (ej. un `<h1>` + texto placeholder) puede quedarse inline en la page sin volverse un widget — no toda page necesita un widget para su contenido si ese contenido no tiene relación de negocio que combinar.
- **Quien monta un componente de `base` es quien wirea sus props estructurales** (`abierto`, `onCerrar`, etc.). Para `Sidebar1/2/3/5` eso son las 4 pages (cada una monta su propia instancia). Para `Sidebar4` es `App.jsx`, porque es la única pieza global que no pertenece a ninguna page. Un widget puede **además** disparar una acción específica de negocio sobre ese mismo estado compartido (ej. `MenuPrincipalSesion` decide cuándo abrir `Sidebar3`) sin que eso le quite a quien monta el componente su responsabilidad de wirear el resto — son dos responsabilidades independientes sobre el mismo estado de `UIContext`.
- **"Sal al gusto":** cuando una page necesita un ajuste de estilo puramente presentacional y de un solo uso sobre un componente reutilizable (ej. un margen para separarlo del borde), se aplica como `style` inline en un wrapper dentro de la page — **nunca** se modifica el CSS del componente compartido (eso filtraría el ajuste a todos los demás consumidores), y tampoco se crea un archivo CSS nuevo solo para una declaración estática (sobre-ingeniería).

### `context/` — la despensa
- Solo aquí vive estado de negocio real y acciones que lo modifican.
- Los context exponen datos (`FECHAS_SESIONES`, `sesionActivaFecha`, etc.) y acciones (`agregarSesiones`, `cargarSesion`, etc.) — nunca lógica de presentación.
- Las acciones que necesitan persistencia llaman a `services/` (ej. `guardarSesiones` de `services/indexedDB.js`) dentro de la misma función de acción del context — el componente que dispara la acción no sabe que existe persistencia.

### `services/` — los proveedores
- I/O externo puro (hoy: IndexedDB nativo, sin librerías). Funciones async simples, sin JSX, sin conocimiento de React.
- Solo los llama `context/`, nunca componentes directamente.

### `utils/` — datos y funciones de referencia puros
- Constantes/funciones **estáticas y reutilizables sin estado**, sin JSX, sin conocimiento de React ni de contexto (ej. `MESES`, formateo de fechas). No es "estado de negocio" (eso es `context/`) ni I/O externo (eso es `services/`) — es la tercera categoría: datos de referencia que cualquier capa puede necesitar.
- **No se duplica el mismo dato/función en dos archivos porque cada uno lo necesita.** Si tanto `context/` como un `widget` necesitan lo mismo (precedente: `MESES` estaba hardcodeado igual en `ProyectoContext.jsx` y en `CintaSesiones.jsx`), se extrae una sola vez a `utils/` y ambos importan de ahí — nunca se decide "cuál de los dos es el dueño", porque ninguno lo es.
- Lo importan tanto `context/` como `components/` (`base/` o `widgets/`) libremente, ya que no tiene ninguna de las restricciones de capa (no es un componente, no toca contexto).

### `App.jsx`
- Decide el routing (`vistaActual` → `PAGES` map) y monta las piezas verdaderamente globales que no pertenecen a ninguna page (hoy solo `Sidebar4`).
- No conoce el estado interno de ninguna page ni de Sidebar5 — esa lógica de cierre/reset vive centralizada en `UIContext` (ver `toggleSidebar5`/`cerrarSidebar5`), nunca duplicada en cada page ni empujada a `App.jsx`.
- Si en el futuro un widget gana una relación propia con `Sidebar4` (ej. algo que lo abra, como ya pasa con `Topbar`→`Sidebar5`), `App.jsx` pierde el control de esa apertura específica, pero conserva el montaje y el cierre — porque sigue siendo la única pieza que `App.jsx` hospeda. "Controlar la apertura" y "montar el componente" son responsabilidades independientes.

## Otras reglas transversales

- **Nombres repetidos entre carpetas no chocan.** `widgets/X.jsx` y `pages/panelcontrol/X.jsx` pueden coexistir con el mismo nombre base — la ruta completa los distingue, y refuerza que cada carpeta tiene una responsabilidad distinta aunque el nombre coincida.
- **CSS con altura fija cuando otros elementos dependen de ella.** Si un componente (ej. `CintaSesiones`) va a ser usado por otros componentes para calcular offsets de posición (`arriba`, `ALTO_*`), su altura debe ser explícita (`height` + `box-sizing: border-box`), nunca auto/dependiente de contenido — de lo contrario cualquier cambio de contenido desalinea todo lo que se posiciona en base a esa constante.
- **Sin sobre-ingeniería.** No crear abstracciones, wrappers, archivos CSS o capas nuevas para necesidades hipotéticas o de un solo uso. Tres líneas parecidas son mejor que una abstracción prematura.
- **Sin comentarios en el código**, salvo que el usuario lo pida explícitamente para un caso puntual.

## Flujo de trabajo de planificación (antes de implementar)

Antes de escribir código para cualquier funcionalidad nueva (no aplica a preguntas conceptuales, ni a fixes triviales ya acordados explícitamente en la misma conversación), primero se explica en texto el flujo de cómo se va a construir:

- Qué capas se van a tocar (`base`, `widgets`, `context`, `services`, `utils`, `pages`) y por qué cada una.
- Qué archivos se crean y cuáles se modifican.
- El orden en que se harán los cambios.

No se escribe ni edita código todavía en ese punto — es una explicación previa, para poder detectar inconsistencias con el patrón antes de escribir una sola línea (mismo criterio ya aplicado informalmente en features anteriores: Calendarización Mensual, FormularioPunto). Se espera confirmación explícita del usuario sobre ese flujo antes de empezar a implementar.

## Flujo de trabajo de verificación

1. `npm run build` primero, siempre.
2. Para verificar UI: `npm install --no-save playwright-core` (confirmar con `ls` que cae en la carpeta correcta del proyecto), dev server con `nohup npm run dev -- --port <N> --strictPort --force &`, y un script `.cjs` con Playwright usando Edge del sistema (`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe` como `executablePath`, ya que el Chromium embebido falla detrás del proxy corporativo).
3. Limpiar siempre al final: borrar el script, los screenshots, `node_modules/playwright-core`, y matar el dev server (`pkill -f "vite.*<puerto>"`).

## Estado actual del flujo de Calendarización Mensual (referencia funcional)

Ya está completo y no requiere más trabajo salvo que se pida explícitamente:

- `base/CalendarioMes.jsx` — grid de mes, selección múltiple de fechas, sin datos de negocio.
- `base/CardS.jsx` — tarjeta oscura de sesión con estados visuales.
- `base/BotonSeleccionablePanel.jsx`, `base/BotonAgregar.jsx` (con modo `etiqueta` expandible), `base/BotonS.jsx` — reutilizados en el flujo.
- `widgets/MenuPanelControl.jsx` — switcher genérico de Sidebar5, con tabla `ITEMS_PANEL_CONTROL`.
- `pages/panelcontrol/CalendarizacionMensual.jsx` — el widget real: por defecto muestra la lista de sesiones agendadas del mes si ya hay alguna, o el calendario si no hay ninguna; el botón "+" del header fuerza el calendario manualmente en cualquier momento.
- `ProyectoContext` — `agregarSesiones(fechas)` agrega un lote de fechas de una vez y recalcula números/estados; persiste en `services/indexedDB.js` en cada cambio y carga al montar.
- Todo esto vive **dentro de Sidebar5 únicamente** — no es una vista/page routeable de ancho completo.

## Estado actual del flujo de FormularioPunto (referencia funcional)

Versión mínima/media completa (sin adjuntos a backend real, sin OneDrive, sin generación de Word/acta — eso no aplica a este proyecto):

- `widgets/FormularioPunto.jsx` — vive en `components/widgets/` (no en `pages/panelcontrol/`), porque `Sidebar3` no tiene un switcher tipo `MenuPanelControl` que lo requiera — se monta directo como `children`, igual que `MenuPrincipalSesion` en `Sidebar1`.
- Se monta **solo en `pages/ProyectoOrdenDia.jsx`** (como `children` de `Sidebar3`), porque es la única page donde el trigger "+" es alcanzable (`MenuPrincipalSesion` solo expande el submenú cuando `vistaActual === 'proyecto'`). Las otras 3 pages (`Inicio`, `SesionPrevia`, `Historial`) **ya no montan `Sidebar3` en absoluto** — antes lo montaban vacío (sin `children`) leyendo el mismo `sidebar3Abierto` de `UIContext`, lo que provocaba que si lo abrías desde `ProyectoOrdenDia` y cambiabas de vista, el sidebar aparecía abierto y vacío en la page nueva. Al no montarlo ahí, simplemente desaparece al cambiar de vista — es el comportamiento correcto de "cada mesa su propio mantel" (si una page no monta un `base`, solo se ve el fondo), no algo que haya que parchear reseteando `sidebar3Abierto` al navegar.
- `UIContext` — nuevo estado `seccionNuevoPunto`/`setSeccionNuevoPunto`, que coordina qué sección quedó seleccionada al hacer clic en el "+" de `SubMenuDD` (en `MenuPrincipalSesion`) con el formulario que se abre en `Sidebar3` — mismo patrón de "dos widgets distintos coordinados vía `UIContext`" ya usado para `sidebar5Abierto`/`accionesHeader`.
- `ProyectoContext` — nuevo estado `puntos`/`agregarPunto(datos)`, persistido en `services/indexedDB.js` (nuevo object store `puntos`, `DB_VERSION` subido a 2). `SECCIONES_DOCUMENTO` y el badge de `VISTAS_MENU_PRINCIPAL` (`proyecto`) ahora se recalculan dentro del Provider a partir de `puntos` — mismo patrón reactivo que `sesionFinalizada`.
- `base/BotonS.jsx` ganó un prop `variant` (`'oscuro'` por defecto, `'claro'` nuevo) y `disabled` — opt-in, sin cambiar el aspecto de los consumidores existentes (`Topbar`, `CalendarizacionMensual`, `Quorum`, todos en fondos oscuros). `FormularioPunto` es el primer consumidor en fondo claro (`Sidebar3`).
- Remitentes (`Pleno`, `Presidencia`, `Secretaría General`) están **hardcodeados directamente en el widget** — son un placeholder genérico, no el organigrama real de la organización; reemplazar cuando se tenga ese dato.
- `base/BotonIcono.jsx` — nuevo átomo genérico (botón cuadrado con un ícono, prop `icono` = clase CSS del ícono). Usa **Remix Icon** vía CDN (`cdn.jsdelivr.net/npm/remixicon`), cargado una sola vez en `index.html` (no por componente, igual que una fuente global) — es el ícono estándar del proyecto para botones de acción; no mezclar con otras librerías de íconos.
- `Sidebar3` **se queda abierto tras "Añadir"** — solo `Cancelar` y el ✕ lo cierran. El formulario se resetea a vacío (misma sección) después de agregar, y **cambia de sección automáticamente y sin cerrar** si se hace clic en el "+" de otra sección mientras ya está abierto (el `useEffect` de `FormularioPunto` escucha tanto `sidebar3Abierto` como `seccionNuevoPunto`). Cada cambio de sección fuerza un remount vía `key={form.seccion}` en el contenedor raíz del widget, lo que dispara una animación CSS de entrada (`@keyframes` en `FormularioPunto.css`) — precedente idéntico al `key={seccionActual}` + `.ter-form { animation }` de PlenoLOCAL.

## Estado actual de los badges de sesión (referencia funcional)

- Cada sesión en `fechasSesiones` (context) tiene un campo propio `celebrada: boolean`, persistido en `services/indexedDB.js` junto al resto del registro.
- `recalcularSesiones` (en `ProyectoContext.jsx`) deriva 4 estados visuales a partir de eso: `celebrada` (verde) si `celebrada === true`; `proxima` (azul) si es la fecha futura/hoy más cercana entre las no celebradas; `no-celebrada` (rojo) si ya pasó sin celebrarse; `pendiente` (gris) para el resto de futuras. Los 4 colores y el hover/`activa` más grande ya existían en `base/FechasSesiones.css` desde antes — este trabajo fue solo de `context/`, no tocó `base/` ni su CSS.
- `agregarSesiones(fechas)` fusiona fechas nuevas con las existentes preservando su `celebrada` (nunca lo resetea al agregar más fechas al mismo mes).
- `finalizarSesion()` marca `celebrada = true` en la sesión que sea `sesionActivaFecha` en ese momento (no un booleano genérico) y recalcula estados. `sesionFinalizada` (usado por el label del menú "Celebrar sesión"/"Sesión celebrada") se deriva de `sesionSeleccionada?.celebrada`, ya no es un `useState` aparte.
- La selección automática de "la más próxima por defecto" y la restricción de "no mostrar una próxima falsa si el mes filtrado no la tiene" no requirieron código adicional: `proxima` es un cálculo global sobre todas las fechas, y el filtro de mes en `CintaSesiones` es solo visual — si la próxima real cae en otro mes, el mes filtrado simplemente no muestra ningún azul.
- **Pendiente real:** `finalizarSesion()` existe en `context/` pero **ninguna page la llama todavía** — no hay un botón "Celebrar sesión" conectado. Eso es trabajo futuro, no iniciar sin que se pida.
- `numeroSesion` (el consecutivo oficial) solo avanza en sesiones con estado `celebrada` o `proxima` — una sesión `no-celebrada` no consume número, conserva el mismo consecutivo que la última sesión válida antes de ella. Se calcula dentro del mismo `recalcularSesiones`.
- `widgets/CintaSesiones.jsx` tiene dos `base/BotonIcono` (flechas `ri-arrow-left-s-line`/`ri-arrow-right-s-line`, iguales a los `◀`/`▶` de PlenoLOCAL) agrupados en `.widget-cinta-sesiones-nav` (su propio `gap` de 4px) antes del `ListaExpandible` de mes, para navegar mes a mes con aritmética de año/mes — navega libremente aunque el mes destino no tenga sesiones (mismo comportamiento que PlenoLOCAL). Es estado local del propio widget (`mesSeleccionadoManual`), sin tocar `context/` ni `base/BotonIcono.jsx`.
- Un tercer `BotonIcono` (`ri-arrow-go-back-line`, "volver a la próxima sesión") vive en ese mismo grupo **solo cuando el mes filtrado no es el de la sesión global con estado `proxima`** (precedente: `mostrarBotonIrActual`/`irASesionActual` de PlenoLOCAL) — al hacer clic, filtra al mes de la próxima y además la carga como `sesionActivaFecha` vía `cargarSesion`. Se renderiza condicionalmente (`{mostrarVolverProxima && (...)}`), no permanece montado.
- **Pendiente conocido, explícitamente revertido:** los badges de `FechasSesiones` se desplazan unos píxeles al cambiar de mes (el ancho de `ListaExpandible` varía con la longitud del nombre del mes — "Septiembre 2026" vs "Octubre 2026" — y arrastra todo lo que sigue). Se intentaron dos fixes (reservar el espacio del botón "volver" con `visibility: hidden`, y un `min-width` fijo en el toggle de mes); ambos se descartaron porque dejaban demasiado espacio en blanco visualmente. **No reintentar estos dos enfoques** sin proponer antes una alternativa distinta — no iniciar sin que se pida.

## Pendientes conocidos (no iniciar sin que se pida)

- Autenticación real con MSAL (`AuthContext`, `LoginGate`, `BloqueadoGate`) — pausado hasta tener `clientId`/`authority` de un App Registration propio para esta app.
- Sistema de permisos/roles que alimentaría `BloqueadoGate` — de momento no existe; cualquier cuenta autenticada pasaría.
- `catalogs/`, `hooks/` — carpetas existentes pero vacías. `utils/` ya tiene contenido (`meses.js`).
- `Sidebar2` — construido pero "parqueado" (usado hoy solo en `Historial.jsx`).
- `Sidebar4` — montado desde `App.jsx` pero sin ningún trigger de apertura conectado todavía (solo existe el cierre); no iniciar esa conexión sin que se pida.
