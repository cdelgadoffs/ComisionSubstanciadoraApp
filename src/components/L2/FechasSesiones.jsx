import '../../styles/L2/FechasSesiones.css';

export default function FechasSesiones({ fechas = [], activaId, onSeleccionar, textoVacio }) {
  return (
    <div className="lvl2-fechas-sesiones">
      {fechas.length === 0 && (
        <span className="lvl2-fechas-sesiones-vacio">{textoVacio}</span>
      )}
      {fechas.map((f) => (
        <span
          key={f.id}
          className={
            'lvl2-badge-fecha' +
            (f.estado ? ' lvl2-badge-fecha-' + f.estado : '') +
            (f.id === activaId ? ' lvl2-badge-fecha-activa' : '')
          }
          onClick={() => onSeleccionar && onSeleccionar(f.id)}
        >
          {f.label}
        </span>
      ))}
    </div>
  );
}
