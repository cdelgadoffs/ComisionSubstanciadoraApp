import BotonMenuLateral from '../L2/BotonMenuLateral.jsx';

export default function Sidebar4({ abierto = false, onCerrar, children }) {
  return (
    <aside className={'lvl1-sidebar4' + (abierto ? ' lvl1-sidebar4-open' : '')}>
      <div className="lvl1-sb-header">
        <div className="lvl1-sb-header-top">
          <div className="lvl1-sb-title">Esquema</div>
          <BotonMenuLateral variant="cerrar" ariaLabel="Cerrar panel" onClick={onCerrar}>✕</BotonMenuLateral>
        </div>
      </div>
      {children}
    </aside>
  );
}
