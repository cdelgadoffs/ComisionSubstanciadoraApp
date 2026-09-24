import '../../styles/L2/BotonAgregar.css';

export default function BotonAgregar({ onClick, etiqueta, children }) {
  return (
    <button
      type="button"
      className={'lvl2-boton-agregar' + (etiqueta ? ' lvl2-boton-agregar-expandible' : '')}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
    >
      {children}
      {etiqueta && <span className="lvl2-boton-agregar-etiqueta">{etiqueta}</span>}
    </button>
  );
}
