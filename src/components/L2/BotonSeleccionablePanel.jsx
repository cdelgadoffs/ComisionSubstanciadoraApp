import '../../styles/L2/BotonSeleccionablePanel.css';

export default function BotonSeleccionablePanel({ activo = false, onClick, children }) {
  return (
    <div
      className={'lvl2-boton-seleccionable-panel' + (activo ? ' lvl2-boton-seleccionable-panel-activo' : '')}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
