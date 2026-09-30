import '../../styles/base/BotonIcono.css';

export default function BotonIcono({ icono, onClick, ariaLabel, disabled }) {
  return (
    <button
      type="button"
      className="base-boton-icono"
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      disabled={disabled}
    >
      <i className={icono}></i>
    </button>
  );
}
