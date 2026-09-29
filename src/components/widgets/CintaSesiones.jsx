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

export default function CintaSesiones({ activaId, onSeleccionar, textoVacio }) {
  const { FECHAS_SESIONES: fechas } = useProyecto();
  const [mesFiltro, setMesFiltro] = useState('todas');

  const mesesDisponibles = Array.from(new Set(fechas.map((f) => f.id.substring(0, 7)))).sort();
  const opcionesMes = [
    { id: 'todas', label: 'Todas' },
    ...mesesDisponibles.map((m) => ({ id: m, label: etiquetaMes(m) })),
  ];
  const etiquetaActual = mesFiltro === 'todas' ? 'Todas' : etiquetaMes(mesFiltro);
  const fechasFiltradas = mesFiltro === 'todas'
    ? fechas
    : fechas.filter((f) => f.id.substring(0, 7) === mesFiltro);

  return (
    <div className="widget-cinta-sesiones">
      <ListaExpandible
        valorActual={mesFiltro}
        etiquetaActual={etiquetaActual}
        opciones={opcionesMes}
        onSeleccionar={setMesFiltro}
      />
      <FechasSesiones fechas={fechasFiltradas} activaId={activaId} onSeleccionar={onSeleccionar} textoVacio={textoVacio} />
    </div>
  );
}
