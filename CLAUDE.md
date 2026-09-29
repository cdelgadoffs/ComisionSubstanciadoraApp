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
- Puede tener composición interna sin depender de `base` en absoluto (ej. `ListaExpandible`: toggle + menú flotante + lógica de posición/cierre, todo autocontenido) — no es obligatorio que un widget use átomos de `base` para calificar como widget, basta con que ensamble varias piezas propias en un bloque.
- Cuando un widget necesita iterar una lista de sub-ítems (ej. un menú con N opciones), **la iteración vive en el mismo widget**, sin envolver cada ítem individual en su propio widget — eso sería sobre-abstracción. Precedente: `MenuPrincipalSesion` itera `VISTAS_MENU_PRINCIPAL` y pinta múltiples `BotonSeleccionableMenu` sin un wrapper por ítem; `MenuPanelControl` hace lo mismo con `ITEMS_PANEL_CONTROL`.
- Cuando dos partes de un mismo widget necesitan aparecer en dos regiones visuales distintas del layout (ej. un botón en el header de Sidebar5 y su contenido en el body), y ambas piezas son instancias de componente separadas, el estado que las coordina **se levanta a `UIContext`** (nunca se intenta compartir estado local de React entre instancias distintas).
- Un widget puede **controlar directamente una relación de comportamiento con un componente de `base`** sin necesitar que una page se la pase por props, siempre que la relación sea intrínseca a ese widget. Precedente: `Topbar` llama `useUI()` para obtener `toggleSidebar5` y dispara la apertura de `Sidebar5` él mismo (antes se pasaba `onToggleSidebar` desde cada page — era wiring redundante repetido 4 veces sin razón, porque `Topbar` ya es un widget con acceso legítimo a contexto).
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

### `App.jsx`
- Decide el routing (`vistaActual` → `PAGES` map) y monta las piezas verdaderamente globales que no pertenecen a ninguna page (hoy solo `Sidebar4`).
- No conoce el estado interno de ninguna page ni de Sidebar5 — esa lógica de cierre/reset vive centralizada en `UIContext` (ver `toggleSidebar5`/`cerrarSidebar5`), nunca duplicada en cada page ni empujada a `App.jsx`.
- Si en el futuro un widget gana una relación propia con `Sidebar4` (ej. algo que lo abra, como ya pasa con `Topbar`→`Sidebar5`), `App.jsx` pierde el control de esa apertura específica, pero conserva el montaje y el cierre — porque sigue siendo la única pieza que `App.jsx` hospeda. "Controlar la apertura" y "montar el componente" son responsabilidades independientes.

## Otras reglas transversales

- **Nombres repetidos entre carpetas no chocan.** `widgets/X.jsx` y `pages/panelcontrol/X.jsx` pueden coexistir con el mismo nombre base — la ruta completa los distingue, y refuerza que cada carpeta tiene una responsabilidad distinta aunque el nombre coincida.
- **CSS con altura fija cuando otros elementos dependen de ella.** Si un componente (ej. `CintaSesiones`) va a ser usado por otros componentes para calcular offsets de posición (`arriba`, `ALTO_*`), su altura debe ser explícita (`height` + `box-sizing: border-box`), nunca auto/dependiente de contenido — de lo contrario cualquier cambio de contenido desalinea todo lo que se posiciona en base a esa constante.
- **Sin sobre-ingeniería.** No crear abstracciones, wrappers, archivos CSS o capas nuevas para necesidades hipotéticas o de un solo uso. Tres líneas parecidas son mejor que una abstracción prematura.
- **Sin comentarios en el código**, salvo que el usuario lo pida explícitamente para un caso puntual.

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

## Pendientes conocidos (no iniciar sin que se pida)

- Autenticación real con MSAL (`AuthContext`, `LoginGate`, `BloqueadoGate`) — pausado hasta tener `clientId`/`authority` de un App Registration propio para esta app.
- Sistema de permisos/roles que alimentaría `BloqueadoGate` — de momento no existe; cualquier cuenta autenticada pasaría.
- `catalogs/`, `hooks/`, `utils/` — carpetas existentes pero vacías.
- `Sidebar2` — construido pero "parqueado" (usado hoy solo en `Historial.jsx`).
- `Sidebar4` — montado desde `App.jsx` pero sin ningún trigger de apertura conectado todavía (solo existe el cierre); no iniciar esa conexión sin que se pida.
