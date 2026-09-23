import '../../styles/L2/BotonAgregar.css';

export default function BotonAgregar({ onClick, children }) {
  return (
    <button
      type="button"
      className="lvl2-boton-agregar"
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
    >
      {children}
    </button>
  );
}
