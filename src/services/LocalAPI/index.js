import { ApiError } from '../ApiError.js';
import { STORE_SESIONES, STORE_PUNTOS, STORE_CATALOGOS, obtenerTodos, obtener, guardar, eliminar } from './db.js';
import {
  usuarioActual, exigirEscritura, puedeVerConfidencial,
  validarFechasISO, calcularEstados,
  camposPunto, validarPunto, normalizarPunto,
} from './reglas.js';

async function exigirSesionAbierta(sesionId) {
  const sesion = await obtener(STORE_SESIONES, sesionId);
  if (!sesion) throw new ApiError('NO_ENCONTRADO', 'La sesión no existe.');
  if (sesion.celebrada) throw new ApiError('SESION_CELEBRADA', 'La sesión ya fue celebrada y no admite cambios.');
  return sesion;
}

export async function listarCatalogos() {
  const filas = await obtenerTodos(STORE_CATALOGOS);
  return Object.fromEntries(filas.map((f) => [f.nombre, f.items]));
}

export async function listarSesiones() {
  return calcularEstados(await obtenerTodos(STORE_SESIONES));
}

export async function crearSesiones(fechas) {
  exigirEscritura();
  validarFechasISO(fechas);
  const existentes = new Set((await obtenerTodos(STORE_SESIONES)).map((s) => s.id));
  const ahora = new Date().toISOString();
  for (const id of new Set(fechas)) {
    if (existentes.has(id)) continue;
    await guardar(STORE_SESIONES, {
      id, celebrada: false, celebradaEn: null, version: 1,
      creadaEn: ahora, creadaPor: usuarioActual().id,
    });
  }
  return listarSesiones();
}

export async function celebrarSesion(id) {
  exigirEscritura();
  const sesion = await obtener(STORE_SESIONES, id);
  if (!sesion) throw new ApiError('NO_ENCONTRADO', 'La sesión no existe.');
  if (sesion.celebrada) throw new ApiError('SESION_CELEBRADA', 'La sesión ya fue celebrada.');
  await guardar(STORE_SESIONES, {
    ...sesion, celebrada: true, celebradaEn: new Date().toISOString(), version: sesion.version + 1,
  });
  const lista = await listarSesiones();
  return lista.find((s) => s.id === id);
}

export async function listarPuntos(sesionId) {
  const todos = await obtenerTodos(STORE_PUNTOS);
  const verConfidencial = puedeVerConfidencial();
  return todos
    .filter((p) => p.sesionId === sesionId && (verConfidencial || !p.confidencial))
    .sort((a, b) => (a.creadoEn === b.creadoEn ? (a.id < b.id ? -1 : 1) : (a.creadoEn < b.creadoEn ? -1 : 1)));
}

export async function crearPunto(sesionId, datos) {
  exigirEscritura();
  if (!sesionId) throw new ApiError('VALIDACION', 'Debes indicar la sesión del punto.');
  await exigirSesionAbierta(sesionId);
  const catalogos = await listarCatalogos();
  validarPunto(datos, catalogos);
  const ahora = new Date().toISOString();
  const punto = {
    id: crypto.randomUUID(),
    sesionId,
    ...normalizarPunto(datos, catalogos),
    version: 1,
    creadoPor: usuarioActual().id,
    creadoEn: ahora,
    modificadoEn: ahora,
  };
  await guardar(STORE_PUNTOS, punto);
  return punto;
}

export async function editarPunto(id, version, cambios) {
  exigirEscritura();
  const actual = await obtener(STORE_PUNTOS, id);
  if (!actual) throw new ApiError('NO_ENCONTRADO', 'El punto no existe.');
  await exigirSesionAbierta(actual.sesionId);
  if (actual.version !== version) {
    throw new ApiError('CONFLICTO', 'El punto cambió desde que lo cargaste. Recarga e intenta de nuevo.');
  }
  const combinado = { ...actual, ...camposPunto(cambios) };
  const catalogos = await listarCatalogos();
  validarPunto(combinado, catalogos);
  const punto = {
    ...actual,
    ...normalizarPunto(combinado, catalogos),
    version: actual.version + 1,
    modificadoEn: new Date().toISOString(),
  };
  await guardar(STORE_PUNTOS, punto);
  return punto;
}

export async function eliminarPunto(id) {
  exigirEscritura();
  const actual = await obtener(STORE_PUNTOS, id);
  if (!actual) throw new ApiError('NO_ENCONTRADO', 'El punto no existe.');
  await exigirSesionAbierta(actual.sesionId);
  await eliminar(STORE_PUNTOS, id);
}
