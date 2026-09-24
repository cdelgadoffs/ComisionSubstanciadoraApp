import '../../styles/L2/BotonMenuLateral.css';

export default function BotonMenuLateral({ variant = 'icono', onClick, ariaLabel, children }) {
  return (
    <button
      type="button"
      className={'lvl2-boton-menu-lateral lvl2-boton-menu-lateral-' + variant}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {variant === 'icono' ? '☰' : children}
    </button>
  );
}
