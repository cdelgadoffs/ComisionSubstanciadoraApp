import Topbar from '../components/L1/Topbar.jsx';
import Sidebar1 from '../components/L1/Sidebar1.jsx';
import Sidebar3 from '../components/L1/Sidebar3.jsx';
import Sidebar5 from '../components/L1/Sidebar5.jsx';
import PanelPrincipal from '../components/L1/PanelPrincipal.jsx';
import MenuPrincipalSesion from '../components/L3/MenuPrincipalSesion.jsx';
import BotonSalirSesion from '../components/L3/BotonSalirSesion.jsx';
import { useUI } from '../context/UIContext.jsx';
import { useProyecto } from '../context/ProyectoContext.jsx';
import '../styles/pages/SesionPrevia.css';

export default function SesionPrevia() {
  const {
    izquierdaSidebar1, izquierdaSidebar3, panelIzquierda,
    sidebar3Abierto, setSidebar3Abierto,
    sidebar5Abierto, setSidebar5Abierto,
    terminoBusqueda, setTerminoBusqueda,
  } = useUI();
  const { sesionActual, nuevoPunto } = useProyecto();

  return (
    <>
      <Topbar
        onToggleSidebar={() => setSidebar5Abierto((a) => !a)}
        terminoBusqueda={terminoBusqueda}
        onCambiarBusqueda={setTerminoBusqueda}
      >
        <BotonSalirSesion />
      </Topbar>
      <Sidebar1
        izquierda={izquierdaSidebar1}
        titulo={sesionActual.titulo}
        subtitulo={sesionActual.subtitulo}
      >
        <MenuPrincipalSesion />
      </Sidebar1>
      <Sidebar3
        abierto={sidebar3Abierto}
        izquierda={izquierdaSidebar3}
        onCerrar={() => setSidebar3Abierto(false)}
        badge={nuevoPunto.badge}
      />
      <Sidebar5
        abierto={sidebar5Abierto}
        onCerrar={() => setSidebar5Abierto(false)}
      />
      <PanelPrincipal izquierda={panelIzquierda}>
        <div className="pg-sesion-previa">
          <h1 className="pg-sesion-previa-titulo">Celebrar sesión</h1>
          <p className="pg-sesion-previa-texto">Aún no hay sesión programada.</p>
        </div>
      </PanelPrincipal>
    </>
  );
}
