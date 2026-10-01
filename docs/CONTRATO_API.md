# Contrato del API (v1)

Fuente de verdad de lo que `services/LocalAPI/` simula y `services/ServerConnection/` consume. Es lo que implementa el backend. Cualquier cambio se hace **aquí primero**.

Todas las operaciones son asíncronas. Los datos viajan como JSON. Los errores tienen siempre la forma `{ codigo, mensaje }` (`services/ApiError.js`).

## Convenciones

- Todos los timestamps son ISO 8601 UTC, asignados por el **servidor**.
- Todo registro modificable lleva `version` (entero, empieza en 1, +1 en cada cambio). Se usa para detectar conflictos.
- El **reloj del servidor** define "hoy". El cliente nunca decide estados.
- Los datos **derivados** (`estado`, `numeroSesion`) no se guardan: se calculan al leer.
- La identidad y el rol salen del token en el servidor, nunca del cliente.

## Modelo

### Sesión
| Campo | Tipo | Notas |
|---|---|---|
| `id` | string | Fecha `YYYY-MM-DD`. Es la identidad natural: **una sesión por fecha**. |
| `numeroSesion` | int | Derivado. Consecutivo oficial. Avanza en `celebrada` y `proxima`; una `no-celebrada` no consume número. |
| `estado` | string | Derivado. `celebrada` · `proxima` · `no-celebrada` · `pendiente`. |
| `celebrada` | bool | Hecho persistido. |
| `celebradaEn` | string \| null | Timestamp. |
| `version` | int | |

Reglas de `estado` (con la fecha de hoy del servidor, entre sesiones ordenadas por `id`):
`celebrada` si `celebrada`; `proxima` si es la primera con `id >= hoy` y no celebrada; `no-celebrada` si `id < hoy` y no celebrada; `pendiente` en cualquier otro caso.

### Punto
| Campo | Tipo | Notas |
|---|---|---|
| `id` | string | Asignado por el servidor (UUID). |
| `sesionId` | string | Sesión a la que pertenece. Obligatorio. |
| `seccion` | string | `id` de un elemento del catálogo `secciones`. |
| `remitente` | string | `id` de un elemento del catálogo `remitentes`. |
| `contenido` | string | Obligatorio, máx. 20 000 caracteres. |
| `acuerdo` | string | Obligatorio si la sección tiene `requiereAcuerdo: true`; si no, se guarda vacío. Máx. 20 000. |
| `confidencial` | bool | |
| `archivos` | `[{ nombre }]` | Hoy solo el nombre (sin almacenamiento real de archivos todavía). |
| `version` | int | |
| `creadoPor`, `creadoEn`, `modificadoEn` | string | Autoría y fechas, del servidor. |

### Catálogos

Los catálogos de dominio son **datos, no código**: el API ofrece un mecanismo genérico y cada proyecto carga sus propias filas (semilla). El API valida contra lo que haya cargado y aplica los atributos sin saber qué significan. Así el motor es reutilizable entre proyectos.

`listarCatalogos()` devuelve `{ [nombreCatalogo]: Item[] }`, donde cada `Item` es `{ id, nombre, ...atributos }`. En este proyecto:

| Catálogo | Atributos | Valores actuales |
|---|---|---|
| `secciones` | `requiereAcuerdo: bool` | `informes` (false), `dictamenes`, `acuerdos`, `asuntos generales` (true) |
| `remitentes` | — | `pleno`, `presidencia`, `secretaria-general` |

Lo que **no** es catálogo y vive solo en el cliente: la estructura de la interfaz (menú, textos, íconos).

## Operaciones

| Operación | Entrada | Salida | Errores |
|---|---|---|---|
| `listarCatalogos()` | — | `{ secciones: Item[], remitentes: Item[] }` | — |
| `listarSesiones()` | — | `Sesion[]` (con derivados, ordenadas por `id`) | — |
| `crearSesiones(fechas)` | `string[]` de fechas `YYYY-MM-DD` | `Sesion[]` (la lista completa actualizada) | `NO_AUTORIZADO`, `VALIDACION` |
| `celebrarSesion(id)` | id de sesión | `Sesion` actualizada | `NO_AUTORIZADO`, `NO_ENCONTRADO`, `SESION_CELEBRADA` |
| `listarPuntos(sesionId)` | id de sesión | `Punto[]` (orden de creación, **ya filtrados según el usuario**) | — |
| `crearPunto(sesionId, datos)` | sesión + `{ seccion, remitente, contenido, acuerdo, confidencial, archivos }` | `Punto` creado | `NO_AUTORIZADO`, `VALIDACION`, `NO_ENCONTRADO`, `SESION_CELEBRADA` |
| `editarPunto(id, version, cambios)` | id, `version` que el cliente tiene, campos a cambiar | `Punto` actualizado | `NO_AUTORIZADO`, `NO_ENCONTRADO`, `SESION_CELEBRADA`, `CONFLICTO`, `VALIDACION` |
| `eliminarPunto(id)` | id | — | `NO_AUTORIZADO`, `NO_ENCONTRADO`, `SESION_CELEBRADA` |

Notas de comportamiento:
- `crearSesiones` es **idempotente**: las fechas que ya existen se ignoran (no resetea `celebrada`); devuelve siempre la lista completa porque los derivados de las demás sesiones pueden cambiar.
- `celebrarSesion` devuelve solo la sesión celebrada; como `proxima` y `numeroSesion` de las demás pueden cambiar, el cliente vuelve a llamar `listarSesiones`.
- `editarPunto` con `version` distinta de la actual → `CONFLICTO` (el cliente debe recargar). Solo se modifican los campos permitidos del punto; el resultado se valida completo.
- Una sesión **celebrada es inmutable**: no admite crear, editar ni eliminar puntos.

## Códigos de error

| Código | Cuándo |
|---|---|
| `NO_AUTORIZADO` | El usuario no tiene permiso para la operación. |
| `NO_ENCONTRADO` | La sesión o el punto no existe. |
| `VALIDACION` | Datos inválidos (fecha, sección, remitente, campos obligatorios, longitudes). |
| `CONFLICTO` | `version` desactualizada. |
| `SESION_CELEBRADA` | La operación no aplica a una sesión ya celebrada. |
| `NO_IMPLEMENTADO` | Solo `ServerConnection` mientras no exista backend. |

## Permisos

| Rol | Sesiones y puntos | Confidenciales |
|---|---|---|
| `capturista` | Lectura y escritura (único con CRUD de puntos y de sesiones) | Los ve |
| Lectores (remitentes, colaboradores) | Solo lectura | **No se les envían** — el servidor los excluye de `listarPuntos` |

Las restricciones finas de lectura por remitente/colaborador están por definir; la regla siempre se aplica en el servidor.

## Pendiente de definir

- Estado de publicación de la sesión (`en preparación` → `publicado` → `celebrada`): si los lectores ven los puntos al crearse o al publicarse.
- Administración de catálogos (hoy solo lectura; las filas se cargan por semilla).
- Almacenamiento, subida y descarga real de archivos (URLs firmadas, límites, antivirus).
- Autenticación (MSAL) y origen del rol.
- Auditoría (bitácora de cambios).
