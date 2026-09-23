import '../../styles/L1/PanelPrincipal.css';

export default function PanelPrincipal({ izquierda = 0, children }) {
  return (
    <main className="lvl1-panel-principal" style={{ left: izquierda }}>
      {children}
    </main>
  );
}
