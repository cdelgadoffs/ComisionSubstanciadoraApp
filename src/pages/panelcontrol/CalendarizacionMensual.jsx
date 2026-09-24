import { useEffect } from 'react';
import BotonS from '../../components/L2/BotonS.jsx';
import BotonAgregar from '../../components/L2/BotonAgregar.jsx';
import { useUI } from '../../context/UIContext.jsx';

export function BotonNuevoCalendarioMensual() {
  const { calendarizacionMensualAbierto } = useUI();

  if (!calendarizacionMensualAbierto) return null;

  return (
    <BotonAgregar etiqueta="Nuevo calendario">+</BotonAgregar>
  );
}

export default function CalendarizacionMensual() {
  const { setSidebar5Ancho, setCalendarizacionMensualAbierto } = useUI();

  useEffect(() => {
    setSidebar5Ancho(true);
    return () => setSidebar5Ancho(false);
  }, [setSidebar5Ancho]);

  return (
    <div style={{ margin: '16px 20px' }}>
      <BotonS onClick={() => setCalendarizacionMensualAbierto(false)}>Volver</BotonS>
    </div>
  );
}
