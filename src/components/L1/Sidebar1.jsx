import BotonMenuLateral from '../L2/BotonMenuLateral.jsx';

export default function Sidebar1({ abierto = true, izquierda = 0, titulo, subtitulo, onCerrar, children }) {
  return (
    <aside className={'lvl1-sidebar1' + (abierto ? '' : ' lvl1-sidebar1-oculto')} style={{ left: izquierda }}>
      <div className="lvl1-sb-header">
        <div className="lvl1-sb-header-top">
          <div className="lvl1-sb-title">{titulo}</div>
          <BotonMenuLateral variant="cerrar" ariaLabel="Cerrar panel" onClick={onCerrar}>✕</BotonMenuLateral>
        </div>
        <div className="lvl1-sb-subtitle">{subtitulo}</div>
      </div>
      <nav className="lvl1-sb-nav">{children}</nav>
    </aside>
  );
}
