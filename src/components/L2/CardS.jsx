import '../../styles/L2/CardS.css';

export default function CardS({ estado, titulo, subtitulo, estadoLabel, onClick, onEliminar, eliminarDeshabilitado }) {
  return (
    <div className={'lvl2-card-s' + (estado ? ' lvl2-card-s-' + estado : '')} onClick={onClick}>
      <div className="lvl2-card-s-top">
        <span className="lvl2-card-s-titulo">{titulo}</span>
        {estadoLabel && <span className="lvl2-card-s-estado">{estadoLabel}</span>}
      </div>
      <div className="lvl2-card-s-bottom">
        <span className="lvl2-card-s-subtitulo">{subtitulo}</span>
        {onEliminar && (
          <button
            type="button"
            className="lvl2-card-s-eliminar"
            disabled={eliminarDeshabilitado}
            title={eliminarDeshabilitado ? 'No se puede eliminar' : 'Eliminar'}
            onClick={(e) => { e.stopPropagation(); onEliminar(); }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
