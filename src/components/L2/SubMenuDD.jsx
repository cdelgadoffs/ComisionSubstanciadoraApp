import BotonAgregar from './BotonAgregar.jsx';
import '../../styles/L2/SubMenuDD.css';

export default function SubMenuDD({ items, activoId, onSeleccionar, onAgregar, iconoAgregar, subtitulo }) {
  return (
    <div className="lvl2-submenu-dd">
      {items.map((item) => (
        <div
          key={item.id}
          className={'lvl2-submenu-dd-item' + (item.id === activoId ? ' lvl2-submenu-dd-item-activo' : '')}
          onClick={() => onSeleccionar && onSeleccionar(item.id)}
        >
          <span className="lvl2-submenu-dd-nombre">{item.nombre}</span>
          <span className="lvl2-submenu-dd-badge">{item.badge}</span>
          {onAgregar && (
            <BotonAgregar onClick={() => onAgregar(item.id)}>{iconoAgregar}</BotonAgregar>
          )}
        </div>
      ))}
      {subtitulo && <div className="lvl2-submenu-dd-subtitulo">{subtitulo}</div>}
    </div>
  );
}
