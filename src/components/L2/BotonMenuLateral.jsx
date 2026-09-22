import '../../styles/BotonMenuLateral.css';

export default function BotonMenuLateral({ variant = 'icono', onClick, ariaLabel, children }) {
  return (
    <button
      type="button"
      className={'l2-boton-menu-lateral l2-boton-menu-lateral-' + variant}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
