import { createContext, useContext, useEffect, useState } from 'react';
import { listarCatalogos, listarSesiones, crearSesiones, celebrarSesion, listarPuntos, crearPunto } from '../services/api.js';
import {
  guardarBorrador, obtenerBorrador, eliminarBorrador,
  guardarCache, obtenerCache,
} from '../services/SesionIndexedDB.js';
import { etiquetaFecha } from '../utils/fechas.js';

const ProyectoContext = createContext(null);

const CACHE_CATALOGOS = 'catalogos';
const CACHE_SESIONES = 'sesiones';
const cachePuntos = (sesionId) => `puntos:${sesionId}`;

const conEtiqueta = (sesiones) => sesiones.map((s) => ({ ...s, label: etiquetaFecha(s.id) }));
const conSync = (punto) => ({ ...punto, sincronizacion: 'servidor' });

const nuevoPunto = {
  badge: 'Nuevo punto',
};

const CATALOGOS_VACIOS = { secciones: [], remitentes: [] };

export function ProyectoProvider({ children }) {
  const [fechasSesiones, setFechasSesiones] = useState([]);
  const [sesionActivaFecha, setSesionActivaFecha] = useState(null);
  const [puntos, setPuntos] = useState([]);
  const [catalogos, setCatalogos] = useState(CATALOGOS_VACIOS);
  const [cargas, setCargas] = useState({ catalogos: { cargando: true }, sesiones: { cargando: true }, puntos: {} });

  function marcarCarga(recurso, estado) {
    setCargas((c) => ({ ...c, [recurso]: estado }));
  }

  useEffect(() => {
    let vigente = true;
    let servidorListo = false;
    obtenerCache(CACHE_CATALOGOS).then((c) => {
      if (vigente && !servidorListo && c) setCatalogos(c);
    });
    listarCatalogos()
      .then((c) => {
        if (!vigente) return;
        servidorListo = true;
        const completos = { ...CATALOGOS_VACIOS, ...c };
        setCatalogos(completos);
        guardarCache(CACHE_CATALOGOS, completos);
        marcarCarga('catalogos', {});
      })
      .catch((e) => vigente && marcarCarga('catalogos', { error: e }));
    return () => { vigente = false; };
  }, []);

  useEffect(() => {
    let vigente = true;
    let servidorListo = false;
    obtenerCache(CACHE_SESIONES).then((c) => {
      if (vigente && !servidorListo && c) setFechasSesiones(c);
    });
    listarSesiones()
      .then((sesiones) => {
        if (!vigente) return;
        servidorListo = true;
        const lista = conEtiqueta(sesiones);
        setFechasSesiones(lista);
        guardarCache(CACHE_SESIONES, lista);
        marcarCarga('sesiones', {});
      })
      .catch((e) => vigente && marcarCarga('sesiones', { error: e }));
    return () => { vigente = false; };
  }, []);

  useEffect(() => {
    if (sesionActivaFecha !== null) return;
    const proxima = fechasSesiones.find((f) => f.estado === 'proxima');
    if (proxima) setSesionActivaFecha(proxima.id);
  }, [fechasSesiones, sesionActivaFecha]);

  useEffect(() => {
    setPuntos([]);
    if (!sesionActivaFecha) {
      marcarCarga('puntos', {});
      return;
    }
    marcarCarga('puntos', { cargando: true });
    let vigente = true;
    let servidorListo = false;
    const clave = cachePuntos(sesionActivaFecha);
    obtenerCache(clave).then((c) => {
      if (vigente && !servidorListo && c) setPuntos(c);
    });
    listarPuntos(sesionActivaFecha)
      .then((lista) => {
        if (!vigente) return;
        servidorListo = true;
        const conEstado = lista.map(conSync);
        setPuntos(conEstado);
        guardarCache(clave, conEstado);
        marcarCarga('puntos', {});
      })
      .catch((e) => vigente && marcarCarga('puntos', { error: e }));
    return () => { vigente = false; };
  }, [sesionActivaFecha]);

  function aplicarSesiones(sesiones) {
    const lista = conEtiqueta(sesiones);
    setFechasSesiones(lista);
    guardarCache(CACHE_SESIONES, lista);
  }

  async function agregarSesiones(fechas) {
    aplicarSesiones(await crearSesiones(fechas));
  }
  function cargarSesion(fecha) {
    setSesionActivaFecha(fecha);
  }
  async function finalizarSesion() {
    await celebrarSesion(sesionActivaFecha);
    aplicarSesiones(await listarSesiones());
  }
  async function agregarPunto(datos) {
    const creado = conSync(await crearPunto(sesionActivaFecha, datos));
    const nuevos = [...puntos, creado];
    setPuntos(nuevos);
    guardarCache(cachePuntos(sesionActivaFecha), nuevos);
  }

  const cargando = Object.values(cargas).some((c) => c.cargando);
  const error = Object.values(cargas).map((c) => c.error).find(Boolean) ?? null;

  const sesionSeleccionada = fechasSesiones.find((f) => f.id === sesionActivaFecha);
  const sesionActual = sesionSeleccionada
    ? { titulo: `Sesión Ordinaria N° ${sesionSeleccionada.numeroSesion}`, subtitulo: sesionSeleccionada.label }
    : { titulo: 'Sesión Ordinaria', subtitulo: 'Fecha por definir' };
  const sesionFinalizada = !!sesionSeleccionada?.celebrada;

  const value = {
    sesionActual, nuevoPunto,
    SECCIONES_DOCUMENTO: catalogos.secciones, REMITENTES: catalogos.remitentes,
    FECHAS_SESIONES: fechasSesiones,
    sesionActivaFecha, cargarSesion,
    sesionFinalizada, finalizarSesion,
    PUNTOS: puntos, agregarPunto,
    agregarSesiones,
    guardarBorrador, obtenerBorrador, eliminarBorrador,
    cargando, error,
  };
  return <ProyectoContext.Provider value={value}>{children}</ProyectoContext.Provider>;
}

export function useProyecto() {
  return useContext(ProyectoContext);
}
