import BotonMenuLateral from '../base/BotonMenuLateral.jsx';
import BuscadorGlobal from '../base/BuscadorGlobal.jsx';
import FechaDia from '../base/FechaDia.jsx';
import '../../styles/widgets/Topbar.css';

export default function Topbar({ onToggleSidebar, terminoBusqueda, onCambiarBusqueda, children }) {
  return (
    <header className="widget-topbar">
      <div className="widget-topbar-left">
        {onToggleSidebar && (
          <BotonMenuLateral ariaLabel="Alternar panel" onClick={onToggleSidebar} />
        )}
        <img
          className="widget-topbar-logo"
          src="https://raw.githubusercontent.com/cdelgadoffs/CGD/535876195bedc1b602f98438ee3a42ff11cbb817/logo.png"
          alt="Logo institucional"
        />
      </div>
      <div className="widget-topbar-right">
        <BuscadorGlobal value={terminoBusqueda} onChange={onCambiarBusqueda} placeholder="Buscar punto..." />
        <FechaDia />
        {children}
      </div>
    </header>
  );
}
