import Topbar from '../components/L1/Topbar.jsx';
import CintaSesiones from '../components/L1/CintaSesiones.jsx';
import Sidebar1 from '../components/L1/Sidebar1.jsx';
import Sidebar3 from '../components/L1/Sidebar3.jsx';
import Sidebar5 from '../components/L1/Sidebar5.jsx';
import PanelPrincipal from '../components/L1/PanelPrincipal.jsx';
import MenuPrincipalSesion from '../components/L3/MenuPrincipalSesion.jsx';
import BotonSalirSesion from '../components/L3/BotonSalirSesion.jsx';
import { useUI, ANCHO_SIDEBAR3, ALTO_TOPBAR, ALTO_CINTA } from '../context/UIContext.jsx';
import { useProyecto } from '../context/ProyectoContext.jsx';
import '../styles/pages/ProyectoOrdenDia.css';

export default function ProyectoOrdenDia() {
  const {
    izquierdaSidebar1, izquierdaSidebar3,
    sidebar3Abierto, setSidebar3Abierto,
    sidebar5Abierto, setSidebar5Abierto,
    terminoBusqueda, setTerminoBusqueda,
  } = useUI();
  const { sesionActual, nuevoPunto, FECHAS_SESIONES } = useProyecto();
  const panelIzquierda = izquierdaSidebar3 + (sidebar3Abierto ? ANCHO_SIDEBAR3 : 0);
  const arriba = ALTO_TOPBAR + ALTO_CINTA;

  return (
    <>
      <Topbar
        onToggleSidebar={() => setSidebar5Abierto((a) => !a)}
        terminoBusqueda={terminoBusqueda}
        onCambiarBusqueda={setTerminoBusqueda}
      >
        <BotonSalirSesion />
      </Topbar>
      <CintaSesiones fechas={FECHAS_SESIONES} textoVacio="Aún no hay sesiones programadas." />
      <Sidebar1
        izquierda={izquierdaSidebar1}
        arriba={arriba}
        titulo={sesionActual.titulo}
        subtitulo={sesionActual.subtitulo}
      >
        <MenuPrincipalSesion />
      </Sidebar1>
      <Sidebar3
        abierto={sidebar3Abierto}
        izquierda={izquierdaSidebar3}
        arriba={arriba}
        onCerrar={() => setSidebar3Abierto(false)}
        badge={nuevoPunto.badge}
      />
      <Sidebar5
        abierto={sidebar5Abierto}
        arriba={arriba}
        onCerrar={() => setSidebar5Abierto(false)}
      />
      <PanelPrincipal izquierda={panelIzquierda} arriba={arriba}>
        <div className="pg-proyecto">
          <h1 className="pg-proyecto-titulo">Proyecto del orden del día</h1>
          <p className="pg-proyecto-texto">Aún no hay puntos agregados.</p>
        </div>
      </PanelPrincipal>
    </>
  );
}
