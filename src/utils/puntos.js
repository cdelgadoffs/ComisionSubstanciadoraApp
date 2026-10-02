export function puntosOrdenados(puntos, secciones) {
  return secciones.flatMap((seccion) =>
    puntos
      .filter((p) => p.seccion === seccion.id)
      .map((punto, i) => ({ punto, seccion, titulo: `${seccion.nombre} ${i + 1}` }))
  );
}

export function puntoActivo(items, id) {
  return items.find((i) => i.punto.id === id) ?? items[0] ?? null;
}
