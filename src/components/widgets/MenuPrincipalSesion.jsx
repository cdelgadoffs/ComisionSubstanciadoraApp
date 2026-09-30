import { useState } from 'react';
import BotonSeleccionableMenu from '../base/BotonSeleccionableMenu.jsx';
import SubMenuDD from './SubMenuDD.jsx';
import { useProyecto } from '../../context/ProyectoContext.jsx';
import { useUI } from '../../context/UIContext.jsx';

export default function MenuPrincipalSesion() {
  const { VISTAS_MENU_PRINCIPAL, SECCIONES_DOCUMENTO } = useProyecto();
  const {
    vistaActual, setVistaActual,
    acordeonAbierto, setAcordeonAbierto,
    setSidebar3Abierto, setSeccionNuevoPunto,
  } = useUI();
  const [seccionActiva, setSeccionActiva] = useState(null);

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
        return (
          <div key={v.id}>
            <BotonSeleccionableMenu
              activo={activo}
              badge={v.badge}
              expandible={v.expandible}
              expandido={expandido}
              onClick={() => seleccionarVista(v)}
            >
              {v.label}
            </BotonSeleccionableMenu>
            {expandido && (
              <SubMenuDD
                items={SECCIONES_DOCUMENTO}
                activoId={seccionActiva}
                onSeleccionar={(seccionId) => { setSeccionActiva(seccionId); setSeccionNuevoPunto(seccionId); setSidebar3Abierto(true); }}
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
