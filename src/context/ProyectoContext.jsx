import { createContext, useContext, useState } from 'react';

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

function enVacaciones(iso, vacaciones) {
  return vacaciones.some((v) => iso >= v.inicio && iso <= v.fin);
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
  const [diaSesion, setDiaSesion] = useState(3);
  const [vacaciones, setVacaciones] = useState([]);
  const [fechasSesiones, setFechasSesiones] = useState([]);
  const [sesionActivaFecha, setSesionActivaFecha] = useState(null);

  function generarSesionesMes(diaSemana) {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = hoy.getMonth();
    const hoyISO = fechaISO(hoy);
    const fechas = [];
    const cursor = new Date(anio, mes, 1);
    while (cursor.getMonth() === mes) {
      if (cursor.getDay() === diaSemana) {
        const iso = fechaISO(cursor);
        if (!enVacaciones(iso, vacaciones)) fechas.push(iso);
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    const proxima = fechas.find((f) => f >= hoyISO);
    const generadas = fechas.map((iso, i) => {
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
    setFechasSesiones(generadas);
  }

  function agregarVacacion(inicio, fin) {
    setVacaciones((v) => [...v, { inicio, fin }]);
  }
  function eliminarVacacion(idx) {
    setVacaciones((v) => v.filter((_, i) => i !== idx));
  }
  function cargarSesion(fecha) {
    setSesionActivaFecha(fecha);
  }

  const value = {
    sesionActual, sesionEnCurso, nuevoPunto, VISTAS_MENU_PRINCIPAL, SECCIONES_DOCUMENTO,
    FECHAS_SESIONES: fechasSesiones,
    diaSesion, setDiaSesion,
    vacaciones, agregarVacacion, eliminarVacacion,
    sesionActivaFecha, cargarSesion,
    generarSesionesMes,
  };
  return <ProyectoContext.Provider value={value}>{children}</ProyectoContext.Provider>;
}

export function useProyecto() {
  return useContext(ProyectoContext);
}
