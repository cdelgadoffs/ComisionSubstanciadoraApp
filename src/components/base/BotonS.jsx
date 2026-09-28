import '../../styles/base/BotonS.css';

export default function BotonS({ onClick, children }) {
  return (
    <button type="button" className="base-boton-s" onClick={onClick}>
      {children}
    </button>
  );
}
