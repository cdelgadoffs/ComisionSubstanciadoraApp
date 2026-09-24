import BotonMenuLateral from '../L2/BotonMenuLateral.jsx';

export default function Sidebar2({ abierto = true, izquierda = 0, arriba = 52, badge, subtitulo, onCerrar, children }) {
  return (
    <aside className={'lvl1-sidebar2' + (abierto ? '' : ' lvl1-sidebar2-oculto')} style={{ left: izquierda, top: arriba, height: `calc(100vh - ${arriba}px)` }}>
      <div className="lvl1-sb-header">
        <div className="lvl1-sb-header-top">
          <div className="lvl1-sb-badge">{badge}</div>
          <BotonMenuLateral variant="cerrar" ariaLabel="Cerrar panel" onClick={onCerrar}>✕</BotonMenuLateral>
        </div>
        <div className="lvl1-sb-subtitle">{subtitulo}</div>
      </div>
      {children}
    </aside>
  );
}
