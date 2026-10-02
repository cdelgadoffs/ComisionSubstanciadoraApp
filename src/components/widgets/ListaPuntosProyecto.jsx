import { useState } from 'react';
import Card from '../base/Card.jsx';
import IndicadorSync from '../base/IndicadorSync.jsx';
import BadgeDinamico from '../base/BadgeDinamico.jsx';
import OpcionesAUD from './OpcionesAUD.jsx';
import OpcionesNavegacion from './OpcionesNavegacion.jsx';
import { useProyecto } from '../../context/ProyectoContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { estiloArchivo, guardarEnDisco } from '../../utils/archivos.js';
import '../../styles/widgets/ListaPuntosProyecto.css';

function TarjetaPunto({ punto, titulo, requiereAcuerdo, nombreRemitente, opciones, onDescargar }) {
  const esInforme = !requiereAcuerdo;
  return (
    <Card>
      <div className="widget-lista-puntos-header">
        <span className={'widget-lista-puntos-titulo' + (punto.confidencial ? ' widget-lista-puntos-titulo-confidencial' : '')}>
          {titulo}
        </span>
        <div className="widget-lista-puntos-header-derecha">
          {opciones}
          <IndicadorSync estado={punto.sincronizacion} />
          <span className="widget-lista-puntos-dependencia">{nombreRemitente}</span>
        </div>
      </div>
      <div className="widget-lista-puntos-fila">
        <span className="widget-lista-puntos-label">{esInforme ? 'Informe' : 'Punto de acuerdo'}</span>
        <div className="widget-lista-puntos-contenido">{punto.contenido || 'Sin contenido'}</div>
      </div>
      {!esInforme && (
        <div className="widget-lista-puntos-fila">
          <span className="widget-lista-puntos-label">Acuerdo</span>
          <div className="widget-lista-puntos-acuerdo">{punto.acuerdo || 'Sin acuerdo'}</div>
        </div>
      )}
      {punto.archivos.length > 0 && (
        <div className="widget-lista-puntos-archivos">
          {punto.archivos.map((a, i) => {
            const { icono, tono } = estiloArchivo(a.nombre);
            return (
              <BadgeDinamico
                key={a.id ?? i}
                texto={a.nombre}
                icono={icono}
                tono={tono}
                onClick={a.id ? () => onDescargar(a) : undefined}
              />
            );
          })}
        </div>
      )}
    </Card>
  );
}

function listaDeSeccion(puntos, seccion, remitentes, estadoCarga, renderOpciones, onDescargar) {
  const deLaSeccion = puntos.filter((p) => p.seccion === seccion.id);
  if (deLaSeccion.length === 0) {
    if (estadoCarga === 'error') return null;
    if (estadoCarga === 'cargando') return <div className="widget-lista-puntos-vacio">Cargando…</div>;
    return <div className="widget-lista-puntos-vacio">Sin puntos en {seccion.nombre}.</div>;
  }
  return deLaSeccion.map((p, i) => (
    <TarjetaPunto
      key={p.id}
      punto={p}
      titulo={`${seccion.nombre} ${i + 1}`}
      requiereAcuerdo={seccion.requiereAcuerdo}
      nombreRemitente={remitentes.find((r) => r.id === p.remitente)?.nombre ?? p.remitente}
      opciones={renderOpciones(p, i, deLaSeccion, seccion.id)}
      onDescargar={onDescargar}
    />
  ));
}

export default function ListaPuntosProyecto({ opcionesOcultas = [], opcionesExtra }) {
  const { PUNTOS: puntos, SECCIONES_DOCUMENTO, REMITENTES, sesionFinalizada, descargarArchivo, reordenarPuntos, cargando, error } = useProyecto();
  const [errorAccion, setErrorAccion] = useState(null);
  const [moviendo, setMoviendo] = useState(false);
  const { seccionActivaProyecto, vistaCompletaProyecto } = useUI();
  const estadoCarga = error ? 'error' : cargando ? 'cargando' : 'listo';
  const avisoError = (error || errorAccion) && (
    <div className="widget-lista-puntos-error">
      {error ? `No se pudo cargar la información: ${error.mensaje}` : errorAccion}
    </div>
  );
  async function descargar(archivo) {
    setErrorAccion(null);
    try {
      const { nombre, blob } = await descargarArchivo(archivo.id);
      guardarEnDisco(nombre, blob);
    } catch (e) {
      setErrorAccion(e.mensaje || 'No se pudo descargar el archivo.');
    }
  }
  async function mover(seccionId, deLaSeccion, indice, delta) {
    if (moviendo) return;
    const ids = deLaSeccion.map((p) => p.id);
    [ids[indice], ids[indice + delta]] = [ids[indice + delta], ids[indice]];
    setMoviendo(true);
    setErrorAccion(null);
    try {
      await reordenarPuntos(seccionId, ids);
    } catch (e) {
      setErrorAccion(e.mensaje || 'No se pudo mover el punto.');
    } finally {
      setMoviendo(false);
    }
  }
  const renderOpciones = (punto, indice, deLaSeccion, seccionId) => (sesionFinalizada ? null : (
    <>
      {deLaSeccion.length > 1 && !opcionesOcultas.includes('mover') && (
        <OpcionesNavegacion
          orientacion="vertical"
          onAnterior={() => mover(seccionId, deLaSeccion, indice, -1)}
          onSiguiente={() => mover(seccionId, deLaSeccion, indice, 1)}
          anteriorDeshabilitado={moviendo || indice === 0}
          siguienteDeshabilitado={moviendo || indice === deLaSeccion.length - 1}
          etiquetaAnterior="Subir punto"
          etiquetaSiguiente="Bajar punto"
        />
      )}
      <OpcionesAUD punto={punto} ocultar={opcionesOcultas}>
        {opcionesExtra && opcionesExtra(punto)}
      </OpcionesAUD>
    </>
  ));

  if (vistaCompletaProyecto) {
    return (
      <div className="widget-lista-puntos-proyecto">
        {avisoError}
        {SECCIONES_DOCUMENTO.map((s) => (
          <div key={s.id} className="widget-lista-puntos-grupo">
            <div className="widget-lista-puntos-separador">{s.nombre}</div>
            {listaDeSeccion(puntos, s, REMITENTES, estadoCarga, renderOpciones, descargar)}
          </div>
        ))}
      </div>
    );
  }

  const seccionId = seccionActivaProyecto ?? SECCIONES_DOCUMENTO[0]?.id;
  const seccion = SECCIONES_DOCUMENTO.find((s) => s.id === seccionId);

  return (
    <div className="widget-lista-puntos-proyecto">
      {avisoError}
      {seccion ? listaDeSeccion(puntos, seccion, REMITENTES, estadoCarga, renderOpciones, descargar) : (
        estadoCarga === 'listo' && <div className="widget-lista-puntos-vacio">Sin secciones definidas.</div>
      )}
      {!seccion && estadoCarga === 'cargando' && <div className="widget-lista-puntos-vacio">Cargando…</div>}
    </div>
  );
}
