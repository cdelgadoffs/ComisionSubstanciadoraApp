import '../../styles/L2/BotonSeleccionableMenu.css';

export default function BotonSeleccionableMenu({ activo = false, deshabilitado = false, badge, expandible = false, expandido = false, onClick, children }) {
  return (
    <div
      className={
        'lvl2-boton-seleccionable-menu' +
        (activo ? ' lvl2-boton-seleccionable-menu-activo' : '') +
        (deshabilitado ? ' lvl2-boton-seleccionable-menu-deshabilitado' : '')
      }
      onClick={deshabilitado ? undefined : onClick}
    >
      <span className="lvl2-boton-seleccionable-menu-punto"></span>
      <span>{children}</span>
      {badge !== undefined && (
        <span className="lvl2-boton-seleccionable-menu-badge">{badge}</span>
      )}
      {expandible && (
        <span
          className={
            'lvl2-boton-seleccionable-menu-chevron' +
            (expandido ? ' lvl2-boton-seleccionable-menu-chevron-expandido' : '')
          }
        >
          &#8250;
        </span>
      )}
    </div>
  );
}
