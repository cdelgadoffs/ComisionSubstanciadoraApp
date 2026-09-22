import BotonMenuLateral from '../L2/BotonMenuLateral.jsx';

export default function Sidebar3({ abierto = true, izquierda = 0, onCerrar, children }) {
  return (
    <aside className={'l1-sidebar3' + (abierto ? '' : ' l1-sidebar3-oculto')} style={{ left: izquierda }}>
      <div className="l2-sb-header">
        <div className="l2-sb-header-top">
          <div className="l2-sb-badge">Nuevo punto</div>
          <BotonMenuLateral variant="cerrar" ariaLabel="Cerrar panel" onClick={onCerrar}>✕</BotonMenuLateral>
        </div>
      </div>
      {children}
    </aside>
  );
}
