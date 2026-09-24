import BotonMenuLateral from '../L2/BotonMenuLateral.jsx';

export default function Sidebar5({ abierto = false, ancho = false, arriba = 52, accionesHeader, onCerrar, children }) {
  return (
    <aside
      className={'lvl1-sidebar5' + (abierto ? ' lvl1-sidebar5-open' : '') + (ancho ? ' lvl1-sidebar5-ancho' : '')}
      style={{ top: arriba, height: `calc(100vh - ${arriba}px)` }}
    >
      <div className="lvl1-sb-header">
        <div className="lvl1-sb-header-top">
          <div className="lvl1-sb-title">Panel de control</div>
          <div className="lvl1-sb-header-acciones">
            {accionesHeader}
            <BotonMenuLateral variant="cerrar" ariaLabel="Cerrar panel" onClick={onCerrar}>✕</BotonMenuLateral>
          </div>
        </div>
      </div>
      <nav className="lvl1-sb-nav">{children}</nav>
    </aside>
  );
}
