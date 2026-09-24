import Sidebar1 from '../components/L1/Sidebar1.jsx';
import Sidebar2 from '../components/L1/Sidebar2.jsx';
import Sidebar3 from '../components/L1/Sidebar3.jsx';
import PanelPrincipal from '../components/L1/PanelPrincipal.jsx';
import MenuPrincipalSesion from '../components/L3/MenuPrincipalSesion.jsx';
import { useUI } from '../context/UIContext.jsx';
import { useProyecto } from '../context/ProyectoContext.jsx';
import '../styles/pages/Inicio.css';

export default function Inicio() {
  const {
    izquierdaSidebar1, izquierdaSidebar2, izquierdaSidebar3, panelIzquierda,
    sidebar2Abierto, setSidebar2Abierto,
    sidebar3Abierto, setSidebar3Abierto,
  } = useUI();
  const { sesionActual, sesionEnCurso, nuevoPunto } = useProyecto();

  return (
    <>
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
      <PanelPrincipal izquierda={panelIzquierda}>
        <div className="pg-inicio">
          <h1 className="pg-inicio-titulo">Inicio</h1>
          <p className="pg-inicio-texto">Aún no hay una sesión en curso.</p>
        </div>
      </PanelPrincipal>
    </>
  );
}
