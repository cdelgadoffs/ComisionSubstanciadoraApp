import BotonSeleccionablePanel from '../base/BotonSeleccionablePanel.jsx';
import CalendarizacionMensual, { BotonNuevoCalendarioMensual } from '../../pages/panelcontrol/CalendarizacionMensual.jsx';
import Quorum from '../../pages/panelcontrol/Quorum.jsx';
import { useUI } from '../../context/UIContext.jsx';

const ITEMS_PANEL_CONTROL = [
  { id: 'calendarizacionMensual', label: 'Calendarización mensual', Panel: CalendarizacionMensual, AccionHeader: BotonNuevoCalendarioMensual },
  { id: 'quorum', label: 'Quorum', Panel: Quorum },
];

export function AccionesHeaderPanelControl() {
  const { panelControlActivo } = useUI();
  const item = ITEMS_PANEL_CONTROL.find((i) => i.id === panelControlActivo);
  if (!item || !item.AccionHeader) return null;
  const AccionHeader = item.AccionHeader;
  return <AccionHeader />;
}

export default function MenuPanelControl() {
  const { panelControlActivo, setPanelControlActivo } = useUI();
  const activo = ITEMS_PANEL_CONTROL.find((i) => i.id === panelControlActivo);

  if (activo) {
    const Panel = activo.Panel;
    return <Panel />;
  }

  return (
    <>
      {ITEMS_PANEL_CONTROL.map((item) => (
        <BotonSeleccionablePanel key={item.id} onClick={() => setPanelControlActivo(item.id)}>
          {item.label}
        </BotonSeleccionablePanel>
      ))}
    </>
  );
}
