# Arquitectura de ComisionSubstanciadoraApp

Este documento es el estándar obligatorio de arquitectura para este proyecto. Cualquier trabajo futuro (en este chat o en uno nuevo) debe seguirlo al pie de la letra. Si una instrucción del usuario parece contradecirlo, pregunta antes de romperlo — el patrón se ha defendido activamente a lo largo de muchas sesiones y las excepciones son siempre deliberadas y documentadas, nunca accidentales.

El estándar general, independiente de esta app, vive en `EstandarNodos.md`. Este documento es su aplicación a este proyecto, con precedentes concretos y el estado actual de cada flujo.

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
| `services/` | I/O externo: el API (intercambiable `LocalAPI`/`ServerConnection`) y el almacenamiento del cliente (`SesionIndexedDB`). Solo los llama `context/`. Ver "Arquitectura de datos". |
| `pages/` | Ensambla una vista completa: monta sus propias instancias de `base`/`widgets` + contenido estático trivial. |
| `App.jsx` | Decide qué page se sirve (routing vía `vistaActual`) y monta solo piezas verdaderamente globales que no pertenecen a ninguna page (hoy: `Sidebar4`). |

## La regla mecánica: `base` vs `widgets`

**Un archivo es `base` solo si lo único que importa es: (1) su propio CSS, (2) React (hooks nativos como `useState`, `useEffect`, `useRef`) y (3) hooks propios puros de `hooks/` (sin JSX, sin contexto, sin importar componentes). Si importa cualquier otra cosa — otro componente, un hook de contexto, `utils/`, `services/` — es `widget`.**

Esto reemplaza cualquier juicio caso por caso. En concreto:

- Importar **otro componente del proyecto** (sea de `base` o de `widgets`) → widget. Ej.: `Topbar` importa `BuscadorGlobal` y `FechaDia` → widget. `SubMenuDD` importa `BotonAgregar` → widget.
- Importar **un hook de contexto** (`useUI`, `useProyecto`, `useAuth`) → widget. Ej.: `BotonSalirSesion` llama `useAuth()` → widget, aunque solo envuelva un único `BotonS`.
- Un componente puede disparar ambas condiciones a la vez (compone Y toca contexto) — sigue siendo widget de todas formas, la regla no se acumula ni se pondera, con que dispare una basta.
- Hooks nativos de React (`useState`, `useEffect`, `useRef`) para estado puramente local de UI **no** cuentan — ej. `FechaDia` usa `useState`/`useEffect` para el reloj y sigue siendo `base`.
- Los hooks propios **puros** de `hooks/` tampoco cuentan — ej. `Sidebar1`, `PanelPrincipal` y `Sidebar5` importan `useScrollbarPersonalizada` y siguen siendo `base`. Un hook de `hooks/` es puro solo si únicamente importa React: en cuanto importe un contexto o un componente deja de serlo, y quien lo use pasa a ser `widget`.

### `components/base/`
- Recibe todo por props, incluyendo posicionamiento (`izquierda`, `arriba`, `ancho`, `abierto`) y slots genéricos (`children`, `accionesHeader` en `Sidebar5`, `botonCerrar` en `Sidebar2-5`) sin saber qué se le va a meter ahí.
- **Nunca importa otro componente ni un hook de contexto** — eso es justo lo que lo mantiene `base` (ver regla mecánica). Lo único permitido fuera de su CSS es React y los hooks puros de `hooks/`.
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
- Solo aquí vive el estado de negocio **en el cliente** (un espejo de lo que dice el API) y las acciones que lo mueven. Las **reglas** de negocio no viven aquí: viven del otro lado del puente (ver "Arquitectura de datos").
- Los context exponen datos (`FECHAS_SESIONES`, `sesionActivaFecha`, `SECCIONES_DOCUMENTO`, etc.) y acciones (`agregarSesiones`, `cargarSesion`, etc.) — nunca lógica de presentación: ni tablas de menú, ni textos de interfaz, ni conteos para mostrar (el badge por sección se cuenta en el widget que lo pinta, a partir de `PUNTOS`).
- Los context **de negocio** son los puentes hacia `services/`; `UIContext` **no** lo es (solo estado de interfaz, jamás llama a `services/`).
- Las acciones son asíncronas: llaman a `services/api.js`, esperan la respuesta y actualizan el estado con **lo que el API devolvió**, nunca con lo que el cliente supone. Las acciones que pueden fallar lanzan el error hacia el componente que las disparó (el widget decide cómo mostrarlo); el context lleva el estado de carga y de error **por recurso** (catálogos, sesiones, puntos) y expone `cargando` (alguno en curso) y `error` (el primer fallo activo, con `mensaje`).
- Nunca se llama a `services/` desde dentro de un updater de `setState` (efecto secundario dentro de una función pura — se ejecuta doble en StrictMode).

