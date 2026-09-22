import BotonMenuLateral from '../L2/BotonMenuLateral.jsx';

export default function Sidebar2({ abierto = true, izquierda = 0, onCerrar, children }) {
  return (
    <aside className={'l1-sidebar2' + (abierto ? '' : ' l1-sidebar2-oculto')} style={{ left: izquierda }}>
      <div className="l2-sb-header">
        <div className="l2-sb-header-top">
          <div className="l2-sb-badge">Sesión en curso</div>
          <BotonMenuLateral variant="cerrar" ariaLabel="Cerrar panel" onClick={onCerrar}>✕</BotonMenuLateral>
        </div>
        <div className="l2-sb-subtitle">0 puntos</div>
      </div>
      {children}
    </aside>
  );
}
