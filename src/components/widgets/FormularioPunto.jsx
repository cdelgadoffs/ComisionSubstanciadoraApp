import { useEffect, useRef, useState } from 'react';
import ListaExpandible from '../base/ListaExpandible.jsx';
import Textarea from '../base/Textarea.jsx';
import Checkbox from '../base/Checkbox.jsx';
import BotonS from '../base/BotonS.jsx';
import BotonIcono from '../base/BotonIcono.jsx';
import { useProyecto } from '../../context/ProyectoContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { useScrollbarPersonalizada } from '../../hooks/useScrollbarPersonalizada.js';
import '../../styles/widgets/FormularioPunto.css';

function estadoVacio(seccion) {
  return {
    seccion: seccion || '',
    remitente: '',
    contenido: '',
    acuerdo: '',
    confidencial: false,
    archivos: [],
  };
}

function claveBorrador(seccion) {
  return `formularioPunto:${seccion}`;
}

function tieneContenido(f) {
  return f.contenido.trim().length > 0 || f.acuerdo.trim().length > 0 || f.archivos.length > 0 || f.confidencial;
}

export default function FormularioPunto() {
  const { SECCIONES_DOCUMENTO, REMITENTES, agregarPunto, guardarBorrador, obtenerBorrador, eliminarBorrador } = useProyecto();
  const { sidebar3Abierto, setSidebar3Abierto, seccionNuevoPunto } = useUI();
  const [form, setForm] = useState(() => estadoVacio(seccionNuevoPunto));
  const [restaurado, setRestaurado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const claveGuardadaRef = useRef(null);
  const { contenedorRef, thumb, onScroll, onArrastrarThumb } = useScrollbarPersonalizada();

  useEffect(() => {
    if (!sidebar3Abierto) return;
    let vigente = true;
    const seccion = seccionNuevoPunto || SECCIONES_DOCUMENTO[0]?.id || '';
    setRestaurado(false);
    setError(null);
    setForm(estadoVacio(seccion));
    obtenerBorrador(claveBorrador(seccion))
      .catch(() => null)
      .then((borrador) => {
        if (!vigente) return;
        claveGuardadaRef.current = borrador ? claveBorrador(seccion) : null;
        if (borrador) setForm({ ...estadoVacio(seccion), ...borrador, seccion });
        setRestaurado(true);
      });
    return () => { vigente = false; };
  }, [sidebar3Abierto, seccionNuevoPunto]);

  useEffect(() => {
    if (!restaurado) return;
    const clave = claveBorrador(form.seccion);
    const temporizador = setTimeout(() => {
      const anterior = claveGuardadaRef.current;
      if (anterior && anterior !== clave) eliminarBorrador(anterior);
      if (tieneContenido(form)) {
        guardarBorrador(clave, form);
        claveGuardadaRef.current = clave;
      } else {
        eliminarBorrador(clave);
        claveGuardadaRef.current = null;
      }
    }, 300);
    return () => clearTimeout(temporizador);
  }, [form, restaurado]);

  const opcionesSeccion = SECCIONES_DOCUMENTO.map((s) => ({ id: s.id, label: s.nombre }));
  const seccionActual = SECCIONES_DOCUMENTO.find((s) => s.id === form.seccion);
  const esInforme = seccionActual ? !seccionActual.requiereAcuerdo : false;
  const remitenteActual = REMITENTES.some((r) => r.id === form.remitente) ? form.remitente : (REMITENTES[0]?.id || '');

  function actualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function adjuntarArchivos(e) {
    const nuevos = Array.from(e.target.files || []).map((f) => ({ nombre: f.name }));
    setForm((f) => ({ ...f, archivos: [...f.archivos, ...nuevos] }));
    e.target.value = '';
  }

  function cancelar() {
    setSidebar3Abierto(false);
  }

  function borrar() {
    setForm(estadoVacio(form.seccion));
  }

  async function confirmar() {
    setEnviando(true);
    setError(null);
    try {
      await agregarPunto({
        seccion: form.seccion,
        remitente: remitenteActual,
        contenido: form.contenido.trim(),
        acuerdo: esInforme ? '' : form.acuerdo.trim(),
        confidencial: form.confidencial,
        archivos: form.archivos,
      });
      setForm(estadoVacio(form.seccion));
    } catch (e) {
      setError(e.mensaje || 'No se pudo añadir el punto.');
    } finally {
      setEnviando(false);
    }
  }

  const puedeConfirmar = !enviando && !!seccionActual && !!remitenteActual && form.contenido.trim().length > 0 && (esInforme || form.acuerdo.trim().length > 0);

  return (
    <div className="widget-formulario-punto-wrap">
      <div className="widget-formulario-punto" key={form.seccion} ref={contenedorRef} onScroll={onScroll}>
      <div className="widget-formulario-punto-fila">
        <div className="widget-formulario-punto-campo">
          <label className="widget-formulario-punto-label">Sección</label>
          <ListaExpandible
            valorActual={form.seccion}
            etiquetaActual={seccionActual ? seccionActual.nombre : ''}
            opciones={opcionesSeccion}
            onSeleccionar={(id) => actualizar('seccion', id)}
          />
        </div>
        <div className="widget-formulario-punto-campo">
          <label className="widget-formulario-punto-label">Remitente</label>
          <ListaExpandible
            valorActual={remitenteActual}
            etiquetaActual={REMITENTES.find((r) => r.id === remitenteActual)?.nombre ?? ''}
            opciones={REMITENTES.map((r) => ({ id: r.id, label: r.nombre }))}
            onSeleccionar={(id) => actualizar('remitente', id)}
          />
        </div>
      </div>

      <div className="widget-formulario-punto-campo">
        <label className="widget-formulario-punto-label">Adjuntar archivos</label>
        <input type="file" className="widget-formulario-punto-archivo-input" multiple onChange={adjuntarArchivos} />
        {form.archivos.length > 0 && (
          <div className="widget-formulario-punto-archivos">
            {form.archivos.map((a, i) => (
              <span key={i} className="widget-formulario-punto-archivo">{a.nombre}</span>
            ))}
          </div>
        )}
      </div>

      <div className="widget-formulario-punto-campo">
        <label className="widget-formulario-punto-label">{esInforme ? 'Informe' : 'Punto de acuerdo'}</label>
        <Textarea
          value={form.contenido}
          onChange={(v) => actualizar('contenido', v)}
          placeholder={esInforme ? 'Informe' : '...por el que/cual se...'}
        />
      </div>

      {!esInforme && (
        <div className="widget-formulario-punto-campo">
          <label className="widget-formulario-punto-label">Acuerdo</label>
          <Textarea value={form.acuerdo} onChange={(v) => actualizar('acuerdo', v)} placeholder="Acuerdos" />
        </div>
      )}

      <Checkbox
        checked={form.confidencial}
        onChange={(v) => actualizar('confidencial', v)}
        label="Marcar como confidencial"
      />

      {error && <div className="widget-formulario-punto-error">{error}</div>}

      <div className="widget-formulario-punto-acciones">
        <BotonIcono icono="ri-eraser-line" ariaLabel="Borrar formulario" onClick={borrar} />
        <div className="widget-formulario-punto-acciones-grupo">
          <BotonS variant="claro" onClick={cancelar}>Cancelar</BotonS>
          <BotonS variant="claro" onClick={confirmar} disabled={!puedeConfirmar}>Añadir</BotonS>
        </div>
      </div>
      </div>
      {thumb.visible && (
        <div
          className="widget-formulario-punto-scrollbar-thumb"
          style={{ height: thumb.alto, top: thumb.top }}
          onMouseDown={onArrastrarThumb}
        />
      )}
    </div>
  );
}
