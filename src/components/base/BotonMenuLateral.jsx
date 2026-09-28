import '../../styles/base/BotonMenuLateral.css';

export default function BotonMenuLateral({ onClick, ariaLabel }) {
  return (
    <button type="button" className="base-boton-menu-lateral" onClick={onClick} aria-label={ariaLabel}>
      ☰
    </button>
  );
}
