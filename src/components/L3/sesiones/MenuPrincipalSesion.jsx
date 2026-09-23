import BotonSeleccionableMenu from '../../L2/BotonSeleccionableMenu.jsx';
import { VISTAS_MENU_PRINCIPAL } from './datosSesionActual.js';

export default function MenuPrincipalSesion({ vistaActual, onCambiarVista }) {
  return (
    <>
      {VISTAS_MENU_PRINCIPAL.map((v) => (
        <BotonSeleccionableMenu
          key={v.id}
          activo={vistaActual === v.id}
          badge={v.badge}
          onClick={() => onCambiarVista && onCambiarVista(v.id)}
        >
          {v.label}
        </BotonSeleccionableMenu>
      ))}
    </>
  );
}
