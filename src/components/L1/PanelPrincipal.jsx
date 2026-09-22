import '../../styles/PanelPrincipal.css';

export default function PanelPrincipal({ izquierda = 0, children }) {
  return (
    <main className="l1-panel-principal" style={{ left: izquierda }}>
      {children}
    </main>
  );
}
