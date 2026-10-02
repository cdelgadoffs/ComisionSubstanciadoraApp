const TIPOS = [
  { extensiones: ['pdf'], icono: 'ri-file-pdf-2-line', tono: 'rojo' },
  { extensiones: ['doc', 'docx'], icono: 'ri-file-word-2-line', tono: 'azul' },
  { extensiones: ['xls', 'xlsx'], icono: 'ri-file-excel-2-line', tono: 'verde' },
  { extensiones: ['png', 'jpg', 'jpeg', 'gif', 'webp'], icono: 'ri-image-line', tono: 'morado' },
];

const GENERICO = { icono: 'ri-file-line', tono: 'gris' };

export function estiloArchivo(nombre) {
  const extension = String(nombre).split('.').pop().toLowerCase();
  const tipo = TIPOS.find((t) => t.extensiones.includes(extension));
  return tipo ? { icono: tipo.icono, tono: tipo.tono } : GENERICO;
}

export function guardarEnDisco(nombre, blob) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
