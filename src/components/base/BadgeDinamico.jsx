import '../../styles/base/BadgeDinamico.css';

export default function BadgeDinamico({ texto, icono, tono = 'gris', title, onClick, onEliminar }) {
  const contenido = (
    <>
      {icono && <i className={icono}></i>}
      <span className="base-badge-dinamico-texto">{texto}</span>
    </>
  );
  return (
    <span className={`base-badge-dinamico base-badge-dinamico-${tono}`} title={title ?? texto}>
      {onClick ? (
        <button type="button" className="base-badge-dinamico-boton" onClick={onClick}>{contenido}</button>
      ) : contenido}
      {onEliminar && (
        <button type="button" className="base-badge-dinamico-quitar" aria-label={`Quitar ${texto}`} onClick={onEliminar}>✕</button>
      )}
    </span>
  );
}
