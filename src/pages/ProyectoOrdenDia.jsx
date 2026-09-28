import Topbar from '../components/widgets/Topbar.jsx';
import CintaSesiones from '../components/widgets/CintaSesiones.jsx';
import Sidebar1 from '../components/base/Sidebar1.jsx';
import Sidebar3 from '../components/base/Sidebar3.jsx';
import Sidebar5 from '../components/base/Sidebar5.jsx';
import PanelPrincipal from '../components/base/PanelPrincipal.jsx';
import MenuPrincipalSesion from '../components/widgets/MenuPrincipalSesion.jsx';
import BotonSalirSesion from '../components/widgets/BotonSalirSesion.jsx';
import MenuPanelControl, { AccionesHeaderPanelControl } from '../components/widgets/MenuPanelControl.jsx';
import { useUI, ANCHO_SIDEBAR3, ALTO_TOPBAR, ALTO_CINTA } from '../context/UIContext.jsx';
import { useProyecto } from '../context/ProyectoContext.jsx';
import '../styles/pages/ProyectoOrdenDia.css';

export default function ProyectoOrdenDia() {
  const {
    izquierdaSidebar1, izquierdaSidebar3,
    sidebar3Abierto, setSidebar3Abierto,
    sidebar5Abierto, toggleSidebar5, cerrarSidebar5,
    sidebar5Ancho,
    terminoBusqueda, setTerminoBusqueda,
  } = useUI();
  const { sesionActual, nuevoPunto, FECHAS_SESIONES } = useProyecto();
  const panelIzquierda = izquierdaSidebar3 + (sidebar3Abierto ? ANCHO_SIDEBAR3 : 0);
  const arriba = ALTO_TOPBAR + ALTO_CINTA;
  const arribaSidebar = arriba - 1;

  return (
    <>
      <Topbar
        onToggleSidebar={toggleSidebar5}
        terminoBusqueda={terminoBusqueda}
        onCambiarBusqueda={setTerminoBusqueda}
      >
        <BotonSalirSesion />
      </Topbar>
      <CintaSesiones fechas={FECHAS_SESIONES} textoVacio="Aún no hay sesiones programadas." />
      <Sidebar1
        izquierda={izquierdaSidebar1}
        arriba={arribaSidebar}
        titulo={sesionActual.titulo}
        subtitulo={sesionActual.subtitulo}
      >
        <MenuPrincipalSesion />
      </Sidebar1>
      <Sidebar3
        abierto={sidebar3Abierto}
        izquierda={izquierdaSidebar3}
        arriba={arribaSidebar}
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
      <PanelPrincipal izquierda={panelIzquierda} arriba={arriba}>
        <div className="pg-proyecto">
          <h1 className="pg-proyecto-titulo">Proyecto del orden del día</h1>
          <p className="pg-proyecto-texto">Aún no hay puntos agregados.</p>
        </div>
      </PanelPrincipal>
    </>
  );
}
