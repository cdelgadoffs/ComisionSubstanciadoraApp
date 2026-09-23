import Sidebar1 from '../components/L1/Sidebar1.jsx';
import Sidebar2 from '../components/L1/Sidebar2.jsx';
import Sidebar3 from '../components/L1/Sidebar3.jsx';
import PanelPrincipal from '../components/L1/PanelPrincipal.jsx';
import MenuPrincipalSesion from '../components/L3/sesiones/MenuPrincipalSesion.jsx';
import { sesionActual, sesionEnCurso, nuevoPunto } from '../components/L3/sesiones/datosSesionActual.js';
import '../styles/Inicio.css';

export default function Inicio({ sidebar1, sidebar2, sidebar3, panelIzquierda, vistaActual, onCambiarVista, onAgregarPunto }) {
  return (
    <>
      <Sidebar1
        izquierda={sidebar1.izquierda}
        titulo={sesionActual.titulo}
        subtitulo={sesionActual.subtitulo}
      >
        <MenuPrincipalSesion vistaActual={vistaActual} onCambiarVista={onCambiarVista} onAgregarPunto={onAgregarPunto} />
      </Sidebar1>
      <Sidebar2
        abierto={sidebar2.abierto}
        izquierda={sidebar2.izquierda}
        onCerrar={sidebar2.onCerrar}
        badge={sesionEnCurso.badge}
        subtitulo={sesionEnCurso.subtitulo}
      />
      <Sidebar3
        abierto={sidebar3.abierto}
        izquierda={sidebar3.izquierda}
        onCerrar={sidebar3.onCerrar}
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
