import { useState } from 'react';
import FechasSesiones from '../base/FechasSesiones.jsx';
import ListaExpandible from '../base/ListaExpandible.jsx';
import { useProyecto } from '../../context/ProyectoContext.jsx';
import { MESES } from '../../utils/meses.js';
import '../../styles/widgets/CintaSesiones.css';

function etiquetaMes(iso) {
  const [anio, mes] = iso.split('-');
  return `${MESES[Number(mes) - 1]} ${anio}`;
}

export default function CintaSesiones({ textoVacio }) {
  const { FECHAS_SESIONES: fechas, sesionActivaFecha, cargarSesion } = useProyecto();
  const [mesSeleccionadoManual, setMesSeleccionadoManual] = useState(null);

  const mesesDisponibles = Array.from(new Set(fechas.map((f) => f.id.substring(0, 7)))).sort();
  const mesPorDefecto = sesionActivaFecha ? sesionActivaFecha.substring(0, 7) : mesesDisponibles[0];
  const mesFiltro = mesSeleccionadoManual ?? mesPorDefecto;

  const opcionesMes = mesesDisponibles.map((m) => ({ id: m, label: etiquetaMes(m) }));
  const etiquetaActual = mesFiltro ? etiquetaMes(mesFiltro) : '—';
  const fechasFiltradas = mesFiltro
    ? fechas.filter((f) => f.id.substring(0, 7) === mesFiltro)
    : fechas;

  return (
    <div className="widget-cinta-sesiones">
      <ListaExpandible
        valorActual={mesFiltro}
        etiquetaActual={etiquetaActual}
        opciones={opcionesMes}
        onSeleccionar={setMesSeleccionadoManual}
      />
      <FechasSesiones fechas={fechasFiltradas} activaId={sesionActivaFecha} onSeleccionar={cargarSesion} textoVacio={textoVacio} />
    </div>
  );
}
