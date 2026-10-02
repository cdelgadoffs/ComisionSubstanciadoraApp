export function encabezadoSesion(sesion) {
  return sesion
    ? { titulo: `Sesión Ordinaria N° ${sesion.numeroSesion}`, subtitulo: sesion.label }
    : { titulo: 'Sesión Ordinaria', subtitulo: 'Fecha por definir' };
}
