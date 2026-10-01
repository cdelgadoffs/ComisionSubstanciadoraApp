import Card from '../base/Card.jsx';
import IndicadorSync from '../base/IndicadorSync.jsx';
import { useProyecto } from '../../context/ProyectoContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import '../../styles/widgets/ListaPuntosProyecto.css';

function TarjetaPunto({ punto, titulo, requiereAcuerdo, nombreRemitente }) {
  const esInforme = !requiereAcuerdo;
  return (
    <Card>
      <div className="widget-lista-puntos-header">
        <span className={'widget-lista-puntos-titulo' + (punto.confidencial ? ' widget-lista-puntos-titulo-confidencial' : '')}>
          {titulo}
        </span>
        <div className="widget-lista-puntos-header-derecha">
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
          {punto.archivos.map((a, i) => (
            <span key={i} className="widget-lista-puntos-archivo">{a.nombre}</span>
          ))}
        </div>
      )}
    </Card>
  );
}

function listaDeSeccion(puntos, seccion, remitentes) {
  const deLaSeccion = puntos.filter((p) => p.seccion === seccion.id);
  if (deLaSeccion.length === 0) {
    return <div className="widget-lista-puntos-vacio">Sin puntos en {seccion.nombre}.</div>;
  }
  return deLaSeccion.map((p, i) => (
    <TarjetaPunto
      key={p.id}
      punto={p}
      titulo={`${seccion.nombre} ${i + 1}`}
      requiereAcuerdo={seccion.requiereAcuerdo}
      nombreRemitente={remitentes.find((r) => r.id === p.remitente)?.nombre ?? p.remitente}
    />
  ));
}

export default function ListaPuntosProyecto() {
  const { PUNTOS: puntos, SECCIONES_DOCUMENTO, REMITENTES } = useProyecto();
  const { seccionActivaProyecto, vistaCompletaProyecto } = useUI();

  if (vistaCompletaProyecto) {
    return (
      <div className="widget-lista-puntos-proyecto">
        {SECCIONES_DOCUMENTO.map((s) => (
          <div key={s.id} className="widget-lista-puntos-grupo">
            <div className="widget-lista-puntos-separador">{s.nombre}</div>
            {listaDeSeccion(puntos, s, REMITENTES)}
          </div>
        ))}
      </div>
    );
  }

  const seccionId = seccionActivaProyecto ?? SECCIONES_DOCUMENTO[0]?.id;
  const seccion = SECCIONES_DOCUMENTO.find((s) => s.id === seccionId);

  return (
    <div className="widget-lista-puntos-proyecto">
      {seccion ? listaDeSeccion(puntos, seccion, REMITENTES) : (
        <div className="widget-lista-puntos-vacio">Sin secciones definidas.</div>
      )}
    </div>
  );
}