### `services/` — los proveedores
- I/O externo puro. Funciones async simples, sin JSX, sin conocimiento de React.
- Solo los llama `context/`, nunca componentes directamente.
- Estructura, nombres y responsabilidades en la sección "Arquitectura de datos" (abajo).

## Arquitectura de datos: cliente / API intercambiable

Estándar para todo proyecto de este tipo. Se desarrolla como **prototipo 100% front**, con un API simulado que se comporta como un servidor real, para que el usuario pruebe y se hagan ajustes antes de conectar. Al conectar, **no cambia nada fuera de `services/` y de la configuración**.

```
context/ (puente)  ──▶  services/api.js  ──▶  LocalAPI/          (prototipo: servidor simulado + su propia IndexedDB "LocalAPI")
                    │                    └──▶  ServerConnection/  (producción: fetch al backend real)
                    └─▶  services/SesionIndexedDB.js              (cliente, permanente en ambos modos)
```

### Quién controla qué
- **API (fuente de verdad)** — todo lo que debe ser seguro, íntegro u oficial: identidad y roles, permisos, **confidencialidad** (el servidor no envía lo que el usuario no puede ver), validación de datos, estados derivados del reloj del servidor (`proxima`, `no-celebrada`), consecutivos oficiales (`numeroSesion`), unicidad (una sesión por fecha), transiciones de estado (celebrar es una operación atómica), inmutabilidad tras celebrar, IDs/timestamps/autoría, control de versiones (`version`), archivos, auditoría.
- **Catálogos de dominio** (secciones, remitentes, etc.) — son **datos del API, no código**: el API ofrece un mecanismo genérico (`listarCatalogos()`) y cada proyecto carga sus propias filas (semilla), con atributos que llevan las reglas (ej. `requiereAcuerdo`). Así el API valida y aplica reglas sin conocer el proyecto, y es reutilizable. El cliente los lee vía context y los usa para pintar y para su validación de UX; **nunca** los hardcodea ni los duplica.
- **Cliente** — la **estructura de la interfaz** (tablas de menú, textos, íconos) vive en el **widget** que la pinta (precedente: `ITEMS_PANEL_CONTROL` en `MenuPanelControl`, `VISTAS_MENU_PRINCIPAL` en `MenuPrincipalSesion`), nunca en el context ni en el API. Además: todo `UIContext`, borradores de formularios, validación de UX (deshabilitar "Añadir", mensajes inline — **duplica** la del servidor, nunca la reemplaza), presentación derivada (formato de etiquetas, agrupar por sección, contar badges, filtrar por mes), qué sesión está activa en pantalla, navegación.
- **Regla de decisión:** si una regla "valida" o "calcula" algo oficial, va en el API. Si aparece en un context o un componente, es una señal de que está del lado equivocado del puente. Los datos **derivados** (estados, consecutivos) nunca se persisten: se calculan al leer.

### Estructura de `services/`
| Archivo / carpeta | Rol | ¿Sobrevive a la conexión real? |
|---|---|---|
| `api.js` | Único punto de entrada para `context/`. Elige la implementación según `VITE_API_MODE` y re-exporta las mismas operaciones. | Sí |
| `ApiError.js` | Forma única de error (`{ codigo, mensaje }`) que ambas implementaciones lanzan. | Sí |
| `LocalAPI/` | Servidor simulado: `index.js` (operaciones), `reglas.js` (validaciones, estados, permisos, usuario simulado), `semilla.js` (filas iniciales de los catálogos del proyecto), `db.js` (su propia IndexedDB, nombre `LocalAPI`). | **No** — se borra la carpeta completa al conectar |
| `ServerConnection/` | Cliente del backend real. Mismas firmas que `LocalAPI`. | Sí (es el real) |
| `SesionIndexedDB.js` | IndexedDB **del cliente** (nombre `SesionIndexedDB`): `borradores` (formularios sin confirmar), `cache` (última copia conocida para abrir rápido) y a futuro `cola` (escritura offline). **Nunca es fuente de verdad**: si discrepa del servidor, gana el servidor. | Sí, siempre |

