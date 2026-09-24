import { useEffect, useRef, useState } from 'react';
import '../../styles/L2/ListaExpandible.css';

export default function ListaExpandible({ valorActual, etiquetaActual, opciones, onSeleccionar }) {
  const [abierto, setAbierto] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const botonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function manejarClickFuera(e) {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        botonRef.current && !botonRef.current.contains(e.target)
      ) setAbierto(false);
    }
    document.addEventListener('mousedown', manejarClickFuera);
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    function cerrarPorScrollOResize(e) {
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setAbierto(false);
    }
    window.addEventListener('scroll', cerrarPorScrollOResize, true);
    window.addEventListener('resize', cerrarPorScrollOResize);
    return () => {
      window.removeEventListener('scroll', cerrarPorScrollOResize, true);
      window.removeEventListener('resize', cerrarPorScrollOResize);
    };
  }, [abierto]);

  function toggle() {
    if (!abierto && botonRef.current) {
      const rect = botonRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setAbierto((v) => !v);
  }

  return (
    <>
      <div
        ref={botonRef}
        className={'lvl2-lista-expandible-toggle' + (abierto ? ' lvl2-lista-expandible-toggle-abierto' : '')}
        onClick={toggle}
      >
        {etiquetaActual}
        <span className="lvl2-lista-expandible-chevron">▾</span>
      </div>
      {abierto && (
        <div
          ref={menuRef}
          className="lvl2-lista-expandible-menu"
          style={{ top: pos.top, left: pos.left, minWidth: pos.width }}
        >
          {opciones.map((op) => (
            <div
              key={op.id}
              className={'lvl2-lista-expandible-item' + (op.id === valorActual ? ' lvl2-lista-expandible-item-activo' : '')}
              onClick={() => { onSeleccionar(op.id); setAbierto(false); }}
            >
              {op.label}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
