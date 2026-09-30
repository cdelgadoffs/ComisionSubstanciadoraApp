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

function recalcularSesiones(sesiones) {
  const hoyISO = fechaISO(new Date());
  const ordenadas = [...sesiones].sort((a, b) => (a.id < b.id ? -1 : 1));
  const proxima = ordenadas.find((s) => s.id >= hoyISO && !s.celebrada);
  let consecutivo = 0;
  return ordenadas.map((s) => {
    const fecha = new Date(s.id + 'T00:00:00');
    let estado = 'pendiente';
    if (s.celebrada) estado = 'celebrada';
    else if (proxima && s.id === proxima.id) estado = 'proxima';
    else if (s.id < hoyISO) estado = 'no-celebrada';
    if (estado !== 'no-celebrada') consecutivo += 1;
    return {
      id: s.id,
      numeroSesion: consecutivo,
      label: `${fecha.getDate()} de ${MESES[fecha.getMonth()]}`,
      celebrada: !!s.celebrada,
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
      const porId = new Map(prev.map((f) => [f.id, f]));
      fechas.forEach((id) => {
        if (!porId.has(id)) porId.set(id, { id, celebrada: false });
      });
      const nuevas = recalcularSesiones([...porId.values()]);
      guardarSesiones(nuevas);
      return nuevas;
    });
  }
  function cargarSesion(fecha) {
    setSesionActivaFecha(fecha);
  }
  function finalizarSesion() {
    setFechasSesiones((prev) => {
      const actualizadas = prev.map((f) =>
        f.id === sesionActivaFecha ? { ...f, celebrada: true } : f
      );
      const nuevas = recalcularSesiones(actualizadas);
      guardarSesiones(nuevas);
      return nuevas;
    });
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
  const sesionFinalizada = !!sesionSeleccionada?.celebrada;

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
