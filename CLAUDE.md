# Patrón Michelín — Arquitectura de ComisionSubstanciadoraApp

Este documento es el estándar obligatorio de arquitectura para este proyecto. Cualquier trabajo futuro (en este chat o en uno nuevo) debe seguirlo al pie de la letra. Si una instrucción del usuario parece contradecirlo, pregunta antes de romperlo — el patrón se ha defendido activamente a lo largo de muchas sesiones y las excepciones son siempre deliberadas y documentadas, nunca accidentales.

## Referencia visual: PlenoLOCAL

`C:\Users\jcdelgadomo\Desktop\PlenoLOCAL` es el proyecto original del que esta app deriva. Se usa **únicamente como referencia de solo lectura** para observar diseños visuales y comportamientos ya resueltos (CSS, estructura de componentes, flujos de interacción).

**Regla de oro: nunca se escribe en PlenoLOCAL.** Solo se lee para inspirarse.

Al traer algo de PlenoLOCAL, nunca se copia tal cual su estructura de archivos ni su forma de organizar componentes — siempre se **traduce** al Patrón Michelín: se identifica qué parte es molde genérico (L2), qué parte es plato combinado (L3), qué parte es de layout (L1), y qué parte es dato/acción de negocio (context). PlenoLOCAL no tiene esta separación de capas; esta app sí, y eso no se sacrifica por fidelidad visual.

## La metáfora: un restaurante Michelín

| Capa | Metáfora | Qué es |
|---|---|---|
| `Skeleton` | El piso / el local | Instancia única y global, siempre presente, el fondo visual. |
| `L1` (Topbar, Sidebar1-5, PanelPrincipal, CintaSesiones) | El mantel / la vajilla del salón | Definidos una vez, pero **cada page monta su propia instancia** — nunca se comparte una sola instancia entre pages. |
| `L2` | Platos y cubiertos genéricos | Átomos reutilizables sin datos de negocio — solo `children`/`onClick`/props genéricas. |
| `L3` | La receta / el platillo terminado | Combina L2 + datos de contexto + relación entre ellos. Llama a los hooks de contexto (`useUI()`, `useProyecto()`, `useAuth()`) **directamente** — nunca recibe esos datos por props desde una page. |
| `context/` | La despensa | Almacén central de datos y acciones del que cualquier platillo L3 se sirve. |
| `services/` | Los proveedores | I/O externo real (IndexedDB, futuro backend). Los llaman las acciones de `context/`, nunca los componentes directamente. |
| `pages/` | El servicio de mesa | Arma una "mesa" completa por vista: monta sus propias instancias de L1 + platillos L3 + contenido estático trivial. |
| `App.jsx` | El salón / el metre | Decide qué mesa se sirve (routing vía `vistaActual`) y aloja solo piezas L1 verdaderamente globales que no pertenecen a ninguna page (hoy: `Sidebar4`). |

## Reglas por capa

### L1 — molde
- Puramente presentacional. Recibe todo por props (incluyendo posicionamiento: `izquierda`, `arriba`, `ancho`, `abierto`).
- **Nunca llama a `useUI()`/`useProyecto()`/`useAuth()` directamente.**
- Puede exponer slots genéricos (ej. `accionesHeader` en `Sidebar5`, `children` para contenido) sin saber qué se le va a meter ahí.
- **"Cada mesa su propio mantel":** un componente L1 se define una sola vez, pero cada page que lo necesita monta su **propia instancia** — nunca una instancia compartida entre pages. Esto es intencional: si una mesa se retira (una page no monta cierto L1), solo el piso (`Skeleton`) debe quedar visible ahí — eso es comportamiento correcto del patrón, no un bug a parchear.

### L2 — átomo genérico
- Cero datos de negocio hardcodeados. Todo por props.
- Un símbolo/ícono se vuelve **intrínseco** al componente (hardcodeado dentro de él, no pasado como `children`) cuando ese componente/variante tiene un único uso con un único significado en todo el proyecto (ej. `BotonMenuLateral` variant="icono" siempre pinta "☰").
- Una capacidad nueva (ej. un modo "expandible" con etiqueta en hover) se agrega al L2 compartido **solo si es genuinamente reutilizable** por cualquier futuro consumidor — nunca para resolver la necesidad puntual de un solo lugar. Se implementa **opt-in vía prop**, sin cambiar el comportamiento por defecto de los consumidores existentes.

