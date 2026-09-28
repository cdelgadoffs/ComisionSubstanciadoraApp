import '../../styles/base/Sidebar5.css';

export default function Sidebar5({ abierto = false, ancho = false, arriba = 52, accionesHeader, onCerrar, mostrarCerrar = true, children }) {
  return (
    <aside
      className={'base-sidebar5' + (abierto ? ' base-sidebar5-open' : '') + (ancho ? ' base-sidebar5-ancho' : '')}
      style={{ top: arriba, height: `calc(100vh - ${arriba}px)` }}
    >
      <div className="base-sidebar5-header">
        <div className="base-sidebar5-header-top">
          <div className="base-sidebar5-title">Panel de control</div>
          <div className="base-sidebar5-header-acciones">
            {accionesHeader}
            {mostrarCerrar && (
              <button type="button" className="base-sidebar5-cerrar" aria-label="Cerrar panel" onClick={onCerrar}>✕</button>
            )}
          </div>
        </div>
      </div>
      <nav className="base-sidebar5-nav">{children}</nav>
    </aside>
  );
}
