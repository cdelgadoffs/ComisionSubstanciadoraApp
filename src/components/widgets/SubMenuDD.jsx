import BotonAgregar from '../base/BotonAgregar.jsx';
import '../../styles/widgets/SubMenuDD.css';

export default function SubMenuDD({ items, activoId, onSeleccionar, onAgregar, iconoAgregar, subtitulo }) {
  return (
    <div className="widget-submenu-dd">
      {items.map((item) => (
        <div
          key={item.id}
          className={'widget-submenu-dd-item' + (item.id === activoId ? ' widget-submenu-dd-item-activo' : '')}
          onClick={() => onSeleccionar && onSeleccionar(item.id)}
        >
          <span className="widget-submenu-dd-nombre">{item.nombre}</span>
          <span className="widget-submenu-dd-badge">{item.badge}</span>
          {onAgregar && (
            <BotonAgregar onClick={() => onAgregar(item.id)}>{iconoAgregar}</BotonAgregar>
          )}
        </div>
      ))}
      {subtitulo && <div className="widget-submenu-dd-subtitulo">{subtitulo}</div>}
    </div>
  );
}