- **Dos bases distintas, dos roles**: `SesionIndexedDB` es del producto final; `LocalAPI` es el servidor de mentira. No se mezclan nunca.
- **Interruptor**: `.env.development` → `VITE_API_MODE=local`; `.env.production` → `VITE_API_MODE=real` (+ `VITE_API_URL`). Se decide **al compilar** (Vite reemplaza la variable y el build de producción no incluye `LocalAPI`). Todo lo `VITE_*` queda visible en el bundle: nunca poner secretos ahí.
- **Contrato**: `docs/CONTRATO_API.md` — firmas, modelo de datos, errores y reglas. Es lo que se congela y lo que el backend implementa; `LocalAPI` y `ServerConnection` son gemelos que lo cumplen. Cualquier cambio de contrato se hace primero en ese documento.
- **`LocalAPI` debe comportarse como un servidor**, no como un almacén: las reglas viven en `LocalAPI/reglas.js`, nunca en el context ni en componentes; operaciones atómicas (nunca "guardar todo"); todo async y puede fallar con `ApiError`.
- **Límites del modo local**: la seguridad real y el multiusuario no se pueden probar ahí (todo está en el navegador). Sirve para validar flujo y contrato.

### Estado de sincronización (`IndicadorSync`)
- Cada dato que el context entrega lleva `sincronizacion`: `'servidor'` | `'local'` | `'error'`. **Lo pone el cliente** (el context/la cola), no el API. Hoy todo es `'servidor'`; `'local'` aparecerá con la cola offline.
- `base/IndicadorSync.jsx` es el átomo que lo pinta (ícono + tooltip intrínsecos); los widgets lo montan.

### Borradores
- Un widget con formulario guarda su borrador **vía el context** (`guardarBorrador`/`obtenerBorrador`/`eliminarBorrador`), nunca llamando a `SesionIndexedDB` directo (es un widget; solo `context/` toca `services/`).
- Clave por contexto de uso (ej. `formularioPunto:<seccion>`); se guarda con debounce, se restaura al abrir y se elimina cuando el formulario queda vacío (tras añadir o borrar). Hasta que termina la restauración no se guarda nada, para no pisar el borrador existente.

### `utils/` — datos y funciones de referencia puros
- Constantes/funciones **estáticas y reutilizables sin estado**, sin JSX, sin conocimiento de React ni de contexto (ej. `MESES`, formateo de fechas). No es "estado de negocio" (eso es `context/`) ni I/O externo (eso es `services/`) — es la tercera categoría: datos de referencia que cualquier capa puede necesitar.
- **No se duplica el mismo dato/función en dos archivos porque cada uno lo necesita.** Si tanto `context/` como un `widget` necesitan lo mismo (precedente: `MESES` estaba hardcodeado igual en `ProyectoContext.jsx` y en `CintaSesiones.jsx`), se extrae una sola vez a `utils/` y ambos importan de ahí — nunca se decide "cuál de los dos es el dueño", porque ninguno lo es.
- Lo importan `context/` y `components/widgets/` libremente. `components/base/` **no** lo importa (sus únicas dependencias permitidas son CSS, React y hooks puros — ver regla mecánica): si un `base` necesitara un dato o función de `utils/`, o se le pasa por props, o ese componente es en realidad un `widget`.

