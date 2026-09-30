import { createContext, useContext, useEffect, useState } from 'react';
import { guardarSesiones, obtenerSesiones, guardarPuntos, obtenerPuntos } from '../services/indexedDB.js';
import { MESES } from '../utils/meses.js';

const ProyectoContext = createContext(null);

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

const sesionEnCurso = {
  badge: 'Sesión en curso',
  subtitulo: '0 puntos',
};

const nuevoPunto = {
  badge: 'Nuevo punto',
};

const SECCIONES_DOCUMENTO_BASE = [
  { id: 'informes', nombre: 'Informes' },
  { id: 'dictamenes', nombre: 'Dictámenes' },
  { id: 'acuerdos', nombre: 'Acuerdos' },
  { id: 'asuntos generales', nombre: 'Asuntos generales' },
];

export function ProyectoProvider({ children }) {
  const [fechasSesiones, setFechasSesiones] = useState([]);
  const [sesionActivaFecha, setSesionActivaFecha] = useState(null);
  const [sesionFinalizada, setSesionFinalizada] = useState(false);
  const [puntos, setPuntos] = useState([]);

  useEffect(() => {
    obtenerSesiones().then(setFechasSesiones);
  }, []);

  useEffect(() => {
    obtenerPuntos().then(setPuntos);
  }, []);

  useEffect(() => {
    if (sesionActivaFecha !== null) return;
    const proxima = fechasSesiones.find((f) => f.estado === 'proxima');
    if (proxima) setSesionActivaFecha(proxima.id);
  }, [fechasSesiones, sesionActivaFecha]);

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
  function finalizarSesion() {
    setSesionFinalizada(true);
  }
  function agregarPunto(datos) {
    const nuevo = { id: crypto.randomUUID(), ...datos };
    setPuntos((prev) => {
      const nuevos = [...prev, nuevo];
      guardarPuntos(nuevos);
      return nuevos;
    });
  }

  const sesionSeleccionada = fechasSesiones.find((f) => f.id === sesionActivaFecha);
  const sesionActual = sesionSeleccionada
    ? { titulo: `Sesión Ordinaria N° ${sesionSeleccionada.numeroSesion}`, subtitulo: sesionSeleccionada.label }
    : { titulo: 'Sesión Ordinaria', subtitulo: 'Fecha por definir' };

  const SECCIONES_DOCUMENTO = SECCIONES_DOCUMENTO_BASE.map((s) => ({
    ...s,
    badge: puntos.filter((p) => p.seccion === s.id).length,
  }));

  const VISTAS_MENU_PRINCIPAL = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'proyecto', label: 'Proyecto del orden del día', badge: puntos.length, expandible: true },
    { id: 'sesionPrevia', label: sesionFinalizada ? 'Sesión celebrada' : 'Celebrar sesión' },
    { id: 'actaSesion', label: 'Historial' },
  ];

  const value = {
    sesionActual, sesionEnCurso, nuevoPunto, VISTAS_MENU_PRINCIPAL, SECCIONES_DOCUMENTO,
    FECHAS_SESIONES: fechasSesiones,
    sesionActivaFecha, cargarSesion,
    sesionFinalizada, finalizarSesion,
    PUNTOS: puntos, agregarPunto,
    agregarSesiones,
  };
  return <ProyectoContext.Provider value={value}>{children}</ProyectoContext.Provider>;
}

export function useProyecto() {
  return useContext(ProyectoContext);
}
