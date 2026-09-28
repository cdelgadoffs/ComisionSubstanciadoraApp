import '../../styles/base/Sidebar4.css';

export default function Sidebar4({ abierto = false, onCerrar, mostrarCerrar = true, children }) {
  return (
    <aside className={'base-sidebar4' + (abierto ? ' base-sidebar4-open' : '')}>
      <div className="base-sidebar4-header">
        <div className="base-sidebar4-header-top">
          <div className="base-sidebar4-title">Esquema</div>
          {mostrarCerrar && (
            <button type="button" className="base-sidebar4-cerrar" aria-label="Cerrar panel" onClick={onCerrar}>✕</button>
          )}
        </div>
      </div>
      {children}
    </aside>
  );
}
