import '../styles/LoginGate.css';

export default function AccesoBloqueado() {
  return (
    <div className="lg-gate">
      <div className="lg-panel-oscuro" style={{ gridColumn: '1 / -1' }}>
        <div className="lg-oscuro-contenido" style={{ maxWidth: '480px', textAlign: 'center' }}>
          <img
            src="https://raw.githubusercontent.com/cdelgadoffs/CGD/535876195bedc1b602f98438ee3a42ff11cbb817/logo.png"
            alt="Logo institucional"
            className="lg-logo"
            style={{ margin: '0 auto 28px' }}
          />
          <div className="lg-eyebrow">OAJ · SISTEMA DE SESIONES</div>
          <h1 className="lg-titulo" style={{ fontSize: '28px' }}>Acceso restringido</h1>
          <p className="lg-descripcion" style={{ margin: '0 auto 32px' }}>
            Tu cuenta inició sesión correctamente, pero aún no tiene
            permisos asignados en esta aplicación. Contacta al administrador para que active tu acceso.
          </p>
          <button className="lg-btn" style={{ maxWidth: '260px', margin: '0 auto' }}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
