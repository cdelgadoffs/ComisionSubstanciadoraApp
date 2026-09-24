import Topbar from '../components/L1/Topbar.jsx';
import Sidebar1 from '../components/L1/Sidebar1.jsx';
import Sidebar2 from '../components/L1/Sidebar2.jsx';
import Sidebar3 from '../components/L1/Sidebar3.jsx';
import Sidebar5 from '../components/L1/Sidebar5.jsx';
import PanelPrincipal from '../components/L1/PanelPrincipal.jsx';
import MenuPrincipalSesion from '../components/L3/MenuPrincipalSesion.jsx';
import BotonSalirSesion from '../components/L3/BotonSalirSesion.jsx';
import MenuPanelControl, { AccionesHeaderPanelControl } from '../components/L3/MenuPanelControl.jsx';
import { useUI, ANCHO_SIDEBAR2, ANCHO_SIDEBAR3 } from '../context/UIContext.jsx';
import { useProyecto } from '../context/ProyectoContext.jsx';
import '../styles/pages/Historial.css';

export default function Historial() {
  const {
    izquierdaSidebar1, izquierdaSidebar2, izquierdaSidebar3,
    sidebar2Abierto, setSidebar2Abierto,
    sidebar3Abierto, setSidebar3Abierto,
    sidebar5Abierto, toggleSidebar5, cerrarSidebar5,
    sidebar5Ancho,
    terminoBusqueda, setTerminoBusqueda,
  } = useUI();
  const { sesionActual, sesionEnCurso, nuevoPunto } = useProyecto();
  const panelIzquierda = izquierdaSidebar2
    + (sidebar2Abierto ? ANCHO_SIDEBAR2 : 0)
    + (sidebar3Abierto ? ANCHO_SIDEBAR3 : 0);

  return (
    <>
      <Topbar
        onToggleSidebar={toggleSidebar5}
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
      <Sidebar2
        abierto={sidebar2Abierto}
        izquierda={izquierdaSidebar2}
        onCerrar={() => setSidebar2Abierto(false)}
        badge={sesionEnCurso.badge}
        subtitulo={sesionEnCurso.subtitulo}
      />
      <Sidebar3
        abierto={sidebar3Abierto}
        izquierda={izquierdaSidebar3}
        onCerrar={() => setSidebar3Abierto(false)}
        badge={nuevoPunto.badge}
      />
      <Sidebar5
        abierto={sidebar5Abierto}
        ancho={sidebar5Ancho}
        accionesHeader={<AccionesHeaderPanelControl />}
        onCerrar={cerrarSidebar5}
      >
        <MenuPanelControl />
      </Sidebar5>
      <PanelPrincipal izquierda={panelIzquierda}>
        <div className="pg-historial">
          <h1 className="pg-historial-titulo">Historial</h1>
          <p className="pg-historial-texto">Aún no hay actas generadas.</p>
        </div>
      </PanelPrincipal>
    </>
  );
}
