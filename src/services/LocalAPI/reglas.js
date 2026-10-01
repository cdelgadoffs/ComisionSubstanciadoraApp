import { ApiError } from '../ApiError.js';

const CAMPOS_PUNTO = ['seccion', 'remitente', 'contenido', 'acuerdo', 'confidencial', 'archivos'];
const MAX_TEXTO = 20000;

const USUARIO = { id: 'usuario-local', nombre: 'Capturista local', rol: 'capturista' };

export function usuarioActual() {
  return USUARIO;
}

export function exigirEscritura() {
  if (USUARIO.rol !== 'capturista') {
    throw new ApiError('NO_AUTORIZADO', 'No tienes permiso para modificar.');
  }
}

export function puedeVerConfidencial() {
  return USUARIO.rol === 'capturista';
}

export function fechaISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dia}`;
}

export function validarFechasISO(fechas) {
  if (!Array.isArray(fechas) || fechas.length === 0) {
    throw new ApiError('VALIDACION', 'Debes indicar al menos una fecha.');
  }
  fechas.forEach((f) => {
    const valida = typeof f === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(f) && fechaISO(new Date(f + 'T00:00:00')) === f;
    if (!valida) throw new ApiError('VALIDACION', `Fecha inválida: ${f}.`);
  });
}

export function calcularEstados(sesiones) {
  const hoyISO = fechaISO(new Date());
  const ordenadas = [...sesiones].sort((a, b) => (a.id < b.id ? -1 : 1));
  const proxima = ordenadas.find((s) => s.id >= hoyISO && !s.celebrada);
  let consecutivo = 0;
  return ordenadas.map((s) => {
    let estado = 'pendiente';
    if (s.celebrada) estado = 'celebrada';
    else if (proxima && s.id === proxima.id) estado = 'proxima';
    else if (s.id < hoyISO) estado = 'no-celebrada';
    if (estado !== 'no-celebrada') consecutivo += 1;
    return {
      id: s.id,
      numeroSesion: consecutivo,
      estado,
      celebrada: !!s.celebrada,
      celebradaEn: s.celebradaEn || null,
      version: s.version,
    };
  });
}

export function camposPunto(datos) {
  const limpio = {};
  CAMPOS_PUNTO.forEach((c) => {
    if (c in datos) limpio[c] = datos[c];
  });
  return limpio;
}

function buscarSeccion(catalogos, id) {
  return (catalogos.secciones || []).find((s) => s.id === id);
}

export function validarPunto(p, catalogos) {
  const seccion = buscarSeccion(catalogos, p.seccion);
  if (!seccion) throw new ApiError('VALIDACION', 'Sección inválida.');
  if (!(catalogos.remitentes || []).some((r) => r.id === p.remitente)) {
    throw new ApiError('VALIDACION', 'Remitente inválido.');
  }
  if (typeof p.contenido !== 'string' || p.contenido.trim().length === 0) {
    throw new ApiError('VALIDACION', 'El contenido es obligatorio.');
  }
  if (p.contenido.length > MAX_TEXTO) throw new ApiError('VALIDACION', 'El contenido es demasiado largo.');
  const acuerdo = typeof p.acuerdo === 'string' ? p.acuerdo : '';
  if (seccion.requiereAcuerdo && acuerdo.trim().length === 0) {
    throw new ApiError('VALIDACION', 'El acuerdo es obligatorio.');
  }
  if (acuerdo.length > MAX_TEXTO) throw new ApiError('VALIDACION', 'El acuerdo es demasiado largo.');
  if (typeof p.confidencial !== 'boolean') throw new ApiError('VALIDACION', 'Indicador de confidencialidad inválido.');
  if (!Array.isArray(p.archivos) || p.archivos.some((a) => !a || typeof a.nombre !== 'string')) {
    throw new ApiError('VALIDACION', 'Lista de archivos inválida.');
  }
}

export function normalizarPunto(p, catalogos) {
  const seccion = buscarSeccion(catalogos, p.seccion);
  return {
    seccion: p.seccion,
    remitente: p.remitente,
    contenido: p.contenido.trim(),
    acuerdo: seccion.requiereAcuerdo ? (p.acuerdo || '').trim() : '',
    confidencial: p.confidencial,
    archivos: p.archivos.map((a) => ({ nombre: a.nombre })),
  };
}