### `hooks/` — comportamiento reutilizable con React
- Hooks propios que encapsulan **lógica con estado/efectos/refs** reutilizable por varios consumidores (precedente: `useScrollbarPersonalizada`), sin JSX.
- **Puros:** solo importan React. Nunca importan un contexto, un componente, `utils/` ni `services/`. Por eso los puede importar tanto `base/` como `widgets/` sin cambiar la clasificación de nadie.
- Comparten la **lógica**, no el marcado: cada consumidor pone su propio JSX y CSS (ver "Scrollbars minimalistas"). Un hook que necesite contexto no va aquí: es lógica de un widget y vive en él.
- No es `utils/` (que no tiene React ni estado) ni `context/` (estado de negocio compartido): un hook tiene estado propio **por instancia**.

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
- `ProyectoContext` — `agregarSesiones(fechas)` (asíncrona) manda el lote de fechas al API (`crearSesiones`) y reemplaza la lista con lo que éste devuelve (números/estados ya calculados por el servidor); carga al montar desde `SesionIndexedDB` (caché) y luego desde el API.
- Todo esto vive **dentro de Sidebar5 únicamente** — no es una vista/page routeable de ancho completo.

## Estado actual del flujo de FormularioPunto (referencia funcional)

Versión mínima/media completa (sin adjuntos a backend real, sin OneDrive, sin generación de Word/acta — eso no aplica a este proyecto):

- `widgets/FormularioPunto.jsx` — vive en `components/widgets/` (no en `pages/panelcontrol/`), porque `Sidebar3` no tiene un switcher tipo `MenuPanelControl` que lo requiera — se monta directo como `children`, igual que `MenuPrincipalSesion` en `Sidebar1`.
- Se monta **solo en `pages/ProyectoOrdenDia.jsx`** (como `children` de `Sidebar3`), porque es la única page donde el trigger "+" es alcanzable (`MenuPrincipalSesion` solo expande el submenú cuando `vistaActual === 'proyecto'`). Las otras 3 pages (`Inicio`, `SesionPrevia`, `Historial`) **ya no montan `Sidebar3` en absoluto** — antes lo montaban vacío (sin `children`) leyendo el mismo `sidebar3Abierto` de `UIContext`, lo que provocaba que si lo abrías desde `ProyectoOrdenDia` y cambiabas de vista, el sidebar aparecía abierto y vacío en la page nueva. Al no montarlo ahí, simplemente desaparece al cambiar de vista — es el comportamiento correcto de "cada mesa su propio mantel" (si una page no monta un `base`, solo se ve el fondo), no algo que haya que parchear reseteando `sidebar3Abierto` al navegar.
- `UIContext` — nuevo estado `seccionNuevoPunto`/`setSeccionNuevoPunto`, que coordina qué sección quedó seleccionada al hacer clic en el "+" de `SubMenuDD` (en `MenuPrincipalSesion`) con el formulario que se abre en `Sidebar3` — mismo patrón de "dos widgets distintos coordinados vía `UIContext`" ya usado para `sidebar5Abierto`/`accionesHeader`. **Solo el botón "+" (`onAgregar`) puede abrir `Sidebar3`** (`setSidebar3Abierto(true)`) — hacer clic en la fila del ítem (`onSeleccionar`, fuera del botón) nunca lo abre. Se intentó en algún momento que la fila también abriera el sidebar, pero se revirtió explícitamente: esa relación es exclusiva del botón "+".
- Con `Sidebar3` **ya abierto**, la fila sí puede refrescar la sección visible (`seleccionarSeccion` en `MenuPrincipalSesion` llama `setSeccionNuevoPunto(seccionId)` **solo si `sidebar3Abierto` es `true`**) — si está cerrado, la fila únicamente actualiza el resaltado local (`seccionActiva`), sin tocar `seccionNuevoPunto` ni el sidebar. `base/BotonAgregar.jsx` ya hace `stopPropagation()` en su `onClick`, así que el clic en "+" nunca dispara también el `onSeleccionar` de la fila que lo contiene.
- `ProyectoContext` — estado `puntos`/`agregarPunto(datos)` (asíncrona, llama a `crearPunto(sesionActivaFecha, datos)` del API). Los puntos **pertenecen a una sesión** (`sesionId`): `PUNTOS` es siempre la lista de la `sesionActivaFecha`, y sin sesión activa el API rechaza crear (el formulario muestra el error). El badge del total de puntos y el de cada sección se cuentan en `MenuPrincipalSesion` a partir de `PUNTOS` (no en el context).
- `base/BotonS.jsx` ganó un prop `variant` (`'oscuro'` por defecto, `'claro'` nuevo) y `disabled` — opt-in, sin cambiar el aspecto de los consumidores existentes (`Topbar`, `CalendarizacionMensual`, `Quorum`, todos en fondos oscuros). `FormularioPunto` es el primer consumidor en fondo claro (`Sidebar3`).
- Secciones y remitentes vienen del catálogo del API (ver "Estado actual de la capa de datos"), no están escritos en el widget. Los remitentes actuales (`Pleno`, `Presidencia`, `Secretaría General`) son un placeholder genérico, no el organigrama real de la organización; se reemplazan editando los datos iniciales de `LocalAPI` cuando se tenga ese dato.
- `base/BotonIcono.jsx` — nuevo átomo genérico (botón cuadrado con un ícono, prop `icono` = clase CSS del ícono). Usa **Remix Icon** vía CDN (`cdn.jsdelivr.net/npm/remixicon`), cargado una sola vez en `index.html` (no por componente, igual que una fuente global) — es el ícono estándar del proyecto para botones de acción; no mezclar con otras librerías de íconos.
- `Sidebar3` **se queda abierto tras "Añadir"** — solo `Cancelar` y el ✕ lo cierran. El formulario se resetea a vacío (misma sección) después de agregar, y **cambia de sección automáticamente y sin cerrar** si se hace clic en el "+" de otra sección mientras ya está abierto (el `useEffect` de `FormularioPunto` escucha tanto `sidebar3Abierto` como `seccionNuevoPunto`). Cada cambio de sección fuerza un remount vía `key={form.seccion}` en el contenedor raíz del widget, lo que dispara una animación CSS de entrada (`@keyframes` en `FormularioPunto.css`) — precedente idéntico al `key={seccionActual}` + `.ter-form { animation }` de PlenoLOCAL.