### L3 — el platillo
- Combina L2 + datos/acciones de contexto + la relación de comportamiento entre ellos.
- Llama a los hooks de contexto directamente.
- Cuando un platillo necesita iterar una lista de sub-ítems (ej. un menú con N opciones), **la iteración vive en el mismo L3**, sin envolver cada ítem individual en su propio L3 — eso sería sobre-abstracción. Precedente: `MenuPrincipalSesion` itera `VISTAS_MENU_PRINCIPAL` y pinta múltiples `BotonSeleccionableMenu` sin un wrapper por ítem; `MenuPanelControl` hace lo mismo con `ITEMS_PANEL_CONTROL`.
- Cuando dos partes de un mismo platillo necesitan aparecer en dos regiones visuales distintas del layout (ej. un botón en el header de Sidebar5 y su contenido en el body), y ambas piezas son instancias de componente separadas, el estado que las coordina **se levanta a `UIContext`** (nunca se intenta compartir estado local de React entre instancias distintas).

### Excepción documentada: `pages/panelcontrol/`
Los archivos en `pages/panelcontrol/*.jsx` (ej. `CalendarizacionMensual.jsx`) **son, por rol, platillos L3** — llaman al contexto directamente y combinan L2 + comportamiento — pero viven en esa carpeta (no en `components/L3/`) porque `MenuPanelControl` (el switcher genérico de Sidebar5) necesita referenciarlos con una forma específica: `export default` = contenido del body, `export function BotonX` = acción del header, ambos desde el mismo archivo.

Esto es una excepción **acotada a esa carpeta**, no una redefinición general de qué es una "page". Las 4 pages reales (`Inicio`, `ProyectoOrdenDia`, `SesionPrevia`, `Historial`) siguen siendo ensambladoras puras — nunca llaman a contexto para construir contenido de negocio, solo montan L1 + platillos L3 ya armados. Si en el futuro se agrega otro ítem al panel de control, va en `pages/panelcontrol/OtroItem.jsx` siguiendo el mismo patrón.

Estos archivos "de excepción" **solo son visibles/montables dentro de `Sidebar5`** (300–420px de ancho) — nunca se diseñan pensando en ancho completo de pantalla, y no se les monta contenido pensado para ese contexto (ej. `CintaSesiones`, que es de ancho completo, no pertenece ahí).

### `pages/` — el servicio
- Ensambla instancias de L1 + platillos L3 + contenido estático trivial de la vista.
- **No llama a contexto para construir contenido de negocio** — eso es trabajo de L3. Sí puede leer contexto para pasar valores simples como props a L1 (ej. `sesionActual.titulo` a `Sidebar1`).
- Contenido estático, trivial y único de una sola page (ej. un `<h1>` + texto placeholder) puede quedarse inline en la page sin volverse un L3 — no toda page necesita un "platillo" para su contenido si ese contenido no tiene relación de negocio que combinar.
- **"Sal al gusto":** cuando una page necesita un ajuste de estilo puramente presentacional y de un solo uso sobre un componente reutilizable (ej. un margen para separarlo del borde), se aplica como `style` inline en un wrapper dentro de la page — **nunca** se modifica el CSS del componente compartido (eso filtraría el ajuste a todos los demás consumidores), y tampoco se crea un archivo CSS nuevo solo para una declaración estática (sobre-ingeniería). El componente reutilizable es la receta; el ajuste de la page es la sal que se le agrega en la mesa, no en la cocina.

### `context/` — la despensa
- Solo aquí vive estado de negocio real y acciones que lo modifican.
- Los context exponen datos (`FECHAS_SESIONES`, `sesionActivaFecha`, etc.) y acciones (`agregarSesiones`, `cargarSesion`, etc.) — nunca lógica de presentación.
- Las acciones que necesitan persistencia llaman a `services/` (ej. `guardarSesiones` de `services/indexedDB.js`) dentro de la misma función de acción del context — el componente que dispara la acción no sabe que existe persistencia.

