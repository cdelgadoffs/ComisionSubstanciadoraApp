import { useState } from 'react';
import BotonSeleccionableMenu from '../../L2/BotonSeleccionableMenu.jsx';
import SubMenuDD from '../../L2/SubMenuDD.jsx';
import { VISTAS_MENU_PRINCIPAL, SECCIONES_DOCUMENTO } from './datosSesionActual.js';

export default function MenuPrincipalSesion({ vistaActual, onCambiarVista, onAgregarPunto }) {
  const [acordeonAbierto, setAcordeonAbierto] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState(null);

  function seleccionarVista(v) {
    if (v.expandible) {
      if (vistaActual === v.id) {
        setAcordeonAbierto((a) => !a);
      } else {
        onCambiarVista && onCambiarVista(v.id);
        setAcordeonAbierto(true);
      }
      return;
    }
    onCambiarVista && onCambiarVista(v.id);
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
                onSeleccionar={setSeccionActiva}
                onAgregar={(seccionId) => onAgregarPunto && onAgregarPunto(seccionId)}
                iconoAgregar="+"
              />
            )}
          </div>
        );
      })}
    </>
  );
}
