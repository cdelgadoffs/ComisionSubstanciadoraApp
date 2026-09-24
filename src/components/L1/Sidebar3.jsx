import BotonMenuLateral from '../L2/BotonMenuLateral.jsx';

export default function Sidebar3({ abierto = true, izquierda = 0, arriba = 52, badge, onCerrar, children }) {
  return (
    <aside className={'lvl1-sidebar3' + (abierto ? '' : ' lvl1-sidebar3-oculto')} style={{ left: izquierda, top: arriba, height: `calc(100vh - ${arriba}px)` }}>
      <div className="lvl1-sb-header">
        <div className="lvl1-sb-header-top">
          <div className="lvl1-sb-badge">{badge}</div>
          <BotonMenuLateral variant="cerrar" ariaLabel="Cerrar panel" onClick={onCerrar}>✕</BotonMenuLateral>
        </div>
      </div>
      {children}
    </aside>
  );
}
