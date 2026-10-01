import BotonSeleccionableMenu from '../base/BotonSeleccionableMenu.jsx';
import SubMenuDD from './SubMenuDD.jsx';
import { useProyecto } from '../../context/ProyectoContext.jsx';
import { useUI } from '../../context/UIContext.jsx';

const VISTAS_MENU_PRINCIPAL = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'proyecto', label: 'Proyecto del orden del día', expandible: true, mostrarTotalPuntos: true },
  { id: 'sesionPrevia', label: 'Celebrar sesión', labelFinalizada: 'Sesión celebrada' },
  { id: 'actaSesion', label: 'Historial' },
];

export default function MenuPrincipalSesion() {
  const { SECCIONES_DOCUMENTO, PUNTOS, sesionFinalizada } = useProyecto();
  const {
    vistaActual, setVistaActual,
    acordeonAbierto, setAcordeonAbierto,
    sidebar3Abierto, setSidebar3Abierto, setSeccionNuevoPunto,
    seccionActivaProyecto, setSeccionActivaProyecto,
  } = useUI();

  const seccionesConBadge = SECCIONES_DOCUMENTO.map((s) => ({
    ...s,
    badge: PUNTOS.filter((p) => p.seccion === s.id).length,
  }));

  function seleccionarSeccion(seccionId) {
    setSeccionActivaProyecto(seccionId);
    if (sidebar3Abierto) setSeccionNuevoPunto(seccionId);
  }

  function seleccionarVista(v) {
    if (v.expandible) {
      if (vistaActual === v.id) {
        setAcordeonAbierto((a) => !a);
      } else {
        setVistaActual(v.id);
        setAcordeonAbierto(true);
      }
      return;
    }
    setVistaActual(v.id);
  }

  return (
    <>
      {VISTAS_MENU_PRINCIPAL.map((v) => {
        const activo = vistaActual === v.id;
        const expandido = v.expandible && activo && acordeonAbierto;
        const label = v.labelFinalizada && sesionFinalizada ? v.labelFinalizada : v.label;
        return (
          <div key={v.id}>
            <BotonSeleccionableMenu
              activo={activo}
              badge={v.mostrarTotalPuntos ? PUNTOS.length : undefined}
              expandible={v.expandible}
              expandido={expandido}
              onClick={() => seleccionarVista(v)}
            >
              {label}
            </BotonSeleccionableMenu>
            {expandido && (
              <SubMenuDD
                items={seccionesConBadge}
                activoId={seccionActivaProyecto}
                onSeleccionar={seleccionarSeccion}
                onAgregar={(seccionId) => { setSeccionNuevoPunto(seccionId); setSidebar3Abierto(true); }}
                iconoAgregar="+"
              />
            )}
          </div>
        );
      })}
    </>
  );
}
