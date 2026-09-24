import '../../styles/L1/PanelPrincipal.css';

export default function PanelPrincipal({ izquierda = 0, arriba = 52, children }) {
  return (
    <main className="lvl1-panel-principal" style={{ left: izquierda, top: arriba, height: `calc(100vh - ${arriba}px)` }}>
      {children}
    </main>
  );
}
