import FechasSesiones from '../L2/FechasSesiones.jsx';
import '../../styles/L1/CintaSesiones.css';

export default function CintaSesiones({ fechas, activaId, onSeleccionar, textoVacio }) {
  return (
    <div className="lvl1-cinta-sesiones">
      <FechasSesiones fechas={fechas} activaId={activaId} onSeleccionar={onSeleccionar} textoVacio={textoVacio} />
    </div>
  );
}
