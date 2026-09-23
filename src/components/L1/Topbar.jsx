import BotonMenuLateral from '../L2/BotonMenuLateral.jsx';
import BuscadorGlobal from '../L2/BuscadorGlobal.jsx';
import FechaDia from '../L2/FechaDia.jsx';
import BotonS from '../L2/BotonS.jsx';

export default function Topbar({ onToggleSidebar, terminoBusqueda, onCambiarBusqueda, textoBotonSalir, onSalir }) {
  return (
    <header className="lvl1-topbar">
      <div className="lvl1-topbar-left">
        {onToggleSidebar && (
          <BotonMenuLateral variant="icono" ariaLabel="Alternar panel" onClick={onToggleSidebar}>☰</BotonMenuLateral>
        )}
        <img
          className="lvl1-topbar-logo"
          src="https://raw.githubusercontent.com/cdelgadoffs/CGD/535876195bedc1b602f98438ee3a42ff11cbb817/logo.png"
          alt="Logo institucional"
        />
      </div>
      <div className="lvl1-topbar-right">
        <BuscadorGlobal value={terminoBusqueda} onChange={onCambiarBusqueda} placeholder="Buscar punto..." />
        <FechaDia />
        <BotonS onClick={onSalir}>{textoBotonSalir}</BotonS>
      </div>
    </header>
  );
}
