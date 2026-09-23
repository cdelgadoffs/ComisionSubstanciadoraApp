import '../../styles/L2/BotonS.css';

export default function BotonS({ onClick, children }) {
  return (
    <button type="button" className="lvl2-boton-s" onClick={onClick}>
      {children}
    </button>
  );
}
