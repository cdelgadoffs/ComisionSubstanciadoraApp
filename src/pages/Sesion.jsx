import Topbar from '../components/widgets/Topbar.jsx';
import Sidebar1 from '../components/base/Sidebar1.jsx';
import Sidebar2 from '../components/base/Sidebar2.jsx';
import Sidebar5 from '../components/base/Sidebar5.jsx';
import PanelPrincipal from '../components/base/PanelPrincipal.jsx';
import MenuPrincipalSesion from '../components/widgets/MenuPrincipalSesion.jsx';
import MenuPanelControl, { AccionesHeaderPanelControl } from '../components/widgets/MenuPanelControl.jsx';
import { useUI, ANCHO_SIDEBAR2 } from '../context/UIContext.jsx';
import { useProyecto } from '../context/ProyectoContext.jsx';
import { encabezadoSesion } from '../utils/sesiones.js';

export default function Sesion() {
  const {
    izquierdaSidebar1, izquierdaSidebar2,
    sidebar5Abierto, cerrarSidebar5,
    sidebar5Ancho,
    terminoBusqueda, setTerminoBusqueda,
  } = useUI();
  const { sesionSeleccionada, PUNTOS } = useProyecto();
  const sesionActual = encabezadoSesion(sesionSeleccionada);
  const panelIzquierda = izquierdaSidebar2 + ANCHO_SIDEBAR2;

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
        izquierda={izquierdaSidebar2}
        badge="Sesión en curso"
        subtitulo={`${PUNTOS.length} ${PUNTOS.length === 1 ? 'punto' : 'puntos'}`}
        mostrarCerrar={false}
      />
      <Sidebar5
        abierto={sidebar5Abierto}
        ancho={sidebar5Ancho}
        accionesHeader={<AccionesHeaderPanelControl />}
        onCerrar={cerrarSidebar5}
      >
        <MenuPanelControl />
      </Sidebar5>
      <PanelPrincipal izquierda={panelIzquierda} />
    </>
  );
}