## Estado actual de los badges de sesión (referencia funcional)

- Cada sesión en `fechasSesiones` (context) tiene un campo propio `celebrada: boolean`, persistido por el API (`LocalAPI`) junto al resto del registro — es lo único que se guarda; el `estado` nunca se persiste.
- `calcularEstados` (en `services/LocalAPI/reglas.js`, es decir, **del lado del API**, no del context) deriva 4 estados visuales a partir de eso, cada vez que se lista, con el reloj del servidor: `celebrada` (verde) si `celebrada === true`; `proxima` (azul) si es la fecha futura/hoy más cercana entre las no celebradas; `no-celebrada` (rojo) si ya pasó sin celebrarse; `pendiente` (gris) para el resto de futuras. Los 4 colores y el hover/`activa` más grande ya existían en `base/FechasSesiones.css` desde antes — este trabajo no tocó `base/` ni su CSS. El `label` ("4 de Octubre") es presentación: lo agrega el context con `utils/fechas.js` (`etiquetaFecha`), no viene del API.
- `crearSesiones(fechas)` (API) es idempotente: fusiona fechas nuevas con las existentes preservando su `celebrada` (nunca lo resetea al agregar más fechas al mismo mes).
- `finalizarSesion()` (context, asíncrona) llama a `celebrarSesion(sesionActivaFecha)` del API — operación atómica que rechaza si ya estaba celebrada — y vuelve a listar para traer los estados recalculados. Una sesión celebrada **no admite** crear/editar/eliminar puntos (error `SESION_CELEBRADA`). `sesionFinalizada` (usado por el label del menú "Celebrar sesión"/"Sesión celebrada") se deriva de `sesionSeleccionada?.celebrada`, ya no es un `useState` aparte.
- La selección automática de "la más próxima por defecto" y la restricción de "no mostrar una próxima falsa si el mes filtrado no la tiene" no requirieron código adicional: `proxima` es un cálculo global sobre todas las fechas, y el filtro de mes en `CintaSesiones` es solo visual — si la próxima real cae en otro mes, el mes filtrado simplemente no muestra ningún azul.
- **Pendiente real:** `finalizarSesion()` existe en `context/` pero **ninguna page la llama todavía** — no hay un botón "Celebrar sesión" conectado. Eso es trabajo futuro, no iniciar sin que se pida.
- `numeroSesion` (el consecutivo oficial) solo avanza en sesiones con estado `celebrada` o `proxima` — una sesión `no-celebrada` no consume número, conserva el mismo consecutivo que la última sesión válida antes de ella. Se calcula dentro del mismo `calcularEstados` (API).
- `widgets/CintaSesiones.jsx` tiene dos `base/BotonIcono` (flechas `ri-arrow-left-s-line`/`ri-arrow-right-s-line`, iguales a los `◀`/`▶` de PlenoLOCAL) agrupados en `.widget-cinta-sesiones-nav` (su propio `gap` de 4px) antes del `ListaExpandible` de mes, para navegar mes a mes con aritmética de año/mes — navega libremente aunque el mes destino no tenga sesiones (mismo comportamiento que PlenoLOCAL). Es estado local del propio widget (`mesSeleccionadoManual`), sin tocar `context/` ni `base/BotonIcono.jsx`.
- Un tercer `BotonIcono` (`ri-arrow-go-back-line`, "volver a la próxima sesión") vive en ese mismo grupo **solo cuando el mes filtrado no es el de la sesión global con estado `proxima`** (precedente: `mostrarBotonIrActual`/`irASesionActual` de PlenoLOCAL) — al hacer clic, filtra al mes de la próxima y además la carga como `sesionActivaFecha` vía `cargarSesion`. Se renderiza condicionalmente (`{mostrarVolverProxima && (...)}`), no permanece montado.
- **Pendiente conocido, explícitamente revertido:** los badges de `FechasSesiones` se desplazan unos píxeles al cambiar de mes (el ancho de `ListaExpandible` varía con la longitud del nombre del mes — "Septiembre 2026" vs "Octubre 2026" — y arrastra todo lo que sigue). Se intentaron dos fixes (reservar el espacio del botón "volver" con `visibility: hidden`, y un `min-width` fijo en el toggle de mes); ambos se descartaron porque dejaban demasiado espacio en blanco visualmente. **No reintentar estos dos enfoques** sin proponer antes una alternativa distinta — no iniciar sin que se pida.

