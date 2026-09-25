import { createContext, useContext, useEffect, useState } from 'react';
import { guardarSesiones, obtenerSesiones } from '../services/indexedDB.js';

const ProyectoContext = createContext(null);

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

function fechaISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dia}`;
}

function recalcularSesiones(idsFechas) {
  const hoyISO = fechaISO(new Date());
  const ordenadas = [...idsFechas].sort();
  const proxima = ordenadas.find((f) => f >= hoyISO);
  return ordenadas.map((iso, i) => {
    const fecha = new Date(iso + 'T00:00:00');
    let estado = 'pendiente';
    if (iso === proxima) estado = 'proxima';
    else if (iso < hoyISO) estado = 'no-celebrada';
    return {
      id: iso,
      numeroSesion: i + 1,
      label: `${fecha.getDate()} de ${MESES[fecha.getMonth()]}`,
      estado,
    };
  });
}

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
  const [fechasSesiones, setFechasSesiones] = useState([]);
  const [sesionActivaFecha, setSesionActivaFecha] = useState(null);

  useEffect(() => {
    obtenerSesiones().then(setFechasSesiones);
  }, []);

  function agregarSesiones(fechas) {
    setFechasSesiones((prev) => {
      const ids = new Set(prev.map((f) => f.id));
      fechas.forEach((f) => ids.add(f));
      const nuevas = recalcularSesiones([...ids]);
      guardarSesiones(nuevas);
      return nuevas;
    });
  }
  function cargarSesion(fecha) {
    setSesionActivaFecha(fecha);
  }

  const value = {
    sesionActual, sesionEnCurso, nuevoPunto, VISTAS_MENU_PRINCIPAL, SECCIONES_DOCUMENTO,
    FECHAS_SESIONES: fechasSesiones,
    sesionActivaFecha, cargarSesion,
    agregarSesiones,
  };
  return <ProyectoContext.Provider value={value}>{children}</ProyectoContext.Provider>;
}

export function useProyecto() {
  return useContext(ProyectoContext);
}
