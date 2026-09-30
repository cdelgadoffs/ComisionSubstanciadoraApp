import { useEffect, useState } from 'react';
import ListaExpandible from '../base/ListaExpandible.jsx';
import Textarea from '../base/Textarea.jsx';
import Checkbox from '../base/Checkbox.jsx';
import BotonS from '../base/BotonS.jsx';
import BotonIcono from '../base/BotonIcono.jsx';
import { useProyecto } from '../../context/ProyectoContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { useScrollbarPersonalizada } from '../../hooks/useScrollbarPersonalizada.js';
import '../../styles/widgets/FormularioPunto.css';

const REMITENTES = ['Pleno', 'Presidencia', 'Secretaría General'];

function estadoVacio(seccion) {
  return {
    seccion: seccion || 'acuerdos',
    remitente: REMITENTES[0],
    contenido: '',
    acuerdo: '',
    confidencial: false,
    archivos: [],
  };
}

export default function FormularioPunto() {
  const { SECCIONES_DOCUMENTO, agregarPunto } = useProyecto();
  const { sidebar3Abierto, setSidebar3Abierto, seccionNuevoPunto } = useUI();
  const [form, setForm] = useState(() => estadoVacio(seccionNuevoPunto));
  const { contenedorRef, thumb, onScroll, onArrastrarThumb } = useScrollbarPersonalizada();

  useEffect(() => {
    if (sidebar3Abierto) setForm(estadoVacio(seccionNuevoPunto));
  }, [sidebar3Abierto, seccionNuevoPunto]);

  const opcionesSeccion = SECCIONES_DOCUMENTO.map((s) => ({ id: s.id, label: s.nombre }));
  const seccionActual = SECCIONES_DOCUMENTO.find((s) => s.id === form.seccion);
  const esInforme = form.seccion === 'informes';

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

  function confirmar() {
    agregarPunto({
      seccion: form.seccion,
      remitente: form.remitente,
      contenido: form.contenido.trim(),
      acuerdo: esInforme ? '' : form.acuerdo.trim(),
      confidencial: form.confidencial,
      archivos: form.archivos,
    });
    setForm(estadoVacio(form.seccion));
  }

  const puedeConfirmar = form.contenido.trim().length > 0 && (esInforme || form.acuerdo.trim().length > 0);

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
            valorActual={form.remitente}
            etiquetaActual={form.remitente}
            opciones={REMITENTES.map((r) => ({ id: r, label: r }))}
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