## Estado actual de la lista de puntos del proyecto (referencia funcional)

- `widgets/ListaPuntosProyecto.jsx` — nuevo widget, montado dentro de `PanelPrincipal` en `pages/ProyectoOrdenDia.jsx` (reemplazó el placeholder `<h1>`/`<p>`). Lee `PUNTOS`/`SECCIONES_DOCUMENTO` de `useProyecto()` y arma una tarjeta por punto reutilizando `base/Card` — diseño inspirado en `TarjetaPunto`/`.punto-tabla` de PlenoLOCAL (header con título + badge de remitente, fila de contenido, fila de acuerdo si no es informe, archivos adjuntos), pero simplificado: sin mover/editar/eliminar/adjuntar, porque esas acciones no existen todavía en nuestro modelo de datos (`ProyectoContext` solo tiene `agregarPunto`). CSS propio en `styles/widgets/ListaPuntosProyecto.css`.
- Tiene dos modos, combinados vía `UIContext`: `vistaCompletaProyecto` (`false` por defecto) filtra a una sola sección (`seccionActivaProyecto`); `true` muestra **todas** las secciones agrupadas con separador, igual que el modo "vista completa" de PlenoLOCAL (`panelVistaCompleta`).
- `seccionActivaProyecto`/`setSeccionActivaProyecto` **se subió de `useState` local en `MenuPrincipalSesion` a `UIContext`** — antes solo controlaba el resaltado de la fila en el submenú; ahora también lo lee `ListaPuntosProyecto` para saber qué sección mostrar en modo filtrado. Mismo patrón que `seccionNuevoPunto`.
- El botón que alterna el modo (`base/BotonIcono`, ícono dinámico `ri-list-unordered`/`ri-stack-line`) vive en el nuevo slot `accionesHeader` de `base/Sidebar1.jsx` (mismo patrón exacto que el `accionesHeader` de `Sidebar5`, opt-in, sin romper a otros consumidores de `Sidebar1`). **Lo monta y controla directamente `pages/ProyectoOrdenDia.jsx`** — la page lee/escribe `vistaCompletaProyecto` de `useUI()` igual que ya hace con `sidebar3Abierto`/`onCerrar`; no es una relación de un widget, es la page ensamblando su propio header porque el toggle es un detalle de esa vista específica, no de `MenuPrincipalSesion`.
- **Fix de corte de tarjetas contra `Topbar`/`CintaSesiones`:** `base/PanelPrincipal.css` tenía `align-items: center` + `overflow: auto` — el bug clásico de flexbox donde, si el contenido centrado es más alto que el contenedor, la mitad que queda "detrás" del punto de centrado no es alcanzable con scroll (se ve cortada). Fix: `align-items: safe center` y `justify-content: safe center` (centra igual cuando el contenido cabe, cae a alineación "start" cuando desborda) — cambio dentro del propio `base/PanelPrincipal.css`, sin prop nueva, compatible con los 4 consumidores actuales.
- `widgets/ListaPuntosProyecto.css` usa `width: 100%` **sin `max-width` fijo** — las tarjetas se autoajustan al ancho real de `PanelPrincipal` (que ya cambia dinámicamente según `Sidebar3`/`Sidebar5`), con `padding: 24px 32px` en el contenedor para que no queden pegadas a los bordes. Se probó un `max-width` en px (900, luego 1050) y se descartó a propósito por no ser dinámico.

