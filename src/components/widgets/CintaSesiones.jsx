import FechasSesiones from '../base/FechasSesiones.jsx';
import '../../styles/widgets/CintaSesiones.css';

export default function CintaSesiones({ fechas, activaId, onSeleccionar, textoVacio }) {
  return (
    <div className="widget-cinta-sesiones">
      <FechasSesiones fechas={fechas} activaId={activaId} onSeleccionar={onSeleccionar} textoVacio={textoVacio} />
    </div>
  );
}
