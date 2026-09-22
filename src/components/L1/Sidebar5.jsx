import BotonMenuLateral from '../L2/BotonMenuLateral.jsx';

export default function Sidebar5({ abierto = false, onCerrar, children }) {
  return (
    <aside className={'l1-sidebar5' + (abierto ? ' l1-sidebar5-open' : '')}>
      <div className="l2-sb-header">
        <div className="l2-sb-header-top">
          <div className="l2-sb-title">Panel de control</div>
          <BotonMenuLateral variant="cerrar" ariaLabel="Cerrar panel" onClick={onCerrar}>✕</BotonMenuLateral>
        </div>
      </div>
      {children}
    </aside>
  );
}