## Scrollbars minimalistas

- `base/Scrollbar.jsx` — nuevo átomo (`<div className="base-scrollbar">{children}</div>`, `overflow-y: auto`, estilo delgado/discreto en `styles/base/Scrollbar.css`). **Solo lo importan `pages/` o `widgets/`**, nunca otro `base/*` — si un `base` existente lo importara, se volvería `widget` por la regla mecánica, así que es exclusivamente para contenido scrollable nuevo que se ensambla desde una page o un widget.
- **`index.css`** (`html`/`body`) tiene `overflow: hidden` — sin esto, el navegador agregaba su propia scrollbar de página completa por encima de las de cada panel, porque el shell de esta SPA es 100% `position: fixed` y cada panel maneja su propio scroll interno; el `body` nunca debe scrollear por sí mismo.
- **La personalización de `::-webkit-scrollbar` (ancho/color) se descartó** porque Windows tiene una opción de accesibilidad ("Mostrar siempre las barras de desplazamiento") que, si está activada, fuerza a Chromium/Edge a dibujar la scrollbar nativa del sistema (gruesa, con flechas) **ignorando** esas reglas CSS por completo. La única forma de garantizar el look minimalista sin depender de esa configuración del usuario es no confiar en la scrollbar nativa en absoluto.
- **`hooks/useScrollbarPersonalizada.js`** (primer contenido real de `hooks/`) — scrollbar 100% construida por la app: oculta la nativa de verdad (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`, que sí funcionan siempre, a diferencia de solo *personalizarla*) y dibuja un thumb propio (`div` absoluto) sincronizado por `onScroll`, `ResizeObserver` (cambios de tamaño del contenedor) y `MutationObserver` (cambios de contenido interno, ej. cuando `PUNTOS` carga async desde IndexedDB y el `ResizeObserver` no lo detecta porque el contenedor en sí no cambia de tamaño). Soporta arrastrar el thumb con el mouse. Se extrajo a `hooks/` desde el primer momento (no se esperó a un "segundo consumidor") porque nació con 4 consumidores simultáneos: `Sidebar1`, `PanelPrincipal`, `Sidebar5` (todos `base`, usan el hook directo, nunca importan `Scrollbar.jsx` porque eso los volvería `widget`) y `FormularioPunto` (`widget`, podría importar `Scrollbar.jsx` pero usa el hook directo igual, para no añadir un wrapper extra sobre su `key={form.seccion}`/animación ya existentes).
- El thumb en fondo claro usa `rgba(0,0,0,0.15)`; en `Sidebar5` (fondo oscuro) usa `rgba(255,255,255,0.2)` — mismo patrón, clase con nombre distinto (`base-sidebar5-scrollbar-thumb`) para no chocar con el resto.
- `base/Scrollbar.jsx` (el wrapper genérico) sigue existiendo para contenido scrollable **nuevo** que una page/widget quiera montar desde cero — los 4 contenedores que ya scrolleaban antes de este trabajo no lo importan, duplican el patrón (misma lógica del hook, JSX propio) para no romper su clasificación de capa ni su layout ya afinado.

## Estado actual de la capa de datos (referencia funcional)

Implementa la sección "Arquitectura de datos" tal cual. Contrato completo en `docs/CONTRATO_API.md`.

- Modo actual: `VITE_API_MODE=local` en desarrollo (`LocalAPI`); `ServerConnection` existe como esqueleto: todas sus operaciones rechazan con `NO_IMPLEMENTADO` hasta que haya backend.
- Operaciones del contrato v1: `listarCatalogos`, `listarSesiones`, `crearSesiones`, `celebrarSesion`, `listarPuntos(sesionId)`, `crearPunto(sesionId, datos)`, `editarPunto(id, version, cambios)`, `eliminarPunto(id)`. **`editarPunto` y `eliminarPunto` existen en el API pero ninguna UI las usa todavía** (ni el context las expone) — trabajo futuro, no iniciar sin que se pida.
- Usuario simulado fijo en `LocalAPI/reglas.js` con rol `capturista` (único con escritura; solo él ve puntos confidenciales). Un selector de rol para pruebas no existe aún.
- `ProyectoContext` carga **caché primero, servidor después** (gana siempre el servidor) y escribe la caché tras cada respuesta del API. `FormularioPunto` guarda/restaura su borrador por sección con `SesionIndexedDB` (vía context).
- `ListaPuntosProyecto` monta `base/IndicadorSync` en cada tarjeta (ícono nube = `servidor`).
- **Errores visibles:** `ListaPuntosProyecto` (aviso rojo + "Cargando…"), `MenuPrincipalSesion` (el `subtitulo` de `SubMenuDD` dice "No se pudieron cargar las secciones."/"Cargando…"), `CintaSesiones` (reutiliza el `textoVacio` de `FechasSesiones` para el mensaje) y `FormularioPunto` (reutiliza su slot de error) distinguen cargando / error / vacío. "Vacío" solo se muestra si la carga terminó sin error. No se tocó ningún `base/`. Falta por cubrir `CalendarizacionMensual` (su lista de sesiones aún no distingue error).
- Datos de prueba antiguos (bases `comisionSubstanciadora`, anteriores a esta arquitectura) **no se migraron**: quedaron huérfanos en el navegador.
- **Catálogos:** `secciones` (con `requiereAcuerdo`) y `remitentes` los sirve `LocalAPI` desde su semilla (`semilla.js`, almacén `catalogos`, `DB_VERSION` 3). `ProyectoContext` los carga con caché y expone `SECCIONES_DOCUMENTO` y `REMITENTES`. El remitente de un punto se guarda como `id` (`pleno`…); si el id ya no existe en el catálogo, la tarjeta muestra el valor tal cual. `catalogs/` queda sin uso (reservada para catálogos estáticos puramente de interfaz, si alguna vez hicieran falta).
- **Pendientes conocidos:** (1) administración de catálogos (hoy solo lectura, cargados por semilla); (2) estado de **publicación** de la sesión (los lectores ven los puntos al crearlos vs. al publicarlos) — decisión de producto aún abierta; (3) cola de escritura offline (almacén `cola` de `SesionIndexedDB`) y el estado `local` del `IndicadorSync`; (4) la caché del cliente guarda también puntos confidenciales — al implementar autenticación real, vaciarla al cerrar sesión.

- Autenticación real con MSAL (`AuthContext`, `LoginGate`, `BloqueadoGate`) — pausado hasta tener `clientId`/`authority` de un App Registration propio para esta app.
- Sistema de permisos/roles que alimentaría `BloqueadoGate` — de momento no existe; cualquier cuenta autenticada pasaría.
- `catalogs/` — carpeta existente pero vacía (ver arriba). `utils/` tiene `meses.js` y `fechas.js`; `hooks/` tiene `useScrollbarPersonalizada.js`.
- `Sidebar2` — construido pero "parqueado" (usado hoy solo en `Historial.jsx`).
- `Sidebar4` — montado desde `App.jsx` pero sin ningún trigger de apertura conectado todavía (solo existe el cierre); no iniciar esa conexión sin que se pida.
