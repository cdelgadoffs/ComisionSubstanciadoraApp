import { createContext, useContext } from 'react';

const ProyectoContext = createContext(null);

const sesionActual = {
  titulo: 'Sesión Ordinaria N° 1',
  subtitulo: 'Fecha por definir',
};

const sesionEnCurso = {
  badge: 'Sesión en curso',
  subtitulo: '0 puntos',
};

const nuevoPunto = {
  badge: 'Nuevo punto',
};

const VISTAS_MENU_PRINCIPAL = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'proyecto', label: 'Proyecto del orden del día', badge: 0, expandible: true },
  { id: 'sesionPrevia', label: 'Celebrar sesión' },
  { id: 'actaSesion', label: 'Historial' },
];

const SECCIONES_DOCUMENTO = [
  { id: 'informes', nombre: 'Informes', badge: 0 },
  { id: 'dictamenes', nombre: 'Dictámenes', badge: 0 },
  { id: 'acuerdos', nombre: 'Acuerdos', badge: 0 },
  { id: 'asuntos generales', nombre: 'Asuntos generales', badge: 0 },
];

export function ProyectoProvider({ children }) {
  const value = { sesionActual, sesionEnCurso, nuevoPunto, VISTAS_MENU_PRINCIPAL, SECCIONES_DOCUMENTO };
  return <ProyectoContext.Provider value={value}>{children}</ProyectoContext.Provider>;
}

export function useProyecto() {
  return useContext(ProyectoContext);
}
