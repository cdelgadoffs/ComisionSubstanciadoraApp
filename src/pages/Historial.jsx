import Topbar from '../components/widgets/Topbar.jsx';
import Sidebar1 from '../components/base/Sidebar1.jsx';
import Sidebar2 from '../components/base/Sidebar2.jsx';
import Sidebar3 from '../components/base/Sidebar3.jsx';
import Sidebar5 from '../components/base/Sidebar5.jsx';
import PanelPrincipal from '../components/base/PanelPrincipal.jsx';
import MenuPrincipalSesion from '../components/widgets/MenuPrincipalSesion.jsx';
import MenuPanelControl, { AccionesHeaderPanelControl } from '../components/widgets/MenuPanelControl.jsx';
import { useUI, ANCHO_SIDEBAR2, ANCHO_SIDEBAR3 } from '../context/UIContext.jsx';
import { useProyecto } from '../context/ProyectoContext.jsx';
import '../styles/pages/Historial.css';

export default function Historial() {
  const {
    izquierdaSidebar1, izquierdaSidebar2, izquierdaSidebar3,
    sidebar2Abierto, setSidebar2Abierto,
    sidebar3Abierto, setSidebar3Abierto,
    sidebar5Abierto, cerrarSidebar5,
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
        terminoBusqueda={terminoBusqueda}
        onCambiarBusqueda={setTerminoBusqueda}
      />
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
        badge={sesionEnCurso.badge}
        subtitulo={sesionEnCurso.subtitulo}
        onCerrar={() => setSidebar2Abierto(false)}
      />
      <Sidebar3
        abierto={sidebar3Abierto}
        izquierda={izquierdaSidebar3}
        badge={nuevoPunto.badge}
        onCerrar={() => setSidebar3Abierto(false)}
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