### `services/` — los proveedores
- I/O externo puro (hoy: IndexedDB nativo, sin librerías). Funciones async simples, sin JSX, sin conocimiento de React.
- Solo los llama `context/`, nunca componentes directamente.

### `App.jsx` — el salón
- Decide el routing (`vistaActual` → `PAGES` map) y monta las piezas L1 verdaderamente globales (hoy solo `Sidebar4`).
- No conoce el estado interno de ninguna page ni de Sidebar5 — esa lógica de cierre/reset vive centralizada en `UIContext` (ver `toggleSidebar5`/`cerrarSidebar5`), nunca duplicada en cada page ni empujada a `App.jsx`.

## Otras reglas transversales

- **Nombres repetidos entre carpetas no chocan.** `L3/X.jsx` y `pages/panelcontrol/X.jsx` pueden coexistir con el mismo nombre base — la ruta completa los distingue, y refuerza que cada carpeta tiene una responsabilidad distinta aunque el nombre coincida.
- **CSS con altura fija cuando otros elementos dependen de ella.** Si un L1 (ej. `CintaSesiones`) va a ser usado por otros componentes para calcular offsets de posición (`arriba`, `ALTO_*`), su altura debe ser explícita (`height` + `box-sizing: border-box`), nunca auto/dependiente de contenido — de lo contrario cualquier cambio de contenido desalinea todo lo que se posiciona en base a esa constante.
- **Sin sobre-ingeniería.** No crear abstracciones, wrappers, archivos CSS o capas nuevas para necesidades hipotéticas o de un solo uso. Tres líneas parecidas son mejor que una abstracción prematura.
- **Sin comentarios en el código**, salvo que el usuario lo pida explícitamente para un caso puntual.

## Flujo de trabajo de verificación

1. `npm run build` primero, siempre.
2. Para verificar UI: `npm install --no-save playwright-core` (confirmar con `ls` que cae en la carpeta correcta del proyecto), dev server con `nohup npm run dev -- --port <N> --strictPort --force &`, y un script `.cjs` con Playwright usando Edge del sistema (`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe` como `executablePath`, ya que el Chromium embebido falla detrás del proxy corporativo).
3. Limpiar siempre al final: borrar el script, los screenshots, `node_modules/playwright-core`, y matar el dev server (`pkill -f "vite.*<puerto>"`).

## Estado actual del flujo de Calendarización Mensual (referencia funcional)

Ya está completo y no requiere más trabajo salvo que se pida explícitamente:

- `L2/CalendarioMes.jsx` — grid de mes, selección múltiple de fechas, sin datos de negocio.
- `L2/CardS.jsx` — tarjeta oscura de sesión con estados visuales.
- `L2/BotonSeleccionablePanel.jsx`, `L2/BotonAgregar.jsx` (con modo `etiqueta` expandible), `L2/BotonS.jsx` — reutilizados en el flujo.
- `L3/MenuPanelControl.jsx` — switcher genérico de Sidebar5, con tabla `ITEMS_PANEL_CONTROL`.
- `pages/panelcontrol/CalendarizacionMensual.jsx` — el platillo real: por defecto muestra la lista de sesiones agendadas del mes si ya hay alguna, o el calendario si no hay ninguna; el botón "+" del header fuerza el calendario manualmente en cualquier momento.
- `ProyectoContext` — `agregarSesiones(fechas)` agrega un lote de fechas de una vez y recalcula números/estados; persiste en `services/indexedDB.js` en cada cambio y carga al montar.
- Todo esto vive **dentro de Sidebar5 únicamente** — no es una vista/page routeable de ancho completo.

## Pendientes conocidos (no iniciar sin que se pida)

- Autenticación real con MSAL (`AuthContext`, `LoginGate`, `BloqueadoGate`) — pausado hasta tener `clientId`/`authority` de un App Registration propio para esta app.
- Sistema de permisos/roles que alimentaría `BloqueadoGate` — de momento no existe; cualquier cuenta autenticada pasaría.
- `catalogs/`, `hooks/`, `utils/` — carpetas existentes pero vacías.
- Sidebar2 — construido pero "parqueado" (usado hoy solo en `Historial.jsx`).
