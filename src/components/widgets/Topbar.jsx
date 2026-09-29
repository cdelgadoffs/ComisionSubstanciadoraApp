import BuscadorGlobal from '../base/BuscadorGlobal.jsx';
import FechaDia from '../base/FechaDia.jsx';
import BotonS from '../base/BotonS.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import '../../styles/widgets/Topbar.css';

export default function Topbar({ terminoBusqueda, onCambiarBusqueda }) {
  const { toggleSidebar5 } = useUI();
  const { cerrarSesion } = useAuth();

  return (
    <header className="widget-topbar">
      <div className="widget-topbar-left">
        <button type="button" className="widget-topbar-menu" aria-label="Alternar panel" onClick={toggleSidebar5}>☰</button>
        <img
          className="widget-topbar-logo"
          src="https://raw.githubusercontent.com/cdelgadoffs/CGD/535876195bedc1b602f98438ee3a42ff11cbb817/logo.png"
          alt="Logo institucional"
        />
      </div>
      <div className="widget-topbar-right">
        <BuscadorGlobal value={terminoBusqueda} onChange={onCambiarBusqueda} placeholder="Buscar punto..." />
        <FechaDia />
        <BotonS onClick={cerrarSesion}>Salir</BotonS>
      </div>
    </header>
  );
}
