import BotonMenuLateral from '../L2/BotonMenuLateral.jsx';

export default function Sidebar1({ abierto = true, izquierda = 0, onCerrar, children }) {
  return (
    <aside className={'l1-sidebar1' + (abierto ? '' : ' l1-sidebar1-oculto')} style={{ left: izquierda }}>
      <div className="l2-sb-header">
        <div className="l2-sb-header-top">
          <div className="l2-sb-title">Sesión Ordinaria N° 1</div>
          <BotonMenuLateral variant="cerrar" ariaLabel="Cerrar panel" onClick={onCerrar}>✕</BotonMenuLateral>
        </div>
        <div className="l2-sb-subtitle">Fecha por definir</div>
      </div>
      {children}
    </aside>
  );
}
