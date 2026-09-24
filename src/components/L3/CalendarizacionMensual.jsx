import BotonSeleccionablePanel from '../L2/BotonSeleccionablePanel.jsx';
import CalendarizacionMensualPanel from '../../pages/panelcontrol/CalendarizacionMensual.jsx';
import { useUI } from '../../context/UIContext.jsx';

export default function CalendarizacionMensual() {
  const { calendarizacionMensualAbierto, setCalendarizacionMensualAbierto } = useUI();

  if (calendarizacionMensualAbierto) {
    return <CalendarizacionMensualPanel />;
  }

  return (
    <BotonSeleccionablePanel onClick={() => setCalendarizacionMensualAbierto(true)}>
      Calendarización mensual
    </BotonSeleccionablePanel>
  );
}
