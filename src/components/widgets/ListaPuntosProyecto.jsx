import Card from '../base/Card.jsx';
import { useProyecto } from '../../context/ProyectoContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import '../../styles/widgets/ListaPuntosProyecto.css';

function TarjetaPunto({ punto, titulo }) {
  const esInforme = punto.seccion === 'informes';
  return (
    <Card>
      <div className="widget-lista-puntos-header">
        <span className={'widget-lista-puntos-titulo' + (punto.confidencial ? ' widget-lista-puntos-titulo-confidencial' : '')}>
          {titulo}
        </span>
        <span className="widget-lista-puntos-dependencia">{punto.remitente}</span>
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

function listaDeSeccion(puntos, seccionId, nombreSeccion) {
  const deLaSeccion = puntos.filter((p) => p.seccion === seccionId);
  if (deLaSeccion.length === 0) {
    return <div className="widget-lista-puntos-vacio">Sin puntos en {nombreSeccion}.</div>;
  }
  return deLaSeccion.map((p, i) => (
    <TarjetaPunto key={p.id} punto={p} titulo={`${nombreSeccion} ${i + 1}`} />
  ));
}

export default function ListaPuntosProyecto() {
  const { PUNTOS: puntos, SECCIONES_DOCUMENTO } = useProyecto();
  const { seccionActivaProyecto, vistaCompletaProyecto } = useUI();

  if (vistaCompletaProyecto) {
    return (
      <div className="widget-lista-puntos-proyecto">
        {SECCIONES_DOCUMENTO.map((s) => (
          <div key={s.id} className="widget-lista-puntos-grupo">
            <div className="widget-lista-puntos-separador">{s.nombre}</div>
            {listaDeSeccion(puntos, s.id, s.nombre)}
          </div>
        ))}
      </div>
    );
  }

  const seccionId = seccionActivaProyecto ?? SECCIONES_DOCUMENTO[0]?.id;
  const seccion = SECCIONES_DOCUMENTO.find((s) => s.id === seccionId);

  return (
    <div className="widget-lista-puntos-proyecto">
      {seccion ? listaDeSeccion(puntos, seccion.id, seccion.nombre) : (
        <div className="widget-lista-puntos-vacio">Sin secciones definidas.</div>
      )}
    </div>
  );
}
