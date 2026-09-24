import { useEffect, useState } from 'react';
import BotonS from '../../components/L2/BotonS.jsx';
import BotonAgregar from '../../components/L2/BotonAgregar.jsx';
import ListaExpandible from '../../components/L2/ListaExpandible.jsx';
import CardS from '../../components/L2/CardS.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { useProyecto } from '../../context/ProyectoContext.jsx';

const DIAS_SEMANA = [
  { id: 1, label: 'Lunes' },
  { id: 2, label: 'Martes' },
  { id: 3, label: 'Miércoles' },
  { id: 4, label: 'Jueves' },
  { id: 5, label: 'Viernes' },
];

const ESTADO_LABEL = {
  proxima: 'Próxima',
  'no-celebrada': 'No celebrada',
  pendiente: 'Pendiente',
  celebrada: 'Celebrada',
};

export function BotonNuevoCalendarioMensual() {
  const { panelControlActivo, setMostrarFormularioCalendario } = useUI();

  if (panelControlActivo !== 'calendarizacionMensual') return null;

  return (
    <BotonAgregar etiqueta="Nuevo calendario" onClick={() => setMostrarFormularioCalendario((v) => !v)}>+</BotonAgregar>
  );
}

export default function CalendarizacionMensual() {
  const { setSidebar5Ancho, setPanelControlActivo, mostrarFormularioCalendario, setMostrarFormularioCalendario } = useUI();
  const {
    diaSesion, setDiaSesion,
    vacaciones, agregarVacacion, eliminarVacacion,
    FECHAS_SESIONES, sesionActivaFecha, cargarSesion,
    generarSesionesMes,
  } = useProyecto();
  const [vacInicio, setVacInicio] = useState('');
  const [vacFin, setVacFin] = useState('');

  useEffect(() => {
    setSidebar5Ancho(true);
    return () => setSidebar5Ancho(false);
  }, [setSidebar5Ancho]);

  function generarCalendario() {
    generarSesionesMes(diaSesion);
    setMostrarFormularioCalendario(false);
  }

  function manejarAgregarVacacion() {
    if (!vacInicio || !vacFin || vacInicio > vacFin) return;
    agregarVacacion(vacInicio, vacFin);
    setVacInicio('');
    setVacFin('');
  }

  const diaSeleccionado = DIAS_SEMANA.find((d) => d.id === diaSesion);

  return (
    <div style={{ margin: '16px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <BotonS onClick={() => setPanelControlActivo(null)}>Volver</BotonS>

      {mostrarFormularioCalendario ? (
        <>
          <div>
            <p style={{ color: '#ccc', fontSize: '12px', margin: '0 0 6px' }}>Día de sesión ordinaria</p>
            <ListaExpandible
              valorActual={diaSesion}
              etiquetaActual={diaSeleccionado?.label}
              opciones={DIAS_SEMANA}
              onSeleccionar={setDiaSesion}
            />
          </div>

          <div>
            <p style={{ color: '#ccc', fontSize: '12px', margin: '0 0 6px' }}>Periodo vacacional</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input type="date" value={vacInicio} onChange={(e) => setVacInicio(e.target.value)} />
              <input type="date" value={vacFin} min={vacInicio} onChange={(e) => setVacFin(e.target.value)} />
            </div>
            <BotonS onClick={manejarAgregarVacacion}>Agregar periodo</BotonS>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {vacaciones.map((v, idx) => (
                <span key={idx} style={{ fontSize: '11px', color: '#ccc', border: '1px solid #3a3a3a', borderRadius: '4px', padding: '3px 8px' }}>
                  {v.inicio} — {v.fin}
                  <span style={{ marginLeft: '6px', cursor: 'pointer', color: '#ef4444' }} onClick={() => eliminarVacacion(idx)}>✕</span>
                </span>
              ))}
            </div>
          </div>

          <BotonS onClick={generarCalendario}>Generar calendario del mes</BotonS>
        </>
      ) : (
        <>
          <p style={{ color: '#aaa', fontSize: '12.5px', margin: 0 }}>Sesiones: {FECHAS_SESIONES.length}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FECHAS_SESIONES.map((f) => (
              <CardS
                key={f.id}
                estado={f.estado}
                titulo={`Sesión Ordinaria N° ${f.numeroSesion}`}
                subtitulo={f.label}
                estadoLabel={f.id === sesionActivaFecha ? 'Activa' : ESTADO_LABEL[f.estado]}
                onClick={() => cargarSesion(f.id)}
                onEliminar={() => {}}
                eliminarDeshabilitado
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
