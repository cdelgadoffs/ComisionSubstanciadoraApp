import BotonMenuLateral from '../L2/BotonMenuLateral.jsx';

export default function Sidebar5({ abierto = false, arriba = 52, onCerrar, children }) {
  return (
    <aside className={'lvl1-sidebar5' + (abierto ? ' lvl1-sidebar5-open' : '')} style={{ top: arriba, height: `calc(100vh - ${arriba}px)` }}>
      <div className="lvl1-sb-header">
        <div className="lvl1-sb-header-top">
          <div className="lvl1-sb-title">Panel de control</div>
          <BotonMenuLateral variant="cerrar" ariaLabel="Cerrar panel" onClick={onCerrar}>✕</BotonMenuLateral>
        </div>
      </div>
      {children}
    </aside>
  );
}
